import { describe, expect, it } from "vitest";
import { shouldRetryTransientHttpStatus } from "./http-policy.js";

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
});
