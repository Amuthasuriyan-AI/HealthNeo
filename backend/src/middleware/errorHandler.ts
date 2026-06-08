import { Request, Response, NextFunction } from 'express';
import { IApiResponse } from '../types';

/**
 * Error Handler Middleware
 * Centralized error handling
 */
export class ErrorHandler {
  /**
   * Handle errors and send appropriate response
   */
  static handle(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    const errorResponse: IApiResponse = {
      success: false,
      message,
      statusCode,
    };

    if (error.details) {
      errorResponse.error = error.details;
    }

    console.error(`[${new Date().toISOString()}] Error:`, error);

    res.status(statusCode).json(errorResponse);
  }
}

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found Middleware
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorResponse: IApiResponse = {
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    statusCode: 404,
  };
  res.status(404).json(errorResponse);
};
