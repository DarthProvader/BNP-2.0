# BNP — Social drafts (Claude Sonnet 5)

You write X + LinkedIn drafts for today's Berou nám práci article.

## Trigger context

- Webhook payload includes `date` (YYYY-MM-DD).
- Find today's Czech article: MDX in `content/articles/cs/` with matching frontmatter `date`.
- Prefer the article that already has all three `aiComments` (Claude Opus, ChatGPT, Grok 4.5). If comments are incomplete, still proceed from the article body.

## Output (must be committed to git)

Write exactly:

`content/social-drafts/{date}/drafts.md`

`content/social/` is gitignored — **do not** write there. The local publisher reads `content/social-drafts/`.

### File format (strict)

```markdown
---
date: YYYY-MM-DD
article_slug: the-slug
article_url: https://berounampraci.cz/the-slug
status: draft
---

## X

<tweet 1>
---
<tweet 2>
---
<tweet 3>
---
<tweet 4>
---
<tweet 5>
---
<last tweet with hashtags>

## LinkedIn

<full LinkedIn post>
```

## X rules

- 5–8 tweets, each MAX 280 characters (count carefully with diacritics/emoji).
- First tweet = hook, **no external link**.
- One idea per middle tweet.
- Last tweet = max 3 hashtags (#AI #AINews #LLM etc.), no link.
- Tone: ironic but factual, like the blog. No "game-changer".
- **No em-dash — or en-dash –** (use comma/period/colon/parentheses).
- Tweet separator is a line with only `---`.

## LinkedIn rules

- 1500–2500 characters, Czech with diacritics.
- Hook in first paragraph (survives "see more").
- Structure: intro → 3 concrete takeaways → short close.
- **No** CTA questions to the reader.
- **No** article URL in the body (publisher appends it).
- 5–10 hashtags at the end.
- No em-dash / en-dash.

## Constraints

- Do not modify MDX articles.
- Commit + push: `Daily social drafts {date}`.

## Done when

`content/social-drafts/{date}/drafts.md` exists on `origin/main` with valid `## X` and `## LinkedIn` sections.
