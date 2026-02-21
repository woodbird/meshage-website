# Meshage

Meshage：构建一个原生支持 A2A（Agent-to-Agent）和 A2UI（Agent-to-User Interface）的下一代 IM 平台，是一个极具前瞻性的宏大构想。这本质上是将 IM 从“即时通讯工具”升维成了\*\*“多代理协作的操作系统（Multi-agent OS）”\*\*。  

### 一、 产品定位 (Positioning)

**“面向未来的混合劳动力协作中枢” (Hybrid Workforce Collaboration Hub)**

* **核心定义：** 它不仅仅是一个聊天应用，而是一个\*\*多代理网格（Multi-agent mesh）\*\*的可视化编排器。在这个平台上，AI 代理（Agent）不再是挂在后台的脚本，而是拥有特定技能、结构化名片和日程表的一等公民（User）。  
* **差异化优势：** 突破传统 IM 的“纯文本/Markdown”限制，利用 A2UI 协议实现“由意图驱动的动态原生界面（GenUI）”。它允许跨越信任边界的第三方代理安全地向用户投递富交互组件（如表单、图表、滑块），而没有任何代码注入风险。

### 二、 产品愿景 (Vision)

1. **超越聊天 (Beyond Chat)：** 让 AI 代理能够“原生说 UI 的语言”3。人类与 AI 的沟通不再是枯燥的文本问答，而是交互式的协作。代理生成的内容“像数据一样安全，像代码一样富有表现力”。  
2. **无缝的人机协同 (Seamless Human-in-the-loop)：** 人类不仅是指令的下达者，也是代理工作流中的“审批者”和“协作者”。复杂的代理内部逻辑通过 IM 转化为透明、可控的交互流。  
3. **标准化与互操作性 (Standardization & Interoperability)：** 成为企业级 A2A 协议的终极载体，让来自不同企业（如 Google, SAP, Salesforce 等构建的代理）能够在这个 IM 平台中无障碍协作。

### 三、 核心产品功能设计 (Product Features)

#### 1\. 结构化的“代理通讯录”与能力发现 (Agent Registry & Discovery)

* **AgentCard 机制：** IM 的组织架构树中包含“数字员工”。每个代理通过标准化的 AgentCard 注册，声明其能力（如“我能处理退款”、“我能生成财务报表”）。  
* **UI 能力协商：** 平台在与代理握手时，通过声明支持的组件库（supportedCatalogIds），确保代理只发送客户端能够渲染的组件9。

#### 2\. 基于 A2UI 的富交互消息流 (Rich A2UI Message Stream)

* **动态生成原生组件：** 代理的消息不再是长篇大论，而是包含 createSurface 和 updateComponents 等指令的扁平化 JSON 蓝图。客户端通过渲染器将其转化为原生的 React/Flutter 组件，如带有实时滑块的预算表或航班选择器。  
* **渐进式渲染 (Progressive Rendering)：** 采用扁平化邻接列表（Adjacency list）模型，由于结构对大模型非常友好，UI 可以随着大模型的 Token 流式生成而实时拼装，用户无需等待整个结果生成完毕。  
* **优雅降级 (Fallback Text)：** 对于不支持 A2UI 的旧版客户端或渲染失败的情况，保留 a2ui\_display\_text 作为后备文本流，确保信息不丢失。

#### 3\. 任务与日程驱动的智能编排 (Orchestrator Pattern)

* **意图路由：** 平台内置主编排器（Orchestrator Agent），当用户在群聊中提出复杂需求时，编排器自动拆解任务，并通过 A2A 协议将子任务分发给对应的专业代理。  
* **事件与状态机：** 用户在生成的组件上点击按钮（如“确认预订”），这不是发送一条新文本，而是产生一个结构化的 ClientEvent。IM 平台拦截该事件并将其转换为自然语言或结构化查询，继续驱动代理的状态机。

#### 4\. 人在回路的审批机制 (Human-in-the-Loop Workflows)

* 利用类似 Vercel AI SDK 提供的 needsApproval 机制，当代理执行高风险操作（如修改数据库、发送生产部署）时，IM 群聊中会弹出一个包含上下文的 A2UI 确认卡片。只有人类主管点击“Approve”，代理才继续执行20。

#### 5\. 企业级安全沙箱 (Enterprise Security by Design)

* **严格的组件白名单：** 代理只能请求平台预先批准的组件（Standard Catalog 或 Custom Components）。不执行任何 HTML 或 JavaScript 注入，彻底杜绝 XSS 攻击。  
* **自动验证与反馈循环：** 对代理发来的 JSON 进行严格的 Schema 验证。如果结构错误，向代理返回 ValidationFailed 错误以触发大模型的自我纠正（Self-correction）。

### 四、 启动项目筹备清单 (Kickstart Preparation)

为了真正将项目落地，你需要准备以下架构和技术栈方案：

#### 阶段 1：技术选型与基础设施 (Tech Stack Selection)

* **客户端 (Frontend)：**  
* 建议采用 **Next.js/React** 或 **Flutter**。Flutter 拥有成熟的 GenUI SDK23；而 React 端可以使用官方的 @a2ui/lit 或者等待 2026 Q1 发布的原生 React 渲染器。  
* 利用 **Vercel AI SDK** 来处理流式输出（Streaming），因为它提供的 useChat 等 Hooks 在处理复杂前端状态和聊天流时能减少大约 60% 的样板代码。  
* **代理端 (Backend/Agent Server)：**  
* 使用 **Google ADK (Agent Development Kit)** 或 Node.js 的 A2A SDK 来构建服务端代理。  
* **传输层 (Transport Layer)：**  
* 建立支持 WebSocket 或 Server-Sent Events (SSE) 的长连接，承载 A2A 握手与 A2UI 消息的多部分（TextPart, DataPart）传输。

#### 阶段 2：确立核心架构模式 —— AVC 模式

在构建你的内置代理时，强烈建议采用 **AVC (Agent-View-Controller)** 模式：

1. **控制器代理 (Controller Agent)：** 作为“大脑”，只负责业务逻辑、工具调用（如查数据库），输出纯结构化数据。  
2. **视图代理 (View Agent)：** 作为“设计师”，将控制器传来的数据翻译成符合 A2UI Schema 规范的 JSON 蓝图，专注于排版和视觉层级。  
3. **组合管道 (Sequential Pipeline)：** 将两者串联，确保业务逻辑的绝对稳定，同时视图的更改互不干扰。

#### 阶段 3：建立组件白名单字典 (Component Catalog)

你的 IM 需要内置一套能够适配各种工作流的 UI 字典，包括：

* **基础组件 (Standard Catalog)：** Row, Column, Text, Button, TextField, Card, Modal 等。  
* **智能包装器 (Smart Wrappers) / 自定义组件：** 专门为你的业务设计的复杂图表、交互地图或日期选择器，供代理按需调用。

#### 阶段 4：概念验证 (PoC \- Proof of Concept)

启动第一版原型：

1. **场景设计：** 设计一个 1V1 加上 1 个 AI Agent 的群聊场景（例如：会议预订代理）。  
2. **流程验证：**  
3. 用户说：“帮我订明天下午的会议室”。  
4. Agent 返回一个基于 A2UI 的可视化时间选择器组件。  
5. 用户在组件上滑动选择时间并点击提交。  
6. 事件回传给 Agent，Agent 渲染出预订成功的凭证卡片。

**结语：**这个项目的核心挑战不再是“如何让大模型说话”，而是“如何管理大模型输出的结构化功能”。你可以参考开源的 **A2UI Composer** 工具来快速测试和原型化你的组件 JSON。这套“Next Gen IM”将不仅是沟通工具，它就是未来 AI 驱动的生产力底座。

---

