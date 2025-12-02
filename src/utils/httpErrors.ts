// Custom HTTP error class for structured error handling
export class HttpError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes for common scenarios
export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string) {
    super(500, message);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message: string) {
    super(503, message);
  }
}
