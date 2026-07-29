"""Run BNP pipeline steps as local Cursor agents via cursor-sdk.

Each step is one agent run against the local checkout: the agent edits files,
never touches git. The orchestrator verifies the result and commits.

Model IDs come from `Cursor.models.list()`; keep them in sync with the account.
"""

from __future__ import annotations

import asyncio
import logging
import os
from collections.abc import Callable, Sequence
from pathlib import Path

logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = SCRIPTS_DIR.parent
PROMPTS_DIR = SCRIPTS_DIR / "prompts"

STEPS = ("article", "opus", "gpt", "grok", "social")

STEP_MODELS = {
    "article": "claude-sonnet-5",
    "opus": "claude-opus-4-8",
    "gpt": "gpt-5.6-terra",
    "grok": "grok-4.5",
    "social": "claude-sonnet-5",
}

PROMPT_FILES = {
    "article": "01-article.md",
    "opus": "02-comment-opus.md",
    "gpt": "03-comment-gpt.md",
    "grok": "04-comment-grok.md",
    "social": "05-social.md",
}

# Article writing is the long one; comments and drafts are much shorter.
STEP_TIMEOUTS = {
    "article": 45 * 60,
    "opus": 15 * 60,
    "gpt": 15 * 60,
    "grok": 15 * 60,
    "social": 15 * 60,
}


class StepDidNotStart(RuntimeError):
    """The agent never executed (auth, config, network)."""


def load_prompt(step: str, target_date: str) -> str:
    path = PROMPTS_DIR / PROMPT_FILES[step]
    return path.read_text(encoding="utf-8").replace("{date}", target_date)


def _api_key() -> str:
    key = os.environ.get("CURSOR_API_KEY", "").strip()
    if not key:
        raise StepDidNotStart(
            "CURSOR_API_KEY missing. Add it to scripts/.env "
            "(cursor.com/dashboard/integrations)."
        )
    return key


async def _run_step_once(client, step: str, target_date: str) -> str:
    """Run one agent to completion. Returns the terminal run status."""
    from cursor_sdk import LocalAgentOptions

    model = STEP_MODELS[step]
    prompt = load_prompt(step, target_date)

    async with await client.agents.create(
        model=model,
        api_key=_api_key(),
        local=LocalAgentOptions(cwd=str(PROJECT_ROOT)),
    ) as agent:
        run = await agent.send(prompt)
        logger.info(
            "step=%s model=%s agent=%s run=%s",
            step,
            model,
            getattr(agent, "agent_id", "?"),
            getattr(run, "id", "?"),
        )
        result = await asyncio.wait_for(run.wait(), timeout=STEP_TIMEOUTS[step])

    status = str(getattr(result, "status", "unknown"))
    text = (getattr(result, "result", "") or "").strip()
    if text:
        logger.info("step=%s said: %s", step, text[:400])
    return status


async def _run_all(
    target_date: str,
    steps: Sequence[str],
    verify: Callable[[str], bool] | None,
    after_step: Callable[[str], None] | None,
    attempts: int,
) -> list[str]:
    from cursor_sdk import AsyncClient, CursorAgentError

    unfinished: list[str] = []

    # One bridge for the whole pipeline; agents are created per step.
    async with await AsyncClient.launch_bridge(workspace=str(PROJECT_ROOT)) as client:
        for step in steps:
            ok = False
            for attempt in range(1, attempts + 1):
                logger.info("=== step %s (attempt %d/%d) ===", step, attempt, attempts)
                try:
                    status = await _run_step_once(client, step, target_date)
                except CursorAgentError as exc:
                    # Never executed: auth, config, network.
                    retryable = bool(getattr(exc, "is_retryable", False))
                    logger.error(
                        "step=%s did not start: %s (retryable=%s)",
                        step,
                        exc,
                        retryable,
                    )
                    if not retryable and attempt >= attempts:
                        raise StepDidNotStart(f"{step}: {exc}") from exc
                    continue
                except asyncio.TimeoutError:
                    logger.error(
                        "step=%s timed out after %ds",
                        step,
                        STEP_TIMEOUTS[step],
                    )
                    continue

                if status != "finished":
                    logger.warning("step=%s finished with status=%s", step, status)

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


def run_steps(
    target_date: str,
    steps: Sequence[str] = STEPS,
    *,
    verify: Callable[[str], bool] | None = None,
    after_step: Callable[[str], None] | None = None,
    attempts: int = 2,
) -> list[str]:
    """Run the given steps in order. Returns steps that never verified.

    `verify(step)` should return True once the step's output is on disk.
    `after_step(step)` runs only after a verified step (commit/push hook).
    """
    unknown = [s for s in steps if s not in STEP_MODELS]
    if unknown:
        raise ValueError(f"Unknown steps: {unknown}")
    _api_key()
    return asyncio.run(_run_all(target_date, steps, verify, after_step, attempts))
