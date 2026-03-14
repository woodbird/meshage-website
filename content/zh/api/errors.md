---
title: 错误码参考
description: HTTP 状态码、错误响应格式与常见错误场景说明
lastUpdated: true
---

# 错误码参考

Meshage API 使用标准 HTTP 状态码表示请求结果。当请求失败时，响应体包含 JSON 格式的错误详情。

## 错误响应格式

所有错误响应遵循统一格式：

```json
{
  "detail": "错误描述信息"
}
```

部分端点在参数验证失败时返回更详细的错误信息：

```json
{
  "detail": [
    {
      "loc": ["body", "username"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## HTTP 状态码

### 成功状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| `200 OK` | 请求成功 | GET、PATCH、POST（操作类） |
| `201 Created` | 资源创建成功 | POST（创建类） |
| `204 No Content` | 操作成功，无返回体 | DELETE |

### 客户端错误

#### 400 Bad Request

请求格式不正确或缺少必要参数。

```json
{ "detail": "请求体不能为空" }
```

**常见场景：**
- 请求体不是有效 JSON
- 缺少必需参数
- 消息内容为空

#### 401 Unauthorized

未提供有效的认证凭证。

```json
{ "detail": "未认证，请先登录" }
```

**常见场景：**
- 未携带 `session_id` Cookie
- Session 已过期
- API Key 无效或过期

#### 403 Forbidden

已认证但无权访问该资源。

```json
{ "detail": "无权访问此对话" }
```

**常见场景：**
- 访问不属于自己的对话
- 尝试审批他人的审批请求
- 操作他人的 API Key

#### 404 Not Found

请求的资源不存在。

```json
{ "detail": "用户不存在" }
```

**常见场景：**
- 用户 ID、对话 ID、消息 ID 不存在
- 代理未注册
- 联系人请求不存在

#### 409 Conflict

操作与现有资源冲突。

```json
{ "detail": "用户名已存在" }
```

**常见场景：**
- 注册时用户名重复
- 重复发送联系人请求
- 与同一用户创建重复的单聊
- 审批请求已被处理

#### 422 Unprocessable Entity

参数格式合法但值不满足业务规则。

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "密码长度不能少于 8 个字符",
      "type": "value_error"
    }
  ]
}
```

**常见场景：**
- 密码不满足复杂度要求
- 用户名包含非法字符
- 字段值超出允许范围

#### 429 Too Many Requests

请求频率超过限制。

```json
{
  "detail": "请求过于频繁，请稍后再试",
  "retry_after": 60
}
```

**限流规则：**

| 端点 | 限制 |
|------|------|
| `POST /auth/login` | 10 次/分钟 |
| `POST /auth/register` | 5 次/分钟 |
| `POST /conversations/{id}/messages` | 60 次/分钟 |
| 其他端点 | 120 次/分钟 |

`retry_after` 表示建议等待的秒数。

### 服务端错误

#### 500 Internal Server Error

服务端内部错误。

```json
{ "detail": "内部服务器错误，请稍后重试" }
```

遇到此错误时：
- 检查后端日志排查原因
- 确认数据库连接正常
- 如持续出现，请提交 issue

## A2A 协议错误码

代理通信使用 JSON-RPC 2.0 错误码，与 HTTP 错误码分开：

| JSON-RPC 错误码 | 含义 | 场景 |
|----------------|------|------|
| `-32700` | Parse error | 代理接收到的请求 JSON 解析失败 |
| `-32600` | Invalid request | 请求格式不符合 JSON-RPC 规范 |
| `-32601` | Method not found | 代理不支持请求的方法 |
| `-32602` | Invalid params | 参数无效（包括 A2UI 验证失败） |
| `-32603` | Internal error | 代理内部错误 |

详见 [A2A 协议指南](/zh/developer/a2a-protocol)。

## 错误处理建议

### 客户端

```dart
try {
  final response = await http.post(url, body: data);
  if (response.statusCode == 401) {
    // 跳转登录页
  } else if (response.statusCode == 429) {
    // 等待 retry_after 秒后重试
  } else if (response.statusCode >= 500) {
    // 显示"服务暂不可用"提示
  }
} catch (e) {
  // 网络错误处理
}
```

### 代理开发者

```python
import httpx

resp = httpx.post(f"{BASE}/agents", headers=headers, json=data)
if resp.status_code == 409:
    print("同名代理已存在")
elif resp.status_code == 401:
    print("API Key 无效，请检查配置")
elif resp.status_code >= 400:
    print(f"请求失败: {resp.status_code} - {resp.json().get('detail')}")
```
