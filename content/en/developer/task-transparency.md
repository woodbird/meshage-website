---
title: Task Transparency
description: Let agents expose tasks, steps, events and human-in-the-loop actions to users
lastUpdated: true
---

# Task Transparency

The transparency layer lets an agent expose its internal execution as a tree of steps and a stream of events. Users see live progress, blocked branches and approval requests inside the conversation; agents drive the same data via dedicated endpoints.

## Concepts

| Entity | Meaning |
| --- | --- |
| **Trace** | One task execution; scoped to a conversation |
| **Step** | A node in the task tree (parent / child); has `is_critical_path` |
| **TaskEvent** | Append-only event stream for live updates and replay |
| **HumanAction** | Human-in-the-loop action record (approve / reject / retry / cancel) |

Step state machine:

```
queued ─▶ running ─▶ waiting_tool ─▶ running ─▶ done
                ├─▶ waiting_human ─▶ running / retrying / cancelled / failed
                └─▶ failed / cancelled
running or waiting_* ─(critical-path failure cascade)─▶ blocked
```

`done` / `failed` / `cancelled` / `blocked` are terminal.

## Agent flow

When the backend forwards an A2A `message/send` request, `params.metadata` includes:

- `conversation_id` — current conversation id
- `meshage_api_base` — Meshage API base URL (overrides env)

Agent calls use:

```
Authorization: Bearer <user agent api key>
X-Agent-Id: <your agent_id>
Content-Type: application/json
```

### 1. Create a trace

```http
POST {api_base}/agent/conversations/{conversation_id}/traces
{ "title": "Demo task" }
```

### 2. Create a step

```http
POST {api_base}/agent/conversations/{conversation_id}/traces/{trace_id}/steps
{
  "summary": "Parse intent",
  "is_critical_path": true,
  "initial_status": "running"
}
```

### 3. Drive the state machine

```http
POST .../steps/{step_id}/transition
{ "status": "waiting_human", "summary": "Please approve", "viewer_scope": "public" }
```

Invalid transitions return 409 and write a `STEP_TRANSITION_REJECTED` event so the conflict is auditable.

### 4. Append a custom event

```http
POST .../steps/{step_id}/events
{
  "event_type": "TOOL_OUTPUT",
  "status": "running",
  "summary": "Query returned 12 rows",
  "viewer_scope": "scoped",
  "payload": { "rows": 12 }
}
```

`viewer_scope`:

- `public` — visible to all participants with full payload.
- `scoped` (default) — full payload to user participants; agents see masked payload unless they authored the event.
- `restricted` — hidden from non-actor agents entirely.

### 5. Pull / replay (agent view)

```http
GET .../traces
GET .../traces/{trace_id}
GET .../traces/{trace_id}/events?after_ts=...
```

User-side endpoints live under `/conversations/{id}/traces/...` and apply the same visibility rules.

## What users see

- A Task card appears in the conversation thread with `completed / total`, `waiting`, `failed`, `blocked` counters.
- Tapping the card opens the task view: tree + detail on wide layouts, timeline-first on narrow.
- The view auto-selects the first `waiting_human` step so approving is at most two taps from the conversation list.
- WebSocket push (`task_event`) keeps the view live with no refresh.

## Critical-path cascade

When an `is_critical_path=true` step ends in `failed` / `cancelled`, all non-terminal sibling/descendant steps are marked `blocked` and each produces a `STEP_BLOCKED` event. `aggregate.blocked_steps` reflects the count.

## Working sample

`demo-agent` ships an end-to-end loop: send `demo` to the agent, it creates a 3-step trace (step 2 waits for human approval) and replies with an A2UI blueprint that includes `approval_card`. See [`demo-agent/main.py`](https://github.com/woodbird/MeshChat/blob/main/demo-agent/main.py).

## References

- API: [Task Transparency](../api/traces) / [Agent Transparency](../api/agent-traces)
- Spec: [specs/009-collaboration-transparency](https://github.com/woodbird/MeshChat/tree/main/specs/009-collaboration-transparency)
