# AI Sandbox SDK for TypeScript

Official TypeScript SDK for AI Sandbox v1 integration.

## Installation
```bash
npm install @egroupai/ai-sandbox-sdk-typescript
```

## Quick Start
```ts
import { AiSandboxClient } from "@egroupai/ai-sandbox-sdk-typescript";

const client = new AiSandboxClient({
  baseUrl: "https://www.egroupai.com",
  apiKey: process.env.AI_SANDBOX_API_KEY!,
});

const agent = await client.createAgent({
  agentDisplayName: "Customer Support",
  agentDescription: "Handles customer inquiries",
});
```

## Supported APIs
- Agent CRUD/list/detail
- Channel creation and chat
- SSE stream chat parsing
- Chat history retrieval
- Knowledge base create/list/status/articles

## Repository
https://github.com/eGroupAI/ai-sandbox-sdk-typescript
