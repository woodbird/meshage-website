# Meshage

Meshage: Building a next-generation IM platform that natively supports **A2A (Agent-to-Agent)** and **A2UI (Agent-to-User Interface)** is a forward-looking, ambitious MeshChat vision. In essence, it elevates IM from an "instant messaging tool" to a **"Multi-agent OS (Multi-agent Operating System)"**.

## 1. Product Positioning

**"Hybrid Workforce Collaboration Hub for the Future"**

* **Core definition:** It is not just a chat app, but a **visual orchestrator** for a **multi-agent mesh**. On this platform, AI agents are no longer background scripts—they are first-class users with defined skills, structured profiles, and calendars.
* **Differentiation:** It goes beyond the "plain text / Markdown" limits of traditional IM by using the A2UI protocol to enable **"intent-driven dynamic native interfaces (GenUI)"**. Third-party agents can safely deliver rich interactive components (forms, charts, sliders) across trust boundaries, with no code-injection risk.

## 2. Product Vision

1. **Beyond Chat:** Let AI agents "speak UI natively"³. Human–AI interaction is no longer dry Q&A text but interactive collaboration. Agent-generated content is "as safe as data, as expressive as code".
2. **Seamless Human-in-the-Loop:** Humans are not only task givers but also "approvers" and "collaborators" in agent workflows. Complex agent logic is turned into transparent, controllable interaction flows via IM.
3. **Standardization & Interoperability:** Become the enterprise-grade carrier for A2A protocols so that agents from different vendors (e.g. Google, SAP, Salesforce) can collaborate on this IM platform without friction.

## 3. Core Product Features

### 3.1 Structured Agent Registry & Discovery

* **AgentCard:** The IM org tree includes "digital employees." Each agent registers via a standardized AgentCard and declares capabilities (e.g. "I can process refunds", "I can generate financial reports").
* **UI capability negotiation:** During handshake, the platform declares supported component catalogs (`supportedCatalogIds`) so that agents only send components the client can render.

### 3.2 Rich A2UI Message Stream

* **Dynamically generated native components:** Agent messages are not long blocks of text but flattened JSON blueprints with instructions like `createSurface` and `updateComponents`. The client turns them into native React/Flutter components (e.g. budget tables with live sliders or flight selectors) via a renderer.
* **Progressive rendering:** A flattened adjacency-list model is used; because the structure is model-friendly, the UI can be assembled in real time as the LLM streams tokens—users don’t need to wait for the full result.
* **Graceful fallback:** For older clients that don’t support A2UI or when rendering fails, `a2ui_display_text` is kept as a fallback text stream so information is never lost.

### 3.3 Task- and Calendar-Driven Orchestration

* **Intent routing:** The platform has a built-in Orchestrator Agent. When users state complex needs in a group chat, the orchestrator decomposes tasks and distributes subtasks to specialist agents via the A2A protocol.
* **Events and state machines:** When the user clicks a button in a generated component (e.g. "Confirm booking"), that does not send a new text message but produces a structured `ClientEvent`. The IM platform intercepts it, converts it to natural language or a structured query, and drives the agent’s state machine further.

### 3.4 Human-in-the-Loop Approval

* Using a mechanism similar to `needsApproval` (e.g. from Vercel AI SDK), when an agent performs high-risk actions (e.g. modifying the database, triggering a production deploy), an A2UI confirmation card with context appears in the IM group. The agent continues only after a human approver clicks "Approve".

### 3.5 Enterprise Security by Design

* **Strict component allowlist:** Agents can only request components pre-approved by the platform (Standard Catalog or Custom Components). No HTML or JavaScript injection is executed, eliminating XSS.
* **Validation and feedback:** Incoming JSON from agents is validated against a strict schema. On structural errors, return a `ValidationFailed` error to the agent to trigger self-correction.

## 4. Kickstart Preparation Checklist

To bring the project to life, you need to prepare the following architecture and tech stack.

### Phase 1: Tech Stack & Infrastructure

* **Frontend**
  * Prefer **Next.js/React** or **Flutter**. Flutter has a mature GenUI SDK; on React you can use the official `@a2ui/lit` or wait for the native React renderer (expected 2026 Q1).
  * Use **Vercel AI SDK** for streaming (e.g. `useChat` hooks) to cut down on boilerplate for complex chat state and streams.
* **Backend / Agent server**
  * Use **Google ADK (Agent Development Kit)** or Node.js A2A SDK to build server-side agents.
* **Transport**
  * Establish long-lived connections over **WebSocket** or **Server-Sent Events (SSE)** to carry A2A handshakes and A2UI messages (TextPart, DataPart).

### Phase 2: Core Architecture — AVC Pattern

When building your built-in agents, strongly consider the **AVC (Agent–View–Controller)** pattern³⁰:

1. **Controller Agent:** The "brain"—handles business logic and tool calls (e.g. DB queries) and outputs pure structured data³¹.
2. **View Agent:** The "designer"—translates controller output into A2UI Schema–compliant JSON blueprints, focused on layout and visual hierarchy.
3. **Sequential pipeline:** Chain the two so that business logic stays stable while view changes stay isolated.

### Phase 3: Component Catalog (Allowlist)

Your IM should ship with a UI catalog that fits various workflows:

* **Standard catalog:** Row, Column, Text, Button, TextField, Card, Modal, etc..
* **Smart wrappers / custom components:** Complex charts, interactive maps, or date pickers tailored to your domain, for agents to use on demand.

### Phase 4: Proof of Concept (PoC)

Ship a first prototype:

1. **Scenario:** A 1v1 group chat with one AI agent (e.g. a meeting-booking agent).
2. **Flow:**
   * User: "Book a meeting room tomorrow afternoon."
   * Agent returns an A2UI-based visual time-picker component.
   * User selects time in the component and submits.
   * Event is sent back to the agent; the agent renders a booking-confirmation card.

**Closing note:** The main challenge is no longer "how to make the model talk" but "how to manage the structured capabilities the model outputs." You can use the open-source **A2UI Composer** to quickly test and prototype your component JSON. This "Next Gen IM" is not only a communication tool—it is the future AI-powered productivity foundation.
