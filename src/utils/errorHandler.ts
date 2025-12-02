import { Request, Response, NextFunction } from 'express';
import { HttpError } from './httpErrors';

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path?: string;
  };
}

// Centralized error handling middleware
export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Check if it's our custom HttpError
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err instanceof SyntaxError && 'body' in err) {
    // Handle JSON parsing errors
    statusCode = 400;
    message = 'Invalid JSON format';
  } else if (err.message) {
    // Generic error with message
    message = err.message;
  }

  // Log error details (in production, use proper logging service)
  console.error('[ERROR]', {
    statusCode,
    message,
    isOperational,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  });

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper for route handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 Not Found handler
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new HttpError(404, `Route not found: ${req.originalUrl}`);
  next(error);
};
