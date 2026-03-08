"""Twitter/X collector for BNP 2.0.

Uses ClaudeBridge (Claude CLI + Playwright MCP) to scrape tweets
from X.com profiles — one Claude call per account.
"""

from __future__ import annotations

import json
import logging
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import yaml

from bridge.claude_bridge import ClaudeBridge, parse_json_response

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

import os

logger = logging.getLogger(__name__)

CHECKPOINT_FILE = ".last_fetch.json"


def _build_prompt_single(
    username: str,
    password: str,
    handle: str,
    since_dt: str,
    max_tweets: int = 5,
    max_replies: int = 5,
) -> str:
    """Build a prompt to scrape a single Twitter account with replies."""
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

    return f"""\
You are a Twitter data collector. Complete ALL steps below in order.

## Step 1: Login
1. Navigate to https://x.com/i/flow/login
2. Use browser_snapshot to see the login form
3. Enter username "{username}" and click Next
4. Use browser_snapshot, enter password "{password}" and click "Log in"
5. Use browser_snapshot to confirm you see the home timeline
6. If login fails or needs 2FA, return: {{"error": "LOGIN_FAILED", "details": "reason"}}

## Step 2: Scrape @{handle}
1. Navigate to https://x.com/{handle}
2. Use browser_snapshot to read the profile
3. Extract up to {max_tweets} tweets that are newer than {since_dt}
4. Convert relative times (e.g. "2h") to ISO datetime using current time: {now_str}
5. If the profile is private/suspended/empty, return an empty array []

## Step 3: Collect replies for each tweet
For each extracted tweet:
1. Click into the tweet (navigate to its URL)
2. Use browser_snapshot to read the replies
3. Extract the top {max_replies} replies by likes (skip bot/spam replies)
4. Navigate back to the profile and continue with the next tweet

## Step 4: Return results
Return a JSON array with this exact structure:
[
  {{
    "text": "tweet text",
    "date": "YYYY-MM-DDTHH:MM:SS",
    "url": "https://x.com/{handle}/status/ID",
    "is_retweet": false,
    "top_replies": [
      {{"author": "replier1", "text": "Reply text", "likes": 50}},
      {{"author": "replier2", "text": "Another reply", "likes": 23}}
    ]
  }}
]

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- Return an empty array [] if there are no new tweets
- top_replies should have at most {max_replies} entries per tweet
- If you cannot load replies for a tweet, use an empty array for top_replies
"""


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
    bridge: ClaudeBridge,
    username: str,
    password: str,
    account: dict,
    since_dt: str,
    output_dir: Path,
    today_str: str,
) -> tuple[bool, int]:
    """Collect tweets from a single account. Returns (success, item_count)."""
    handle = account["handle"]
    slug = account["slug"]
    name = account["name"]
    tags = account.get("tags", [])

    prompt = _build_prompt_single(username, password, handle, since_dt)
    result = bridge.send(prompt)

    if not result.success:
        logger.error("  Claude CLI failed for @%s: %s", handle, result.stderr[:300])
        return False, 0

    response_text = result.response_text
    data = parse_json_response(response_text)

    if data is None:
        logger.error("  Could not parse JSON for @%s", handle)
        logger.info("  Raw response: %s", response_text[:500])
        return False, 0

    if isinstance(data, dict) and "error" in data:
        logger.error("  Agent returned error for @%s: %s", handle, data)
        return False, 0

    # Accept both list (expected) and dict with handle key (legacy)
    if isinstance(data, dict):
        tweets = data.get(f"@{handle}", data.get(handle, []))
    elif isinstance(data, list):
        tweets = data
    else:
        logger.error("  Unexpected response type for @%s: %s", handle, type(data).__name__)
        return False, 0

    if not tweets:
        logger.info("  No new tweets for @%s", handle)
        return True, 0

    # Convert to standard item format
    items = []
    for tw in tweets:
        if not isinstance(tw, dict):
            continue
        item = {
            "title": f"{name} (@{handle})",
            "url": tw.get("url", f"https://x.com/{handle}"),
            "published": tw.get("date", ""),
            "summary": tw.get("text", ""),
            "author": handle,
            "is_retweet": tw.get("is_retweet", False),
        }
        if tw.get("top_replies"):
            item["top_replies"] = tw["top_replies"]
        items.append(item)

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

    # Get credentials
    username = os.environ.get("X_USERNAME", "")
    password = os.environ.get("X_PASSWORD", "")
    if not username or not password:
        logger.error("X_USERNAME or X_PASSWORD not set in .env")
        return {"twitter": 0}

    agent_dir = scripts_dir / "twitter_agent"
    bridge = ClaudeBridge(agent_dir=agent_dir, model="sonnet")

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
        else:
            since_dt = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff)
        since_str = since_dt.strftime("%Y-%m-%dT%H:%M:%S")

        logger.info("[%d/%d] @%s (tweets after %s)...", idx, total, handle, since_str)
        t0 = time.time()

        success, count = _collect_single_account(
            bridge, username, password, account, since_str, output_dir, today_str,
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
