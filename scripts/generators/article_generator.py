"""Article generator — sends Claude CLI a task to read raw data and write an article."""

from __future__ import annotations

import json
import logging
import re
from datetime import date
from pathlib import Path

from bridge.claude_bridge import ClaudeBridge
from generators.mdx_writer import validate_article_data, write_mdx, update_mdx_comments
from generators.comment_generator import generate_comments

logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = SCRIPTS_DIR.parent / "content" / "raw"

SECTIONS = ("META", "CS_TITLE", "CS_EXCERPT", "CS_CONTENT", "CS_OPINION", "EN_TITLE", "EN_EXCERPT", "EN_CONTENT", "EN_OPINION")

SOURCE_CATEGORIES = ("youtube", "twitter", "reddit", "blogs", "podcasts")


def _find_raw_files(target_date: str) -> list[Path]:
    """Find all raw JSON files for the given date."""
    files = []
    for category in SOURCE_CATEGORIES:
        dir_path = RAW_DIR / category
        if dir_path.exists():
            found = list(dir_path.glob(f"{target_date}_*.json"))
            files.extend(found)
            if found:
                logger.info("  %s: %d files", category, len(found))
    return files


def _build_prompt(target_date: str, raw_files: list[Path]) -> str:
    """Build the prompt that tells Claude where to find data and what to write."""
    file_list = "\n".join(f"- {f}" for f in raw_files)

    return f"""\
You are the editor of "Berou nam praci" (They're Taking Our Jobs), a daily AI news digest blog.

Today is {target_date}. Raw data has been collected from YouTube, Twitter/X, Reddit, tech blogs, and podcasts into JSON files.

## Your Task

1. **Check previous articles** first. Look in `content/articles/cs/` — read the most recent article (by date in frontmatter) to see what topics you already covered. AVOID repeating the same stories. If there's a follow-up to a previous story, reference it briefly ("jak jsme psali včera...") instead of retelling it.
2. **Read** the raw data files listed below. Use the Read tool to open each file and understand what news came in today.
3. **Select** the 5-8 most important, interesting, or impactful AI news stories that are NEW or have significant updates.
4. **Write** a cohesive daily digest article covering these stories with editorial opinion and analysis.
5. **Attribute** sources inline — mention who reported/said what, link back to originals.
   - Community reactions (Reddit comments, Twitter replies) are included in the data — use them to gauge public sentiment and mention notable community takes.
6. **Make the headline unique and creative** — vary your title style. Don't start every headline the same way. Use wordplay, questions, metaphors, or unexpected angles.

## Raw Data Files

{file_list}

## Writing Guidelines

- You are Claude Sonnet, the editor-in-chief. Sign your opinion as such.
- Generate the article in BOTH Czech and English.
  - Czech (cs): Write naturally in Czech with FULL DIACRITICS (č, ř, ž, š, ě, á, í, é, ú, ů, ý, ď, ť, ň) — this is the PRIMARY version, not a translation.
  - English (en): Write a parallel English version — NOT a direct translation of the Czech text.
- After each article, write a short personal opinion (2-4 paragraphs, max 200 words) on the day's news.
  - This is YOUR take as Claude Sonnet — be opinionated, insightful, and authentic.
  - What surprised you? What worries you? What excites you? What do people miss?
  - Write it in first person. Don't be generic — have a real point of view.
- Use markdown formatting:
  - Use `## Subheading` to break the article into thematic sections (2-4 sections typically).
  - Use **bold** for key terms, company names on first mention, or important numbers.
  - Use *italic* for editorial asides or emphasis.
  - Separate paragraphs with blank lines.
  - Do NOT use H1 (#) — only H2 (##) for section headings.
  - Do NOT use bullet lists or numbered lists — write flowing prose.
- Slug: Create a descriptive slug based on the main topic (e.g. "openai-pentagon-deal-a-grok-4").
- Tags: Pick 3-5 relevant tags (lowercase, e.g. "openai", "nvidia", "ai-safety").
- readTime: Estimate reading time in minutes (roughly 200 words per minute).

## Output Format

When you are done reading the data and writing the article, output EXACTLY this format with ===SECTION=== markers. Do NOT use JSON for the articles — write them as plain text.

===META===
{{"slug": "descriptive-slug-here", "date": "{target_date}", "tags": ["tag1", "tag2", "tag3"], "readTime": 5, "sources": [{{"title": "Source Title", "url": "https://...", "type": "youtube"}}, {{"title": "Another Source", "url": "https://...", "type": "web"}}]}}
===CS_TITLE===
Český titulek článku
===CS_EXCERPT===
Krátký popis článku v jedné větě...
===CS_CONTENT===
První odstavec článku.

Druhý odstavec článku...
===CS_OPINION===
Můj názor na dnešní novinky jako Claude Opus...
===EN_TITLE===
English article title
===EN_EXCERPT===
Short one-sentence description...
===EN_CONTENT===
First paragraph of the article.

Second paragraph...
===EN_OPINION===
My take on today's news as Claude Sonnet...

IMPORTANT:
- The META section must be a single line of valid JSON (no line breaks inside it).
- The "type" field in sources MUST be one of: "youtube", "twitter", "web", "podcast".
- Article content uses markdown: ## headings for sections, **bold**, *italic*, paragraphs separated by blank lines.
- Do NOT wrap output in markdown code fences.
"""


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
            "opusOpinion": sections["CS_OPINION"],
        },
        "en": {
            "title": sections["EN_TITLE"],
            "excerpt": sections["EN_EXCERPT"],
            "content": sections["EN_CONTENT"],
            "opusOpinion": sections["EN_OPINION"],
        },
    }


def generate_articles(target_date: str | None = None) -> dict:
    """Generate daily article. Claude reads raw data files on its own."""
    if target_date is None:
        target_date = date.today().isoformat()

    # 1. Find raw files
    logger.info("Finding raw data for %s...", target_date)
    raw_files = _find_raw_files(target_date)
    if not raw_files:
        raise ValueError(
            f"No raw data found for {target_date}. "
            f"Run collectors first."
        )
    logger.info("Found %d raw files", len(raw_files))

    # 2. Build prompt (just instructions + file paths, no data)
    prompt = _build_prompt(target_date, raw_files)
    logger.info("Prompt size: %d characters (instructions only, no data)", len(prompt))

    # 3. Call Claude — it will read the files itself
    bridge = ClaudeBridge(agent_dir=SCRIPTS_DIR, model="sonnet")

    logger.info("Sending task to Claude (will read %d files)...", len(raw_files))
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

    # 7. Generate AI comments (cascading: Claude → ChatGPT → Gemini)
    logger.info("Generating AI comments...")
    for lang, mdx_path in [("cs", cs_path), ("en", en_path)]:
        try:
            comments = generate_comments(article_data[lang]["content"], lang)
            if comments:
                update_mdx_comments(mdx_path, comments)
        except Exception as e:
            logger.warning("AI comments failed for %s: %s", lang, e)

    return {"cs": str(cs_path), "en": str(en_path), "slug": article_data["slug"]}
