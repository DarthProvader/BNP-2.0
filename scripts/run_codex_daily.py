#!/usr/bin/env python3
"""Primary BNP daily pipeline: collectors + Codex CLI + social publishing.

The orchestration and verification logic is shared with the preserved Cursor
runner. Only the agent backend changes: every writing step uses GPT-5.6 Terra
through Codex CLI.
"""

from codex_pipeline import agent_runner
from run_cursor_daily import main


if __name__ == "__main__":
    main(agent_backend=agent_runner, pipeline_name="Codex")
