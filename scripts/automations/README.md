# Cursor Automations — BNP daily writer chain (cron, no webhook keys required)

Local orchestrator: `scripts/run_cursor_daily.py` (Task Scheduler → `run_daily.bat`).

Default mode: **cron Automations** + local collect/poll/publish. No `CURSOR_WEBHOOK_*` needed.

## CRITICAL: push straight to `main` (no PRs)

Cursor enables the **Pull request creation** tool by default. That is why runs land on `cursor/...` branches instead of `main`, and the comment chain then fails.

For **each** of the 5 Automations, in the editor:

1. **Tools** → disable **Open pull request** / **Pull request creation**.
2. Repo = `DarthProvader/BNP-2.0`, branch = **`main`**.
3. Replace the prompt with the matching file under `scripts/automations/0N-*.md` (they now forbid feature branches and PRs).
4. Save + keep Active.

Without step 1, prompt wording alone is not enough.

Also check GitHub: `main` must allow the Automation identity to **push** (no "require PR" branch protection that blocks the Cursor GitHub app / your account).

## Event-driven chain (recommended — replaces fixed cron gaps)

Fixed cron times are brittle: if the article is 40 minutes late, the Opus run finds nothing, and GPT/Grok then bail on their prerequisite. Chain the steps on git events instead.

For Automations **02–05**, add a second trigger in the UI:

**Add trigger → On a GitHub event → New push to branch** → repo `DarthProvader/BNP-2.0`, branch `main`.

Now every step wakes up as soon as the previous one pushes: article → Opus → GPT → Grok → social.

Keep the cron trigger as a backstop (triggers are OR-ed, so either one fires a run).

### Why this is safe

Every push to `main` wakes all four Automations, so most runs must do nothing. Each prompt starts with a **Guard** section that exits early when:

- today's MDX is not on `main` yet,
- the previous model's comment is missing,
- its own output already exists (idempotent — no duplicate comments, no overwritten drafts).

No-op runs finish in seconds. Never remove the Guard section when editing a prompt.

## Schedule (cron backstop — Europe/Prague local wall clock, confirm timezone in Automations UI)

| Time | Automation | Model |
|------|------------|--------|
| ~06:00 | Local: collect + push `daily-inbox` | — |
| 06:20 | BNP Daily Article | Claude Sonnet 5 |
| 06:50 | BNP Comment Opus | Claude Opus 4.8 |
| 07:20 | BNP Comment GPT | GPT-5.6 Terra |
| 07:50 | BNP Comment Grok | Grok 4.5 |
| 08:20 | BNP Social Drafts | Claude Sonnet 5 |
| until done | Local: poll git + publish X/LinkedIn | — |

Cron expressions (if UI wants custom cron):

```
20 6 * * *   # article
50 6 * * *   # opus
20 7 * * *   # gpt
50 7 * * *   # grok
20 8 * * *   # social
```

Set each Automation timezone to your local timezone (CET/CEST) when the editor offers it.

## Repo

- Repository: `DarthProvader/BNP-2.0`
- Branch: `main` (direct push — never a feature branch)
- Prompts: `scripts/automations/01`–`05-*.md` (source of truth; paste into UI after edits)

## Optional webhooks

Only if you later prefer push-triggered runs:

```
python scripts/run_cursor_daily.py --use-webhooks
```

Requires `CURSOR_WEBHOOK_{ARTICLE,OPUS,GPT,GROK,SOCIAL}_{URL,KEY}` in `scripts/.env`.
