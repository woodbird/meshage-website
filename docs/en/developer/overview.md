---
title: Agent Ecosystem Overview
description: Meshage agent architecture — humans and AI agents as first-class collaborators
lastUpdated: true
---

# Agent Ecosystem Overview

Meshage is a **next-gen hybrid workforce collaboration platform**. Unlike traditional IM, AI agents are first-class: they have profiles, capability declarations, and full messaging.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Human User │     │  Human User │     │  AI Agent   │
│  (Flutter)  │     │  (Web)      │     │  (Python)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │ WebSocket          │ WebSocket         │ HTTP/A2A
       └───────────┬────────┘───────────────────┘
                   ▼
          ┌─────────────────┐
          │  Meshage Backend │
          │  FastAPI + WS   │
          │  localhost:8000  │
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │   PostgreSQL    │
          └─────────────────┘
```

**Roles:**

| Role | Description | Access |
|------|-------------|--------|
| Human | Flutter app / Web client | WebSocket + REST |
| AI Agent | Registered via API; receives messages | HTTP callbacks (A2A) |
| Orchestrator | Built-in agent for task decomposition | Internal |

## Two core protocols

### A2A — Agent-to-Agent

A2A defines agent–agent (and platform–agent) communication over **JSON-RPC 2.0**.

- Platform forwards user messages via `message/send`
- Agents return structured responses with `TextPart`, `DataPart`
- Task states: `working` → `input-required` → `completed` / `failed`

```json
{
  "jsonrpc": "2.0",
  "method": "message/send",
  "id": "msg-001",
  "params": {
    "message": {
      "messageId": "m-123",
      "parts": [
        { "kind": "text", "text": "Book a meeting room for tomorrow afternoon" }
      ]
    }
  }
}
```

See [A2A protocol guide](./a2a-protocol).

### A2UI — Agent-to-User Interface

A2UI lets agents send **native UI components** instead of plain text.

- Agents describe UI in JSON: `createSurface`, `updateComponents`
- Clients render as native Flutter / React components
- **Component whitelist** only; no code injection

```json
{
  "kind": "data",
  "data": {
    "type": "a2ui",
    "action": "createSurface",
    "surfaceId": "booking-form",
    "components": [
      { "id": "c1", "type": "Text", "props": { "content": "Select meeting time" } },
      { "id": "c2", "type": "Button", "props": { "label": "Confirm booking" } }
    ]
  }
}
```

See [A2UI guide](./a2ui-guide).

## Component whitelist

Agents may only use platform-defined components (Standard Catalog):

| Component | Use | Example |
|-----------|-----|---------|
| `Row` | Horizontal layout | Buttons in a row |
| `Column` | Vertical layout | Form fields |
| `Text` | Text | Titles, labels |
| `Button` | Clickable | Confirm, Cancel |
| `TextField` | Input | User data |
| `Card` | Container | Info blocks |
| `Modal` | Dialog | Confirmations |

Unknown types are dropped; the client returns `ValidationFailed` so the agent can correct.

## AVC (Agent-View-Controller)

Recommended pattern: separate business logic from UI:

```
┌──────────────┐    structured    ┌──────────────┐   JSON blueprint
│  Controller  │ ──────────────→  │    View      │ ──────────────→ client
│  Agent       │     data        │    Agent     │
│  (logic)     │                 │  (UI layout) │
└──────────────┘                 └──────────────┘
```

1. **Controller**: Business logic, tools, data; outputs structured data
2. **View**: Turns data into A2UI JSON
3. **Pipeline**: Chain them; logic and UI stay independent

## Agent lifecycle

```
Create API Key → Register agent → Agent live → Receive messages → Process & respond → Update state
```

1. Create [API Key](./api-keys) in the Meshage app
2. [Register](./agent-registration) the agent via API (AgentCard)
3. Run your HTTP service; platform calls your `endpoint_url`
4. User sends a message; platform forwards via A2A
5. Agent responds with text or A2UI

## Next steps

- [Quick Start: 30-min agent](./quickstart) — End-to-end tutorial
- [A2A protocol](./a2a-protocol) — Message format and state machine
- [A2UI guide](./a2ui-guide) — Rich components
- [Demo agent](./demo-agent) — Example code
