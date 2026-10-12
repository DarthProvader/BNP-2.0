from __future__ import annotations

import os
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

from opencode_pipeline import agent_runner


class CommandTests(unittest.TestCase):
    def test_windows_command_uses_wsl_and_deepseek_flash(self) -> None:
        env = {
            "BNP_OPENCODE_WSL_USER": "pavel",
            "BNP_OPENCODE_PROJECT_ROOT": "/mnt/c/PV/BNP-2.0",
        }
        with patch.dict(os.environ, env, clear=True), patch.object(
            agent_runner.os, "name", "nt"
        ), patch.object(
            agent_runner, "CONFIG_FILE", Path("C:/PV/BNP-2.0/scripts/opencode_pipeline/opencode.json")
        ):
            command = agent_runner.build_command()

        self.assertEqual(command[:7], [
            "wsl.exe",
            "--user",
            "pavel",
            "--exec",
            "env",
            "OPENCODE_CONFIG=/mnt/c/PV/BNP-2.0/scripts/opencode_pipeline/opencode.json",
            "/home/pavel/.opencode/bin/opencode",
        ])
        self.assertIn("opencode-go/deepseek-v4.1-flash", command)
        self.assertEqual(command[command.index("--agent") + 1], "bnp-writer")
        self.assertEqual(command[command.index("--variant") + 1], "high")
        self.assertEqual(command[-2:], ["--dir", "/mnt/c/PV/BNP-2.0"])

    def test_writer_agent_cannot_run_shell_or_fetch(self) -> None:
        import json

        config = json.loads(agent_runner.CONFIG_FILE.read_text(encoding="utf-8"))
        permission = config["agent"][agent_runner.AGENT]["permission"]
        self.assertEqual(permission["*"], "deny")
        self.assertEqual(permission["edit"], "allow")
        self.assertNotIn("bash", permission)
        self.assertNotIn("webfetch", permission)


class RunStepsTests(unittest.TestCase):
    def test_runs_verified_steps_in_order(self) -> None:
        completed = subprocess.CompletedProcess(
            args=["opencode"], returncode=0, stdout="done", stderr=""
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

    def test_failed_step_is_reported_unfinished(self) -> None:
        failed = subprocess.CompletedProcess(
            args=["opencode"], returncode=1, stdout="", stderr="\x1b[91mquota\x1b[0m"
        )
        with patch.object(agent_runner, "_run_step_once", return_value=failed):
            unfinished = agent_runner.run_steps("2026-09-01", ["social"], attempts=2)

        self.assertEqual(unfinished, ["social"])


if __name__ == "__main__":
    unittest.main()
