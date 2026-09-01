"""Run BNP writing steps with Codex CLI and GPT-5.6 Terra.

Each step is a separate non-interactive Codex run against the checked-out
repository. Codex edits files only; verification, commits, and pushes remain
the orchestrator's responsibility.

On Windows the runner executes Codex in WSL, where the CLI and its saved
authentication live. On Linux it calls the local ``codex`` executable.
"""

from __future__ import annotations

import logging
import os
import re
import shutil
import subprocess
from collections.abc import Callable, Sequence
from pathlib import Path

logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = SCRIPTS_DIR.parent
PROMPTS_DIR = SCRIPTS_DIR / "prompts"

STEPS = ("article", "opus", "gpt", "grok", "social")
MODEL = "gpt-5.6-terra"
REASONING_EFFORT = "high"

PROMPT_FILES = {
    "article": "01-article.md",
    "opus": "02-comment-opus.md",
    "gpt": "03-comment-gpt.md",
    "grok": "04-comment-grok.md",
    "social": "05-social.md",
}

STEP_TIMEOUTS = {
    "article": 45 * 60,
    "opus": 15 * 60,
    "gpt": 15 * 60,
    "grok": 15 * 60,
    "social": 15 * 60,
}


class StepDidNotStart(RuntimeError):
    """Codex could not be launched (missing CLI, auth, or invalid config)."""


def load_prompt(step: str, target_date: str) -> str:
    path = PROMPTS_DIR / PROMPT_FILES[step]
    return path.read_text(encoding="utf-8").replace("{date}", target_date)


def _windows_path_to_wsl(path: Path) -> str:
    """Convert an absolute Windows path to the default WSL DrvFS path."""
    raw = str(path.resolve())
    match = re.match(r"^([A-Za-z]):[\\/](.*)$", raw)
    if not match:
        raise StepDidNotStart(f"Cannot convert project path to WSL: {raw}")
    drive, tail = match.groups()
    return f"/mnt/{drive.lower()}/{tail.replace(chr(92), '/')}"


def _command_prefix() -> tuple[list[str], str]:
    """Return the Codex executable command and its view of the project root."""
    override = os.environ.get("BNP_CODEX_BIN", "").strip()

    if os.name == "nt":
        wsl_user = os.environ.get("BNP_CODEX_WSL_USER", "pavel").strip() or "pavel"
        distro = os.environ.get("BNP_CODEX_WSL_DISTRO", "").strip()
        codex_bin = override or f"/home/{wsl_user}/.local/bin/codex"
        prefix = ["wsl.exe"]
        if distro:
            prefix.extend(["--distribution", distro])
        prefix.extend(["--user", wsl_user, "--exec", codex_bin])
        project_root = os.environ.get("BNP_CODEX_PROJECT_ROOT", "").strip()
        return prefix, project_root or _windows_path_to_wsl(PROJECT_ROOT)

    codex_bin = override or shutil.which("codex") or str(
        Path.home() / ".local" / "bin" / "codex"
    )
    project_root = os.environ.get("BNP_CODEX_PROJECT_ROOT", "").strip()
    return [codex_bin], project_root or str(PROJECT_ROOT)


def build_command() -> list[str]:
    """Build the deterministic non-interactive Codex command."""
    prefix, project_root = _command_prefix()
    return prefix + [
        "exec",
        "--ephemeral",
        "--ignore-user-config",
        "--model",
        MODEL,
        "--sandbox",
        "workspace-write",
        "--config",
        f'model_reasoning_effort="{REASONING_EFFORT}"',
        "--color",
        "never",
        "--cd",
        project_root,
        "-",
    ]


def _tail(text: str, limit: int = 1200) -> str:
    compact = text.strip()
    return compact[-limit:] if compact else "(no output)"


def _run_step_once(step: str, target_date: str) -> subprocess.CompletedProcess[str]:
    prompt = load_prompt(step, target_date)
    command = build_command()
    logger.info(
        "step=%s model=%s reasoning=%s backend=codex-cli",
        step,
        MODEL,
        REASONING_EFFORT,
    )
    try:
        return subprocess.run(
            command,
            input=prompt,
            text=True,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
            timeout=STEP_TIMEOUTS[step],
            check=False,
        )
    except FileNotFoundError as exc:
        raise StepDidNotStart(f"Codex executable not found: {command[0]}") from exc


def run_steps(
    target_date: str,
    steps: Sequence[str] = STEPS,
    *,
    verify: Callable[[str], bool] | None = None,
    after_step: Callable[[str], None] | None = None,
    attempts: int = 2,
) -> list[str]:
    """Run steps in order and return steps that produced no verified output."""
    unknown = [step for step in steps if step not in PROMPT_FILES]
    if unknown:
        raise ValueError(f"Unknown steps: {unknown}")

    unfinished: list[str] = []
    for step in steps:
        ok = False
        for attempt in range(1, attempts + 1):
            logger.info("=== step %s (attempt %d/%d) ===", step, attempt, attempts)
            try:
                result = _run_step_once(step, target_date)
            except subprocess.TimeoutExpired:
                logger.error(
                    "step=%s timed out after %ds", step, STEP_TIMEOUTS[step]
                )
                continue

            if result.stdout.strip():
                logger.info("step=%s said: %s", step, _tail(result.stdout, 500))
            if result.returncode != 0:
                logger.error(
                    "step=%s Codex exited %d: %s",
                    step,
                    result.returncode,
                    _tail(result.stderr),
                )
                continue

            if verify is None or verify(step):
                ok = True
                break
            logger.warning("step=%s produced no verifiable output", step)

        if ok:
            if after_step is not None:
                after_step(step)
        else:
            unfinished.append(step)

    return unfinished
