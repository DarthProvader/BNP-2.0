# SDK pipeline prompts

These are the prompts for the daily pipeline, run as **local Cursor agents**
through `cursor-sdk` by `scripts/run_cursor_daily.py`. This replaced the cloud
Cursor Automations setup (`scripts/automations/`, now a fallback).

## Why SDK instead of Automations

The Automations chain kept breaking in ways we could not control:

- Cloud agents worked in a clone and pushed to `cursor/...` branches, so the
  next step in the chain could not see the previous step's output on `main`.
- A step that "finished" with nothing done looked like a success.
- Ordering depended on cron timing rather than on actual completion.

With the SDK, agents run against this working copy, never touch git, and the
orchestrator verifies each step on disk before committing and pushing itself.
A step either produced its file or the run is reported as failed.

## Steps

| Step | Prompt | Model | Output |
| --- | --- | --- | --- |
| `article` | `01-article.md` | `grok-4.5` fast | `content/articles/{cs,en}/<slug>.mdx` |
| `opus` | `02-comment-opus.md` | `grok-4.5` fast | `aiComments` → Claude Opus (persona) |
| `gpt` | `03-comment-gpt.md` | `grok-4.5` fast | `aiComments` → ChatGPT (persona) |
| `grok` | `04-comment-grok.md` | `grok-4.5` fast | `aiComments` → Grok 4.5 |
| `social` | `05-social.md` | `grok-4.5` fast | `content/social-drafts/{date}/drafts.md` |

Temporary: Claude/GPT/Gemini limits exhausted, so every step uses
`grok-4.5` with `fast=true`. Public labels in the MDX stay the old personas.
Model selection lives in `scripts/cursor_pipeline/agent_runner.py`.

## Prompt conventions

- `{date}` is replaced with the target date (`YYYY-MM-DD`) before sending.
- Every prompt starts with a **Guard** section so a re-run is idempotent: it
  stops early when the prerequisite is missing or the output already exists.
- Prompts forbid `git`. Committing and pushing is the orchestrator's job.

## Setup

1. Put a Cursor API key in `scripts/.env` (gitignored):

```
CURSOR_API_KEY=crsr_...
```

Create keys at cursor.com/dashboard → Integrations.

2. Install dependencies:

```bash
pip install -r scripts/requirements.txt
```

## Running

```bash
# full pipeline for today
python scripts/run_cursor_daily.py

# re-run just the comments for a date, no publishing
python scripts/run_cursor_daily.py --date 2026-07-29 --skip-collect --skip-social --steps opus,gpt,grok

# collectors only
python scripts/run_cursor_daily.py --collect-only
```

To rehearse the whole chain without touching the live site, copy the repo
elsewhere (scripts + older articles + the target date's `daily-inbox/`, but
*not* that date's article or drafts, or every guard stops early) and run the
copy's script with `--no-git --skip-social`. Nothing is committed, pushed or
posted.

Each step gets `--attempts` tries (default 2); a step that produces nothing is
logged, the pipeline continues, and the process exits non-zero.

## Windows note

The SDK's synchronous bridge cannot start on Windows (it waits on a subprocess
pipe with `select`, which only accepts sockets there). `agent_runner` therefore
uses `AsyncClient.launch_bridge`, which goes through asyncio subprocesses and
works fine. Do not switch these calls to the sync `Cursor.*` / `Agent.*`
helpers.
