#!/usr/bin/env python3
"""Primary BNP daily pipeline: collectors + OpenCode CLI + social publishing.

The orchestration and verification logic is shared with the preserved Cursor
runner. Only the agent backend changes: every writing step uses DeepSeek V4.1
Flash through OpenCode CLI and the OpenCode Go subscription.
"""

from opencode_pipeline import agent_runner
from run_cursor_daily import main


if __name__ == "__main__":
    main(agent_backend=agent_runner, pipeline_name="OpenCode")
