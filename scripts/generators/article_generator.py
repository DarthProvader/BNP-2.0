"""Article generator — orchestrates raw data → LLM → MDX articles."""

from __future__ import annotations

import json
import logging
import re
from datetime import date
from pathlib import Path

from bridge.claude_bridge import ClaudeBridge
from generators.prompt_builder import load_raw_data, build_prompt
from generators.mdx_writer import validate_article_data, write_mdx

logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent.parent

SECTIONS = ("META", "CS_TITLE", "CS_EXCERPT", "CS_CONTENT", "EN_TITLE", "EN_EXCERPT", "EN_CONTENT")


def _parse_sections(text: str) -> dict[str, str]:
    """Parse ===SECTION=== delimited response into a dict."""
    parts: dict[str, str] = {}
    pattern = r"===(\w+)===(.*?)(?====\w+===|$)"
    for match in re.finditer(pattern, text, re.DOTALL):
        key = match.group(1)
        value = match.group(2).strip()
        parts[key] = value

    missing = set(SECTIONS) - set(parts.keys())
    if missing:
        raise ValueError(f"Missing sections in Claude response: {missing}")

    return parts


def _sections_to_article_data(sections: dict[str, str]) -> dict:
    """Convert parsed sections into article_data dict for mdx_writer."""
    meta = json.loads(sections["META"])

    return {
        "slug": meta["slug"],
        "date": meta["date"],
        "tags": meta["tags"],
        "readTime": meta["readTime"],
        "sources": meta["sources"],
        "cs": {
            "title": sections["CS_TITLE"],
            "excerpt": sections["CS_EXCERPT"],
            "content": sections["CS_CONTENT"],
        },
        "en": {
            "title": sections["EN_TITLE"],
            "excerpt": sections["EN_EXCERPT"],
            "content": sections["EN_CONTENT"],
        },
    }


def generate_articles(target_date: str | None = None) -> dict:
    """Generate daily article from raw data. Returns dict with file paths."""
    if target_date is None:
        target_date = date.today().isoformat()

    # 1. Load raw data
    logger.info("Loading raw data for %s...", target_date)
    items = load_raw_data(target_date)
    if not items:
        raise ValueError(
            f"No raw data found for {target_date}. "
            f"Run collectors first (run_rss.py, run_twitter.py, run_reddit.py)."
        )

    logger.info("Loaded %d items across all sources", len(items))

    # 2. Build prompt
    prompt = build_prompt(items, target_date)
    logger.info("Prompt size: %d characters", len(prompt))

    # 3. Call Claude via ClaudeBridge (no Playwright needed — pure text)
    bridge = ClaudeBridge(agent_dir=SCRIPTS_DIR, model="sonnet")

    logger.info("Sending prompt to Claude...")
    result = bridge.send(prompt)

    if not result.success:
        raise RuntimeError(f"Claude CLI failed: {result.stderr[:500]}")

    logger.info("Claude responded in %.1fs", result.duration)

    # 4. Parse section-based response
    response_text = result.response_text

    # Save raw response for debugging
    debug_path = SCRIPTS_DIR / "logs" / "last_response.txt"
    debug_path.parent.mkdir(parents=True, exist_ok=True)
    debug_path.write_text(response_text, encoding="utf-8")
    logger.info("Raw response saved to %s (%d chars)", debug_path, len(response_text))

    try:
        sections = _parse_sections(response_text)
        article_data = _sections_to_article_data(sections)
    except (ValueError, json.JSONDecodeError, KeyError) as e:
        logger.error("Failed to parse response: %s", e)
        logger.error("Response starts with: %s", response_text[:300])
        raise RuntimeError(f"Failed to parse Claude response: {e}") from e

    # 5. Validate
    validate_article_data(article_data)
    logger.info("Article validated: slug=%s, tags=%s", article_data["slug"], article_data["tags"])

    # 6. Write MDX files
    cs_path = write_mdx(article_data, lang="cs")
    en_path = write_mdx(article_data, lang="en")

    return {"cs": str(cs_path), "en": str(en_path), "slug": article_data["slug"]}
