"""RSS/Atom feed collector for BNP 2.0.

Reads sources from config.yaml, fetches feeds via feedparser,
filters by checkpoint/cutoff, and saves raw JSON to content/raw/.
"""

from __future__ import annotations

import html
import json
import logging
import re
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path
from time import mktime

import feedparser
import yaml

logger = logging.getLogger(__name__)

CHECKPOINT_FILE = ".last_fetch.json"
# YouTube throttles a burst of feed requests and answers with an HTML error
# page, so space the requests out and retry instead of losing the source.
FEED_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
)
FEED_RETRY_COUNT = 3
FEED_RETRY_BACKOFF_S = 4
INTER_FEED_DELAY_S = 1.5


def load_config(config_path: Path) -> dict:
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_checkpoint(scripts_dir: Path) -> dict:
    cp_path = scripts_dir / CHECKPOINT_FILE
    if cp_path.exists():
        with open(cp_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_checkpoint(scripts_dir: Path, checkpoint: dict) -> None:
    cp_path = scripts_dir / CHECKPOINT_FILE
    with open(cp_path, "w", encoding="utf-8") as f:
        json.dump(checkpoint, f, indent=2)


def parse_entry_date(entry) -> datetime | None:
    """Extract published date from a feed entry."""
    for attr in ("published_parsed", "updated_parsed"):
        parsed = getattr(entry, attr, None)
        if parsed:
            return datetime.fromtimestamp(mktime(parsed), tz=timezone.utc)
    return None


def entry_to_item(entry) -> dict:
    """Convert a feedparser entry to our standard item format."""
    published = parse_entry_date(entry)
    summary = entry.get("summary", "")
    if "<" in summary:
        summary = html.unescape(re.sub(r"<[^>]+>", "", summary)).strip()

    return {
        "title": entry.get("title", ""),
        "url": entry.get("link", ""),
        "published": published.isoformat() if published else None,
        "summary": summary[:1000],  # cap at 1000 chars
        "author": entry.get("author", ""),
    }


def fetch_feed(source: dict, cutoff: datetime) -> list[dict] | None:
    """Fetch one feed and return items newer than cutoff, or None if it failed.

    None and an empty list mean different things: a failed fetch must not
    advance the checkpoint, otherwise the skipped window is lost for good.
    """
    feed_url = source["feed_url"]
    name = source["name"]

    logger.info("Fetching: %s (%s)", name, feed_url)
    last_err: object = None

    for attempt in range(1, FEED_RETRY_COUNT + 1):
        try:
            feed = feedparser.parse(feed_url, agent=FEED_USER_AGENT)
        except Exception as e:
            last_err = e
        else:
            if feed.entries:
                items = []
                for entry in feed.entries:
                    pub_date = parse_entry_date(entry)
                    if pub_date and pub_date < cutoff:
                        continue
                    items.append(entry_to_item(entry))
                logger.info("  -> %d new items from %s", len(items), name)
                return items
            # Hosts under load answer with an HTML error page, which surfaces
            # as a parse error rather than a status code.
            last_err = getattr(feed, "bozo_exception", None) or (
                f"HTTP {getattr(feed, 'status', '?')}, no entries"
            )

        logger.warning(
            "Feed error for %s (attempt %d/%d): %s",
            name,
            attempt,
            FEED_RETRY_COUNT,
            last_err,
        )
        if attempt < FEED_RETRY_COUNT:
            time.sleep(FEED_RETRY_BACKOFF_S * attempt)

    logger.error("Giving up on feed %s: %s", name, last_err)
    return None


def collect_category(
    sources: list[dict],
    category: str,
    output_base: Path,
    checkpoint: dict,
    first_run_cutoff_hours: int,
    today_str: str,
) -> dict:
    """Collect all feeds for a category (youtube/podcasts/blogs).
    Returns updated checkpoint entries."""

    output_dir = output_base / category
    output_dir.mkdir(parents=True, exist_ok=True)

    updated_checkpoint = {}

    for idx, source in enumerate(sources):
        if idx > 0:
            time.sleep(INTER_FEED_DELAY_S)
        slug = source["slug"]
        checkpoint_key = f"{category}/{slug}"

        # Determine cutoff
        if checkpoint_key in checkpoint:
            cutoff = datetime.fromisoformat(checkpoint[checkpoint_key])
        else:
            cutoff = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff_hours)

        items = fetch_feed(source, cutoff)
        now_iso = datetime.now(timezone.utc).isoformat()

        if items is None:
            # Keep the old checkpoint so the next run retries this window.
            logger.warning(
                "  -> %s unavailable, checkpoint left untouched", source["name"]
            )
            continue

        if not items:
            logger.info("  -> No new items for %s, skipping file write", source["name"])
            updated_checkpoint[checkpoint_key] = now_iso
            continue

        output_data = {
            "source_type": category,
            "source_name": source["name"],
            "source_slug": slug,
            "feed_url": source["feed_url"],
            "tags": source.get("tags", []),
            "fetched_at": now_iso,
            "items": items,
        }

        output_file = output_dir / f"{today_str}_{slug}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)

        logger.info("  -> Saved %d items to %s", len(items), output_file.name)
        updated_checkpoint[checkpoint_key] = now_iso

    return updated_checkpoint


def run(config_path: Path | None = None) -> dict:
    """Main entry point. Returns summary stats."""
    scripts_dir = Path(__file__).resolve().parent.parent
    if config_path is None:
        config_path = scripts_dir / "config.yaml"

    config = load_config(config_path)
    checkpoint = load_checkpoint(scripts_dir)

    output_base = (scripts_dir / config.get("output_dir", "../content/raw")).resolve()
    first_run_cutoff = config.get("first_run_cutoff_hours", 48)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    stats = {}

    for category in ("youtube", "podcasts", "blogs"):
        sources = config.get(category, [])
        if not sources:
            continue

        logger.info("=== Collecting %s (%d sources) ===", category, len(sources))
        updated = collect_category(
            sources, category, output_base, checkpoint, first_run_cutoff, today_str
        )
        checkpoint.update(updated)
        stats[category] = len(sources)

    save_checkpoint(scripts_dir, checkpoint)
    logger.info("Checkpoint saved. Done.")

    return stats
