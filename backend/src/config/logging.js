const { logger } = require('../utils/logger');
const { performanceMiddleware, startHealthMonitoring } = require('../utils/performanceLogger');

/**
 * Centralized logging configuration
 * Sets up all logging middleware and monitors
 */

const initializeLogging = (app) => {
  // Add performance monitoring middleware early in the stack
  app.use(performanceMiddleware);
  
  // Start system health monitoring
  startHealthMonitoring(15); // Every 15 minutes
  
  // Log application startup
  logger.info('Application logging initialized', {
    environment: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    timestamp: new Date()
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
    
    // Give logger time to write before exiting
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise.toString(),
      timestamp: new Date()
    });
  });
  
  // Log process warnings
  process.on('warning', (warning) => {
    logger.warn('Process Warning', {
      name: warning.name,
      message: warning.message,
      stack: warning.stack,
      timestamp: new Date()
    });
  });
  
  // Graceful shutdown logging
  const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`, {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date()
    });
    
    // Give time for cleanup operations
    setTimeout(() => {
      logger.info('Graceful shutdown completed');
      process.exit(0);
    }, 5000);
  };
  
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

/**
 * Request logging configuration for Express
 */
const getRequestLoggingConfig = () => {
  return {
    // Skip logging for health check endpoints
    skip: (req) => {
      return req.url === '/health' || req.url === '/favicon.ico';
    },
    
    // Custom format for request logging
    format: 'combined',
    
    // Log to our winston logger
    stream: {
      write: (message) => logger.http(message.trim())
    }
  };
};

/**
 * Security logging configuration
 */
const initializeSecurityLogging = (app) => {
  // Log failed authentication attempts
  app.use((req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode === 401 && req.url.includes('/auth/')) {
        logger.warn('Failed authentication attempt', {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          url: req.url,
          method: req.method,
          timestamp: new Date()
        });
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  });
};

/**
 * Business event logging helpers
 */
const createBusinessEventLogger = () => {
  return {
    userRegistered: (userId, email) => {
      logger.info('Business Event: User Registered', {
        event: 'USER_REGISTERED',
        userId,
        email,
        timestamp: new Date()
      });
    },
    
    applicationSubmitted: (applicationId, userId, serviceId) => {
      logger.info('Business Event: Application Submitted', {
        event: 'APPLICATION_SUBMITTED',
        applicationId,
        userId,
        serviceId,
        timestamp: new Date()
      });
    },
    
    applicationStatusChanged: (applicationId, oldStatus, newStatus, reviewerId) => {
      logger.info('Business Event: Application Status Changed', {
        event: 'APPLICATION_STATUS_CHANGED',
        applicationId,
        oldStatus,
        newStatus,
        reviewerId,
        timestamp: new Date()
      });
    },
    
    serviceCreated: (serviceId, serviceName, createdBy) => {
      logger.info('Business Event: Service Created', {
        event: 'SERVICE_CREATED',
        serviceId,
        serviceName,
        createdBy,
        timestamp: new Date()
      });
    },
    
    serviceDeleted: (serviceId, serviceName, deletedBy) => {
      logger.info('Business Event: Service Deleted', {
        event: 'SERVICE_DELETED',
        serviceId,
        serviceName,
        deletedBy,
        timestamp: new Date()
      });
    },
    
    userRoleChanged: (userId, oldRole, newRole, changedBy) => {
      logger.info('Business Event: User Role Changed', {
        event: 'USER_ROLE_CHANGED',
        userId,
        oldRole,
        newRole,
        changedBy,
        timestamp: new Date()
      });
    }
  };
};

/**
 * Database operation logging wrapper
 */
const createDatabaseLogger = () => {
  return {
    logQuery: (collection, operation, duration, filters = {}) => {
      const logData = {
        collection,
        operation,
        duration: `${duration}ms`,
        filters,
        timestamp: new Date()
      };
      
      if (duration > 1000) {
        logger.warn('Slow database query', logData);
      } else {
        logger.debug('Database query', logData);
      }
    },
    
    logBulkOperation: (collection, operation, count, duration) => {
      logger.info('Database bulk operation', {
        collection,
        operation,
        documentCount: count,
        duration: `${duration}ms`,
        timestamp: new Date()
      });
    }
  };
};

/**
 * Error logging with context
 */
const createErrorLogger = () => {
  return {
    logApiError: (req, error, statusCode) => {
      logger.error('API Error', {
        method: req.method,
        url: req.url,
        statusCode,
        error: error.message,
        stack: error.stack,
        userId: req.user?.uid,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    },
    
    logDatabaseError: (operation, collection, error) => {
      logger.error('Database Error', {
        operation,
        collection,
        error: error.message,
        stack: error.stack,
        timestamp: new Date()
      });
    },
    
    logAuthenticationError: (req, error) => {
      logger.error('Authentication Error', {
        url: req.url,
        method: req.method,
        error: error.message,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    },
    
    logValidationError: (req, validationErrors) => {
      logger.warn('Validation Error', {
        url: req.url,
        method: req.method,
        validationErrors,
        userId: req.user?.uid,
        ip: req.ip,
        timestamp: new Date()
      });
    }
  };
};

/**
 * Performance logging utilities
 */
const createPerformanceLogger = () => {
  return {
    logSlowEndpoint: (req, responseTime) => {
      logger.warn('Slow endpoint detected', {
        method: req.method,
        url: req.url,
        responseTime: `${responseTime}ms`,
        userId: req.user?.uid,
        timestamp: new Date()
      });
    },
    
    logHighMemoryUsage: () => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      
      if (heapUsedMB > 500) { // Alert if heap usage > 500MB
        logger.warn('High memory usage detected', {
          heapUsed: `${heapUsedMB}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
          rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
          timestamp: new Date()
        });
      }
    }
  };
};

module.exports = {
  initializeLogging,
  getRequestLoggingConfig,
  initializeSecurityLogging,
  createBusinessEventLogger,
  createDatabaseLogger,
  createErrorLogger,
  createPerformanceLogger
};
