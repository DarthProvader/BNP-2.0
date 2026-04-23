"""Twitter/X collector for BNP 2.0.

Fetches tweets via Nitter RSS mirror (nitter.net). No API, no login, no paid
credits. If nitter.net starts failing (rate limits, whitelisting, 4xx/5xx,
outage), failures are logged with distinctive [NITTER_*] markers so they are
easy to grep in scripts/logs/ and we can react before the pipeline goes quiet.
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
NITTER_HOST = "nitter.net"
# nitter.net 403s browser UAs but lets RSS-client UAs through.
NITTER_UA = "feedparser/6.0.11"
RETRY_COUNT = 2
INTER_REQUEST_DELAY_S = 1.0


def _parse_entry_date(entry) -> datetime | None:
    for attr in ("published_parsed", "updated_parsed"):
        parsed = getattr(entry, attr, None)
        if parsed:
            return datetime.fromtimestamp(mktime(parsed), tz=timezone.utc)
    return None


def _strip_html(raw: str) -> str:
    if not raw:
        return ""
    text = re.sub(r"<[^>]+>", " ", raw)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _extract_tweet_id(link: str, guid: str) -> str:
    m = re.search(r"/status/(\d+)", link or "")
    if m:
        return m.group(1)
    if guid and guid.isdigit():
        return guid
    return ""


def _fetch_tweets(handle: str) -> list | None:
    """Fetch RSS entries for a handle. Returns None on unrecoverable failure."""
    url = f"https://{NITTER_HOST}/{handle}/rss"
    last_err: object = None

    for attempt in range(1, RETRY_COUNT + 1):
        try:
            feed = feedparser.parse(
                url,
                agent=NITTER_UA,
                request_headers={"Accept": "application/rss+xml, application/xml;q=0.9"},
            )
        except Exception as e:
            last_err = e
            logger.warning("[NITTER] @%s attempt %d raised: %s", handle, attempt, e)
            time.sleep(1.5 * attempt)
            continue

        status = getattr(feed, "status", None)
        if status and status >= 400:
            last_err = f"HTTP {status}"
            logger.warning("[NITTER] @%s attempt %d got HTTP %s", handle, attempt, status)
            time.sleep(1.5 * attempt)
            continue

        channel_title = (feed.feed.get("title", "") or "").lower()
        if "not yet whitelisted" in channel_title:
            logger.error(
                "[NITTER_BLOCKED] @%s: %s now requires RSS whitelist. "
                "Feed returns placeholder instead of tweets. Check https://%s "
                "and consider switching mirror in twitter_collector.py.",
                handle, NITTER_HOST, NITTER_HOST,
            )
            return None

        if feed.bozo and not feed.entries:
            last_err = feed.bozo_exception
            logger.warning("[NITTER] @%s attempt %d parse error: %s", handle, attempt, last_err)
            time.sleep(1.5 * attempt)
            continue

        return feed.entries

    logger.error("[NITTER] @%s: all %d attempts failed (last error: %s)", handle, RETRY_COUNT, last_err)
    return None


def _entry_to_item(entry, handle: str, name: str) -> dict | None:
    created = _parse_entry_date(entry)
    if not created:
        return None

    title = entry.get("title", "") or ""
    desc_raw = entry.get("summary", "") or entry.get("description", "") or ""
    text = _strip_html(desc_raw) or _strip_html(title)

    is_retweet = title.startswith("RT by @")

    link = entry.get("link", "") or ""
    guid = entry.get("id", "") or entry.get("guid", "") or ""
    tweet_id = _extract_tweet_id(link, guid)

    author_tag = (entry.get("author", "") or "").lstrip("@") or handle
    canonical_url = (
        f"https://x.com/{author_tag}/status/{tweet_id}"
        if tweet_id else f"https://x.com/{handle}"
    )

    return {
        "title": f"{name} (@{handle})",
        "url": canonical_url,
        "published": created.isoformat(),
        "summary": text[:1000],
        "author": handle,
        "is_retweet": is_retweet,
        "favorites": 0,
        "retweets": 0,
        "replies": 0,
        "views": "0",
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


def _collect_single_account(
    account: dict,
    since_dt: datetime,
    output_dir: Path,
    today_str: str,
    max_tweets: int = 5,
) -> tuple[bool, int]:
    handle = account["handle"]
    slug = account["slug"]
    name = account["name"]
    tags = account.get("tags", [])

    entries = _fetch_tweets(handle)
    if entries is None:
        return False, 0

    items: list[dict] = []
    for entry in entries:
        item = _entry_to_item(entry, handle, name)
        if not item:
            continue
        pub = datetime.fromisoformat(item["published"])
        if pub <= since_dt:
            continue
        items.append(item)
        if len(items) >= max_tweets:
            break

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

    total = len(accounts)
    ok_count = 0
    fail_count = 0

    for idx, account in enumerate(accounts, 1):
        handle = account["handle"]
        slug = account["slug"]
        checkpoint_key = f"twitter/{slug}"

        if checkpoint_key in checkpoint:
            since_dt = datetime.fromisoformat(checkpoint[checkpoint_key])
            if since_dt.tzinfo is None:
                since_dt = since_dt.replace(tzinfo=timezone.utc)
        else:
            since_dt = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff)

        logger.info(
            "[%d/%d] @%s (tweets after %s) via %s...",
            idx, total, handle, since_dt.strftime("%Y-%m-%dT%H:%M:%S"), NITTER_HOST,
        )
        t0 = time.time()

        success, count = _collect_single_account(account, since_dt, output_dir, today_str)
        elapsed = time.time() - t0

        if success:
            ok_count += 1
            checkpoint[checkpoint_key] = datetime.now(timezone.utc).isoformat()
            save_checkpoint(scripts_dir, checkpoint)
            logger.info("[%d/%d] @%s: %d tweets (%.1fs)", idx, total, handle, count, elapsed)
        else:
            fail_count += 1
            logger.warning("[%d/%d] @%s: FAILED (%.1fs)", idx, total, handle, elapsed)

        if idx < total:
            time.sleep(INTER_REQUEST_DELAY_S)

    if total > 0 and fail_count == total:
        logger.critical(
            "[NITTER_DOWN] All %d accounts failed via %s. Mirror may be down, "
            "rate-limiting, or newly whitelist-gated. Verify https://%s/%s/rss "
            "manually and switch NITTER_HOST in twitter_collector.py if needed.",
            total, NITTER_HOST, NITTER_HOST, accounts[0]["handle"],
        )
    elif fail_count > 0:
        logger.warning("[NITTER] %d/%d accounts failed this run.", fail_count, total)

    logger.info("Twitter collection done. %d/%d accounts OK.", ok_count, total)
    return {"twitter": total, "twitter_ok": ok_count, "twitter_fail": fail_count}
