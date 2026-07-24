"""LEGACY: local Claude CLI social draft generation.

Daily social copy now comes from Cursor Automation 05
(scripts/automations/05-social-sonnet5.md) writing
content/social-drafts/{date}/drafts.md.

Publishing is handled by scripts/run_social.py (no LLM).
"""

from __future__ import annotations

raise ImportError(
    "social.generator is deprecated. Social drafts are produced by Cursor "
    "Automation 05 into content/social-drafts/{date}/drafts.md; use run_social.py "
    "to publish only."
)
