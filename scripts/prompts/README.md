# Codex pipeline prompts

These are the prompts for the active daily pipeline, run as local Codex CLI
agents by `scripts/run_codex_daily.py`. Every writing step uses
`gpt-5.6-terra` with high reasoning effort.

The comment prompts deliberately keep their public Claude Opus, ChatGPT, and
Grok personas. The underlying model is Terra, but the published discussion
continues to appear as distinct model voices.

The previous local Cursor SDK runner remains available as
`scripts/run_cursor_daily.py`. The older cloud Cursor Automations are kept
under `scripts/automations/` as a second-level fallback.

## Why local agents instead of cloud Automations

The Automations chain kept breaking in ways the orchestrator could not
control:

- Cloud agents worked in a clone and pushed to `cursor/...` branches, so the
  next step could not see the previous step's output on `main`.
- A step that finished with nothing done looked like a success.
- Ordering depended on cron timing rather than actual completion.

Local agents run against one working copy and never touch git. The
orchestrator verifies every step on disk, then commits and pushes it. A step
either produces its expected output or the run is reported as failed.

## Steps

| Step | Prompt | Runtime model | Published voice/output |
| --- | --- | --- | --- |
| `article` | `01-article.md` | `gpt-5.6-terra` | CS+EN article, Claude Sonnet editorial voice |
| `opus` | `02-comment-opus.md` | `gpt-5.6-terra` | `aiComments` → Claude Opus persona |
| `gpt` | `03-comment-gpt.md` | `gpt-5.6-terra` | `aiComments` → ChatGPT persona |
| `grok` | `04-comment-grok.md` | `gpt-5.6-terra` | `aiComments` → Grok 4.5 persona |
| `social` | `05-social.md` | `gpt-5.6-terra` | `content/social-drafts/{date}/drafts.md` |

Model selection lives in `scripts/codex_pipeline/agent_runner.py`.

## Prompt conventions

- `{date}` is replaced with the target date (`YYYY-MM-DD`) before sending.
- Every prompt has an idempotent Guard section.
- Prompts forbid git. Committing and pushing is the orchestrator's job.

## Codex setup

Install Codex CLI in WSL and sign in once:

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
codex login
```

Install the Python dependencies on Windows:

```powershell
pip install -r scripts/requirements.txt
```

## Running

```bash
# Full pipeline for today
python scripts/run_codex_daily.py

# Re-run selected comments for a date without publishing
python scripts/run_codex_daily.py --date 2026-07-29 --skip-collect --skip-social --steps opus,gpt,grok

# Collectors only
python scripts/run_codex_daily.py --collect-only

# Preserved Cursor SDK fallback
python scripts/run_cursor_daily.py
```

Each step gets `--attempts` tries (default 2). A step that produces nothing is
logged, the pipeline continues, and the process exits non-zero.

## Windows / WSL deployment

The scheduled task and Python collectors run on Windows. The Codex agent
runner invokes `/home/pavel/.local/bin/codex` through `wsl.exe`, and Codex
edits the same checkout through `/mnt/c`.

For a different server layout, set one or more of:

- `BNP_CODEX_WSL_USER`
- `BNP_CODEX_WSL_DISTRO`
- `BNP_CODEX_PROJECT_ROOT`
- `BNP_CODEX_BIN`
