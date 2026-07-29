"""Git helpers for the Cursor daily orchestrator."""

from __future__ import annotations

import logging
import subprocess
from pathlib import Path

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


def _run(args: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    logger.info("git %s", " ".join(args))
    result = subprocess.run(
        ["git", *args],
        cwd=str(PROJECT_ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if result.stdout.strip():
        logger.debug(result.stdout.strip())
    if result.returncode != 0 and check:
        raise RuntimeError(
            f"git {' '.join(args)} failed:\n{result.stderr or result.stdout}"
        )
    return result


def pull() -> None:
    _run(["pull", "--rebase", "--autostash", "origin", "main"])


def push() -> None:
    _run(["push", "origin", "main"])


def commit_inbox(target_date: str) -> bool:
    """Stage and commit daily-inbox for date (including deletions). Returns True if committed."""
    _run(["add", "-A", "content/daily-inbox/"])
    staged = _run(["diff", "--staged", "--quiet"], check=False)
    if staged.returncode == 0:
        logger.info("No inbox changes to commit")
        return False
    _run(["commit", "-m", f"Daily inbox {target_date}"])
    return True


def commit_paths(paths: list[str], message: str) -> bool:
    """Stage the given paths and commit. Returns True if a commit was made."""
    _run(["add", "-A", *paths])
    staged = _run(["diff", "--staged", "--quiet"], check=False)
    if staged.returncode == 0:
        logger.info("Nothing staged for: %s", message)
        return False
    _run(["commit", "-m", message])
    return True


def commit_articles_if_any(target_date: str) -> bool:
    """Commit any local article changes (usually Automations already pushed)."""
    _run(["add", "content/articles/"])
    staged = _run(["diff", "--staged", "--quiet"], check=False)
    if staged.returncode == 0:
        return False
    _run(["commit", "-m", f"Daily article {target_date}"])
    return True
