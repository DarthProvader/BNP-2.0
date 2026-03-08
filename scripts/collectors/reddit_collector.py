"""Reddit collector for BNP 2.0.

Uses Reddit's public JSON API (append .json to any URL) to fetch
hot posts and top comments per subreddit. No login or browser needed.
"""

from __future__ import annotations

import json
import logging
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta
from pathlib import Path

import yaml

logger = logging.getLogger(__name__)

CHECKPOINT_FILE = ".last_fetch.json"
USER_AGENT = "Windows:BerouNamPraci:2.0 (by /u/martin_kovac404)"
REQUEST_DELAY = 2  # seconds between requests


def _fetch_json(url: str) -> dict | list | None:
    """Fetch JSON from a Reddit URL. Returns parsed data or None on failure."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError) as e:
        logger.error("  Failed to fetch %s: %s", url, e)
        return None


def _fetch_hot_posts(subreddit: str, limit: int = 10) -> list[dict] | None:
    """Fetch hot posts from a subreddit. Returns list of post dicts or None on error."""
    url = f"https://www.reddit.com/r/{subreddit}/hot.json?limit={limit}"
    data = _fetch_json(url)
    if data is None:
        return None
    if not isinstance(data, dict) or "data" not in data:
        return None
    return [child["data"] for child in data["data"].get("children", []) if child.get("kind") == "t3"]


def _fetch_post_comments(permalink: str, max_comments: int = 5) -> list[dict]:
    """Fetch top comments for a post by its permalink. Returns list of comment dicts."""
    url = f"https://www.reddit.com{permalink}.json?sort=top&limit={max_comments + 5}"
    data = _fetch_json(url)
    if not data or not isinstance(data, list) or len(data) < 2:
        return []

    comments = []
    for child in data[1]["data"].get("children", []):
        if child.get("kind") != "t1":
            continue
        c = child["data"]
        author = c.get("author", "")
        if author in ("AutoModerator", "[deleted]", ""):
            continue
        comments.append({
            "author": author,
            "text": c.get("body", "")[:500],
            "score": c.get("score", 0),
        })
        if len(comments) >= max_comments:
            break

    return comments


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
    max_comments: int = 5,
) -> tuple[bool, int]:
    """Collect posts from a single subreddit. Returns (success, item_count)."""
    name = sub["name"]
    slug = sub["slug"]
    tags = sub.get("tags", [])

    # Fetch extra posts so we have enough after filtering
    posts = _fetch_hot_posts(name, limit=max_posts + 5)
    if posts is None:
        return False, 0

    if not posts:
        logger.info("  No posts found for r/%s", name)
        return True, 0

    # Filter by date, skip stickied
    filtered = []
    for p in posts:
        created = datetime.fromtimestamp(p.get("created_utc", 0), tz=timezone.utc)
        if created > since_dt and not p.get("stickied", False):
            filtered.append(p)

    # Sort by score descending, take top max_posts
    filtered.sort(key=lambda p: p.get("score", 0), reverse=True)
    filtered = filtered[:max_posts]

    if not filtered:
        logger.info("  No new posts for r/%s since cutoff", name)
        return True, 0

    # Fetch comments for each post
    items = []
    for i, p in enumerate(filtered):
        item = {
            "title": p.get("title", ""),
            "url": f"https://www.reddit.com{p.get('permalink', '')}",
            "published": datetime.fromtimestamp(p.get("created_utc", 0), tz=timezone.utc).isoformat(),
            "summary": (p.get("selftext", "") or p.get("url", ""))[:1000],
            "author": p.get("author", ""),
            "score": p.get("score", 0),
            "comments": p.get("num_comments", 0),
        }

        # Delay between comment requests
        if i > 0:
            time.sleep(REQUEST_DELAY)

        permalink = p.get("permalink", "")
        if permalink:
            top_comments = _fetch_post_comments(permalink, max_comments)
            if top_comments:
                item["top_comments"] = top_comments

        items.append(item)

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
