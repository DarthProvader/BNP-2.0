"""The daily run pushes once: every push to main is a stored Vercel deployment."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_DIR))

import run_cursor_daily as daily

DATE = "2026-11-15"


class FakeBackend:
    """Stands in for an agent runner: every step succeeds unless told otherwise."""

    STEPS = ("article", "opus", "gpt", "grok", "social")

    def __init__(self, events: list[str], fail: tuple[str, ...] = (), explode_on: str | None = None):
        self.events = events
        self.fail = fail
        self.explode_on = explode_on

    def run_steps(self, target_date, steps, *, verify, after_step, attempts):
        unfinished = []
        for step in steps:
            if step == self.explode_on:
                raise RuntimeError(f"{step} blew up")
            if step in self.fail:
                unfinished.append(step)
                continue
            self.events.append(f"step:{step}")
            after_step(step)
        return unfinished


class DailyPushTests(unittest.TestCase):
    def setUp(self) -> None:
        self.events: list[str] = []
        record = self.events.append

        def commit_paths(paths, message):
            record(f"commit:{message}")
            return True

        patches = [
            patch.object(daily, "_run_collectors", lambda: record("collect")),
            patch.object(daily.inbox, "package_inbox", lambda d: record("package")),
            patch.object(daily.inbox, "clear_inbox", lambda d: record("clear-inbox")),
            patch.object(daily.gitops, "commit_inbox", lambda d: record("commit:inbox") or True),
            patch.object(daily.gitops, "commit_paths", commit_paths),
            patch.object(daily.gitops, "commit_articles_if_any", lambda d: False),
            patch.object(daily.gitops, "pull", lambda: record("pull")),
            patch.object(daily.gitops, "push", lambda: record("push")),
            patch.object(daily, "_wait_for_article_live", lambda d: record("wait-live") or True),
            patch.object(daily, "_run_social", lambda d: record("social-publish")),
            patch.object(daily.articles, "article_slug", lambda d: "slug"),
        ]
        for p in patches:
            p.start()
            self.addCleanup(p.stop)

    def run_day(self, **kwargs) -> int:
        kwargs.setdefault("agent_backend", FakeBackend(self.events))
        return daily.run(DATE, **kwargs)

    def test_whole_day_goes_out_in_one_push(self) -> None:
        code = self.run_day()

        self.assertEqual(code, 0)
        commits = [e for e in self.events if e.startswith("commit:")]
        self.assertEqual(
            commits,
            [
                "commit:inbox",
                f"commit:Daily article {DATE}",
                f"commit:Daily comments opus {DATE}",
                f"commit:Daily comments gpt {DATE}",
                f"commit:Daily comments grok {DATE}",
                f"commit:Daily social drafts {DATE}",
            ],
        )
        first_push = self.events.index("push")
        # Nothing is pushed before the last step is committed…
        self.assertGreater(first_push, self.events.index(commits[-1]))
        # …and the posts go out only after the push and the wait for the site.
        self.assertLess(first_push, self.events.index("wait-live"))
        self.assertLess(self.events.index("wait-live"), self.events.index("social-publish"))

    def test_only_the_closing_sync_pushes_again(self) -> None:
        self.run_day()
        # One push for the day, one closing sync that has nothing new to send.
        self.assertEqual(self.events.count("push"), 2)

    def test_collect_only_pushes_the_inbox_right_away(self) -> None:
        code = self.run_day(collect_only=True)

        self.assertEqual(code, 0)
        self.assertEqual(self.events.count("push"), 1)
        self.assertNotIn("step:article", self.events)

    def test_failed_social_step_still_pushes_the_article(self) -> None:
        code = self.run_day(agent_backend=FakeBackend(self.events, fail=("social",)))

        self.assertEqual(code, 1)
        self.assertIn("push", self.events)
        self.assertNotIn("social-publish", self.events)
        self.assertNotIn("wait-live", self.events)

    def test_crash_in_a_step_still_pushes_what_was_committed(self) -> None:
        with self.assertRaises(RuntimeError):
            self.run_day(agent_backend=FakeBackend(self.events, explode_on="gpt"))

        self.assertIn(f"commit:Daily comments opus {DATE}", self.events)
        self.assertEqual(self.events.count("push"), 1)

    def test_no_git_never_pushes_or_waits(self) -> None:
        self.run_day(use_git=False)

        self.assertNotIn("push", self.events)
        self.assertNotIn("wait-live", self.events)
        self.assertIn("social-publish", self.events)


class WaitForArticleLiveTests(unittest.TestCase):
    def _statuses(self, *codes):
        calls = iter(codes)

        class Response:
            def __init__(self, status_code):
                self.status_code = status_code

        return lambda url, timeout: Response(next(calls))

    def test_returns_once_the_article_answers_200(self) -> None:
        with patch("run_social.drafts_article_url", lambda d: "https://example.test/a"), patch(
            "requests.get", self._statuses(404, 404, 200)
        ), patch.object(daily.time, "sleep", lambda s: None):
            self.assertTrue(daily._wait_for_article_live(DATE, timeout=600, interval=20))

    def test_gives_up_after_the_timeout(self) -> None:
        with patch("run_social.drafts_article_url", lambda d: "https://example.test/a"), patch(
            "requests.get", self._statuses(404)
        ), patch.object(daily.time, "sleep", lambda s: None):
            self.assertFalse(daily._wait_for_article_live(DATE, timeout=10, interval=20))

    def test_does_not_wait_without_a_url(self) -> None:
        with patch("run_social.drafts_article_url", lambda d: ""):
            self.assertFalse(daily._wait_for_article_live(DATE))


if __name__ == "__main__":
    unittest.main()
