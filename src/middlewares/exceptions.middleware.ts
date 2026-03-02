import { NextFunction, Request, Response } from "express";

import { ValidationException } from "../shared/exceptions/validation-exception";
import { ZodError } from "zod";
import { HttpException } from "../shared/exceptions/http-exception";
const {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
  // You might include other specific Sequelize errors like ForeignKeyConstraintError
} = require("sequelize");
// import { createLogger } from "#/shared/utils/logger";
// import { HttpException } from "#/shared/exceptions/http-exception";
// import { ValidationException } from "#/shared/exceptions/validation-exception";

// const logger = createLogger({ name: "exceptions-middleware" });
const isDev = process.env.NODE_ENV === "development";

/**
 * Global error handling middleware
 *
 * @param err - The Express error (can be ours or another)
 * @param req - The initial request
 * @param res - The response object
 * @param next - Allows passing to the next middleware if it exists
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const exceptionsMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpException) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      stack: isDev ? err.stack : undefined,
      cause: isDev && err.cause ? (err.cause as Error).message : undefined,
      payload : err.payload
    });
  }

  if (err instanceof ValidationException) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      violations: err.violations,
      stack: isDev ? err.stack : undefined,
      cause: isDev && err.cause ? (err.cause as Error).message : undefined,
    });
  }

  if (err instanceof ZodError) {
    // FIX: ZodError uses `issues`, not `errors`, and may be empty
    const issues = (err as ZodError).issues ?? [];

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: issues[0]?.message ?? "Validation failed",
      violations: issues.map((e: any) => ({
        code: e.code,
        message: e.message,
        path: Array.isArray(e.path) ? e.path.join(".") : "",
      })),
      // cause: err,
    });
  }

  if (err instanceof ValidationError) {
    let sequelizeError = err.errors || [];

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: err?.message,
      violations: sequelizeError?.map((e: any) => ({
        code: e.code || null,
        message: e.message,
        path: Array.isArray(e.path) ? e.path.join(".") : "",
      })),
      // cause: err,
    });
  }

  if (err instanceof UniqueConstraintError) {
    let errors =
      err.errors.map((e: any) => ({
        path: e.path,
        message: `${e.path} already in use.`,
        code: "unique_constraint",
        value: e.value,
      })) || [];

    return res.status(400).json({
      code: 409,
      message: "Resource already exists due to a unique constraint violation.",
      violations: errors,
      // cause: err,
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {

    let errors =
      err.fields
        ? Object.entries(err.fields).map(([path, value]) => ({
            path,
            message: `${path} is invalid or does not exist (foreign key constraint failed).`,
            code: "foreign_key_constraint",
            value,
          }))
        : [];

    return res.status(400).json({
      code: 400,
      message: "Resource could not be created or updated due to a foreign key constraint violation." + " " + (err?.original?.detail || ""),
      violations: errors,
      // cause: err,
    });
  }
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      code: 500,
      message: "Database error occurred.",
      // cause: err,
    });
  }


  /** Log unhandled errors to a file */
  //   logger.fatal({
  //     url: req.protocol + "://" + req.hostname + req.originalUrl,
  //     message: err.message,
  //     stack: err.stack,
  //   });

  /**
   * In other cases, we return a 500
   */
  return res.status(500).json({ message: "Oops.. Internal Server Error" });
};