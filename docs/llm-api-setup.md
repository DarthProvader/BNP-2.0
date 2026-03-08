# LLM API Setup - Gemini (Vertex AI) a Azure OpenAI

Navod vychazi z fungovaciho kodu v `jarvis-backend/src/jarvis_langgraph/graph.py`.

---

## Gemini (Google Vertex AI)

### Instalace

```bash
pip install langchain-google-vertexai google-auth
```

### Credentials - 2 zpusoby

#### 1. Lokalni vyvoj - soubor `vertexai.json`

Stahni service account JSON z Google Cloud Console:
- IAM & Admin → Service Accounts → vytvorit ucet s roli `Vertex AI User`
- Keys → Add Key → JSON → stahne se `vertexai.json`

Uloz jako `vertexai.json` do rootu projektu. **Nikdy nekompitovat do gitu.**

```gitignore
vertexai.json
**/vertexai.json
```

#### 2. Produkce (Docker/cloud) - env var

```bash
# Zakodovat soubor do base64
base64 -w 0 vertexai.json

# Ulozit do .env
GOOGLE_CREDENTIALS_BASE64=<base64 string>
```

**Pozor:** Na Hostingeru/nekterych systemech base64 zpusobuje "Invalid private key" bug kvuli CRLF.
**Reseni:** Pouzij volume mount misto env var (viz docker-compose.yml v Jarvisovi).

### Pouziti s LangChain

```python
import json
import os
import tempfile
from google.oauth2 import service_account
from langchain_google_vertexai import ChatVertexAI

def load_credentials(creds_path: str):
    with open(creds_path) as f:
        data = json.load(f)
    project_id = data.get("project_id")
    credentials = service_account.Credentials.from_service_account_file(
        creds_path,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    return project_id, credentials

project, creds = load_credentials("vertexai.json")

model = ChatVertexAI(
    model_name="gemini-2.5-flash-preview-05-20",
    location="europe-west1",   # nebo "europe-southwest1" pro Madrid
    project=project,
    credentials=creds,
)

response = model.invoke("Ahoj, jak se mas?")
print(response.content)
```

### Dulezite - nazvy modelu

Vertex AI vyzaduje presne nazvy vcetne suffixu:

| Spravne | Spatne (404) |
|---------|--------------|
| `gemini-2.5-flash-preview-05-20` | `gemini-2.5-flash` |
| `gemini-3-flash-preview` | `gemini-3-flash` |

### Gemini 3 - specialni konfigurace

Gemini 3 vyzaduje `location="global"` (regionalni endpoint vraci 404):

```python
model = ChatVertexAI(
    model_name="gemini-3-flash-preview",
    location="global",          # POVINNE pro Gemini 3
    project=project,
    credentials=creds,
    thinking_budget=0,          # Vypne thinking (nutne pro tool calling v multi-agent)
)
```

### Thinking

```python
# Gemini 2.5 - thinking_budget (pocet tokenu)
model = ChatVertexAI(
    model_name="gemini-2.5-flash-preview-05-20",
    location="europe-west1",
    project=project,
    credentials=creds,
    thinking_budget=1000,       # 0 = vypnout, -1 = dynamic
)

# Gemini 3 - thinking_level (enum)
# Nastavuje se pres generation_config, ne pres ChatVertexAI parametr
# "MINIMAL" | "LOW" | "MEDIUM" | "HIGH"
```

### Async streaming

```python
async for chunk in model.astream("Vypis 5 faktov o Praze"):
    print(chunk.content, end="", flush=True)
```

---

## Azure OpenAI

### Instalace

```bash
pip install langchain-openai
```

### Credentials

V Azure Portal:
- Azure OpenAI resource → Keys and Endpoint
- Zkopiruj `KEY 1` a `Endpoint`
- Model deployments → zkopiruj nazev deployment

```env
AZURE_OPENAI_KEY=abc123...
AZURE_OPENAI_ENDPOINT=https://muj-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_DEPLOYMENT_NAME=gpt-5.1
```

### Pouziti s LangChain

```python
import os
from langchain_openai import AzureChatOpenAI

model = AzureChatOpenAI(
    azure_deployment=os.getenv("AZURE_DEPLOYMENT_NAME"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
    temperature=0,
)

response = model.invoke("Ahoj!")
print(response.content)
```

### Tool calling / Function calling

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """Vrati pocasi pro dane mesto."""
    return f"V {city} je 20 stupnu."

model_with_tools = model.bind_tools([get_weather])
response = model_with_tools.invoke("Jak je v Praze?")
```

**Dulezite pro multi-agent swarmy:** Azure OpenAI vyzaduje vypnout paralelni tool calls:

```python
model = AzureChatOpenAI(
    ...
    model_kwargs={"parallel_tool_calls": False},  # NUTNE pro LangGraph swarmy
)
```

---

## Pouziti primo (bez LangChain)

### Gemini - google-generativeai SDK

```python
pip install google-generativeai
```

```python
import google.generativeai as genai
from google.oauth2 import service_account

# Service account credentials
credentials = service_account.Credentials.from_service_account_file(
    "vertexai.json",
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)

import vertexai
vertexai.init(project="tvuj-project-id", location="europe-west1", credentials=credentials)

from vertexai.generative_models import GenerativeModel
model = GenerativeModel("gemini-2.5-flash-preview-05-20")
response = model.generate_content("Ahoj!")
print(response.text)
```

### Azure OpenAI - openai SDK

```bash
pip install openai
```

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_version="2024-12-01-preview",
)

response = client.chat.completions.create(
    model="gpt-5.1",   # nazev deployment, ne modelu
    messages=[{"role": "user", "content": "Ahoj!"}],
)
print(response.choices[0].message.content)
```

---

## .env sablona

```env
# Google Vertex AI
# Varianta A: soubor (lokalni vyvoj) - staci mit vertexai.json v rootu
GCP_PROJECT_ID=gen-lang-client-xxxxx
GCP_LOCATION=europe-west1

# Varianta B: base64 (cloud deploy, ale pozor na CRLF bug)
# GOOGLE_CREDENTIALS_BASE64=<base64>

# Azure OpenAI
AZURE_OPENAI_KEY=
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_DEPLOYMENT_NAME=gpt-5.1
```

---

## Casty problemy

| Problem | Reseni |
|---------|--------|
| `404 Publisher Model not found` | Chybi `-preview` suffix v nazvu modelu |
| `Invalid private key` | CRLF korupce v base64 - pouzij volume mount |
| `400 missing thought_signature` | Gemini 3 + multi-agent: nastav `thinking_budget=0` |
| `DefaultCredentialsError` | Chybi vertexai.json nebo GOOGLE_CREDENTIALS_BASE64 |
| `ResourceNotFound` na Azure | Spatny `azure_deployment` - zkontroluj nazev v Azure Portal |
