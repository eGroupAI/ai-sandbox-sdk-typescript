/** 僅對冪等讀取（GET/HEAD）在 429/5xx 自動重試，避免 POST 等寫入重複副作用。 */
export function shouldRetryTransientHttpStatus(method: string, status: number): boolean {
  if (status !== 429 && (status < 500 || status > 599)) return false;
  const m = method.toUpperCase();
  return m === "GET" || m === "HEAD";
}
