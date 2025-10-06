import { db } from './firebase';
import { collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Audit action types
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  PASSWORD_CHANGE: 'password_change',
  
  // User Management
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_ROLE_CHANGE: 'user_role_change',
  
  // Service Management
  SERVICE_CREATE: 'service_create',
  SERVICE_UPDATE: 'service_update',
  SERVICE_DELETE: 'service_delete',
  
  // Application Management
  APPLICATION_CREATE: 'application_create',
  APPLICATION_UPDATE: 'application_update',
  APPLICATION_STATUS_CHANGE: 'application_status_change',
  APPLICATION_ASSIGN: 'application_assign',
  APPLICATION_DELETE: 'application_delete',
  
  // Document Management
  DOCUMENT_UPLOAD: 'document_upload',
  DOCUMENT_DELETE: 'document_delete',
  DOCUMENT_DOWNLOAD: 'document_download',
  
  // System Actions
  SYSTEM_CONFIG_CHANGE: 'system_config_change',
  BULK_OPERATION: 'bulk_operation',
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import'
};

// Create audit log entry
export const createAuditLog = async ({
  userId,
  userEmail,
  userRole,
  action,
  resourceType,
  resourceId,
  details = {},
  ipAddress = null,
  userAgent = null
}) => {
  try {
    const auditEntry = {
      userId,
      userEmail,
      userRole,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent,
      timestamp: new Date(),
      success: true
    };

    const docRef = await addDoc(collection(db, 'audit_logs'), auditEntry);
    return docRef.id;
  } catch (error) {
    console.error('Error creating audit log:', error);
    
    // Try to log the failure itself
    try {
      await addDoc(collection(db, 'audit_logs'), {
        userId,
        userEmail,
        userRole,
        action: 'audit_log_failure',
        resourceType: 'system',
        resourceId: null,
        details: { 
          originalAction: action,
          error: error.message 
        },
        timestamp: new Date(),
        success: false
      });
    } catch (logError) {
      console.error('Failed to log audit failure:', logError);
    }
    
    throw error;
  }
};

// Authentication audit logs
export const logLogin = async (user, ipAddress, userAgent) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.LOGIN,
    resourceType: 'user',
    resourceId: user.uid,
    details: {
      loginMethod: 'email_password',
      timestamp: new Date()
    },
    ipAddress,
    userAgent
  });
};

export const logLogout = async (user, ipAddress, userAgent) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.LOGOUT,
    resourceType: 'user',
    resourceId: user.uid,
    details: {
      sessionDuration: null, // Could calculate session duration
      timestamp: new Date()
    },
    ipAddress,
    userAgent
  });
};

// User management audit logs
export const logUserRoleChange = async (adminUser, targetUserId, oldRole, newRole) => {
  return createAuditLog({
    userId: adminUser.uid,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: AUDIT_ACTIONS.USER_ROLE_CHANGE,
    resourceType: 'user',
    resourceId: targetUserId,
    details: {
      oldRole,
      newRole,
      changedBy: adminUser.uid,
      timestamp: new Date()
    }
  });
};

export const logUserDelete = async (adminUser, targetUserId, targetUserEmail) => {
  return createAuditLog({
    userId: adminUser.uid,
    userEmail: adminUser.email,
    userRole: adminUser.role,
    action: AUDIT_ACTIONS.USER_DELETE,
    resourceType: 'user',
    resourceId: targetUserId,
    details: {
      deletedUserEmail: targetUserEmail,
      deletedBy: adminUser.uid,
      timestamp: new Date()
    }
  });
};

// Service management audit logs
export const logServiceCreate = async (user, service) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.SERVICE_CREATE,
    resourceType: 'service',
    resourceId: service.id,
    details: {
      serviceName: service.name,
      serviceCategory: service.category,
      createdBy: user.uid,
      timestamp: new Date()
    }
  });
};

export const logServiceUpdate = async (user, serviceId, oldData, newData) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.SERVICE_UPDATE,
    resourceType: 'service',
    resourceId: serviceId,
    details: {
      changes: getChanges(oldData, newData),
      updatedBy: user.uid,
      timestamp: new Date()
    }
  });
};

export const logServiceDelete = async (user, serviceId, serviceName) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.SERVICE_DELETE,
    resourceType: 'service',
    resourceId: serviceId,
    details: {
      serviceName,
      deletedBy: user.uid,
      timestamp: new Date()
    }
  });
};

// Application audit logs
export const logApplicationStatusChange = async (user, applicationId, oldStatus, newStatus, remarks) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.APPLICATION_STATUS_CHANGE,
    resourceType: 'application',
    resourceId: applicationId,
    details: {
      oldStatus,
      newStatus,
      remarks,
      changedBy: user.uid,
      timestamp: new Date()
    }
  });
};

export const logApplicationAssign = async (user, applicationId, assignedToUserId) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.APPLICATION_ASSIGN,
    resourceType: 'application',
    resourceId: applicationId,
    details: {
      assignedTo: assignedToUserId,
      assignedBy: user.uid,
      timestamp: new Date()
    }
  });
};

// Document audit logs
export const logDocumentUpload = async (user, applicationId, fileName, fileSize) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.DOCUMENT_UPLOAD,
    resourceType: 'document',
    resourceId: applicationId,
    details: {
      fileName,
      fileSize,
      applicationId,
      uploadedBy: user.uid,
      timestamp: new Date()
    }
  });
};

// System audit logs
export const logBulkOperation = async (user, operationType, affectedCount, details) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.BULK_OPERATION,
    resourceType: 'system',
    resourceId: null,
    details: {
      operationType,
      affectedCount,
      ...details,
      performedBy: user.uid,
      timestamp: new Date()
    }
  });
};

export const logDataExport = async (user, exportType, recordCount) => {
  return createAuditLog({
    userId: user.uid,
    userEmail: user.email,
    userRole: user.role,
    action: AUDIT_ACTIONS.DATA_EXPORT,
    resourceType: 'system',
    resourceId: null,
    details: {
      exportType,
      recordCount,
      exportedBy: user.uid,
      timestamp: new Date()
    }
  });
};

// Get audit logs with filtering
export const getAuditLogs = async (filters = {}) => {
  try {
    let auditQuery = collection(db, 'audit_logs');
    
    // Apply filters
    if (filters.userId) {
      auditQuery = query(auditQuery, where('userId', '==', filters.userId));
    }
    
    if (filters.action) {
      auditQuery = query(auditQuery, where('action', '==', filters.action));
    }
    
    if (filters.resourceType) {
      auditQuery = query(auditQuery, where('resourceType', '==', filters.resourceType));
    }
    
    // Always order by timestamp descending
    auditQuery = query(auditQuery, orderBy('timestamp', 'desc'));
    
    // Apply limit
    if (filters.limit) {
      auditQuery = query(auditQuery, limit(filters.limit));
    }
    
    const snapshot = await getDocs(auditQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// Helper function to get changes between old and new data
const getChanges = (oldData, newData) => {
  const changes = {};
  
  for (const key in newData) {
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        from: oldData[key],
        to: newData[key]
      };
    }
  }
  
  return changes;
};

// Get user activity summary
export const getUserActivitySummary = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const logs = await getAuditLogs({
      userId,
      limit: 1000
    });
    
    // Filter by date range (client-side since Firestore timestamp queries are complex)
    const recentLogs = logs.filter(log => log.timestamp >= startDate);
    
    const summary = {
      totalActions: recentLogs.length,
      actionBreakdown: {},
      lastActivity: recentLogs[0]?.timestamp || null,
      mostActiveDay: null
    };
    
    // Count actions by type
    recentLogs.forEach(log => {
      summary.actionBreakdown[log.action] = (summary.actionBreakdown[log.action] || 0) + 1;
    });
    
    return summary;
  } catch (error) {
    console.error('Error getting user activity summary:', error);
    throw error;
  }
};
