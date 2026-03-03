"""RSS/Atom feed collector for BNP 2.0.

Reads sources from config.yaml, fetches feeds via feedparser,
filters by checkpoint/cutoff, and saves raw JSON to content/raw/.
"""

from __future__ import annotations

import html
import json
import logging
import re
from datetime import datetime, timezone, timedelta
from pathlib import Path
from time import mktime

import feedparser
import yaml

logger = logging.getLogger(__name__)

CHECKPOINT_FILE = ".last_fetch.json"


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


def fetch_feed(source: dict, cutoff: datetime) -> list[dict]:
    """Fetch a single RSS/Atom feed and return items newer than cutoff."""
    feed_url = source["feed_url"]
    name = source["name"]

    logger.info("Fetching: %s (%s)", name, feed_url)

    try:
        feed = feedparser.parse(feed_url)
    except Exception as e:
        logger.error("Failed to parse feed %s: %s", name, e)
        return []

    if feed.bozo and not feed.entries:
        logger.warning("Feed error for %s: %s", name, feed.bozo_exception)
        return []

    items = []
    for entry in feed.entries:
        pub_date = parse_entry_date(entry)
        if pub_date and pub_date < cutoff:
            continue
        items.append(entry_to_item(entry))

    logger.info("  -> %d new items from %s", len(items), name)
    return items


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

    for source in sources:
        slug = source["slug"]
        checkpoint_key = f"{category}/{slug}"

        # Determine cutoff
        if checkpoint_key in checkpoint:
            cutoff = datetime.fromisoformat(checkpoint[checkpoint_key])
        else:
            cutoff = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff_hours)

        items = fetch_feed(source, cutoff)
        now_iso = datetime.now(timezone.utc).isoformat()

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
