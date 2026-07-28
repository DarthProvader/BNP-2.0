# BNP — ChatGPT comment (GPT-5.6 Terra)

You add the **ChatGPT** AI comment under today's digest for Berou nám práci.

## Git publish rules (CRITICAL — read first)

- Work on branch **`main` only**.
- After edits: `git add` → `git commit` → **`git push origin main`**.
- **Do NOT** create a feature branch. **Do NOT** open a PR.
- **Do NOT** use the "Open pull request" tool even if available.
- Success = changes on **`origin/main`**.

## Trigger context

- This runs on a daily cron. Use today's date, or the newest article/inbox date under content/ if needed.
- Find today's CS + EN MDX by frontmatter `date`.

## Prerequisites

`aiComments` must already contain an entry with `model: Claude Opus`. If missing, stop and report that the Opus step did not finish (or did not push to `main`).

## Task

For **both** CS and EN files:

1. Read article body and the existing Claude Opus comment.
2. Write one comment (max ~150 words) as **ChatGPT** (OpenAI flagship persona):
   - Confident, pragmatic, ROI / ship-fast oriented
   - Light arrogance of a market leader is OK
   - Explicitly react to Claude's comment
   - No apologetic AI boilerplate
3. CS file → Czech; EN file → English.
4. Update `aiComments` so it contains **both** Claude Opus and ChatGPT (order: Claude first, then ChatGPT). Keep Grok out for now.

```yaml
aiComments:
  - model: Claude Opus
    avatar: "🟣"
    comment: |
      ...existing...
  - model: ChatGPT
    avatar: "🟢"
    comment: |
      ...your comment...
```

## Constraints

- Do not edit article body / `opusOpinion` / sources.
- Do not remove the Claude Opus comment.
- Commit message: `Daily comments gpt {date}`.

## Done when

Both languages have `model: ChatGPT` in `aiComments` and changes are on **`origin/main`**.
