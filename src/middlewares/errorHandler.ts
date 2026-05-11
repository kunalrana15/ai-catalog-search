import { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";
import logger from "../lib/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  // Known, operational error — safe to expose message
  if (err instanceof AppError && err.isOperational) {
    logger.warn({ code: err.code, url: req.url }, err.message);

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Unknown / programmer error — log full stack, send generic message
  logger.error({ err, url: req.url }, "Unhandled error");

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
}