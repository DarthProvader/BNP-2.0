# Cursor Automations — BNP daily writer chain

Local orchestrator: `scripts/run_cursor_daily.py` (Task Scheduler → `run_daily.bat`).

## Models

| Step | Automation prompt | Model |
|------|-------------------|--------|
| 1 | `01-article-sonnet5.md` | Claude Sonnet 5 |
| 2 | `02-comment-opus48.md` | Claude Opus 4.8 |
| 3 | `03-comment-gpt56-terra.md` | GPT-5.6 Terra |
| 4 | `04-comment-grok45.md` | Grok 4.5 |
| 5 | `05-social-sonnet5.md` | Claude Sonnet 5 |

## Flow

```
collect → push daily-inbox
→ article webhook → poll MDX
→ opus → gpt → grok webhooks → poll aiComments
→ social webhook → poll content/social-drafts/{date}/drafts.md
→ local X + LinkedIn publish
```

## Create each Automation

1. Open Automations UI (agent can prefill)
2. Trigger: **Webhook**
3. Model: as in the table
4. Repository: `DarthProvader/BNP-2.0`, branch `main`
5. Instructions: paste the matching `0N-*.md` file (or `@` it after commit)
6. Save → copy webhook URL + auth header (`Bearer crsr_…`)

## `scripts/.env`

```env
CURSOR_WEBHOOK_ARTICLE_URL=...
CURSOR_WEBHOOK_ARTICLE_KEY=...
CURSOR_WEBHOOK_OPUS_URL=...
CURSOR_WEBHOOK_OPUS_KEY=...
CURSOR_WEBHOOK_GPT_URL=...
CURSOR_WEBHOOK_GPT_KEY=...
CURSOR_WEBHOOK_GROK_URL=...
CURSOR_WEBHOOK_GROK_KEY=...
CURSOR_WEBHOOK_SOCIAL_URL=...
CURSOR_WEBHOOK_SOCIAL_KEY=...
```

Keys may be pasted with or without the `Bearer ` prefix.

## Local tests

```bash
python scripts/run_cursor_daily.py --collect-only
python scripts/run_cursor_daily.py --skip-collect --dry-run-webhooks
python scripts/run_social.py --date YYYY-MM-DD --dry-run
```
