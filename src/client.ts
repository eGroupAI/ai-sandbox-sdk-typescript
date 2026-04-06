import { ApiError } from "./errors.js";
import type { ClientConfig, JsonValue } from "./types.js";

export class AiSandboxClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(config: ClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? 30_000;
    this.maxRetries = config.maxRetries ?? 2;
  }

  private async request(
    method: string,
    path: string,
    body?: Record<string, JsonValue>,
    accept = "application/json"
  ): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: accept,
      Authorization: `Bearer ${this.apiKey}`,
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";

    let attempt = 0;
    while (true) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if ([429, 500, 502, 503, 504].includes(response.status) && attempt < this.maxRetries) {
          attempt += 1;
          await new Promise((r) => setTimeout(r, 200 * attempt));
          continue;
        }

        if (!response.ok) {
          const raw = await response.text();
          throw new ApiError(`HTTP ${response.status}`, response.status, raw, response.headers.get("x-trace-id") ?? undefined);
        }
        return response;
      } catch (error) {
        clearTimeout(timer);
        if (attempt < this.maxRetries) {
          attempt += 1;
          await new Promise((r) => setTimeout(r, 200 * attempt));
          continue;
        }
        if (error instanceof ApiError) throw error;
        throw new Error(`Network error: ${String(error)}`);
      }
    }
  }

  private async json(
    method: string,
    path: string,
    body?: Record<string, JsonValue>
  ): Promise<unknown> {
    const response = await this.request(method, path, body);
    return response.json();
  }

  createAgent(payload: Record<string, JsonValue>) { return this.json("POST", "/agents", payload); }
  updateAgent(agentId: number, payload: Record<string, JsonValue>) { return this.json("PUT", `/agents/${agentId}`, payload); }
  listAgents(query = "") { return this.json("GET", `/agents${query ? `?${query}` : ""}`); }
  getAgentDetail(agentId: number) { return this.json("GET", `/agents/${agentId}`); }
  createChatChannel(agentId: number, payload: Record<string, JsonValue>) { return this.json("POST", `/agents/${agentId}/channels`, payload); }
  sendChat(agentId: number, payload: Record<string, JsonValue>) { return this.json("POST", `/agents/${agentId}/chat`, payload); }
  getChatHistory(agentId: number, channelId: string, query = "limit=50&page=0") {
    return this.json("GET", `/agents/${agentId}/channels/${channelId}/messages?${query}`);
  }
  getKnowledgeBaseArticles(agentId: number, collectionId: number, query = "startIndex=0") {
    return this.json("GET", `/agents/${agentId}/collections/${collectionId}/articles?${query}`);
  }
  createKnowledgeBase(agentId: number, payload: Record<string, JsonValue>) {
    return this.json("POST", `/agents/${agentId}/collections`, payload);
  }
  updateKnowledgeBaseStatus(agentCollectionId: number, payload: Record<string, JsonValue>) {
    return this.json("PATCH", `/agent-collections/${agentCollectionId}/status`, payload);
  }
  listKnowledgeBases(agentId: number, query = "activeOnly=false") {
    return this.json("GET", `/agents/${agentId}/collections?${query}`);
  }

  async *sendChatStream(agentId: number, payload: Record<string, JsonValue>): AsyncGenerator<string> {
    const response = await this.request("POST", `/agents/${agentId}/chat`, payload, "text/event-stream");
    if (!response.body) return;
    const decoder = new TextDecoder();
    let buffer = "";
    for await (const chunk of response.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        yield data;
      }
    }
  }
}
