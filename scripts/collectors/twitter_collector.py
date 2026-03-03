"""Twitter/X collector for BNP 2.0.

Uses ClaudeBridge (Claude CLI + Playwright MCP) to scrape tweets
from X.com profiles in a single Claude call: login → visit each profile → extract tweets.
"""

from __future__ import annotations

import json
import logging
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


def _build_prompt(username: str, password: str, accounts: list[dict]) -> str:
    """Build a single prompt that logs in and scrapes all accounts."""
    account_lines = []
    for acc in accounts:
        account_lines.append(
            f'  - handle: "@{acc["handle"]}", collect tweets after: {acc["since_dt"]}'
        )
    accounts_block = "\n".join(account_lines)

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

## Step 2: Scrape each account
For each account below, navigate to their profile, use browser_snapshot, and extract their recent tweets.

Accounts to scrape:
{accounts_block}

For each account:
1. Navigate to https://x.com/{{handle}}
2. Use browser_snapshot to read the profile
3. Extract tweets that are newer than the "collect tweets after" datetime
4. Convert relative times (e.g. "2h") to ISO datetime using current time: {now_str}
5. If the profile is private/suspended/empty, skip it with an empty array

## Step 3: Return results
Return a single JSON object with this exact structure:
{{
  "@handle1": [
    {{"text": "tweet text", "date": "YYYY-MM-DDTHH:MM:SS", "url": "https://x.com/handle/status/ID", "is_retweet": false}},
    ...
  ],
  "@handle2": [...],
  ...
}}

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- Use empty array [] for accounts with no new tweets
- Include the @ prefix in handle keys
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

    # Prepare accounts with their cutoff dates
    accounts_with_dates = []
    for account in accounts:
        slug = account["slug"]
        checkpoint_key = f"twitter/{slug}"
        if checkpoint_key in checkpoint:
            since_dt = datetime.fromisoformat(checkpoint[checkpoint_key])
        else:
            since_dt = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff)
        accounts_with_dates.append({
            **account,
            "since_dt": since_dt.strftime("%Y-%m-%dT%H:%M:%S"),
        })

    # Get credentials
    username = os.environ.get("X_USERNAME", "")
    password = os.environ.get("X_PASSWORD", "")
    if not username or not password:
        logger.error("X_USERNAME or X_PASSWORD not set in .env")
        return {"twitter": 0}

    # Build single prompt for login + all scrapes
    prompt = _build_prompt(username, password, accounts_with_dates)

    agent_dir = scripts_dir / "twitter_agent"
    bridge = ClaudeBridge(agent_dir=agent_dir, model="sonnet")

    logger.info("Sending single prompt to scrape %d accounts...", len(accounts_with_dates))
    result = bridge.send(prompt)

    if not result.success:
        logger.error("Claude CLI failed: %s", result.stderr[:300])
        return {"twitter": 0}

    # Parse response — expect {"@handle": [tweets...], ...}
    response_text = result.response_text
    data = parse_json_response(response_text)

    if data is None:
        logger.error("Could not parse JSON response")
        logger.info("Raw response: %s", response_text[:500])
        return {"twitter": 0}

    if isinstance(data, dict) and "error" in data:
        logger.error("Agent returned error: %s", data)
        return {"twitter": 0}

    if not isinstance(data, dict):
        logger.error("Expected dict, got %s", type(data).__name__)
        return {"twitter": 0}

    # Process results and save per-account JSON files
    now_iso = datetime.now(timezone.utc).isoformat()
    collected = 0

    for account in accounts:
        handle = account["handle"]
        slug = account["slug"]
        name = account["name"]
        tags = account.get("tags", [])
        checkpoint_key = f"twitter/{slug}"

        # Try both "@handle" and "handle" keys
        tweets = data.get(f"@{handle}", data.get(handle, []))

        if not isinstance(tweets, list) or not tweets:
            logger.info("  -> No new tweets for @%s", handle)
            checkpoint[checkpoint_key] = now_iso
            continue

        # Convert to standard item format
        items = []
        for tw in tweets:
            if not isinstance(tw, dict):
                continue
            items.append({
                "title": f"{name} (@{handle})",
                "url": tw.get("url", f"https://x.com/{handle}"),
                "published": tw.get("date", ""),
                "summary": tw.get("text", ""),
                "author": handle,
                "is_retweet": tw.get("is_retweet", False),
            })

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

        logger.info("  -> Saved %d items to %s", len(items), output_file.name)
        checkpoint[checkpoint_key] = now_iso
        collected += 1

    save_checkpoint(scripts_dir, checkpoint)
    logger.info("Twitter collection done. %d/%d accounts had new tweets.", collected, len(accounts))

    return {"twitter": len(accounts)}
