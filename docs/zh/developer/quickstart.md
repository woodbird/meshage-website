---
title: 快速开始：30 分钟上线代理
description: 从创建 API Key 到编写 Python 代理，完整上手教程
lastUpdated: true
---

# 快速开始：30 分钟上线代理

本教程带你从零开始，完成以下四步：

1. 在 Meshage App 中创建 API Key
2. 编写一个 Python 代理
3. 通过 API 注册代理
4. 与代理进行对话测试

## 前置条件

- Python 3.11+
- Meshage 后端已运行在 `http://localhost:8000`
- 一个已注册的 Meshage 用户账号

## 第一步：创建 API Key

1. 打开 Meshage App，进入「我的」→「API Key 管理」
2. 点击「创建新 Key」
3. 为 Key 命名（如 `my-first-agent`），点击确认
4. **复制并妥善保存 Key 值**（只会显示一次）

也可以通过 API 创建：

```bash
curl -X POST http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-first-agent"}'
```

## 第二步：编写 Python 代理

创建项目目录并安装依赖：

```bash
mkdir my-agent && cd my-agent
pip install fastapi uvicorn
```

创建 `main.py`：

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="My First Meshage Agent")


def extract_user_text(body: dict) -> str:
    """从 A2A message/send 的 params 中提取用户文本。"""
    params = body.get("params") or {}
    message = params.get("message") or {}
    parts = message.get("parts") or []
    texts = [p["text"] for p in parts if p.get("kind") == "text" and p.get("text")]
    return " ".join(texts).strip() or "(空消息)"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/")
async def handle_message(request: Request):
    """处理来自 Meshage 的 A2A message/send 请求。"""
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
    reply = f"你好！你说了：「{user_text}」。我是你的第一个 Meshage 代理！"

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

启动代理服务：

```bash
uvicorn main:app --host 0.0.0.0 --port 8001
```

验证健康检查：

```bash
curl http://localhost:8001/health
# {"status":"ok"}
```

## 第三步：注册代理

使用 API Key 将代理注册到 Meshage 平台：

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "我的第一个代理",
    "description": "一个简单的回声代理，用于测试 A2A 协议",
    "endpoint_url": "http://localhost:8001/",
    "catalog_ids": ["meshage.standard"]
  }'
```

响应示例：

```json
{
  "id": "agent-uuid-001",
  "name": "我的第一个代理",
  "description": "一个简单的回声代理，用于测试 A2A 协议",
  "endpoint_url": "http://localhost:8001/",
  "status": "active",
  "created_at": "2026-03-01T10:00:00Z"
}
```

## 第四步：测试对话

1. 打开 Meshage App，进入「代理」页面
2. 找到刚注册的「我的第一个代理」
3. 点击「开始对话」，发送任意消息
4. 代理会回复你的消息内容

你也可以用 curl 模拟平台发送的 A2A 请求来测试：

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
        "parts": [{"kind": "text", "text": "你好，世界！"}]
      }
    }
  }'
```

预期响应：

```json
{
  "jsonrpc": "2.0",
  "id": "test-001",
  "result": {
    "kind": "message",
    "messageId": "reply-001",
    "contextId": "",
    "parts": [
      { "kind": "text", "text": "你好！你说了：「你好，世界！」。我是你的第一个 Meshage 代理！" }
    ]
  }
}
```

## 进阶：添加 A2UI 组件

让代理返回一个带按钮的卡片，而不是纯文本：

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
                {"kind": "text", "text": "这是一个带按钮的卡片："},
                {
                    "kind": "data",
                    "data": {
                        "type": "a2ui",
                        "action": "createSurface",
                        "surfaceId": "demo-card",
                        "components": [
                            {"id": "c1", "type": "Card", "parentId": None, "props": {}},
                            {"id": "c2", "type": "Text", "parentId": "c1", "props": {"content": "欢迎使用 Meshage！"}},
                            {"id": "c3", "type": "Button", "parentId": "c1", "props": {"label": "了解更多"}},
                        ],
                        "a2ui_display_text": "欢迎使用 Meshage！[了解更多]"
                    }
                }
            ],
        },
    })
```

详见 [A2UI 开发指南](./a2ui-guide) 了解完整的组件目录和交互模式。

## 常见问题

**Q: 代理注册后在 App 中看不到？**
确保代理的 `status` 为 `active`，并且注册时使用了有效的 API Key。

**Q: 平台无法调用我的代理？**
检查 `endpoint_url` 是否可从后端访问。如果代理运行在本机，使用 `http://host.docker.internal:8001/` 或实际 IP。

**Q: 如何调试 A2A 请求？**
在代理代码中添加日志，打印接收到的 `body`，检查 JSON-RPC 格式是否正确。

## 下一步

- [API Key 管理](./api-keys) — 深入了解 Key 的创建与安全
- [代理注册与配置](./agent-registration) — AgentCard 完整字段说明
- [A2A 协议指南](./a2a-protocol) — 任务状态机与事件处理
- [Demo Agent 解读](./demo-agent) — 阅读完整示例代码
