"""Package today's raw collector output into a git-tracked daily inbox.

Cloud Automations only see files that are in git. content/raw/ is gitignored,
so we copy today's JSONs into content/daily-inbox/{date}/ before triggering
the article Automation.
"""

from __future__ import annotations

import json
import logging
import shutil
from pathlib import Path

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
RAW_DIR = PROJECT_ROOT / "content" / "raw"
INBOX_DIR = PROJECT_ROOT / "content" / "daily-inbox"
SOURCE_CATEGORIES = ("youtube", "twitter", "reddit", "blogs", "podcasts", "futuretools")


def inbox_path(target_date: str) -> Path:
    return INBOX_DIR / target_date


def package_inbox(target_date: str) -> Path:
    """Copy today's raw JSON files into content/daily-inbox/{date}/.

    Returns the inbox directory path. Raises if no raw files exist.
    """
    dest_root = inbox_path(target_date)

    # Collect first: never wipe an existing inbox before we know there is
    # fresh raw data to replace it with (re-runs for older dates have none).
    sources: list[tuple[str, Path]] = []
    for category in SOURCE_CATEGORIES:
        src_dir = RAW_DIR / category
        if not src_dir.exists():
            continue
        for src in sorted(src_dir.glob(f"{target_date}_*.json")):
            sources.append((category, src))

    if not sources:
        if (dest_root / "manifest.json").exists():
            logger.info("No raw files for %s — keeping existing inbox", target_date)
            return dest_root
        raise FileNotFoundError(
            f"No raw files for {target_date} under {RAW_DIR}. "
            "Run collectors first."
        )

    if dest_root.exists():
        shutil.rmtree(dest_root)
    dest_root.mkdir(parents=True, exist_ok=True)

    copied: list[str] = []
    for category, src in sources:
        dest_cat = dest_root / category
        dest_cat.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest_cat / src.name)
        rel = f"{category}/{src.name}"
        copied.append(rel)
        logger.info("  inbox: %s", rel)

    manifest = {
        "date": target_date,
        "files": copied,
        "status": "ready_for_article",
        "pipeline": {
            # Temporary: all steps on grok-4.5 fast; labels stay the public personas.
            "article_model": "grok-4.5-fast",
            "comments": [
                {"step": "opus", "model": "grok-4.5-fast", "label": "Claude Opus"},
                {"step": "gpt", "model": "grok-4.5-fast", "label": "ChatGPT"},
                {"step": "grok", "model": "grok-4.5-fast", "label": "Grok 4.5"},
            ],
        },
    }
    (dest_root / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    logger.info("Packaged %d files into %s", len(copied), dest_root)
    return dest_root


def clear_inbox(target_date: str) -> None:
    """Remove today's inbox after a successful pipeline (optional cleanup)."""
    path = inbox_path(target_date)
    if path.exists():
        shutil.rmtree(path)
        logger.info("Cleared inbox %s", path)
