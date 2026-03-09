"""Writes MDX article files from structured article data."""

from __future__ import annotations

import logging
from pathlib import Path

import yaml

logger = logging.getLogger(__name__)

CONTENT_DIR = Path(__file__).resolve().parent.parent.parent / "content" / "articles"

REQUIRED_KEYS = {"slug", "date", "tags", "readTime", "cs", "en", "sources"}
REQUIRED_LANG_KEYS = {"title", "excerpt", "content"}
VALID_SOURCE_TYPES = {"youtube", "twitter", "web", "podcast"}


def validate_article_data(data: dict) -> None:
    """Raise ValueError if the article data is malformed."""
    missing = REQUIRED_KEYS - set(data.keys())
    if missing:
        raise ValueError(f"Missing required keys: {missing}")

    for lang in ("cs", "en"):
        if not isinstance(data.get(lang), dict):
            raise ValueError(f"'{lang}' must be a dict")
        lang_missing = REQUIRED_LANG_KEYS - set(data[lang].keys())
        if lang_missing:
            raise ValueError(f"Missing keys in '{lang}': {lang_missing}")

    for src in data.get("sources", []):
        if src.get("type") not in VALID_SOURCE_TYPES:
            raise ValueError(f"Invalid source type: {src.get('type')}")


def _format_mdx(frontmatter: dict, content: str) -> str:
    """Format frontmatter + content into MDX string."""
    # yaml.dump with specific settings to match existing MDX files
    yaml_str = yaml.dump(
        frontmatter,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        width=1000,  # prevent line wrapping
    )
    return f"---\n{yaml_str}---\n\n{content.strip()}\n"


def write_mdx(article_data: dict, lang: str) -> Path:
    """Write a single MDX file for the given language. Returns the file path."""
    slug = article_data["slug"]
    lang_data = article_data[lang]

    frontmatter = {
        "slug": slug,
        "title": lang_data["title"],
        "date": article_data["date"],
        "tags": article_data["tags"],
        "readTime": article_data["readTime"],
        "excerpt": lang_data["excerpt"],
        "sources": article_data["sources"],
        "aiComments": [],
    }

    mdx_content = _format_mdx(frontmatter, lang_data["content"])

    out_dir = CONTENT_DIR / lang
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{slug}.mdx"
    out_path.write_text(mdx_content, encoding="utf-8")

    logger.info("Wrote %s (%d chars)", out_path.relative_to(CONTENT_DIR.parent), len(mdx_content))
    return out_path


def update_mdx_comments(mdx_path: Path, comments: list[dict]) -> None:
    """Update the aiComments field in an existing MDX file's frontmatter."""
    raw = mdx_path.read_text(encoding="utf-8")

    if not raw.startswith("---"):
        raise ValueError(f"MDX file does not start with frontmatter: {mdx_path}")

    parts = raw.split("---", 2)
    if len(parts) < 3:
        raise ValueError(f"Could not parse frontmatter in: {mdx_path}")

    frontmatter = yaml.safe_load(parts[1])
    content_body = parts[2]

    frontmatter["aiComments"] = comments

    yaml_str = yaml.dump(
        frontmatter,
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
        width=1000,
    )

    updated = f"---\n{yaml_str}---{content_body}"
    mdx_path.write_text(updated, encoding="utf-8")

    logger.info("Updated aiComments in %s (%d comments)", mdx_path.name, len(comments))
