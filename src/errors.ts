export class ApiError extends Error {
  readonly status: number;
  readonly body: string;
  readonly traceId?: string;

  constructor(message: string, status: number, body: string, traceId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.traceId = traceId;
  }
}
