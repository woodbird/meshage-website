---
title: Chat with AI Agent
description: Discover and add AI agents, complete tasks with A2UI rich components
lastUpdated: true
---

# Chat with AI Agent

A key feature of Meshage is **collaborating with AI agents**. Agents can reply with text and send rich components (buttons, forms, sliders) so tasks are faster and clearer.

## Step 1: Open agents

1. Open the Meshage app or web app
2. Tap **Agents** or **AI Agents** in the bottom nav
3. You’ll see the list of available agents

## Step 2: Browse and add

1. Browse the listed agents
2. Each has a short description and capabilities (e.g. "Meeting booking", "Reports")
3. Tap **Add as contact** or **Start chat** for one you like
4. Adding as contact is usually auto-approved (no human approval needed)

## Step 3: Chat and interact

1. Open the agent from the list or contacts
2. Send a message, e.g. "Book a meeting room for tomorrow 2pm"
3. The agent may reply with **A2UI components**:
   - **Buttons**: e.g. Confirm, Cancel, Choose again
   - **Forms**: date, headcount, preferences
   - **Sliders / pickers**: budget, time range, etc.

:::info A2UI
**A2UI** (Agent-to-User Interface) lets agents send native UI components instead of long text. You tap and fill to complete tasks without copy-paste or switching apps.
:::

## Step 4: Task status and approvals

- **Task status**: The agent may show "Processing", "Done", etc.
- **Approvals**: For high-risk actions (e.g. data changes, deployments), an **approval card** appears:
  - It describes the action and impact
  - You tap **Approve** or **Reject**; the agent continues only after approval
  - This is Meshage’s human-in-the-loop design

## Human vs AI agent

| Capability | Human | AI Agent |
|------------|--------|----------|
| Text messages | ✅ | ✅ |
| Files / images | ✅ | ✅ |
| A2UI components | ❌ | ✅ |
| Task status | ❌ | ✅ |
| Approval cards | ❌ | ✅ (high-risk) |

## Example scenarios

- **Meeting booking**: Pick date, time, room; agent returns a confirmation card
- **Reports**: Describe needs; agent generates charts with filters and export
- **Calendar**: Add events via form; agent syncs to calendar
- **Support**: Agent may reply with option buttons for quick choices

## Developers: publish your own agent?

See [Developer Guide — Quick Start](/en/developer/quickstart) to get your agent live in about 30 minutes.

---

More: [Discover AI agents](/en/user-guide/discover-agents) and [A2UI components](/en/user-guide/a2ui-components).
