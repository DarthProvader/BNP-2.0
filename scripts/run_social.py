"""Autopilot social media orchestrator.

Generates X + LinkedIn drafts for a given date's article and publishes them
immediately — no human approval, no Discord, no interactive session.

Usage:
    python scripts/run_social.py --date 2026-04-20
    python scripts/run_social.py --date 2026-04-20 --dry-run      # generate only, don't post
    python scripts/run_social.py --date 2026-04-20 --skip-twitter # only LinkedIn
    python scripts/run_social.py --date 2026-04-20 --skip-linkedin
"""

from __future__ import annotations

import argparse
import json
import logging
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

# Windows cp1250 console can't handle emoji
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

SCRIPTS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPTS_DIR.parent
sys.path.insert(0, str(SCRIPTS_DIR))

from utils import setup_logging
from social.generator import generate_drafts

logger = logging.getLogger("social")

PYTHON = sys.executable  # same interpreter (venv) for subprocesses


def _publish(script: str, drafts_path: Path, dry_run: bool) -> str | None:
    """Run a publisher script; return last stdout line (URL) or None on failure."""
    cmd = [PYTHON, str(SCRIPTS_DIR / "social" / script), "--input", str(drafts_path)]
    if dry_run:
        cmd.append("--dry-run")
    logger.info("Spouštím %s …", script)
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if result.returncode != 0:
        logger.error("%s selhal (exit %d): %s", script, result.returncode, result.stderr[:500])
        return None
    logger.info("%s OK", script)
    logger.debug(result.stdout)
    last_line = (result.stdout.strip().splitlines() or [""])[-1]
    return last_line or None


def run(target_date: str, dry_run: bool, skip_twitter: bool, skip_linkedin: bool) -> int:
    logger.info("=== Social autopilot — %s ===", target_date)

    try:
        drafts_path = generate_drafts(target_date)
    except Exception as exc:
        logger.exception("Generování draftů selhalo: %s", exc)
        return 1

    if dry_run:
        logger.info("--dry-run: drafty v %s, žádné posting", drafts_path.relative_to(PROJECT_ROOT))
        return 0

    results: dict[str, str | None] = {}
    if not skip_twitter:
        results["twitter"] = _publish("post_twitter.py", drafts_path, dry_run=False)
    if not skip_linkedin:
        results["linkedin"] = _publish("post_linkedin.py", drafts_path, dry_run=False)

    # Write audit trail
    published_path = drafts_path.parent / "published.json"
    published_path.write_text(
        json.dumps({
            "date": target_date,
            "article_slug": drafts_path.parent.name,  # note: this is DATE dir, not slug
            "published": {k: v for k, v in results.items() if v},
            "failed": [k for k, v in results.items() if not v],
            "published_at": datetime.now(timezone.utc).isoformat(),
        }, indent=2, ensure_ascii=False),
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
    parser = argparse.ArgumentParser(description="BNP social autopilot")
    parser.add_argument("--date", type=str, help="Datum článku (YYYY-MM-DD), default dnes")
    parser.add_argument("--dry-run", action="store_true", help="Vygeneruj drafty, nic nepublikuj")
    parser.add_argument("--skip-twitter", action="store_true")
    parser.add_argument("--skip-linkedin", action="store_true")
    args = parser.parse_args()

    setup_logging("social")

    target_date = args.date or date.today().isoformat()
    exit_code = run(target_date, args.dry_run, args.skip_twitter, args.skip_linkedin)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
