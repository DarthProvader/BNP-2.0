"""Reddit collector for BNP 2.0.

Uses ClaudeBridge (Claude CLI + Playwright MCP) to scrape posts
from Reddit subreddits in a single Claude call: login → visit each subreddit → extract posts.
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


def _build_prompt(username: str, password: str, subreddits: list[dict]) -> str:
    """Build a single prompt that logs in and scrapes all subreddits."""
    sub_lines = []
    for sub in subreddits:
        sub_lines.append(
            f'  - subreddit: "r/{sub["name"]}", collect posts after: {sub["since_dt"]}'
        )
    subs_block = "\n".join(sub_lines)

    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

    return f"""\
You are a Reddit data collector. Complete ALL steps below in order.

## Step 1: Login
1. Navigate to https://www.reddit.com/login/
2. Use browser_snapshot to see the login form
3. Enter username "{username}" and password "{password}", then click the login button
4. Use browser_snapshot to confirm you are logged in
5. If login fails, return: {{"error": "LOGIN_FAILED", "details": "reason"}}

## Step 2: Scrape each subreddit
For each subreddit below, navigate to it sorted by "new", use browser_snapshot, and extract recent posts.

Subreddits to scrape:
{subs_block}

For each subreddit:
1. Navigate to https://www.reddit.com/r/{{subreddit}}/new/
2. Use browser_snapshot to read the post list
3. Extract posts that are newer than the "collect posts after" datetime
4. Convert relative times (e.g. "3h ago") to ISO datetime using current time: {now_str}

## Step 3: Return results
Return a single JSON object with this exact structure:
{{
  "r/subreddit1": [
    {{
      "title": "Post title",
      "author": "username",
      "date": "YYYY-MM-DDTHH:MM:SS",
      "url": "https://www.reddit.com/r/subreddit/comments/ID/slug/",
      "score": 42,
      "comments": 15,
      "text": "Post body text or summary if visible"
    }},
    ...
  ],
  "r/subreddit2": [...],
  ...
}}

Rules:
- Return ONLY valid JSON, no markdown, no explanation
- Use empty array [] for subreddits with no new posts
- Include the "r/" prefix in subreddit keys
- For link posts (no body text), use the link URL as "text"
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

    # Prepare subreddits with their cutoff dates
    subs_with_dates = []
    for sub in subreddits:
        slug = sub["slug"]
        checkpoint_key = f"reddit/{slug}"
        if checkpoint_key in checkpoint:
            since_dt = datetime.fromisoformat(checkpoint[checkpoint_key])
        else:
            since_dt = datetime.now(timezone.utc) - timedelta(hours=first_run_cutoff)
        subs_with_dates.append({
            **sub,
            "since_dt": since_dt.strftime("%Y-%m-%dT%H:%M:%S"),
        })

    # Get credentials
    username = os.environ.get("REDDIT_USERNAME", "")
    password = os.environ.get("REDDIT_PASSWORD", "")
    if not username or not password:
        logger.error("REDDIT_USERNAME or REDDIT_PASSWORD not set in .env")
        return {"reddit": 0}

    # Build single prompt for login + all scrapes
    prompt = _build_prompt(username, password, subs_with_dates)

    agent_dir = scripts_dir / "reddit_agent"
    bridge = ClaudeBridge(agent_dir=agent_dir, model="sonnet")

    logger.info("Sending single prompt to scrape %d subreddits...", len(subs_with_dates))
    result = bridge.send(prompt)

    if not result.success:
        logger.error("Claude CLI failed: %s", result.stderr[:300])
        return {"reddit": 0}

    # Parse response — expect {"r/subreddit": [posts...], ...}
    response_text = result.response_text
    data = parse_json_response(response_text)

    if data is None:
        logger.error("Could not parse JSON response")
        logger.info("Raw response: %s", response_text[:500])
        return {"reddit": 0}

    if isinstance(data, dict) and "error" in data:
        logger.error("Agent returned error: %s", data)
        return {"reddit": 0}

    if not isinstance(data, dict):
        logger.error("Expected dict, got %s", type(data).__name__)
        return {"reddit": 0}

    # Process results and save per-subreddit JSON files
    now_iso = datetime.now(timezone.utc).isoformat()
    collected = 0

    for sub in subreddits:
        name = sub["name"]
        slug = sub["slug"]
        tags = sub.get("tags", [])
        checkpoint_key = f"reddit/{slug}"

        # Try both "r/name" and "name" keys
        posts = data.get(f"r/{name}", data.get(name, []))

        if not isinstance(posts, list) or not posts:
            logger.info("  -> No new posts for r/%s", name)
            checkpoint[checkpoint_key] = now_iso
            continue

        # Convert to standard item format
        items = []
        for post in posts:
            if not isinstance(post, dict):
                continue
            items.append({
                "title": post.get("title", ""),
                "url": post.get("url", f"https://www.reddit.com/r/{name}"),
                "published": post.get("date", ""),
                "summary": post.get("text", ""),
                "author": post.get("author", ""),
                "score": post.get("score", 0),
                "comments": post.get("comments", 0),
            })

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

        logger.info("  -> Saved %d items to %s", len(items), output_file.name)
        checkpoint[checkpoint_key] = now_iso
        collected += 1

    save_checkpoint(scripts_dir, checkpoint)
    logger.info("Reddit collection done. %d/%d subreddits had new posts.", collected, len(subreddits))

    return {"reddit": len(subreddits)}
