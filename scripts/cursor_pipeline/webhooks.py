"""Trigger Cursor Automation webhook endpoints."""

from __future__ import annotations

import logging
import os
import urllib.error
import urllib.request
from dataclasses import dataclass

logger = logging.getLogger(__name__)

STEPS = ("article", "opus", "gpt", "grok", "social")


@dataclass(frozen=True)
class WebhookTarget:
    step: str
    url: str
    api_key: str


def _load_target(step: str) -> WebhookTarget:
    url_key = f"CURSOR_WEBHOOK_{step.upper()}_URL"
    key_key = f"CURSOR_WEBHOOK_{step.upper()}_KEY"
    url = os.environ.get(url_key, "").strip()
    api_key = os.environ.get(key_key, "").strip()
    if not url or not api_key:
        raise RuntimeError(
            f"Missing {url_key} / {key_key} in environment (scripts/.env). "
            "Create the Cursor Automation, save it to get the webhook URL + key, "
            "then add them to .env."
        )
    # UI "Generate auth header" may include the "Bearer " prefix — normalize.
    if api_key.lower().startswith("bearer "):
        api_key = api_key[7:].strip()
    return WebhookTarget(step=step, url=url, api_key=api_key)


def trigger(step: str, target_date: str, dry_run: bool = False) -> None:
    """POST to the Automation webhook for the given step."""
    if step not in STEPS:
        raise ValueError(f"Unknown step: {step}")

    target = _load_target(step)
    payload = (
        f'{{"date":"{target_date}","step":"{step}",'
        f'"source":"bnp-run-cursor-daily"}}'
    ).encode("utf-8")

    if dry_run:
        logger.info("[dry-run] Would POST %s → %s", step, target.url)
        return

    req = urllib.request.Request(
        target.url,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {target.api_key}",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            logger.info(
                "Webhook %s → HTTP %s (%d bytes)",
                step,
                resp.status,
                len(body),
            )
    except urllib.error.HTTPError as exc:
        err_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Webhook {step} failed: HTTP {exc.code}: {err_body[:500]}"
        ) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Webhook {step} failed: {exc}") from exc
