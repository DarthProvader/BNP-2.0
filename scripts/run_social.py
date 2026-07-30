"""Publish X + LinkedIn from Cursor-generated drafts (no local LLM).

Drafts are written by Cursor Automation to:
  content/social-drafts/{date}/drafts.md

This module only posts them via the existing Twitter/LinkedIn publishers.
"""

from __future__ import annotations

import argparse
import json
import logging
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPTS_DIR.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from utils import setup_logging

logger = logging.getLogger("social")
PYTHON = sys.executable
SOCIAL_DRAFTS_DIR = PROJECT_ROOT / "content" / "social-drafts"


def drafts_path_for(target_date: str) -> Path:
    return SOCIAL_DRAFTS_DIR / target_date / "drafts.md"


def drafts_slug(target_date: str) -> str:
    """Read article_slug out of the drafts frontmatter."""
    path = drafts_path_for(target_date)
    if not path.exists():
        return ""
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("article_slug:"):
            return line.split(":", 1)[1].strip().strip("'\"")
        if line.startswith("## "):
            break
    return ""


def drafts_ready(target_date: str) -> bool:
    path = drafts_path_for(target_date)
    if not path.exists():
        return False
    text = path.read_text(encoding="utf-8")
    return "## X" in text and "## LinkedIn" in text


def _publish(
    script: str,
    drafts_path: Path,
    dry_run: bool,
    *,
    extra_args: list[str] | None = None,
) -> str | None:
    cmd = [PYTHON, str(SCRIPTS_DIR / "social" / script), "--input", str(drafts_path)]
    if dry_run:
        cmd.append("--dry-run")
    if extra_args:
        cmd.extend(extra_args)
    logger.info("Spouštím %s …", script)
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.stdout.strip():
        for line in result.stdout.strip().splitlines():
            logger.info("%s: %s", script, line)
    if result.returncode != 0:
        err = (result.stderr or result.stdout or "").strip()
        logger.error("%s selhal (exit %d): %s", script, result.returncode, err[-2000:])
        return None
    logger.info("%s OK", script)
    last_line = (result.stdout.strip().splitlines() or [""])[-1]
    return last_line or None


def run(
    target_date: str,
    dry_run: bool = False,
    skip_twitter: bool = False,
    skip_linkedin: bool = False,
    force_unique_twitter: bool = False,
) -> int:
    """Publish existing Cursor drafts. Does not generate copy."""
    logger.info("=== Social publish — %s ===", target_date)
    drafts_path = drafts_path_for(target_date)
    if not drafts_ready(target_date):
        logger.error("Chybí Cursor drafty: %s", drafts_path)
        return 1

    if dry_run:
        logger.info("--dry-run: drafty v %s, žádné posting", drafts_path.relative_to(PROJECT_ROOT))
        return 0

    results: dict[str, str | None] = {}
    if not skip_twitter:
        tw_extra = ["--force-unique"] if force_unique_twitter else None
        results["twitter"] = _publish(
            "post_twitter.py",
            drafts_path,
            dry_run=False,
            extra_args=tw_extra,
        )
    if not skip_linkedin:
        results["linkedin"] = _publish("post_linkedin.py", drafts_path, dry_run=False)

    published_path = drafts_path.parent / "published.json"
    published_path.write_text(
        json.dumps(
            {
                "date": target_date,
                "article_slug": drafts_slug(target_date),
                "published": {k: v for k, v in results.items() if v},
                "failed": [k for k, v in results.items() if not v],
                "published_at": datetime.now(timezone.utc).isoformat(),
                "drafts_source": "cursor-sdk",
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    logger.info("Audit log: %s", published_path.relative_to(PROJECT_ROOT))

    failed = [k for k, v in results.items() if not v]
    if failed:
        logger.error("Některé platformy selhaly: %s", ", ".join(failed))
        return 1
    logger.info("Hotovo. URLs: %s", results)
    return 0


def main() -> None:
    parser = argparse.ArgumentParser(description="BNP social publish (Cursor drafts)")
    parser.add_argument("--date", type=str, help="Datum (YYYY-MM-DD), default dnes")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip-twitter", action="store_true")
    parser.add_argument("--skip-linkedin", action="store_true")
    parser.add_argument(
        "--force-unique-twitter",
        action="store_true",
        help="Bypass X duplicate-content 403 (invisible marker on 1st tweet)",
    )
    args = parser.parse_args()
    setup_logging("social")
    target_date = args.date or date.today().isoformat()
    sys.exit(
        run(
            target_date,
            args.dry_run,
            args.skip_twitter,
            args.skip_linkedin,
            force_unique_twitter=args.force_unique_twitter,
        )
    )


if __name__ == "__main__":
    main()
