import { Request, Response } from 'express';

export abstract class BaseController {
  protected sendSuccess(res: Response, data: any, message = 'Success', statusCode = 200): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  protected sendError(res: Response, message = 'Internal server error', statusCode = 500, errors?: any[]): void {
    res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  protected sendValidationError(res: Response, errors: any[]): void {
    this.sendError(res, 'Validation failed', 400, errors);
  }

  protected sendNotFound(res: Response, message = 'Resource not found'): void {
    this.sendError(res, message, 404);
  }

  protected sendUnauthorized(res: Response, message = 'Unauthorized'): void {
    this.sendError(res, message, 401);
  }

  protected sendForbidden(res: Response, message = 'Forbidden'): void {
    this.sendError(res, message, 403);
  }

  protected getPaginationParams(req: Request): { limit: number; offset: number } {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    return { limit, offset };
  }
}