const RETRY_BASE_DELAY_MS = 200;
const RETRY_MAX_DELAY_MS = 2_000;

// Retry 429/5xx only for idempotent reads to avoid duplicate write side effects.
export function shouldRetryTransientHttpStatus(method: string, status: number): boolean {
  if (status !== 429 && (status < 500 || status > 599)) return false;
  const m = method.toUpperCase();
  return m === "GET" || m === "HEAD";
}

// Retry only fetch/network transient failures, not arbitrary runtime exceptions.
export function shouldRetryNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "AbortError" || error.name === "TypeError";
}

export function getRetryDelayMs(attempt: number): number {
  const safeAttempt = Math.max(1, attempt);
  const delay = RETRY_BASE_DELAY_MS * (2 ** (safeAttempt - 1));
  return Math.min(RETRY_MAX_DELAY_MS, delay);
}
