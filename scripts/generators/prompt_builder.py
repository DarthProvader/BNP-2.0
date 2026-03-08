"""Builds the LLM prompt from raw collected data."""

from __future__ import annotations

import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = SCRIPTS_DIR.parent / "content" / "raw"

SOURCE_CATEGORIES = ("youtube", "twitter", "reddit", "blogs", "podcasts")

SOURCE_TYPE_MAP = {
    "youtube": "youtube",
    "twitter": "twitter",
    "blogs": "web",
    "podcasts": "podcast",
    "reddit": "web",
}


def find_raw_files(target_date: str) -> list[Path]:
    """Find all raw JSON files for the given date across all source categories."""
    files = []
    for category in SOURCE_CATEGORIES:
        dir_path = RAW_DIR / category
        if dir_path.exists():
            found = list(dir_path.glob(f"{target_date}_*.json"))
            files.extend(found)
            if found:
                logger.info("  %s: %d files", category, len(found))
    return files


def load_raw_data(target_date: str) -> list[dict]:
    """Load all raw JSON items for the given date. Returns flat list of normalized items."""
    files = find_raw_files(target_date)
    if not files:
        return []

    all_items = []
    for file_path in files:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        source_type = data.get("source_type", "")
        source_name = data.get("source_name", "")
        mapped_type = SOURCE_TYPE_MAP.get(source_type, "web")

        for item in data.get("items", []):
            normalized = {
                "source_type": mapped_type,
                "source_category": source_type,
                "source_name": source_name,
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "published": item.get("published", ""),
                "summary": item.get("summary", ""),
                "author": item.get("author", ""),
            }
            # Include full transcript for YouTube
            if item.get("transcript"):
                normalized["transcript"] = item["transcript"]
            # Include Reddit metadata
            if item.get("score") is not None:
                normalized["score"] = item["score"]
                normalized["comments"] = item.get("comments", 0)
            # Include retweet flag
            if item.get("is_retweet") is not None:
                normalized["is_retweet"] = item["is_retweet"]
            # Include community reactions
            if item.get("top_comments"):
                normalized["top_comments"] = item["top_comments"]
            if item.get("top_replies"):
                normalized["top_replies"] = item["top_replies"]

            all_items.append(normalized)

    logger.info("Loaded %d items from %d files", len(all_items), len(files))
    return all_items


def build_prompt(items: list[dict], target_date: str) -> str:
    """Build the full prompt for Claude with all raw data."""
    items_json = json.dumps(items, ensure_ascii=False, indent=2)

    prompt_size = len(items_json)
    if prompt_size > 180_000:
        logger.warning("Prompt data is very large: %d characters", prompt_size)

    return f"""\
You are the editor of "Berou nam praci" (They're Taking Our Jobs), a daily AI news digest blog.

Below is raw data collected today ({target_date}) from various sources: YouTube channels, Twitter/X accounts, Reddit subreddits, tech blogs, and podcasts. Your job is to analyze ALL of it and write a compelling daily article.

## Instructions

1. **Select** the 5-8 most important, interesting, or impactful AI news stories from the data below.
2. **Write** a cohesive daily digest article that covers these stories with your own editorial opinion and analysis.
3. **Attribute** sources inline — mention who reported/said what, link back to originals.
   - Community reactions (comments/replies) are included where available — use them to gauge public sentiment and mention notable community takes.
4. **Generate** the article in BOTH Czech and English:
   - Czech (cs): Write naturally in Czech — this is the PRIMARY version, not a translation.
   - English (en): Write a parallel English version — NOT a direct translation of the Czech text.
5. **Content format**: Use markdown formatting for structure and emphasis:
   - Use `## Subheading` to break the article into thematic sections (2-4 sections typically).
   - Use **bold** for key terms, company names on first mention, or important numbers.
   - Use *italic* for editorial asides or emphasis.
   - Separate paragraphs with blank lines.
   - Do NOT use H1 (#) — only H2 (##) for section headings.
   - Do NOT use bullet lists or numbered lists — write flowing prose.
6. **Slug**: Create a descriptive slug based on the main topic (e.g. "openai-pentagon-deal-a-grok-4" or "ai-novinky-2026-03-03").
7. **Tags**: Pick 3-5 relevant tags from the data (lowercase, e.g. "openai", "nvidia", "ai-safety").
8. **readTime**: Estimate reading time in minutes (roughly 200 words per minute).

## Output Format

Use this EXACT section-based format with ===SECTION=== markers. Do NOT use JSON for the articles — write them as plain text.

===META===
{{"slug": "descriptive-slug-here", "date": "{target_date}", "tags": ["tag1", "tag2", "tag3"], "readTime": 5, "sources": [{{"title": "Source Title", "url": "https://...", "type": "youtube"}}, {{"title": "Another Source", "url": "https://...", "type": "web"}}]}}
===CS_TITLE===
Cesky titulek clanku
===CS_EXCERPT===
Kratky popis clanku v jedne vete...
===CS_CONTENT===
Prvni odstavec clanku.

Druhy odstavec clanku...
===EN_TITLE===
English article title
===EN_EXCERPT===
Short one-sentence description...
===EN_CONTENT===
First paragraph of the article.

Second paragraph...

IMPORTANT:
- The META section must be a single line of valid JSON (no line breaks inside it).
- The "type" field in sources MUST be one of: "youtube", "twitter", "web", "podcast".
- Article content uses markdown: ## headings for sections, **bold**, *italic*, paragraphs separated by blank lines.
- Do NOT wrap output in markdown code fences.

## Raw Data

{items_json}
"""
