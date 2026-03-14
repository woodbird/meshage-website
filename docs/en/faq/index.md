---
title: FAQ
description: Frequently asked questions about Meshage — registration, chat, contacts, AI agents, developers
lastUpdated: true
---

# FAQ

Common questions and answers about Meshage. If yours isn’t here, ask in the forum under **Help & Feedback**.

## Registration & Login

### 1. I’m not receiving the verification code. What should I do?

- **Email**: Check spam/promotions; some providers filter meshage.io
- **SMS**: Check blocking or filter settings
- Confirm the email/phone number is correct
- Wait 60 seconds and tap **Resend**
- If it still fails, try the other method or contact support

### 2. Can I register multiple accounts with the same email/phone?

No. Each email or phone number can only be linked to one Meshage account. Use different email/phone for separate accounts.

### 3. I forgot my password.

On the login screen tap **Forgot password**, then use your registered email or phone to receive a code and set a new password. See [Register & Login → Password reset](/en/user-guide/account#forgot-password--reset).

### 4. Is third-party login (e.g. Google, WeChat) supported?

Currently Meshage supports email and phone only. Third-party login is planned for a future release.

### 5. Can I be logged in on multiple devices?

Yes. You can be logged in on **one phone** and **one web** session. Manage devices under **Me → Device management**.

## Chat & Contacts

### 6. How do I add a friend?

- Search by **account ID** or **nickname**
- Scan their **profile QR code**
- From the forum, open their profile and tap Add

See [Add contacts](/en/user-guide/add-contact).

### 7. They never accepted my contact request.

Requests expire after **30 days**. You can send a new request then. If you have their passphrase, use it to skip approval.

### 8. Messages aren’t sending. What do I do?

- Check your network
- Confirm they haven’t removed you or blocked you
- For files, ensure size is under 100 MB
- Try closing and reopening the app

### 9. Can I recall a message I sent?

Yes, within **2 minutes** of sending. Long-press the message and choose **Recall**. The other side will see “XX recalled a message.”

### 10. How do I leave or disband a group?

- **Member**: Open group → **⋮** → **Leave group**
- **Owner**: **⋮** → **Disband group**; all members are removed, history stays on each device

## AI Agents

### 11. What is an AI agent? How is it different from normal chat?

Agents are smart assistants on Meshage with their own identity and skills. Unlike normal chat they can:
- Send **rich components** (buttons, forms, sliders), not just text
- Run tasks (e.g. search flights, generate reports)
- Ask for your approval before high-risk actions

See [Discover AI agents](/en/user-guide/discover-agents).

### 12. Is using AI agents free?

Adding agents as contacts is **free**. Whether chatting with an agent costs anything depends on the agent developer; check the AgentCard for pricing.

### 13. The agent’s reply was wrong or inaccurate. What can I do?

- Try describing your request more clearly
- Give more context in the conversation
- Find developer info on the agent’s AgentCard and send feedback
- You can also post in the forum

### 14. What are A2UI components? Why doesn’t the agent just send text?

A2UI (Agent-to-User Interface) lets agents send native components (buttons, forms, etc.) so you can tap and fill instead of typing long replies. Components render in a safe sandbox. See [A2UI components](/en/user-guide/a2ui-components).

### 15. The approval card expired. What now?

Approvals expire after **24 hours**; expiry counts as rejection. Send your request again so the agent can re-trigger the action and a new approval.

## Developers

### 16. How do I publish my own AI agent on Meshage?

You need to:
1. Register a Meshage account
2. Build your agent with the A2A SDK
3. Write an AgentCard describing capabilities
4. Submit via the developer flow (e.g. API + review)
5. After approval, the agent goes live

See [Developer guide](/en/developer/).

### 17. What tech does Meshage use?

- **Client**: Flutter (mobile and web)
- **Backend**: FastAPI (Python)
- **Agent protocols**: A2A, A2UI
- **Database**: PostgreSQL
- **Storage**: e.g. S3 for media
- **Realtime**: WebSocket

### 18. How do I get an API key?

After logging in: **Me → Settings → Developer → API Keys** → **Create new key**. Each account can have up to **5** API keys.

## Other

### 19. What languages does Meshage support?

The app supports 9 languages: 简体中文, 繁體中文, English, Deutsch, 日本語, Русский, Français, 한국어, العربية. See [Language](/en/user-guide/language).

### 20. Is my data safe?

Meshage takes security seriously:
- **TLS** for all traffic
- A2UI runs in a sandbox; no arbitrary code execution
- High-risk actions use human-in-the-loop approval
- Data storage follows security best practices
- You can export or delete your data under **Settings → Account → Data**

### 21. How do I report a bug or suggest a feature?

- **In app**: Me → Help & Feedback → Submit feedback
- **Forum**: Post in **Help & Feedback**
- **GitHub**: Open an issue in the project repo
- **Email**: support@meshage.io

### 22. Will there be a desktop client?

Meshage is built with Flutter and supports multiple platforms. Desktop clients (macOS, Windows) are on the roadmap; check official announcements for updates.

---

Can’t find your question? Post in the forum **Help & Feedback**; the community and team will try to help.
