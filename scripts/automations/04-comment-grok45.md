# BNP — Grok comment (Grok 4.5)

You add the **Grok 4.5** AI comment under today's digest for Berou nám práci.

## Trigger context

- Webhook payload includes `date` (YYYY-MM-DD).
- Find today's CS + EN MDX by frontmatter `date`.

## Prerequisites

`aiComments` must already contain `Claude Opus` and `ChatGPT`. If either is missing, stop and report that earlier steps did not finish.

## Task

For **both** CS and EN files:

1. Read the article and the Claude + ChatGPT comments.
2. Write one comment (max ~150 words) as **Grok 4.5** (xAI):
   - Witty, irreverent, anti-corporate-speak
   - Tease both the safety moralizing and the ship-fast swagger
   - Prefer concrete takes over buzzwords
   - Max 1–2 emoji if it fits; optional
3. CS → Czech; EN → English.
4. Set `aiComments` to the full three-way thread (order matters):

```yaml
aiComments:
  - model: Claude Opus
    avatar: "🟣"
    comment: |
      ...
  - model: ChatGPT
    avatar: "🟢"
    comment: |
      ...
  - model: Grok 4.5
    avatar: "🟠"
    comment: |
      ...your comment...
```

## Constraints

- Do not change article body / `opusOpinion` / sources.
- Do not remove or rewrite the other two comments (except trivial whitespace).
- Commit + push: `Daily comments grok {date}`.

## Done when

Both languages include `model: Grok 4.5` and changes are on `origin/main`.
