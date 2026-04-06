import { afterEach, describe, expect, it, vi } from "vitest";
import { AiSandboxClient } from "./client.js";
import { ApiError } from "./errors.js";

function jsonResponse(status: number, payload: unknown, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json",
      ...headers,
    },
  });
}

describe("AiSandboxClient contract with injected faults", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("retries GET on transient 5xx and then succeeds", async () => {
    let calls = 0;
    const fetchMock = vi.fn(async (...args: unknown[]) => {
      calls += 1;
      const init = args[1] as { method?: string } | undefined;
      expect(init?.method).toBe("GET");
      if (calls === 1) {
        return new Response("temporary backend fault", { status: 503 });
      }
      return jsonResponse(200, { ok: true, payload: { items: [] } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new AiSandboxClient({
      baseUrl: "https://api.example.test",
      apiKey: "test-key",
      timeoutMs: 1000,
      maxRetries: 2,
    });

    const result = await client.listAgents();
    expect(calls).toBe(2);
    expect(result).toEqual({ ok: true, payload: { items: [] } });
  });

  it("does not retry POST on HTTP 5xx to avoid duplicate writes", async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls += 1;
      return new Response("write failed", {
        status: 503,
        headers: { "x-trace-id": "trace-post-1" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new AiSandboxClient({
      baseUrl: "https://api.example.test",
      apiKey: "test-key",
      timeoutMs: 1000,
      maxRetries: 2,
    });

    let thrown: unknown;
    try {
      await client.sendChat(123, { channelId: "c-1", message: "hello" });
    } catch (error) {
      thrown = error;
    }

    expect(calls).toBe(1);
    expect(thrown).toBeInstanceOf(ApiError);
    const apiError = thrown as ApiError;
    expect(apiError.status).toBe(503);
    expect(apiError.traceId).toBe("trace-post-1");
  });

  it("retries network failures even for POST and eventually succeeds", async () => {
    let calls = 0;
    const fetchMock = vi.fn(async () => {
      calls += 1;
      if (calls === 1) {
        throw new TypeError("fetch failed");
      }
      return jsonResponse(200, { ok: true, payload: { messageId: "m-1" } });
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new AiSandboxClient({
      baseUrl: "https://api.example.test",
      apiKey: "test-key",
      timeoutMs: 1000,
      maxRetries: 2,
    });

    const result = await client.sendChat(123, { channelId: "c-1", message: "hello" });
    expect(calls).toBe(2);
    expect(result).toEqual({ ok: true, payload: { messageId: "m-1" } });
  });
});
