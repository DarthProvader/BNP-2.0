from __future__ import annotations

import os
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from codex_pipeline import agent_runner


class CommandTests(unittest.TestCase):
    def test_windows_command_uses_wsl_and_terra(self) -> None:
        env = {
            "BNP_CODEX_WSL_USER": "pavel",
            "BNP_CODEX_PROJECT_ROOT": "/mnt/c/PV/BNP-2.0",
        }
        with patch.dict(os.environ, env, clear=True), patch.object(
            agent_runner.os, "name", "nt"
        ):
            command = agent_runner.build_command()

        self.assertEqual(command[:5], [
            "wsl.exe",
            "--user",
            "pavel",
            "--exec",
            "/home/pavel/.local/bin/codex",
        ])
        self.assertIn("gpt-5.6-terra", command)
        self.assertIn('model_reasoning_effort="high"', command)
        self.assertIn("workspace-write", command)
        self.assertEqual(command[-2:], ["/mnt/c/PV/BNP-2.0", "-"])


class RunStepsTests(unittest.TestCase):
    def test_runs_verified_steps_in_order(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["codex"], returncode=0, stdout="done", stderr=""
        )
        verified: list[str] = []
        published: list[str] = []

        with patch.object(agent_runner, "_run_step_once", return_value=completed):
            unfinished = agent_runner.run_steps(
                "2026-09-01",
                ["opus", "gpt", "grok"],
                verify=lambda step: verified.append(step) or True,
                after_step=published.append,
                attempts=1,
            )

        self.assertEqual(unfinished, [])
        self.assertEqual(verified, ["opus", "gpt", "grok"])
        self.assertEqual(published, ["opus", "gpt", "grok"])


if __name__ == "__main__":
    unittest.main()
