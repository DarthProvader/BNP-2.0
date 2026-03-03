"""Synchronous ClaudeBridge — calls Claude CLI with Playwright MCP for browser automation.

Adapted from c:\\PV\\Trading\\TM\\DiscordSignalMonitor\\bridge\\claude_bridge.py (async version).
"""

from __future__ import annotations

import json
import logging
import os
import platform
import re
import shutil
import subprocess
import time
import uuid
from dataclasses import dataclass
from pathlib import Path

logger = logging.getLogger(__name__)


@dataclass
class ClaudeResult:
    stdout: str
    stderr: str
    exit_code: int
    duration: float
    prompt: str

    @property
    def success(self) -> bool:
        return self.exit_code == 0

    @property
    def response_text(self) -> str:
        """Extract the response text from --output-format json."""
        if not self.stdout:
            return ""
        try:
            data = json.loads(self.stdout)
            return data.get("result", self.stdout)
        except (json.JSONDecodeError, TypeError):
            return self.stdout


def _get_claude_cmd() -> str:
    if platform.system() == "Windows":
        cmd = shutil.which("claude.cmd") or shutil.which("claude")
    else:
        cmd = shutil.which("claude")
    if not cmd:
        raise FileNotFoundError(
            "Claude CLI not found. Ensure 'claude' is installed and on PATH."
        )
    return cmd


def parse_json_response(text: str) -> list | dict | None:
    """Try to parse JSON from Claude's response with multiple fallbacks."""
    # 1. Direct parse
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass

    # 2. Extract from markdown code fences
    match = re.search(r"```(?:json)?\s*\n([\s\S]*?)\n```", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # 3. Find first [ ... ] or { ... } block
    for pattern in (r"\[[\s\S]*\]", r"\{[\s\S]*\}"):
        match = re.search(pattern, text)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass

    return None


class ClaudeBridge:
    def __init__(
        self,
        agent_dir: Path | str,
        model: str = "sonnet",
    ):
        self._claude_cmd = _get_claude_cmd()
        self._agent_dir = Path(agent_dir)
        self._model = model

    def send(self, message: str, max_retries: int = 2) -> ClaudeResult:
        """Send a message to Claude CLI. Each call is a fresh, isolated session."""
        retry_delays = [15, 30]

        result = None
        for attempt in range(1 + max_retries):
            session_id = str(uuid.uuid4())
            cmd = [
                self._claude_cmd, "-p",
                "--dangerously-skip-permissions",
                "--output-format", "json",
                "--session-id", session_id,
            ]

            if self._model:
                cmd.extend(["--model", self._model])

            result = self._execute(cmd, stdin_text=message, session_id=session_id)

            if result.success:
                return result

            if attempt < max_retries:
                delay = retry_delays[attempt]
                logger.warning(
                    "Claude CLI failed (exit %d, attempt %d/%d), retrying in %ds...",
                    result.exit_code, attempt + 1, 1 + max_retries, delay,
                )
                time.sleep(delay)
            else:
                logger.error("Claude CLI failed after %d attempts", 1 + max_retries)

        return result

    def _execute(self, cmd: list[str], stdin_text: str = "", session_id: str = "") -> ClaudeResult:
        logger.info("Calling Claude CLI (session: %s)", session_id)
        logger.debug("Prompt (%d chars): %s", len(stdin_text), stdin_text[:200])

        start = time.monotonic()

        # Clear CLAUDECODE env var to allow nested Claude CLI invocations
        env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}

        result = subprocess.run(
            cmd,
            cwd=str(self._agent_dir),
            input=stdin_text,
            capture_output=True,
            text=True,
            encoding="utf-8",
            env=env,
        )

        duration = time.monotonic() - start
        claude_result = ClaudeResult(
            stdout=result.stdout,
            stderr=result.stderr,
            exit_code=result.returncode,
            duration=duration,
            prompt=stdin_text[:200],
        )

        if claude_result.success:
            logger.info("Claude CLI completed in %.1fs", duration)
        else:
            logger.error(
                "Claude CLI failed (exit %d) in %.1fs: %s",
                result.returncode, duration, result.stderr[:500],
            )

        return claude_result
