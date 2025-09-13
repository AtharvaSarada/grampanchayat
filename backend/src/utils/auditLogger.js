const { getFirestore, COLLECTIONS } = require('../config/firebase');
const { logger } = require('./logger');

/**
 * Create an audit log entry
 * @param {Object} logData - The audit log data
 * @param {string} logData.action - The action performed
 * @param {string} [logData.userId] - The ID of the user who performed the action
 * @param {Object} [logData.details] - Additional details about the action
 * @param {string} [logData.ipAddress] - The IP address of the request
 * @param {string} [logData.userAgent] - The user agent of the request
 * @param {string} [logData.resourceId] - The ID of the resource affected
 * @param {string} [logData.resourceType] - The type of resource affected
 */
const createAuditLog = async (logData) => {
  try {
    const db = getFirestore();
    
    const auditLogEntry = {
      action: logData.action,
      userId: logData.userId || null,
      details: logData.details || {},
      ipAddress: logData.ipAddress || null,
      userAgent: logData.userAgent || null,
      resourceId: logData.resourceId || null,
      resourceType: logData.resourceType || null,
      timestamp: new Date(),
      success: logData.success !== undefined ? logData.success : true
    };

    // Add to Firestore
    const docRef = await db.collection(COLLECTIONS.AUDIT_LOGS).add(auditLogEntry);
    
    // Log to file as well
    logger.info('Audit log created', {
      id: docRef.id,
      ...auditLogEntry
    });

    return docRef.id;
  } catch (error) {
    logger.error('Failed to create audit log:', error);
    // Don't throw error to avoid breaking the main flow
  }
};

/**
 * Get audit logs with filtering and pagination
 * @param {Object} options - Query options
 * @param {string} [options.userId] - Filter by user ID
 * @param {string} [options.action] - Filter by action
 * @param {string} [options.resourceType] - Filter by resource type
 * @param {Date} [options.startDate] - Filter by start date
 * @param {Date} [options.endDate] - Filter by end date
 * @param {number} [options.limit] - Limit number of results
 * @param {string} [options.startAfter] - Document ID to start after (for pagination)
 * @returns {Promise<Array>} Array of audit log entries
 */
const getAuditLogs = async (options = {}) => {
  try {
    const db = getFirestore();
    let query = db.collection(COLLECTIONS.AUDIT_LOGS);

    // Apply filters
    if (options.userId) {
      query = query.where('userId', '==', options.userId);
    }
    
    if (options.action) {
      query = query.where('action', '==', options.action);
    }
    
    if (options.resourceType) {
      query = query.where('resourceType', '==', options.resourceType);
    }
    
    if (options.startDate) {
      query = query.where('timestamp', '>=', options.startDate);
    }
    
    if (options.endDate) {
      query = query.where('timestamp', '<=', options.endDate);
    }

    // Order by timestamp (most recent first)
    query = query.orderBy('timestamp', 'desc');

    // Apply pagination
    if (options.startAfter) {
      const startAfterDoc = await db.collection(COLLECTIONS.AUDIT_LOGS).doc(options.startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    const auditLogs = [];

    snapshot.forEach(doc => {
      auditLogs.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });

    return auditLogs;
  } catch (error) {
    logger.error('Failed to get audit logs:', error);
    throw error;
  }
};

/**
 * Get audit logs for a specific user
 * @param {string} userId - The user ID
 * @param {Object} options - Additional query options
 * @returns {Promise<Array>} Array of audit log entries for the user
 */
const getUserAuditLogs = async (userId, options = {}) => {
  return getAuditLogs({
    userId,
    ...options
  });
};

/**
 * Create middleware to automatically log requests
 * @param {string} action - The action to log
 * @param {Function} [getDetails] - Function to extract details from request
 * @returns {Function} Express middleware function
 */
const auditMiddleware = (action, getDetails = () => ({})) => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;
      
      res.send = function(data) {
        // Log after response is sent
        setImmediate(async () => {
          try {
            const success = res.statusCode >= 200 && res.statusCode < 400;
            
            await createAuditLog({
              action,
              userId: req.user?.uid,
              details: {
                ...getDetails(req, res),
                statusCode: res.statusCode
              },
              ipAddress: req.ip,
              userAgent: req.get('User-Agent'),
              success
            });
          } catch (error) {
            logger.error('Audit middleware error:', error);
          }
        });
        
        return originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      logger.error('Audit middleware setup error:', error);
      next();
    }
  };
};

module.exports = {
  createAuditLog,
  getAuditLogs,
  getUserAuditLogs,
  auditMiddleware
};
