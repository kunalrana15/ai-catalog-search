import { Request, Response, NextFunction } from 'express';

// Define known error types so we can return proper HTTP codes
const ERROR_MAP: Record<string, number> = {
    'Empty AI response': 503,
    'AI returned invalid JSON': 502,
    'Invalid AI response structure': 502,
    'Tool execution timeout': 504,
    'Validation failed after retries': 422,
};

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code: string = 'INTERNAL_ERROR'
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Look up status code from known errors, default to 500
    const statusCode = err instanceof AppError
        ? err.statusCode
        : ERROR_MAP[err.message] ?? 500;

    const code = err instanceof AppError
        ? err.code
        : deriveCode(err.message);

    // Never leak stack traces to client in production
    const isDev = process.env.NODE_ENV === 'development';

    console.error('[ErrorHandler]', {
        message: err.message,
        code,
        statusCode,
        stack: isDev ? err.stack : undefined,
        url: req.url,
        method: req.method,
    });

    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message: isDev ? err.message : sanitizeMessage(statusCode),
        }
    });
}

// Convert error message → snake_case code
function deriveCode(message: string): string {
    return message
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
}

// In production, don't leak internal details
function sanitizeMessage(statusCode: number): string {
    const messages: Record<number, string> = {
        400: 'Bad request',
        422: 'Could not process your query',
        500: 'Internal server error',
        502: 'AI service error',
        503: 'AI service unavailable',
        504: 'Request timed out',
    };
    return messages[statusCode] ?? 'Something went wrong';
}