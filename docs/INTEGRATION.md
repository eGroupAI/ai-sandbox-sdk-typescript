# Integration Guide (TypeScript)

This SDK is designed for low-change, low-touch customer integration.

## Goals
- Stable API surface for v1.
- Explicit timeout and retry controls.
- Streaming chat support (`text/event-stream`).

## Retry safety
- **429 / 5xx** automatic retries apply only to **GET** and **HEAD** (idempotent reads). **POST / PUT / PATCH** are not retried on those status codes to avoid duplicate side effects.
- **Network / timeout** failures may still be retried for all methods, up to `maxRetries`.
- Retry delay uses **exponential backoff** with a capped wait time to avoid retry storms.

## Install
`npm install @egroupai/ai-sandbox-sdk-typescript`

## First Steps
1. Configure `baseUrl` and `apiKey` on `AiSandboxClient`.
2. Call `createAgent(...)`.
3. Create a chat channel with `createChatChannel(...)` and send the first message with `sendChat(...)` or `sendChatStream(...)`.
