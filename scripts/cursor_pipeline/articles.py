"""Find today's article MDX and inspect aiComments progress."""

from __future__ import annotations

import logging
import re
from pathlib import Path

import yaml

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
ARTICLES_DIR = PROJECT_ROOT / "content" / "articles"

# Expected labels written into frontmatter by comment Automations
COMMENT_LABELS = {
    "opus": "Claude Opus",
    "gpt": "ChatGPT",
    "grok": "Grok 4.5",
}


def _parse_frontmatter(path: Path) -> dict | None:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\r?\n(.*?)\r?\n---", text, re.DOTALL)
    if not match:
        return None
    try:
        data = yaml.safe_load(match.group(1))
    except yaml.YAMLError:
        return None
    return data if isinstance(data, dict) else None


def find_articles_for_date(target_date: str) -> dict[str, Path]:
    """Return {lang: path} for MDX files whose frontmatter date matches."""
    found: dict[str, Path] = {}
    for lang in ("cs", "en"):
        lang_dir = ARTICLES_DIR / lang
        if not lang_dir.exists():
            continue
        for path in sorted(lang_dir.glob("*.mdx"), key=lambda p: p.stat().st_mtime, reverse=True):
            fm = _parse_frontmatter(path)
            if not fm:
                continue
            date_val = str(fm.get("date", ""))
            if date_val == target_date or date_val.startswith(target_date):
                found[lang] = path
                break
    return found


def article_ready(target_date: str) -> bool:
    """True when both CS and EN MDX exist for the date."""
    found = find_articles_for_date(target_date)
    ready = "cs" in found and "en" in found
    if ready:
        logger.info(
            "Article ready: cs=%s en=%s",
            found["cs"].name,
            found["en"].name,
        )
    return ready


def _comment_models(path: Path) -> set[str]:
    fm = _parse_frontmatter(path)
    if not fm:
        return set()
    comments = fm.get("aiComments") or []
    models: set[str] = set()
    for item in comments:
        if isinstance(item, dict) and item.get("model"):
            models.add(str(item["model"]))
    return models


def comment_ready(target_date: str, step: str) -> bool:
    """True when both language files include the expected comment label."""
    label = COMMENT_LABELS[step]
    found = find_articles_for_date(target_date)
    if "cs" not in found or "en" not in found:
        return False
    for lang, path in found.items():
        models = _comment_models(path)
        if label not in models:
            logger.debug("%s missing %r in %s (have %s)", lang, label, path.name, models)
            return False
    logger.info("Comment step %s ready (%s)", step, label)
    return True


def article_slug(target_date: str) -> str | None:
    found = find_articles_for_date(target_date)
    if "cs" not in found:
        return None
    fm = _parse_frontmatter(found["cs"])
    if not fm:
        return None
    return str(fm.get("slug") or found["cs"].stem)
