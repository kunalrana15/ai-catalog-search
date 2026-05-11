export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    // Preserves proper prototype chain in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Pre-defined errors — import and throw directly
export const Errors = {
  MISSING_QUERY: () =>
    new AppError("query field is required", 400, "MISSING_QUERY"),

  INVALID_QUERY: (detail: string) =>
    new AppError(`Invalid query: ${detail}`, 400, "INVALID_QUERY"),

  AI_SERVICE_FAILED: (detail: string) =>
    new AppError(`AI service error: ${detail}`, 502, "AI_SERVICE_FAILED"),

  DB_QUERY_FAILED: (detail: string) =>
    new AppError(`Database error: ${detail}`, 500, "DB_QUERY_FAILED"),

  NOT_FOUND: (resource: string) =>
    new AppError(`${resource} not found`, 404, "NOT_FOUND"),
} as const;