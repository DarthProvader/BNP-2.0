"""Twitter/X collector for BNP 2.0.

Uses Apify actor (iron-crawler/twitter-user-tweets) to fetch recent tweets
per account. No login or browser needed.
"""

from __future__ import annotations

import json
import logging
import time
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path

import yaml

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

import os

logger = logging.getLogger(__name__)

CHECKPOINT_FILE = ".last_fetch.json"
APIFY_ACTOR = "iron-crawler/twitter-user-tweets"


def _parse_twitter_date(date_str: str) -> datetime | None:
    """Parse Twitter date format like 'Sun Mar 08 21:21:17 +0000 2026'."""
    try:
        return parsedate_to_datetime(date_str)
    except (ValueError, TypeError):
        return None


def _fetch_tweets(api_token: str, handle: str, max_tweets: int = 5) -> list[dict] | None:
    """Fetch recent tweets for a handle via Apify. Returns list of tweet dicts or None on error."""
    try:
        from apify_client import ApifyClient
    except ImportError:
        logger.error("apify-client not installed. Run: pip install apify-client")
        return None

    client = ApifyClient(api_token)

    run_input = {
        "handles": [handle],
        "tweetsDesired": max_tweets,
    }

    try:
        run = client.actor(APIFY_ACTOR).call(run_input=run_input)
    except Exception as e:
        logger.error("  Apify actor failed for @%s: %s", handle, e)
        return None

    items = []
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        if item.get("noResults"):
            continue
        items.append(item)

    return items


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


def _collect_single_account(
    api_token: str,
    account: dict,
    since_dt: datetime,
    output_dir: Path,
    today_str: str,
    max_tweets: int = 5,
) -> tuple[bool, int]:
    """Collect tweets from a single account. Returns (success, item_count)."""
    handle = account["handle"]
    slug = account["slug"]
    name = account["name"]
    tags = account.get("tags", [])

    raw_tweets = _fetch_tweets(api_token, handle, max_tweets)
    if raw_tweets is None:
        return False, 0

    if not raw_tweets:
        logger.info("  No tweets found for @%s", handle)
        return True, 0

    # Filter by date and convert to standard format
    items = []
    for tw in raw_tweets:
        created = _parse_twitter_date(tw.get("created_at", ""))
        if not created:
            continue
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        if created <= since_dt:
            continue

        # Detect retweet from text
        text = tw.get("text", "")
        is_retweet = text.startswith("RT @")

        # Get author info
        author_data = tw.get("author", {})
        tweet_author = author_data.get("screen_name", handle)

        tweet_id = tw.get("tweet_id", "")
        item = {
            "title": f"{name} (@{handle})",
            "url": f"https://x.com/{tweet_author}/status/{tweet_id}" if tweet_id else f"https://x.com/{handle}",
            "published": created.isoformat(),
            "summary": text,
            "author": handle,
            "is_retweet": is_retweet,
            "favorites": tw.get("favorites", 0),
            "retweets": tw.get("retweets", 0),
            "replies": tw.get("replies", 0),
            "views": tw.get("views", "0"),
        }
        items.append(item)

    if not items:
        logger.info("  No new tweets for @%s since cutoff", handle)
        return True, 0

    now_iso = datetime.now(timezone.utc).isoformat()
    output_data = {
        "source_type": "twitter",
        "source_name": name,
        "source_slug": slug,
        "handle": handle,
        "tags": tags,
        "fetched_at": now_iso,
        "items": items,
    }

    output_file = output_dir / f"{today_str}_{slug}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    return True, len(items)


def run(config_path: Path | None = None, single_handle: str | None = None) -> dict:
    """Main entry point. Returns stats dict."""
    scripts_dir = Path(__file__).resolve().parent.parent
    if config_path is None:
        config_path = scripts_dir / "config.yaml"

    config = load_config(config_path)
    checkpoint = load_checkpoint(scripts_dir)

    output_base = (scripts_dir / config.get("output_dir", "../content/raw")).resolve()
    output_dir = output_base / "twitter"
    output_dir.mkdir(parents=True, exist_ok=True)

    first_run_cutoff = config.get("first_run_cutoff_hours", 48)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    accounts = config.get("twitter", [])
    if not accounts:
        logger.warning("No twitter accounts configured in config.yaml")
        return {"twitter": 0}

    if single_handle:
        accounts = [a for a in accounts if a["handle"] == single_handle]
        if not accounts:
            logger.error("Handle @%s not found in config.yaml", single_handle)
            return {"twitter": 0}

    # Get Apify token
    api_token = os.environ.get("APIFY_API_TOKEN", "")
    if not api_token:
        logger.error("APIFY_API_TOKEN not set in .env")
        return {"twitter": 0}

    total = len(accounts)
    ok_count = 0
    fail_count = 0

    for idx, account in enumerate(accounts, 1):
        handle = account["handle"]
        slug = account["slug"]
        checkpoint_key = f"twitter/{slug}"

        # Determine cutoff date
        if checkpoint_key in checkpoint:
            since_dt = datetime.fromisoformat(checkpoint[checkpoint_key])
            if since_dt.tzinfo is None:
                since_dt = since_dt.replace(tzinfo=timezone.utc)
        else:
            since_dt = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff)

        logger.info("[%d/%d] @%s (tweets after %s)...", idx, total, handle, since_dt.strftime("%Y-%m-%dT%H:%M:%S"))
        t0 = time.time()

        success, count = _collect_single_account(
            api_token, account, since_dt, output_dir, today_str,
        )
        elapsed = time.time() - t0

        if success:
            ok_count += 1
            checkpoint[checkpoint_key] = datetime.now(timezone.utc).isoformat()
            save_checkpoint(scripts_dir, checkpoint)
            logger.info("[%d/%d] @%s: %d tweets (%.0fs)", idx, total, handle, count, elapsed)
        else:
            fail_count += 1
            logger.warning("[%d/%d] @%s: FAILED (%.0fs)", idx, total, handle, elapsed)

    logger.info("Twitter collection done. %d/%d accounts OK.", ok_count, total)

    return {"twitter": total, "twitter_ok": ok_count, "twitter_fail": fail_count}
