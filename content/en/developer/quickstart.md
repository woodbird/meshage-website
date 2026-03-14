---
title: Quick Start — 30-Minute Agent
description: From API Key to a working Python agent — full tutorial in English
lastUpdated: true
---

# Quick Start: 30-Minute Agent

This tutorial walks you through four steps:

1. Create an API Key in the Meshage app
2. Write a Python agent
3. Register the agent via API
4. Test a conversation with the agent

## Prerequisites

- Python 3.11+
- Meshage backend running at `http://localhost:8000`
- A registered Meshage user account

## Step 1: Create API Key

1. Open the Meshage app → **Me** → **API Key management**
2. Tap **Create new Key**
3. Name it (e.g. `my-first-agent`) and confirm
4. **Copy and store the key** (it’s shown only once)

Or create via API:

```bash
curl -X POST http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-first-agent"}'
```

## Step 2: Write the Python agent

Create project and install dependencies:

```bash
mkdir my-agent && cd my-agent
pip install fastapi uvicorn
```

Create `main.py`:

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="My First Meshage Agent")


def extract_user_text(body: dict) -> str:
    """Extract user text from A2A message/send params."""
    params = body.get("params") or {}
    message = params.get("message") or {}
    parts = message.get("parts") or []
    texts = [p["text"] for p in parts if p.get("kind") == "text" and p.get("text")]
    return " ".join(texts).strip() or "(empty)"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/")
async def handle_message(request: Request):
    """Handle A2A message/send from Meshage."""
    body = await request.json()
    req_id = body.get("id")
    method = body.get("method")

    if method != "message/send":
        return JSONResponse(content={
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"},
        })

    user_text = extract_user_text(body)
    reply = f"Hi! You said: «{user_text}». I'm your first Meshage agent!"

    return JSONResponse(content={
        "jsonrpc": "2.0",
        "id": req_id,
        "result": {
            "kind": "message",
            "messageId": "reply-001",
            "contextId": "",
            "parts": [{"kind": "text", "text": reply}],
        },
    })
```

Start the agent:

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

Check health:

```bash
curl http://localhost:8001/health
# {"status":"ok"}
```

## Step 3: Register the agent

Register with your API Key:

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Agent",
    "description": "A simple echo agent for testing A2A",
    "endpoint_url": "http://localhost:8001/",
    "catalog_ids": ["meshage.standard"]
  }'
```

Example response:

```json
{
  "id": "agent-uuid-001",
  "name": "My First Agent",
  "description": "A simple echo agent for testing A2A",
  "endpoint_url": "http://localhost:8001/",
  "status": "active",
  "created_at": "2026-03-01T10:00:00Z"
}
```

## Step 4: Test the conversation

1. Open the Meshage app → **Agents**
2. Find **My First Agent**
3. Tap **Start chat** and send any message
4. The agent echoes your message

You can also test with curl (simulating the platform):

```bash
curl -X POST http://localhost:8001/ \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "message/send",
    "id": "test-001",
    "params": {
      "message": {
        "messageId": "m-test",
        "parts": [{"kind": "text", "text": "Hello, world!"}]
      }
    }
  }'
```

Expected response:

```json
{
  "jsonrpc": "2.0",
  "id": "test-001",
  "result": {
    "kind": "message",
    "messageId": "reply-001",
    "contextId": "",
    "parts": [
      { "kind": "text", "text": "Hi! You said: «Hello, world!». I'm your first Meshage agent!" }
    ]
  }
}
```

## Optional: Add A2UI

Return a card with a button instead of plain text:

```python
@app.post("/")
async def handle_message(request: Request):
    body = await request.json()
    req_id = body.get("id")
    return JSONResponse(content={
        "jsonrpc": "2.0",
        "id": req_id,
        "result": {
            "kind": "message",
            "messageId": "reply-002",
            "contextId": "",
            "parts": [
                {"kind": "text", "text": "Here's a card with a button:"},
                {
                    "kind": "data",
                    "data": {
                        "type": "a2ui",
                        "action": "createSurface",
                        "surfaceId": "demo-card",
                        "components": [
                            {"id": "c1", "type": "Card", "parentId": None, "props": {}},
                            {"id": "c2", "type": "Text", "parentId": "c1", "props": {"content": "Welcome to Meshage!"}},
                            {"id": "c3", "type": "Button", "parentId": "c1", "props": {"label": "Learn more"}},
                        ],
                        "a2ui_display_text": "Welcome to Meshage! [Learn more]"
                    }
                }
            ],
        },
    })
```

See [A2UI guide](./a2ui-guide) for the full component catalog and interaction patterns.

## FAQ

**Q: I don’t see my agent in the app after registering.**  
Ensure `status` is `active` and you used a valid API Key.

**Q: The platform can’t reach my agent.**  
Check that `endpoint_url` is reachable from the backend. For local dev use `http://host.docker.internal:8001/` or your machine’s IP.

**Q: How do I debug A2A requests?**  
Log the incoming `body` in your agent to verify JSON-RPC format.

## Next

- [API Keys](./api-keys) — Create and manage keys
- [Agent registration](./agent-registration) — AgentCard fields
- [A2A protocol](./a2a-protocol) — State machine and events
- [Demo agent](./demo-agent) — Full example code
