# Cursor Automations — BNP daily writer chain (cron, no webhook keys required)

Local orchestrator: `scripts/run_cursor_daily.py` (Task Scheduler → `run_daily.bat`).

Default mode: **cron Automations** + local collect/poll/publish. No `CURSOR_WEBHOOK_*` needed.

## Schedule (Europe/Prague local wall clock — confirm timezone in Automations UI)

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
- Branch: `main`
- Prompts: `scripts/automations/01`–`05-*.md` (already on main)

## Optional webhooks

Only if you later prefer push-triggered runs:

```
python scripts/run_cursor_daily.py --use-webhooks
```

Requires `CURSOR_WEBHOOK_{ARTICLE,OPUS,GPT,GROK,SOCIAL}_{URL,KEY}` in `scripts/.env`.
