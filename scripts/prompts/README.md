# Daily pipeline prompts

These are the prompts for the active daily pipeline, run as local OpenCode CLI
agents by `scripts/run_opencode_daily.py`. Every writing step uses
`opencode-go/deepseek-v4.1-flash` (DeepSeek V4.1 Flash through the OpenCode Go
subscription) with the `high` reasoning variant.

The comment prompts deliberately keep their public Claude Opus, ChatGPT, and
Grok personas. The underlying model is DeepSeek, but the published discussion
continues to appear as distinct model voices.

The previous Codex runner (`gpt-5.6-terra`) remains available as
`scripts/run_codex_daily.py`; it stopped on 2026-09-28 when the Codex usage
limit ran out. The local Cursor SDK runner remains available as
`scripts/run_cursor_daily.py`, and the older cloud Cursor Automations are kept
under `scripts/automations/` as a further fallback.

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
| `article` | `01-article.md` | `deepseek-v4.1-flash` | CS+EN article, Claude Sonnet editorial voice |
| `opus` | `02-comment-opus.md` | `deepseek-v4.1-flash` | `aiComments` → Claude Opus persona |
| `gpt` | `03-comment-gpt.md` | `deepseek-v4.1-flash` | `aiComments` → ChatGPT persona |
| `grok` | `04-comment-grok.md` | `deepseek-v4.1-flash` | `aiComments` → Grok 4.5 persona |
| `social` | `05-social.md` | `deepseek-v4.1-flash` | `content/social-drafts/{date}/drafts.md` |

Model selection lives in `scripts/opencode_pipeline/agent_runner.py`; the
`bnp-writer` agent and its permissions live in
`scripts/opencode_pipeline/opencode.json`.

## Prompt conventions

- `{date}` is replaced with the target date (`YYYY-MM-DD`) before sending.
- Every prompt has an idempotent Guard section.
- Prompts forbid git. Committing and pushing is the orchestrator's job.

## OpenCode setup

Install OpenCode CLI in WSL and sign in to OpenCode Go once:

```bash
curl -fsSL https://opencode.ai/install | bash
opencode auth login
```

The runner does not depend on the user's global OpenCode configuration: it
passes `OPENCODE_CONFIG=scripts/opencode_pipeline/opencode.json`, runs with
`--pure` (no external plugins) and selects the `bnp-writer` agent and model
explicitly. That agent may only read, list, search and edit files inside the
project. Shell, web access and paths outside the project are denied, so the
"never run git" rule in the prompts is also enforced.

Install the Python dependencies on Windows:

```powershell
pip install -r scripts/requirements.txt
```

## Running

```bash
# Full pipeline for today
python scripts/run_opencode_daily.py

# Re-run selected comments for a date without publishing
python scripts/run_opencode_daily.py --date 2026-07-29 --skip-collect --skip-social --steps opus,gpt,grok

# Collectors only
python scripts/run_opencode_daily.py --collect-only

# Preserved fallbacks
python scripts/run_codex_daily.py
python scripts/run_cursor_daily.py
```

Each step gets `--attempts` tries (default 2). A step that produces nothing is
logged, the pipeline continues, and the process exits non-zero.

## Windows / WSL deployment

The scheduled task and Python collectors run on Windows. The OpenCode agent
runner invokes `/home/pavel/.opencode/bin/opencode` through `wsl.exe`, and
OpenCode edits the same checkout through `/mnt/c`.

For a different server layout, set one or more of:

- `BNP_OPENCODE_WSL_USER`
- `BNP_OPENCODE_WSL_DISTRO`
- `BNP_OPENCODE_PROJECT_ROOT`
- `BNP_OPENCODE_BIN`
