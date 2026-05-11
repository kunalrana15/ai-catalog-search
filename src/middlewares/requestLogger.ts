import pinoHttp from 'pino-http';
import type { Request,Response } from 'express';
import logger from "../lib/logger.js";

export const requestLogger = pinoHttp({
  logger,
  // Don't log health checks — too noisy
  autoLogging: {
    ignore: (req: Request) => req.url === "/health",
  },
  customLogLevel: (_req: Request, res: Response) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req(req: Request) {
      return { method: req.method, url: req.url };
    },
    res(res: Response) {
      return { statusCode: res.statusCode };
    },
  },
});