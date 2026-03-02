import { ZodObject, ZodError } from "zod";
type AnyZodObject = ZodObject<any>;
import { Request, Response, NextFunction } from "express";
import { ValidationException } from "../shared/exceptions/validation-exception";


/**
 * Validates request query, params and body parameters
 * @param validator Zod validator that will be used to validate the request
 */
export const validateRequest =
(zodSchema: AnyZodObject ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // -- We validate the request (body, query, params, file, files..)
      const validatedData = await zodSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: (req as any).file,
        files: (req as any).files,
      });

      // -- Replace the request body with the validated data to remove any extra fields
      req.body = (validatedData as any).body;

      // -- Validation was successful, continue
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // FIX: ZodError uses `issues`, not `errors`, and may be empty
        const issues = (error as ZodError).issues ?? [];
        return next(
          new ValidationException({
            message: issues[0]?.message ?? "Validation failed",
            violations: issues.map((e: any) => ({
              code: e.code,
              message: e.message,
              path: Array.isArray(e.path) ? e.path.join(".") : "",
            })),
            cause: error,
          })
        );
      }

      return next(error);
    }
  };
