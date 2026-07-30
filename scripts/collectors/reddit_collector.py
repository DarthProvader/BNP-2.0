"""Reddit collector for BNP 2.0.

Reads each subreddit's public Atom feed (`/r/<sub>/hot/.rss`). The older
`.json` endpoints now answer 403 Blocked for unauthenticated clients no matter
the User-Agent, while the feeds still serve fine to a browser UA.

The feeds carry title, permalink, author, timestamp and the post body, but no
score, comment count or comments. Restoring those means registering a Reddit
app and calling oauth.reddit.com with client credentials.
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
# Reddit throttles unknown clients hard; a plain browser UA is what the feeds
# expect. Our old custom UA got 429 on the very same feed URL.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
)
REQUEST_DELAY = 20  # seconds between subreddits
RETRY_COUNT = 3
RETRY_BACKOFF_S = 30  # 429 needs a long pause; a short one just burns quota


def _strip_html(raw: str) -> str:
    text = re.sub(r"(?is)<(script|style).*?</\1>", " ", raw)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _fetch_feed(subreddit: str) -> list | None:
    """Fetch a subreddit's hot Atom feed. Returns entries or None on failure."""
    url = f"https://www.reddit.com/r/{subreddit}/hot/.rss"
    last_err: object = None

    for attempt in range(1, RETRY_COUNT + 1):
        feed = feedparser.parse(url, agent=USER_AGENT)
        status = getattr(feed, "status", None)

        if status == 429:
            last_err = "HTTP 429 (rate limited)"
        elif status and status >= 400:
            last_err = f"HTTP {status}"
        elif feed.entries:
            return feed.entries
        else:
            last_err = getattr(feed, "bozo_exception", None) or "empty feed"

        logger.warning(
            "  r/%s attempt %d/%d: %s", subreddit, attempt, RETRY_COUNT, last_err
        )
        if attempt < RETRY_COUNT:
            time.sleep(RETRY_BACKOFF_S * attempt)

    logger.error("  Failed to fetch r/%s: %s", subreddit, last_err)
    return None


def _entry_dt(entry) -> datetime | None:
    for attr in ("published_parsed", "updated_parsed"):
        parsed = getattr(entry, attr, None)
        if parsed:
            return datetime.fromtimestamp(mktime(parsed), tz=timezone.utc)
    return None


def _entry_to_post(entry) -> dict:
    """Convert an Atom entry into the post shape the rest of the pipeline uses."""
    body = ""
    for candidate in (entry.get("content") or []):
        body = candidate.get("value", "") or body
    if not body:
        body = entry.get("summary", "")

    published = entry.get("published") or entry.get("updated") or ""
    author = (entry.get("author") or "").lstrip("/").removeprefix("u/")

    return {
        "title": entry.get("title", ""),
        "url": entry.get("link", ""),
        "published": published,
        "summary": _strip_html(body)[:1000],
        "author": author,
    }


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


def _collect_single_sub(
    sub: dict,
    since_dt: datetime,
    output_dir: Path,
    today_str: str,
    max_posts: int = 10,
) -> tuple[bool, int]:
    """Collect posts from a single subreddit. Returns (success, item_count)."""
    name = sub["name"]
    slug = sub["slug"]
    tags = sub.get("tags", [])

    entries = _fetch_feed(name)
    if entries is None:
        return False, 0

    # Feeds are already in hot order, so keep that order once stale posts are out.
    items = []
    for entry in entries:
        post = _entry_to_post(entry)
        created = _entry_dt(entry)
        if created is None or created <= since_dt:
            continue
        items.append(post)
        if len(items) >= max_posts:
            break

    if not items:
        logger.info("  No new posts for r/%s since cutoff", name)
        return True, 0

    now_iso = datetime.now(timezone.utc).isoformat()
    output_data = {
        "source_type": "reddit",
        "source_name": f"r/{name}",
        "source_slug": slug,
        "subreddit": name,
        "tags": tags,
        "fetched_at": now_iso,
        "items": items,
    }

    output_file = output_dir / f"{today_str}_{slug}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    return True, len(items)


def run(config_path: Path | None = None, single_sub: str | None = None) -> dict:
    """Main entry point. Returns stats dict."""
    scripts_dir = Path(__file__).resolve().parent.parent
    if config_path is None:
        config_path = scripts_dir / "config.yaml"

    config = load_config(config_path)
    checkpoint = load_checkpoint(scripts_dir)

    output_base = (scripts_dir / config.get("output_dir", "../content/raw")).resolve()
    output_dir = output_base / "reddit"
    output_dir.mkdir(parents=True, exist_ok=True)

    first_run_cutoff = config.get("first_run_cutoff_hours", 48)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    subreddits = config.get("reddit", [])
    if not subreddits:
        logger.warning("No reddit subreddits configured in config.yaml")
        return {"reddit": 0}

    if single_sub:
        subreddits = [s for s in subreddits if s["name"] == single_sub]
        if not subreddits:
            logger.error("Subreddit r/%s not found in config.yaml", single_sub)
            return {"reddit": 0}

    total = len(subreddits)
    ok_count = 0
    fail_count = 0

    for idx, sub in enumerate(subreddits, 1):
        name = sub["name"]
        slug = sub["slug"]
        checkpoint_key = f"reddit/{slug}"

        # Determine cutoff date
        if checkpoint_key in checkpoint:
            since_dt = datetime.fromisoformat(checkpoint[checkpoint_key])
            if since_dt.tzinfo is None:
                since_dt = since_dt.replace(tzinfo=timezone.utc)
        else:
            since_dt = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff)

        logger.info("[%d/%d] r/%s (posts after %s)...", idx, total, name, since_dt.strftime("%Y-%m-%dT%H:%M:%S"))
        t0 = time.time()

        # Delay between subreddits
        if idx > 1:
            time.sleep(REQUEST_DELAY)

        success, count = _collect_single_sub(sub, since_dt, output_dir, today_str)
        elapsed = time.time() - t0

        if success:
            ok_count += 1
            checkpoint[checkpoint_key] = datetime.now(timezone.utc).isoformat()
            save_checkpoint(scripts_dir, checkpoint)
            logger.info("[%d/%d] r/%s: %d posts (%.0fs)", idx, total, name, count, elapsed)
        else:
            fail_count += 1
            logger.warning("[%d/%d] r/%s: FAILED (%.0fs)", idx, total, name, elapsed)

    logger.info("Reddit collection done. %d/%d subreddits OK.", ok_count, total)

    return {"reddit": total, "reddit_ok": ok_count, "reddit_fail": fail_count}
