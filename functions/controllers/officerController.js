const { getFirestore, getAuth, COLLECTIONS } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { createAuditLog, getAuditLogs } = require('../utils/auditLogger');
const { v4: uuidv4 } = require('uuid');

// Get admin dashboard data
const getAdminDashboard = async (req, res, next) => {
  try {
    const db = getFirestore();
    
    // Get comprehensive statistics
    const systemStats = await getSystemStatistics(db);
    
    // Get recent activities
    const recentActivities = await getRecentActivities(db, 10);
    
    // Get pending actions
    const pendingActions = await getPendingActions(db);
    
    await createAuditLog({
      action: 'ADMIN_DASHBOARD_VIEWED',
      userId: req.user.uid,
      details: { role: req.user.role },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      data: {
        systemStats,
        recentActivities,
        pendingActions,
        adminInfo: {
          role: req.user.role,
          name: `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    logger.error('Get admin dashboard error:', error);
    next(error);
  }
};

// Get system analytics
const getSystemAnalytics = async (req, res, next) => {
  try {
    const { period = '30d', type = 'overview' } = req.query;
    const db = getFirestore();
    
    const analyticsData = await generateAnalytics(db, period, type);
    
    await createAuditLog({
      action: 'SYSTEM_ANALYTICS_VIEWED',
      userId: req.user.uid,
      details: { period, type },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    logger.error('Get system analytics error:', error);
    next(error);
  }
};

// === SERVICE MANAGEMENT ===

// Create new service
const createService = async (req, res, next) => {
  try {
    const serviceData = req.body;
    const db = getFirestore();
    
    const serviceId = uuidv4();
    const newService = {
      id: serviceId,
      ...serviceData,
      isActive: true,
      createdBy: req.user.uid,
      createdByName: `${req.user.firstName} ${req.user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection(COLLECTIONS.SERVICES).doc(serviceId).set(newService);
    
    await createAuditLog({
      action: 'SERVICE_CREATED',
      userId: req.user.uid,
      resourceId: serviceId,
      resourceType: 'service',
      details: { 
        serviceName: serviceData.name,
        category: serviceData.category,
        fees: serviceData.fees 
      },
      ipAddress: req.ip
    });
    
    logger.info(`Service created: ${serviceData.name} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        serviceId,
        name: serviceData.name,
        createdAt: newService.createdAt
      }
    });
  } catch (error) {
    logger.error('Create service error:', error);
    next(error);
  }
};

// Get all services (including inactive)
const getAllServicesAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const db = getFirestore();
    
    let servicesQuery = db.collection(COLLECTIONS.SERVICES);
    
    // Apply filters
    if (category) {
      servicesQuery = servicesQuery.where('category', '==', category);
    }
    
    if (isActive !== undefined) {
      servicesQuery = servicesQuery.where('isActive', '==', isActive === 'true');
    }
    
    // Apply sorting
    servicesQuery = servicesQuery.orderBy(sortBy, sortOrder);
    
    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    if (offset > 0) {
      const offsetSnapshot = await servicesQuery.limit(offset).get();
      const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
      if (lastDoc) {
        servicesQuery = servicesQuery.startAfter(lastDoc);
      }
    }
    
    const snapshot = await servicesQuery.limit(parseInt(limit)).get();
    const services = [];
    
    // Get application count and other stats for each service
    for (const doc of snapshot.docs) {
      const serviceData = doc.data();
      const stats = await getServiceStats(db, doc.id);
      
      services.push({
        id: doc.id,
        ...serviceData,
        ...stats,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      });
    }
    
    // Get total count
    let totalQuery = db.collection(COLLECTIONS.SERVICES);
    if (category) {
      totalQuery = totalQuery.where('category', '==', category);
    }
    if (isActive !== undefined) {
      totalQuery = totalQuery.where('isActive', '==', isActive === 'true');
    }
    
    const totalSnapshot = await totalQuery.get();
    const totalCount = totalSnapshot.size;
    
    res.status(200).json({
      success: true,
      count: services.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      data: services
    });
  } catch (error) {
    logger.error('Get all services admin error:', error);
    next(error);
  }
};

// Get service details (admin view)
const getServiceDetailsAdmin = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const db = getFirestore();
    
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(serviceId).get();
    
    if (!serviceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const serviceData = serviceDoc.data();
    const stats = await getServiceDetailedStats(db, serviceId);
    
    await createAuditLog({
      action: 'SERVICE_ADMIN_VIEWED',
      userId: req.user.uid,
      resourceId: serviceId,
      resourceType: 'service',
      details: { serviceName: serviceData.name },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: serviceDoc.id,
        ...serviceData,
        statistics: stats,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get service details admin error:', error);
    next(error);
  }
};

// Update service
const updateService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;
    const db = getFirestore();
    
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(serviceId).get();
    
    if (!serviceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const currentData = serviceDoc.data();
    
    // Update service
    const updatedService = {
      ...updateData,
      updatedAt: new Date(),
      updatedBy: req.user.uid,
      updatedByName: `${req.user.firstName} ${req.user.lastName}`
    };
    
    await db.collection(COLLECTIONS.SERVICES).doc(serviceId).update(updatedService);
    
    // Log changes
    const changes = getObjectChanges(currentData, updateData);
    
    await createAuditLog({
      action: 'SERVICE_UPDATED',
      userId: req.user.uid,
      resourceId: serviceId,
      resourceType: 'service',
      details: {
        serviceName: updateData.name || currentData.name,
        changes
      },
      ipAddress: req.ip
    });
    
    logger.info(`Service updated: ${serviceId} by ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: {
        serviceId,
        updatedAt: updatedService.updatedAt,
        changes: Object.keys(changes)
      }
    });
  } catch (error) {
    logger.error('Update service error:', error);
    next(error);
  }
};

// Delete service
const deleteService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const db = getFirestore();
    
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(serviceId).get();
    
    if (!serviceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const serviceData = serviceDoc.data();
    
    // Check if there are pending applications for this service
    const pendingApplications = await db.collection(COLLECTIONS.APPLICATIONS)
      .where('serviceId', '==', serviceId)
      .where('status', 'in', ['pending', 'under_review'])
      .get();
    
    if (!pendingApplications.empty) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete service. ${pendingApplications.size} pending applications exist.`,
        pendingApplicationsCount: pendingApplications.size
      });
    }
    
    // Delete service
    await db.collection(COLLECTIONS.SERVICES).doc(serviceId).delete();
    
    await createAuditLog({
      action: 'SERVICE_DELETED',
      userId: req.user.uid,
      resourceId: serviceId,
      resourceType: 'service',
      details: {
        serviceName: serviceData.name,
        category: serviceData.category
      },
      ipAddress: req.ip
    });
    
    logger.info(`Service deleted: ${serviceData.name} by ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    logger.error('Delete service error:', error);
    next(error);
  }
};

// Toggle service status
const toggleServiceStatus = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const db = getFirestore();
    
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(serviceId).get();
    
    if (!serviceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const currentData = serviceDoc.data();
    const newStatus = !currentData.isActive;
    
    await db.collection(COLLECTIONS.SERVICES).doc(serviceId).update({
      isActive: newStatus,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });
    
    await createAuditLog({
      action: 'SERVICE_STATUS_TOGGLED',
      userId: req.user.uid,
      resourceId: serviceId,
      resourceType: 'service',
      details: {
        serviceName: currentData.name,
        previousStatus: currentData.isActive,
        newStatus
      },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      message: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        serviceId,
        isActive: newStatus
      }
    });
  } catch (error) {
    logger.error('Toggle service status error:', error);
    next(error);
  }
};

// === APPLICATION MANAGEMENT ===

// Get all applications with advanced filtering
const getAllApplications = async (req, res, next) => {
  try {
    const { 
      status, 
      serviceId, 
      dateFrom, 
      dateTo, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc' 
    } = req.query;
    
    const db = getFirestore();
    let applicationsQuery = db.collection(COLLECTIONS.APPLICATIONS);
    
    // Apply filters
    if (status) {
      applicationsQuery = applicationsQuery.where('status', '==', status);
    }
    
    if (serviceId) {
      applicationsQuery = applicationsQuery.where('serviceId', '==', serviceId);
    }
    
    if (dateFrom) {
      applicationsQuery = applicationsQuery.where('createdAt', '>=', new Date(dateFrom));
    }
    
    if (dateTo) {
      applicationsQuery = applicationsQuery.where('createdAt', '<=', new Date(dateTo));
    }
    
    // Apply sorting
    applicationsQuery = applicationsQuery.orderBy(sortBy, sortOrder);
    
    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    if (offset > 0) {
      const offsetSnapshot = await applicationsQuery.limit(offset).get();
      const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
      if (lastDoc) {
        applicationsQuery = applicationsQuery.startAfter(lastDoc);
      }
    }
    
    const snapshot = await applicationsQuery.limit(parseInt(limit)).get();
    const applications = [];
    
    // Get detailed information for each application
    for (const doc of snapshot.docs) {
      const appData = doc.data();
      const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(appData.serviceId).get();
      const applicantDoc = await db.collection(COLLECTIONS.USERS).doc(appData.applicantId).get();
      
      applications.push({
        id: doc.id,
        ...appData,
        serviceDetails: serviceDoc.exists ? {
          id: serviceDoc.id,
          name: serviceDoc.data().name,
          category: serviceDoc.data().category
        } : null,
        applicantDetails: {
          ...appData.applicantDetails,
          profileComplete: applicantDoc.exists
        },
        createdAt: appData.createdAt.toDate(),
        updatedAt: appData.updatedAt.toDate()
      });
    }
    
    res.status(200).json({
      success: true,
      count: applications.length,
      currentPage: parseInt(page),
      data: applications
    });
  } catch (error) {
    logger.error('Get all applications error:', error);
    next(error);
  }
};

// Bulk update application status
const bulkUpdateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationIds, status, remarks } = req.body;
    const db = getFirestore();
    
    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Application IDs array is required'
      });
    }
    
    const results = [];
    const batch = db.batch();
    
    for (const applicationId of applicationIds) {
      try {
        const applicationRef = db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId);
        const applicationDoc = await applicationRef.get();
        
        if (applicationDoc.exists) {
          const currentData = applicationDoc.data();
          
          const newStatusEntry = {
            status,
            timestamp: new Date(),
            remarks: remarks || '',
            reviewedBy: req.user.uid,
            reviewerName: `${req.user.firstName} ${req.user.lastName}`,
            reviewerRole: req.user.role
          };
          
          const updatedStatusHistory = [...(currentData.statusHistory || []), newStatusEntry];
          
          batch.update(applicationRef, {
            status,
            statusHistory: updatedStatusHistory,
            updatedAt: new Date(),
            lastReviewedBy: req.user.uid,
            lastReviewedAt: new Date()
          });
          
          results.push({
            applicationId,
            success: true,
            previousStatus: currentData.status,
            newStatus: status
          });
        } else {
          results.push({
            applicationId,
            success: false,
            error: 'Application not found'
          });
        }
      } catch (error) {
        results.push({
          applicationId,
          success: false,
          error: error.message
        });
      }
    }
    
    // Execute batch update
    await batch.commit();
    
    // Create audit log
    await createAuditLog({
      action: 'BULK_APPLICATION_STATUS_UPDATE',
      userId: req.user.uid,
      details: {
        applicationIds,
        status,
        successCount: results.filter(r => r.success).length,
        totalCount: results.length
      },
      ipAddress: req.ip
    });
    
    logger.info(`Bulk status update completed by ${req.user.email}: ${results.filter(r => r.success).length}/${results.length} successful`);
    
    res.status(200).json({
      success: true,
      message: 'Bulk status update completed',
      data: {
        results,
        successCount: results.filter(r => r.success).length,
        totalCount: results.length
      }
    });
  } catch (error) {
    logger.error('Bulk update application status error:', error);
    next(error);
  }
};

// Delete application
const deleteApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const db = getFirestore();
    
    const applicationDoc = await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).get();
    
    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const applicationData = applicationDoc.data();
    
    // Delete application
    await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).delete();
    
    await createAuditLog({
      action: 'APPLICATION_DELETED',
      userId: req.user.uid,
      resourceId: applicationId,
      resourceType: 'application',
      details: {
        applicantId: applicationData.applicantId,
        serviceId: applicationData.serviceId,
        status: applicationData.status
      },
      ipAddress: req.ip
    });
    
    logger.info(`Application deleted: ${applicationId} by ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    logger.error('Delete application error:', error);
    next(error);
  }
};

// === USER MANAGEMENT ===

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const db = getFirestore();
    
    let usersQuery = db.collection(COLLECTIONS.USERS);
    
    // Apply filters
    if (role) {
      usersQuery = usersQuery.where('role', '==', role);
    }
    
    if (isActive !== undefined) {
      usersQuery = usersQuery.where('isActive', '==', isActive === 'true');
    }
    
    // Apply sorting
    usersQuery = usersQuery.orderBy(sortBy, sortOrder);
    
    const snapshot = await usersQuery.get();
    const users = [];
    
    snapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        ...userData,
        // Remove sensitive information
        password: undefined,
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate()
      });
    });
    
    // Apply pagination to filtered results
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedUsers.length,
      totalCount: users.length,
      totalPages: Math.ceil(users.length / parseInt(limit)),
      currentPage: parseInt(page),
      data: paginatedUsers
    });
  } catch (error) {
    logger.error('Get all users error:', error);
    next(error);
  }
};

// Get user details
const getUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const db = getFirestore();
    
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    
    // Get user's applications
    const applicationsQuery = db.collection(COLLECTIONS.APPLICATIONS)
      .where('applicantId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(10);
    
    const applicationsSnapshot = await applicationsQuery.get();
    const recentApplications = [];
    
    applicationsSnapshot.forEach(doc => {
      const appData = doc.data();
      recentApplications.push({
        id: doc.id,
        serviceId: appData.serviceId,
        status: appData.status,
        createdAt: appData.createdAt.toDate()
      });
    });
    
    await createAuditLog({
      action: 'USER_DETAILS_VIEWED',
      userId: req.user.uid,
      resourceId: userId,
      resourceType: 'user',
      details: { viewedUserEmail: userData.email },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: userDoc.id,
        ...userData,
        password: undefined,
        recentApplications,
        createdAt: userData.createdAt.toDate(),
        updatedAt: userData.updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get user details error:', error);
    next(error);
  }
};

// Update user role
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const db = getFirestore();
    
    if (!['user', 'staff', 'officer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: user, staff, or officer'
      });
    }
    
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    const previousRole = userData.role;
    
    await db.collection(COLLECTIONS.USERS).doc(userId).update({
      role,
      updatedAt: new Date(),
      roleUpdatedBy: req.user.uid
    });
    
    await createAuditLog({
      action: 'USER_ROLE_UPDATED',
      userId: req.user.uid,
      resourceId: userId,
      resourceType: 'user',
      details: {
        userEmail: userData.email,
        previousRole,
        newRole: role
      },
      ipAddress: req.ip
    });
    
    logger.info(`User role updated: ${userData.email} from ${previousRole} to ${role} by ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        userId,
        previousRole,
        newRole: role
      }
    });
  } catch (error) {
    logger.error('Update user role error:', error);
    next(error);
  }
};

// Toggle user status
const toggleUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const db = getFirestore();
    
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userData = userDoc.data();
    const newStatus = !userData.isActive;
    
    await db.collection(COLLECTIONS.USERS).doc(userId).update({
      isActive: newStatus,
      updatedAt: new Date(),
      statusUpdatedBy: req.user.uid
    });
    
    await createAuditLog({
      action: 'USER_STATUS_TOGGLED',
      userId: req.user.uid,
      resourceId: userId,
      resourceType: 'user',
      details: {
        userEmail: userData.email,
        previousStatus: userData.isActive,
        newStatus
      },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: {
        userId,
        isActive: newStatus
      }
    });
  } catch (error) {
    logger.error('Toggle user status error:', error);
    next(error);
  }
};

// === SCHEME MANAGEMENT ===

// Create new scheme
const createScheme = async (req, res, next) => {
  try {
    const { name, description, eligibility, benefits, applicationProcess, documents, validity } = req.body;
    const db = getFirestore();
    
    const schemeId = uuidv4();
    const newScheme = {
      id: schemeId,
      name,
      description,
      eligibility: eligibility || [],
      benefits: benefits || [],
      applicationProcess: applicationProcess || '',
      requiredDocuments: documents || [],
      validity: {
        startDate: validity?.startDate ? new Date(validity.startDate) : new Date(),
        endDate: validity?.endDate ? new Date(validity.endDate) : null
      },
      isActive: true,
      createdBy: req.user.uid,
      createdByName: `${req.user.firstName} ${req.user.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('schemes').doc(schemeId).set(newScheme);
    
    await createAuditLog({
      action: 'SCHEME_CREATED',
      userId: req.user.uid,
      resourceId: schemeId,
      resourceType: 'scheme',
      details: { schemeName: name },
      ipAddress: req.ip
    });
    
    logger.info(`Scheme created: ${name} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: {
        schemeId,
        name,
        createdAt: newScheme.createdAt
      }
    });
  } catch (error) {
    logger.error('Create scheme error:', error);
    next(error);
  }
};

// Get all schemes
const getAllSchemes = async (req, res, next) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;
    const db = getFirestore();
    
    let schemesQuery = db.collection('schemes').orderBy('createdAt', 'desc');
    
    if (isActive !== undefined) {
      schemesQuery = schemesQuery.where('isActive', '==', isActive === 'true');
    }
    
    const snapshot = await schemesQuery.get();
    const schemes = [];
    
    snapshot.forEach(doc => {
      const schemeData = doc.data();
      schemes.push({
        id: doc.id,
        ...schemeData,
        createdAt: schemeData.createdAt.toDate(),
        updatedAt: schemeData.updatedAt.toDate(),
        validity: {
          startDate: schemeData.validity?.startDate?.toDate(),
          endDate: schemeData.validity?.endDate?.toDate()
        }
      });
    });
    
    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedSchemes = schemes.slice(startIndex, endIndex);
    
    res.status(200).json({
      success: true,
      count: paginatedSchemes.length,
      totalCount: schemes.length,
      totalPages: Math.ceil(schemes.length / parseInt(limit)),
      currentPage: parseInt(page),
      data: paginatedSchemes
    });
  } catch (error) {
    logger.error('Get all schemes error:', error);
    next(error);
  }
};

// === AUDIT & REPORTS ===

// Get audit logs (wrapper for existing auditLogger functionality)
const getAuditLogsController = async (req, res, next) => {
  try {
    const options = {
      userId: req.query.userId,
      action: req.query.action,
      resourceType: req.query.resourceType,
      startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
      limit: parseInt(req.query.limit) || 50,
      startAfter: req.query.startAfter
    };
    
    const auditLogs = await getAuditLogs(options);
    
    await createAuditLog({
      action: 'AUDIT_LOGS_VIEWED',
      userId: req.user.uid,
      details: { filters: options },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      count: auditLogs.length,
      data: auditLogs
    });
  } catch (error) {
    logger.error('Get audit logs error:', error);
    next(error);
  }
};

// Generate reports
const generateReport = async (req, res, next) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, format = 'json' } = req.query;
    
    const reportData = await generateReportData(reportType, startDate, endDate);
    
    await createAuditLog({
      action: 'REPORT_GENERATED',
      userId: req.user.uid,
      details: { reportType, format, dateRange: { startDate, endDate } },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      reportType,
      generatedAt: new Date(),
      data: reportData
    });
  } catch (error) {
    logger.error('Generate report error:', error);
    next(error);
  }
};

// Export data
const exportData = async (req, res, next) => {
  try {
    const { dataType } = req.params;
    const { format = 'csv', filters } = req.query;
    
    // This would typically generate and return a file
    // For now, we'll return a success message
    
    await createAuditLog({
      action: 'DATA_EXPORTED',
      userId: req.user.uid,
      details: { dataType, format, filters },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      message: `${dataType} data export initiated`,
      format,
      exportedAt: new Date()
    });
  } catch (error) {
    logger.error('Export data error:', error);
    next(error);
  }
};

// === HELPER FUNCTIONS ===

// Additional controller methods would be implemented here for other routes
const getApplicationDetailsAdmin = async (req, res, next) => {
  // Implementation similar to staff controller but with admin privileges
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const updateApplicationStatusAdmin = async (req, res, next) => {
  // Implementation similar to staff controller but with admin privileges
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const createStaffAccount = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const getAllStaff = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const updateStaffDetails = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const deleteStaffAccount = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const updateScheme = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

const deleteScheme = async (req, res, next) => {
  res.status(501).json({ success: false, message: 'Method not implemented yet' });
};

// Helper functions
const getSystemStatistics = async (db) => {
  try {
    // Implementation for getting comprehensive system statistics
    const totalUsers = (await db.collection(COLLECTIONS.USERS).get()).size;
    const totalServices = (await db.collection(COLLECTIONS.SERVICES).get()).size;
    const totalApplications = (await db.collection(COLLECTIONS.APPLICATIONS).get()).size;
    const activeServices = (await db.collection(COLLECTIONS.SERVICES).where('isActive', '==', true).get()).size;
    
    return {
      totalUsers,
      totalServices,
      totalApplications,
      activeServices,
      timestamp: new Date()
    };
  } catch (error) {
    logger.error('Get system statistics error:', error);
    return {};
  }
};

const getRecentActivities = async (db, limit = 10) => {
  try {
    // Get recent audit logs
    const auditLogs = await getAuditLogs({ limit });
    return auditLogs;
  } catch (error) {
    logger.error('Get recent activities error:', error);
    return [];
  }
};

const getPendingActions = async (db) => {
  try {
    const pendingApplications = (await db.collection(COLLECTIONS.APPLICATIONS).where('status', '==', 'pending').get()).size;
    const underReviewApplications = (await db.collection(COLLECTIONS.APPLICATIONS).where('status', '==', 'under_review').get()).size;
    
    return {
      pendingApplications,
      underReviewApplications
    };
  } catch (error) {
    logger.error('Get pending actions error:', error);
    return {};
  }
};

const generateAnalytics = async (db, period, type) => {
  // Implementation for generating analytics data
  return {
    period,
    type,
    data: {},
    generatedAt: new Date()
  };
};

const getServiceStats = async (db, serviceId) => {
  try {
    const applicationsCount = (await db.collection(COLLECTIONS.APPLICATIONS).where('serviceId', '==', serviceId).get()).size;
    return { applicationsCount };
  } catch (error) {
    return { applicationsCount: 0 };
  }
};

const getServiceDetailedStats = async (db, serviceId) => {
  try {
    const applicationsSnapshot = await db.collection(COLLECTIONS.APPLICATIONS).where('serviceId', '==', serviceId).get();
    const statusCounts = {};
    
    applicationsSnapshot.forEach(doc => {
      const status = doc.data().status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return {
      totalApplications: applicationsSnapshot.size,
      statusBreakdown: statusCounts
    };
  } catch (error) {
    return { totalApplications: 0, statusBreakdown: {} };
  }
};

const getObjectChanges = (oldObj, newObj) => {
  const changes = {};
  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      changes[key] = { from: oldObj[key], to: newObj[key] };
    }
  }
  return changes;
};

const generateReportData = async (reportType, startDate, endDate) => {
  // Implementation for generating different types of reports
  return {
    reportType,
    dateRange: { startDate, endDate },
    data: [],
    summary: {}
  };
};

module.exports = {
  getAdminDashboard,
  getSystemAnalytics,
  createService,
  getAllServicesAdmin,
  getServiceDetailsAdmin,
  updateService,
  deleteService,
  toggleServiceStatus,
  getAllApplications,
  getApplicationDetailsAdmin,
  updateApplicationStatusAdmin,
  bulkUpdateApplicationStatus,
  deleteApplication,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  toggleUserStatus,
  createStaffAccount,
  getAllStaff,
  updateStaffDetails,
  deleteStaffAccount,
  createScheme,
  getAllSchemes,
  updateScheme,
  deleteScheme,
  getAuditLogsController,
  generateReport,
  exportData
};
