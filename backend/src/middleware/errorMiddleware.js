/**
 * Centralized error handling.
 *
 * All errors thrown by controllers pass through here. Stack traces are
 * only included in development responses, never in production.
 */

import { config } from '../config/index.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFound = (req, res, next) => {
  next(new AppError(`Not found: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';

  // Log full error on the server
  console.error(`[${new Date().toISOString()}] ${statusCode} ${req.method} ${req.path}`);
  if (config.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Never leak sensitive details to the client
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  });
};