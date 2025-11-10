import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../logging/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('API Error:', {
    statusCode,
    message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found`,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

