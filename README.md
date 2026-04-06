# AI Sandbox SDK for TypeScript

![Motion headline](https://readme-typing-svg.demolab.com?font=Inter&weight=700&size=24&duration=2800&pause=800&color=0A84FF&background=FFFFFF00&width=900&lines=Build+Production+AI+Experiences+in+Minutes;11+APIs+%7C+SSE+Streaming+%7C+GA+v1)

![GA](https://img.shields.io/badge/GA-v1-0A84FF?style=for-the-badge)
![APIs](https://img.shields.io/badge/APIs-11-00A86B?style=for-the-badge)
![Streaming](https://img.shields.io/badge/SSE-Ready-7C3AED?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-SDK-3178C6?style=for-the-badge)

## UX-First Value Cards

| Quick Integration | Real-Time Experience | Reliability by Default |
| --- | --- | --- |
| 60-second quick start and minimal setup friction | SSE chunk streaming for responsive chat UI | Timeout + retry controls for production traffic |

## Visual Integration Flow

```mermaid
flowchart LR
  A[Create Agent] --> B[Create Chat Channel]
  B --> C[Send Message]
  C --> D[SSE Stream Chunks]
  D --> E[Attach Knowledge Base]
  E --> F[Customer-Ready Experience]
```

## 60-Second Quick Start

```ts
import { AiSandboxClient } from "@egroupai/ai-sandbox-sdk-typescript";

const client = new AiSandboxClient({
  baseUrl: process.env.AI_SANDBOX_BASE_URL ?? "https://www.egroupai.com",
  apiKey: process.env.AI_SANDBOX_API_KEY ?? "",
});

const agent = await client.createAgent({
  agentDisplayName: "Support Agent",
  agentDescription: "Handles customer inquiries",
});
const agentPayload =
  agent && typeof agent === "object"
    ? (agent as { payload?: Record<string, unknown> }).payload
    : undefined;
const agentId = Number(agentPayload?.agentId ?? 0);

const channel = await client.createChatChannel(agentId, {
  title: "Web Chat",
  visitorId: "visitor-001",
});
const channelPayload =
  channel && typeof channel === "object"
    ? (channel as { payload?: Record<string, unknown> }).payload
    : undefined;
const channelId = String(channelPayload?.channelId ?? "");

for await (const chunk of client.sendChatStream(agentId, {
  channelId,
  message: "What is the return policy?",
  stream: true,
})) {
  console.log(chunk);
}
```

## Installation

```bash
npm install @egroupai/ai-sandbox-sdk-typescript
```

## Snapshot

| Metric | Value |
| --- | --- |
| API Coverage | 11 operations (Agent / Chat / Knowledge Base) |
| Stream Mode | `text/event-stream` with `[DONE]` handling |
| Retry Safety | 429/5xx auto-retry for GET/HEAD + capped exponential backoff |
| Error Surface | `ApiError` with status/body/traceId |
| Validation | Production-host integration verified |

## Links

- [Official System Integration Docs](https://www.egroupai.com/ai-sandbox/system-integration)
- [30-Day Optimization Plan](docs/30D_OPTIMIZATION_PLAN.md)
- [Integration Guide](docs/INTEGRATION.md)
- [Quickstart Example](examples/quickstart.ts)
- [Repository](https://github.com/eGroupAI/ai-sandbox-sdk-typescript)
