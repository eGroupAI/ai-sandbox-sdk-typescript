import { describe, expect, it } from "vitest";
import {
  getRetryDelayMs,
  shouldRetryNetworkError,
  shouldRetryTransientHttpStatus,
} from "./http-policy.js";

describe("shouldRetryTransientHttpStatus", () => {
  it("retries 429/5xx only for GET/HEAD", () => {
    expect(shouldRetryTransientHttpStatus("GET", 503)).toBe(true);
    expect(shouldRetryTransientHttpStatus("HEAD", 429)).toBe(true);
    expect(shouldRetryTransientHttpStatus("POST", 503)).toBe(false);
    expect(shouldRetryTransientHttpStatus("PUT", 429)).toBe(false);
  });
  it("does not retry other status codes on GET", () => {
    expect(shouldRetryTransientHttpStatus("GET", 404)).toBe(false);
    expect(shouldRetryTransientHttpStatus("GET", 408)).toBe(false);
  });

  it("retries only transient network errors", () => {
    const abortErr = new Error("aborted");
    abortErr.name = "AbortError";
    expect(shouldRetryNetworkError(abortErr)).toBe(true);
    expect(shouldRetryNetworkError(new TypeError("fetch failed"))).toBe(true);
    expect(shouldRetryNetworkError(new Error("validation failed"))).toBe(false);
  });

  it("uses exponential backoff with a cap", () => {
    expect(getRetryDelayMs(1)).toBe(200);
    expect(getRetryDelayMs(2)).toBe(400);
    expect(getRetryDelayMs(3)).toBe(800);
    expect(getRetryDelayMs(4)).toBe(1600);
    expect(getRetryDelayMs(5)).toBe(2000);
    expect(getRetryDelayMs(8)).toBe(2000);
  });
});
