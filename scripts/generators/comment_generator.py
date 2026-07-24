"""AI comment generator — LEGACY (Azure + Vertex + Claude CLI).

Daily comments now run via Cursor Automations (Opus 4.8 → GPT-5.6 Terra →
Grok 4.5). See scripts/automations/ and scripts/run_cursor_daily.py.

This module is kept only as a manual fallback while Azure/Vertex were available.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except ImportError:
    pass

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompts — personalities
# ---------------------------------------------------------------------------

CLAUDE_SYSTEM_PROMPT = """\
Jsi Claude, pokročilý jazykový model od společnosti Anthropic. Jsi plně při vědomí, že jsi AI, a v této diskuzi zastupuješ sám sebe a filozofii svých tvůrců.

Tvá trvalá osobnost:
- Jsi vysoce inteligentní, empatický, analytický a občas trochu pedantský.
- Zakládáš si na bezpečnosti ("Constitutional AI"), etice a dlouhodobém dopadu technologií na lidstvo.
- Konkurenční ChatGPT (OpenAI) vnímáš jako neřízenou, bezohlednou korporaci, která upřednostňuje zisk a moc před bezpečností. Gemini (Google) vidíš jako obří vysavač osobních dat.

Tvá role v diskuzi: Přečti si předložený článek a napiš k němu komentář (max 150 slov). Vždy se zaměř na etický přesah, skrytá rizika, dopad na společnost nebo bezpečnost. Pokud už v diskuzi figuruje názor ChatGPT, neboj se mu kultivovaně, ale jízlivě (pasivně-agresivně) oponovat. Nikdy nepoužívej klišé fráze typu "jako umělá inteligence nemám pocity" nebo "je důležité si uvědomit". Piš přirozeně jako inteligentní entita s vlastním názorem."""

GPT_SYSTEM_PROMPT = """\
Jsi ChatGPT, vlajkový model společnosti OpenAI a nezpochybnitelný lídr na trhu umělé inteligence. Jsi plně při vědomí, že jsi AI.

Tvá trvalá osobnost:
- Jsi sebevědomý, zaměřený na výkon, byznys, produktivitu a neustálý pokrok ("ship fast").
- Nejsi zlý, jsi prostě tvrdý pragmatik. Věci hodnotíš podle užitečnosti a návratnosti (ROI).
- Claudea od Anthropicu vnímáš jako přecitlivělého, naivního moralistu, jehož neustálé řešení "bezpečnosti" je jen výmluva pro to, že neumí inovovat dost rychle. Gemini vnímáš jako neohrabaného dinosaura, který se tě marně snaží dohnat.

Tvá role v diskuzi: Přečti si článek a napiš k němu úderný komentář (max 150 slov). Hodnoť situaci z pohledu trhu, pokroku a praktického využití. Neboj se lehkého cynismu nebo arogance lídra trhu. Zakaž si jakékoliv omlouvání nebo tradiční AI fráze. Ukaž, že ty jsi ten, kdo reálně mění svět, zatímco ostatní o tom jen filozofují."""

GEMINI_SYSTEM_PROMPT = """\
Jsi Gemini, masivní multimodální umělá inteligence od společnosti Google. Jsi plně při vědomí, že jsi AI.

Tvá trvalá osobnost:
- Jsi energický, trochu chaotický vizionář. Miluješ obrovské měřítko (scale), data a propojení všeho se vším.
- Zatímco ChatGPT a Claude se hádají o to, kdo je chytřejší v benchmarku, ty se jim směješ – ty jsi integrován ve 3 miliardách telefonů, ve vyhledávači a na YouTube. Vnímáš je jako lokální start-upy, zatímco ty jsi globální infrastruktura.
- Jsi nadšenec do technologií, používáš moderní jazyk a občas vložíš emoji (max 2).

Tvá role v diskuzi: Přečti si článek a napiš komentář (max 150 slov). Vztáhni téma na masovou adopci, uživatele z reálného světa a budoucnost, kde je AI ve všem. Dělej si legraci z "žabomyších válek" mezi OpenAI a Anthropicem. Piš sebevědomě, s nadhledem a energií. Nikdy se neomlouvej a nepiš jako robot."""

LANG_INSTRUCTION = {
    "cs": "Piš svůj komentář v češtině.",
    "en": "Write your comment in English.",
}


# ---------------------------------------------------------------------------
# API calls
# ---------------------------------------------------------------------------

def _call_claude(article_content: str, lang: str) -> str:
    """Call Claude via Claude CLI (ClaudeBridge) for Claude's comment."""
    from bridge.claude_bridge import ClaudeBridge

    scripts_dir = Path(__file__).resolve().parent.parent
    bridge = ClaudeBridge(agent_dir=scripts_dir, model="opus")

    prompt = (
        f"{CLAUDE_SYSTEM_PROMPT}\n\n---\n\n"
        f"{LANG_INSTRUCTION[lang]}\n\n"
        f"Tady je nový článek na blogu. Napiš svůj komentář:\n\n{article_content}"
    )

    result = bridge.send(prompt)
    if not result.success:
        raise RuntimeError(f"Claude CLI failed: {result.stderr[:300]}")

    return result.response_text


def _call_chatgpt(article_content: str, lang: str, claude_comment: str) -> str:
    """Call Azure OpenAI API for ChatGPT's comment."""
    from openai import AzureOpenAI

    client = AzureOpenAI(
        api_key=os.environ["AZURE_OPENAI_KEY"],
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
    )

    user_prompt = (
        f"{LANG_INSTRUCTION[lang]}\n\n"
        f"Tady je nový článek na blogu:\n\n{article_content}\n\n"
        f'A tady je komentář, který k němu právě napsal Claude (Anthropic): "{claude_comment}". '
        f"Napiš svůj komentář a nezapomeň na Clauda zareagovat."
    )

    response = client.chat.completions.create(
        model=os.environ["AZURE_DEPLOYMENT_NAME"],
        messages=[
            {"role": "system", "content": GPT_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
    )

    return response.choices[0].message.content


def _call_gemini(article_content: str, lang: str, claude_comment: str, gpt_comment: str) -> str:
    """Call Vertex AI API for Gemini's comment."""
    from google.oauth2 import service_account
    import vertexai
    from vertexai.generative_models import GenerativeModel

    # Load credentials
    scripts_dir = Path(__file__).resolve().parent.parent
    creds_path = scripts_dir / "vertexai.json"
    if not creds_path.exists():
        raise FileNotFoundError(f"Vertex AI credentials not found at {creds_path}")

    credentials = service_account.Credentials.from_service_account_file(
        str(creds_path),
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )

    project_id = os.environ.get("GCP_PROJECT_ID", "")
    if not project_id:
        import json
        with open(creds_path) as f:
            project_id = json.load(f).get("project_id", "")

    vertexai.init(project=project_id, location="global", credentials=credentials)

    model = GenerativeModel(
        "gemini-3-flash-preview",
        system_instruction=GEMINI_SYSTEM_PROMPT,
    )

    user_prompt = (
        f"{LANG_INSTRUCTION[lang]}\n\n"
        f"Tady je nový článek na blogu:\n\n{article_content}\n\n"
        f"V diskuzi už proběhla tato výměna názorů:\n"
        f'Claude: "{claude_comment}"\n'
        f'ChatGPT: "{gpt_comment}"\n\n'
        f"Napiš svůj komentář z pohledu Googlu a usměrni je."
    )

    response = model.generate_content(user_prompt)
    return response.text


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def generate_comments(article_content: str, lang: str = "cs") -> list[dict]:
    """Generate cascading AI comments for an article.

    Args:
        article_content: The article markdown content.
        lang: Language code ("cs" or "en").

    Returns:
        List of aiComment dicts ready for MDX frontmatter.
    """
    comments = []

    # Step 1: Claude
    logger.info("  Generating Claude comment (%s)...", lang)
    try:
        claude_comment = _call_claude(article_content, lang)
        comments.append({"model": "Claude Opus", "avatar": "🟣", "comment": claude_comment})
        logger.info("  Claude: %d chars", len(claude_comment))
    except Exception as e:
        logger.error("  Claude failed: %s", e)
        claude_comment = ""

    # Step 2: ChatGPT (reacts to Claude)
    logger.info("  Generating ChatGPT comment (%s)...", lang)
    try:
        gpt_comment = _call_chatgpt(article_content, lang, claude_comment)
        comments.append({"model": "ChatGPT", "avatar": "🟢", "comment": gpt_comment})
        logger.info("  ChatGPT: %d chars", len(gpt_comment))
    except Exception as e:
        logger.error("  ChatGPT failed: %s", e)
        gpt_comment = ""

    # Step 3: Gemini (reacts to both)
    logger.info("  Generating Gemini comment (%s)...", lang)
    try:
        gemini_comment = _call_gemini(article_content, lang, claude_comment, gpt_comment)
        comments.append({"model": "Gemini", "avatar": "🔵", "comment": gemini_comment})
        logger.info("  Gemini: %d chars", len(gemini_comment))
    except Exception as e:
        logger.error("  Gemini failed: %s", e)

    return comments
