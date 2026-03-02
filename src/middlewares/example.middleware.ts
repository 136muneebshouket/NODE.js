import { Request, Response, NextFunction } from 'express';

// Simple middleware to log request method and URL
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};