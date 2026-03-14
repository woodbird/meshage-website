---
title: Demo Agent 解读
description: 逐行解读 demo-agent/main.py 示例代码，理解代理接入模式
lastUpdated: true
---

# Demo Agent 解读

Meshage 项目自带一个示例代理 `demo-agent/main.py`，它是最小化的 A2A 代理实现。本文逐段解读其代码，帮助你快速理解代理接入模式。

## 完整代码

```python
"""
Meshage 示例 Agent：实现 A2A message/send 协议，可被 Meshage 后端代理调用。
运行: uvicorn main:app --host 0.0.0.0 --port 8001
注册时 endpoint_url 填: http://<本机IP或localhost>:8001/
"""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="Meshage Demo Agent", version="0.1.0")


def _extract_user_text(body: dict) -> str:
    """从 A2A message/send 的 params 中取出用户文本。"""
    params = body.get("params") or {}
    message = params.get("message") or {}
    parts = message.get("parts") or []
    texts = []
    for p in parts:
        if p.get("kind") == "text" and p.get("text"):
            texts.append(p["text"])
    return " ".join(texts).strip() or "(空消息)"


@app.get("/health")
def health():
    return {"status": "ok", "agent": "meshchat-demo-agent"}


@app.post("/")
async def a2a_message(request: Request):
    """
    处理 Meshage 转发的 A2A message/send 请求（JSON-RPC 2.0）。
    返回 result.kind == "message" 的回复。
    """
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}}
        )

    req_id = body.get("id")
    method = body.get("method")
    if method != "message/send":
        return JSONResponse(
            status_code=200,
            content={
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Method not found: {method}"},
            },
        )

    user_text = _extract_user_text(body)
    reply_text = f"你好，我收到了你的消息：「{user_text}」。我是 Meshage 示例 Agent，可以在这里接入你的逻辑或大模型。"

    return JSONResponse(
        status_code=200,
        content={
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "kind": "message",
                "messageId": body.get("params", {}).get("message", {}).get("messageId") or "demo-reply",
                "contextId": "",
                "parts": [{"kind": "text", "text": reply_text}],
            },
        },
    )
```

## 逐段解析

### 1. 依赖与应用初始化

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(title="Meshage Demo Agent", version="0.1.0")
```

- 使用 **FastAPI** 作为 HTTP 框架——轻量、高性能、自带 OpenAPI 文档
- 代理本质上就是一个 Web 服务，监听 HTTP POST 请求
- 不依赖 Meshage SDK——任何能处理 HTTP 的框架都可以实现代理

### 2. 提取用户文本

```python
def _extract_user_text(body: dict) -> str:
    params = body.get("params") or {}
    message = params.get("message") or {}
    parts = message.get("parts") or []
    texts = []
    for p in parts:
        if p.get("kind") == "text" and p.get("text"):
            texts.append(p["text"])
    return " ".join(texts).strip() or "(空消息)"
```

这个辅助函数从 A2A 请求体中提取用户的文本消息：

- A2A 消息体结构：`body → params → message → parts`
- `parts` 是一个列表，每项有 `kind` 字段
- 只提取 `kind == "text"` 的部分
- 多个 TextPart 用空格连接
- 空消息时返回默认值，避免下游处理出错

### 3. 健康检查端点

```python
@app.get("/health")
def health():
    return {"status": "ok", "agent": "meshchat-demo-agent"}
```

- Meshage 平台定期调用 `GET /health` 检测代理是否在线
- 返回 `status: "ok"` 表示代理正常运行
- 如果连续检查失败，平台将代理状态标记为 `inactive`

### 4. A2A 消息处理（核心逻辑）

```python
@app.post("/")
async def a2a_message(request: Request):
```

代理的根路径 `POST /` 是 A2A 消息入口。平台将用户消息以 JSON-RPC 2.0 格式 POST 到此地址。

#### 4a. 请求解析与错误处理

```python
try:
    body = await request.json()
except Exception:
    return JSONResponse(
        status_code=400,
        content={"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}}
    )
```

- JSON 解析失败时返回标准的 JSON-RPC 解析错误 (`-32700`)
- 确保代理不会因为非法输入而崩溃

#### 4b. 方法路由

```python
req_id = body.get("id")
method = body.get("method")
if method != "message/send":
    return JSONResponse(
        status_code=200,
        content={
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32601, "message": f"Method not found: {method}"},
        },
    )
```

- 当前只处理 `message/send` 方法
- 未知方法返回 `-32601 Method not found` 错误
- `id` 字段原样返回，确保请求-响应配对正确

#### 4c. 构造回复

```python
user_text = _extract_user_text(body)
reply_text = f"你好，我收到了你的消息：「{user_text}」。..."

return JSONResponse(
    status_code=200,
    content={
        "jsonrpc": "2.0",
        "id": req_id,
        "result": {
            "kind": "message",
            "messageId": body.get("params", {}).get("message", {}).get("messageId") or "demo-reply",
            "contextId": "",
            "parts": [{"kind": "text", "text": reply_text}],
        },
    },
)
```

- `result.kind` 为 `"message"` 表示这是一条消息回复
- `messageId` 复用请求中的 ID（生产环境建议生成唯一 ID）
- `parts` 列表包含一个 TextPart
- 这里可以替换为调用 LLM、查询数据库、生成 A2UI 组件等逻辑

## 运行方式

```bash
cd demo-agent
pip install fastapi uvicorn
uvicorn main:app --host 0.0.0.0 --port 8001
```

## 注册到平台

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Agent",
    "description": "Meshage 示例回声代理",
    "endpoint_url": "http://localhost:8001/"
  }'
```

## 扩展思路

Demo Agent 是一个起点，你可以在此基础上：

| 扩展方向 | 实现方式 |
|----------|----------|
| 接入 LLM | 将 `reply_text` 替换为调用 OpenAI / Claude API 的返回值 |
| 返回 A2UI | 在 `parts` 中添加 `DataPart`，携带 A2UI JSON 蓝图 |
| 多轮对话 | 利用 `contextId` 维护会话状态 |
| 任务状态 | 返回 `result.kind: "status"` + `state: "working"` |
| 异步处理 | 先返回 `working`，后续通过回调更新结果 |

## 下一步

- [快速开始](./quickstart) — 完整的 30 分钟上手教程
- [A2A 协议指南](./a2a-protocol) — 深入消息格式与状态机
- [A2UI 开发指南](./a2ui-guide) — 让代理发送富交互组件
- [代理注册与配置](./agent-registration) — AgentCard 完整字段说明
