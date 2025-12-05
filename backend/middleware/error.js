const { ValidationError } = require('joi');
const { JsonWebTokenError } = require('jsonwebtoken');
const { DatabaseError } = require('sequelize');
const logger = require('../utils/logger');

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error 💥', err);
  } else {
    // Log error in production
    logger.error(`Error: ${err.message}`, { stack: err.stack });
  }

  // Handle specific error types
  if (err instanceof ValidationError) {
    // Joi validation error
    const message = err.details.map(detail => detail.message).join('. ');
    error = new APIError(`Validation Error: ${message}`, 400);
  } else if (err instanceof JsonWebTokenError) {
    // JWT error
    error = new APIError('Invalid token. Please log in again!', 401);
  } else if (err instanceof DatabaseError) {
    // Database error
    error = new APIError('Database operation failed', 500);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    // Handle unique constraint errors
    const message = `Duplicate field value: ${Object.keys(err.fields).join(', ')}`;
    error = new APIError(message, 400);
  } else if (err.name === 'SequelizeValidationError') {
    // Handle sequelize validation errors
    const messages = err.errors.map(e => e.message);
    error = new APIError(`Invalid input data: ${messages.join('. ')}`, 400);
  }

  // Default to 500 if status code is not set
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const message = error.isOperational ? error.message : 'Something went wrong!';

  // Send error response
  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new APIError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
};

module.exports = {
  APIError,
  errorHandler,
  notFound
};
