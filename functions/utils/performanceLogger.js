const { logger } = require('./logger');
const { createAuditLog } = require('./auditLogger');

/**
 * Performance logging utility for monitoring API response times
 * and system performance metrics
 */

// Performance metrics tracking
const performanceMetrics = {
  requests: [],
  errors: [],
  slowQueries: []
};

/**
 * Middleware to log API performance
 */
const performanceMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  // Override res.send to capture response time
  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Log performance metrics
    logApiPerformance(req, res, responseTime);
    
    // Store metrics for analysis
    storePerformanceMetric(req, res, responseTime);
    
    return originalSend.call(this, data);
  };
  
  next();
};

/**
 * Log API performance metrics
 */
const logApiPerformance = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.uid || 'anonymous'
  };
  
  // Log different levels based on response time and status
  if (responseTime > 5000) {
    logger.warn('Slow API response', logData);
  } else if (responseTime > 2000) {
    logger.info('Moderate API response', logData);
  } else if (res.statusCode >= 400) {
    logger.error('API error response', logData);
  } else {
    logger.debug('API response', logData);
  }
};

/**
 * Store performance metrics for analysis
 */
const storePerformanceMetric = (req, res, responseTime) => {
  const metric = {
    timestamp: new Date(),
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime,
    userId: req.user?.uid,
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage()
  };
  
  performanceMetrics.requests.push(metric);
  
  // Keep only last 1000 metrics to prevent memory overflow
  if (performanceMetrics.requests.length > 1000) {
    performanceMetrics.requests = performanceMetrics.requests.slice(-1000);
  }
  
  // Log slow queries
  if (responseTime > 3000) {
    performanceMetrics.slowQueries.push(metric);
    logger.warn('Slow query detected', {
      url: req.url,
      responseTime: `${responseTime}ms`,
      method: req.method
    });
  }
};

/**
 * Log database operation performance
 */
const logDatabaseOperation = (operation, collection, duration, documentCount = 0) => {
  const logData = {
    operation,
    collection,
    duration: `${duration}ms`,
    documentCount,
    timestamp: new Date()
  };
  
  if (duration > 1000) {
    logger.warn('Slow database operation', logData);
  } else {
    logger.debug('Database operation', logData);
  }
};

/**
 * Log authentication events
 */
const logAuthEvent = (event, userId, details = {}) => {
  logger.info('Authentication event', {
    event,
    userId,
    ...details,
    timestamp: new Date()
  });
};

/**
 * Log business logic events
 */
const logBusinessEvent = (event, userId, details = {}) => {
  logger.info('Business event', {
    event,
    userId,
    ...details,
    timestamp: new Date()
  });
};

/**
 * Log security events
 */
const logSecurityEvent = (event, severity, details = {}) => {
  const logData = {
    event,
    severity,
    ...details,
    timestamp: new Date()
  };
  
  if (severity === 'high' || severity === 'critical') {
    logger.error('Security event', logData);
  } else if (severity === 'medium') {
    logger.warn('Security event', logData);
  } else {
    logger.info('Security event', logData);
  }
  
  // Also create audit log for security events
  createAuditLog({
    action: 'SECURITY_EVENT',
    details: logData,
    success: false
  });
};

/**
 * Get performance metrics
 */
const getPerformanceMetrics = () => {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  // Filter metrics from last hour
  const recentMetrics = performanceMetrics.requests.filter(
    metric => metric.timestamp.getTime() > oneHourAgo
  );
  
  if (recentMetrics.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      errorRate: 0
    };
  }
  
  const totalRequests = recentMetrics.length;
  const averageResponseTime = recentMetrics.reduce((sum, metric) => sum + metric.responseTime, 0) / totalRequests;
  const slowRequests = recentMetrics.filter(metric => metric.responseTime > 2000).length;
  const errorRequests = recentMetrics.filter(metric => metric.statusCode >= 400).length;
  const errorRate = (errorRequests / totalRequests) * 100;
  
  return {
    totalRequests,
    averageResponseTime: Math.round(averageResponseTime),
    slowRequests,
    errorRate: Math.round(errorRate * 100) / 100,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  };
};

/**
 * Log system health metrics
 */
const logSystemHealth = () => {
  const metrics = getPerformanceMetrics();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  logger.info('System health check', {
    ...metrics,
    memoryUsage: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
    },
    cpuUsage,
    timestamp: new Date()
  });
};

/**
 * Monitor system health periodically
 */
const startHealthMonitoring = (intervalMinutes = 15) => {
  const interval = intervalMinutes * 60 * 1000;
  
  setInterval(() => {
    logSystemHealth();
  }, interval);
  
  logger.info(`System health monitoring started with ${intervalMinutes} minute intervals`);
};

/**
 * Log error with context
 */
const logError = (error, context = {}) => {
  logger.error('Application error', {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date()
  });
};

/**
 * Create request logger for specific operations
 */
const createOperationLogger = (operationName) => {
  return {
    start: (details = {}) => {
      const startTime = Date.now();
      logger.info(`${operationName} started`, { ...details, startTime });
      return startTime;
    },
    
    end: (startTime, details = {}) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      logger.info(`${operationName} completed`, { 
        ...details, 
        duration: `${duration}ms`,
        endTime 
      });
      return duration;
    },
    
    error: (startTime, error, details = {}) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      logger.error(`${operationName} failed`, {
        ...details,
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack,
        endTime
      });
      return duration;
    }
  };
};

module.exports = {
  performanceMiddleware,
  logApiPerformance,
  logDatabaseOperation,
  logAuthEvent,
  logBusinessEvent,
  logSecurityEvent,
  logError,
  getPerformanceMetrics,
  logSystemHealth,
  startHealthMonitoring,
  createOperationLogger
};
