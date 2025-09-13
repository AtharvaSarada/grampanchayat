const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { statusCode: 404, message };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { statusCode: 400, message };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { statusCode: 400, message };
  }

  // Firebase errors
  if (err.code && err.code.startsWith('auth/')) {
    const message = getFirebaseErrorMessage(err.code);
    error = { statusCode: 401, message };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { statusCode: 401, message };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { statusCode: 401, message };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const getFirebaseErrorMessage = (code) => {
  const errorMessages = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'User account has been disabled',
    'auth/user-not-found': 'User not found',
    'auth/wrong-password': 'Invalid password',
    'auth/email-already-in-use': 'Email is already registered',
    'auth/weak-password': 'Password is too weak',
    'auth/invalid-token': 'Invalid authentication token',
    'auth/token-expired': 'Authentication token has expired',
    'auth/insufficient-permission': 'Insufficient permissions to access this resource',
    'auth/internal-error': 'Internal authentication error'
  };

  return errorMessages[code] || 'Authentication error';
};

module.exports = errorHandler;
