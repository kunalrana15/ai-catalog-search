import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../lib/AppError.js";

type Target = "body" | "query" | "params";

export function validate(schema: ZodSchema, target: Target = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const messages = result.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");

      return next(new AppError(`Validation failed — ${messages}`, 400, "VALIDATION_ERROR"));
    }

    // Replace with parsed+coerced data
    req[target] = result.data;
    next();
  };
}