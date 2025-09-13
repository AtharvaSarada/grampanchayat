const { getFirestore, COLLECTIONS } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { createAuditLog } = require('../utils/auditLogger');

// Get staff dashboard data
const getDashboard = async (req, res, next) => {
  try {
    const db = getFirestore();
    
    // Get applications statistics
    const applicationsStats = await getApplicationsStatsData(db, req.user);
    
    // Get recent applications
    const recentApplicationsQuery = db.collection(COLLECTIONS.APPLICATIONS)
      .orderBy('createdAt', 'desc')
      .limit(5);
    
    const recentSnapshot = await recentApplicationsQuery.get();
    const recentApplications = [];
    
    // Get service details for each recent application
    for (const doc of recentSnapshot.docs) {
      const appData = doc.data();
      const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(appData.serviceId).get();
      
      recentApplications.push({
        id: doc.id,
        ...appData,
        serviceDetails: serviceDoc.exists ? {
          id: serviceDoc.id,
          name: serviceDoc.data().name,
          category: serviceDoc.data().category
        } : null,
        createdAt: appData.createdAt.toDate(),
        updatedAt: appData.updatedAt.toDate()
      });
    }
    
    // Get pending notifications count
    const notificationsQuery = db.collection(COLLECTIONS.NOTIFICATIONS)
      .where('userId', '==', req.user.uid)
      .where('isRead', '==', false);
    const notificationsSnapshot = await notificationsQuery.get();
    
    await createAuditLog({
      action: 'STAFF_DASHBOARD_VIEWED',
      userId: req.user.uid,
      details: { role: req.user.role },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      data: {
        statistics: applicationsStats,
        recentApplications,
        unreadNotifications: notificationsSnapshot.size,
        userInfo: {
          role: req.user.role,
          name: `${req.user.firstName} ${req.user.lastName}`,
          email: req.user.email
        }
      }
    });
  } catch (error) {
    logger.error('Get staff dashboard error:', error);
    next(error);
  }
};

// Get all services
const getAllServices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, isActive } = req.query;
    const db = getFirestore();
    
    let servicesQuery = db.collection(COLLECTIONS.SERVICES)
      .orderBy('createdAt', 'desc');
    
    // Apply filters
    if (category) {
      servicesQuery = servicesQuery.where('category', '==', category);
    }
    
    if (isActive !== undefined) {
      servicesQuery = servicesQuery.where('isActive', '==', isActive === 'true');
    }
    
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
    
    // Get application count for each service
    for (const doc of snapshot.docs) {
      const serviceData = doc.data();
      const applicationsCount = await getServiceApplicationCount(db, doc.id);
      
      services.push({
        id: doc.id,
        ...serviceData,
        applicationsCount,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      });
    }
    
    res.status(200).json({
      success: true,
      count: services.length,
      currentPage: parseInt(page),
      data: services
    });
  } catch (error) {
    logger.error('Get all services error:', error);
    next(error);
  }
};

// Get service details
const getServiceDetails = async (req, res, next) => {
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
    
    // Get applications count and recent applications for this service
    const applicationsCount = await getServiceApplicationCount(db, serviceId);
    
    const recentApplicationsQuery = db.collection(COLLECTIONS.APPLICATIONS)
      .where('serviceId', '==', serviceId)
      .orderBy('createdAt', 'desc')
      .limit(10);
    
    const recentSnapshot = await recentApplicationsQuery.get();
    const recentApplications = [];
    
    recentSnapshot.forEach(doc => {
      const appData = doc.data();
      recentApplications.push({
        id: doc.id,
        applicantId: appData.applicantId,
        applicantDetails: appData.applicantDetails,
        status: appData.status,
        createdAt: appData.createdAt.toDate()
      });
    });
    
    await createAuditLog({
      action: 'SERVICE_DETAILS_VIEWED',
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
        applicationsCount,
        recentApplications,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get service details error:', error);
    next(error);
  }
};

// Get applications
const getApplications = async (req, res, next) => {
  try {
    const { status, serviceId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const db = getFirestore();
    
    let applicationsQuery = db.collection(COLLECTIONS.APPLICATIONS);
    
    // Apply filters
    if (status) {
      applicationsQuery = applicationsQuery.where('status', '==', status);
    }
    
    if (serviceId) {
      applicationsQuery = applicationsQuery.where('serviceId', '==', serviceId);
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
    
    // Get service details for each application
    for (const doc of snapshot.docs) {
      const appData = doc.data();
      const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(appData.serviceId).get();
      
      applications.push({
        id: doc.id,
        ...appData,
        serviceDetails: serviceDoc.exists ? {
          id: serviceDoc.id,
          name: serviceDoc.data().name,
          category: serviceDoc.data().category
        } : null,
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
    logger.error('Get applications error:', error);
    next(error);
  }
};

// Get application details
const getApplicationDetails = async (req, res, next) => {
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
    
    const appData = applicationDoc.data();
    
    // Get service details
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(appData.serviceId).get();
    
    // Get applicant details
    const applicantDoc = await db.collection(COLLECTIONS.USERS).doc(appData.applicantId).get();
    
    await createAuditLog({
      action: 'APPLICATION_DETAILS_VIEWED',
      userId: req.user.uid,
      resourceId: applicationId,
      resourceType: 'application',
      details: { status: appData.status, viewedBy: req.user.role },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: applicationDoc.id,
        ...appData,
        serviceDetails: serviceDoc.exists ? serviceDoc.data() : null,
        applicantProfile: applicantDoc.exists ? {
          uid: applicantDoc.data().uid,
          email: applicantDoc.data().email,
          firstName: applicantDoc.data().firstName,
          lastName: applicantDoc.data().lastName,
          phoneNumber: applicantDoc.data().phoneNumber
        } : null,
        createdAt: appData.createdAt.toDate(),
        updatedAt: appData.updatedAt.toDate(),
        statusHistory: appData.statusHistory.map(entry => ({
          ...entry,
          timestamp: entry.timestamp.toDate()
        }))
      }
    });
  } catch (error) {
    logger.error('Get application details error:', error);
    next(error);
  }
};

// Update application status
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status, remarks } = req.body;
    const db = getFirestore();
    
    const applicationDoc = await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).get();
    
    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const currentData = applicationDoc.data();
    
    // Create new status history entry
    const newStatusEntry = {
      status,
      timestamp: new Date(),
      remarks: remarks || '',
      reviewedBy: req.user.uid,
      reviewerName: `${req.user.firstName} ${req.user.lastName}`,
      reviewerRole: req.user.role
    };
    
    const updatedStatusHistory = [...(currentData.statusHistory || []), newStatusEntry];
    
    // Update application
    await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).update({
      status,
      statusHistory: updatedStatusHistory,
      updatedAt: new Date(),
      lastReviewedBy: req.user.uid,
      lastReviewedAt: new Date()
    });
    
    // Create notification for applicant
    await createNotificationForApplicant(currentData.applicantId, {
      title: 'Application Status Updated',
      message: `Your application status has been updated to: ${status.replace('_', ' ').toUpperCase()}`,
      type: 'status_update',
      relatedId: applicationId
    });
    
    // Get service details for logging
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(currentData.serviceId).get();
    
    await createAuditLog({
      action: 'APPLICATION_STATUS_UPDATED',
      userId: req.user.uid,
      resourceId: applicationId,
      resourceType: 'application',
      details: {
        previousStatus: currentData.status,
        newStatus: status,
        serviceName: serviceDoc.exists ? serviceDoc.data().name : 'Unknown',
        applicantId: currentData.applicantId,
        remarks
      },
      ipAddress: req.ip
    });
    
    logger.info(`Application ${applicationId} status updated from ${currentData.status} to ${status} by ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: {
        applicationId,
        previousStatus: currentData.status,
        newStatus: status,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Update application status error:', error);
    next(error);
  }
};

// Add comment to application
const addApplicationComment = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { comment } = req.body;
    const db = getFirestore();
    
    const applicationDoc = await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).get();
    
    if (!applicationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    const currentData = applicationDoc.data();
    const newComment = {
      id: Date.now().toString(),
      comment,
      addedBy: req.user.uid,
      addedByName: `${req.user.firstName} ${req.user.lastName}`,
      addedByRole: req.user.role,
      timestamp: new Date()
    };
    
    const updatedComments = [...(currentData.comments || []), newComment];
    
    await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).update({
      comments: updatedComments,
      updatedAt: new Date()
    });
    
    await createAuditLog({
      action: 'APPLICATION_COMMENT_ADDED',
      userId: req.user.uid,
      resourceId: applicationId,
      resourceType: 'application',
      details: { comment: comment.substring(0, 100) },
      ipAddress: req.ip
    });
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment
    });
  } catch (error) {
    logger.error('Add application comment error:', error);
    next(error);
  }
};

// Get application history
const getApplicationHistory = async (req, res, next) => {
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
    
    const appData = applicationDoc.data();
    
    res.status(200).json({
      success: true,
      data: {
        applicationId,
        statusHistory: appData.statusHistory.map(entry => ({
          ...entry,
          timestamp: entry.timestamp.toDate()
        })),
        comments: (appData.comments || []).map(comment => ({
          ...comment,
          timestamp: comment.timestamp.toDate()
        }))
      }
    });
  } catch (error) {
    logger.error('Get application history error:', error);
    next(error);
  }
};

// Get applications statistics
const getApplicationsStats = async (req, res, next) => {
  try {
    const db = getFirestore();
    const stats = await getApplicationsStatsData(db, req.user);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Get applications stats error:', error);
    next(error);
  }
};

// Search applications
const searchApplications = async (req, res, next) => {
  try {
    const { query, status, serviceId, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
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
    
    applicationsQuery = applicationsQuery.orderBy('createdAt', 'desc');
    
    const snapshot = await applicationsQuery.get();
    let applications = [];
    
    // Get service details for each application
    for (const doc of snapshot.docs) {
      const appData = doc.data();
      const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(appData.serviceId).get();
      
      applications.push({
        id: doc.id,
        ...appData,
        serviceDetails: serviceDoc.exists ? {
          id: serviceDoc.id,
          name: serviceDoc.data().name,
          category: serviceDoc.data().category
        } : null,
        createdAt: appData.createdAt.toDate(),
        updatedAt: appData.updatedAt.toDate()
      });
    }
    
    // Apply text search filter (client-side)
    if (query) {
      const searchQuery = query.toLowerCase();
      applications = applications.filter(app => 
        app.applicantDetails.firstName.toLowerCase().includes(searchQuery) ||
        app.applicantDetails.lastName.toLowerCase().includes(searchQuery) ||
        app.applicantDetails.email.toLowerCase().includes(searchQuery) ||
        (app.serviceDetails && app.serviceDetails.name.toLowerCase().includes(searchQuery))
      );
    }
    
    // Apply pagination to filtered results
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedApplications = applications.slice(startIndex, endIndex);
    
    await createAuditLog({
      action: 'APPLICATIONS_SEARCHED',
      userId: req.user.uid,
      details: { query, status, resultsCount: applications.length },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      count: paginatedApplications.length,
      totalCount: applications.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(applications.length / parseInt(limit)),
      data: paginatedApplications
    });
  } catch (error) {
    logger.error('Search applications error:', error);
    next(error);
  }
};

// Get staff notifications
const getStaffNotifications = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const db = getFirestore();
    
    let notificationsQuery = db.collection(COLLECTIONS.NOTIFICATIONS)
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');
    
    if (isRead !== undefined) {
      notificationsQuery = notificationsQuery.where('isRead', '==', isRead === 'true');
    }
    
    const snapshot = await notificationsQuery.limit(parseInt(limit)).get();
    const notifications = [];
    
    snapshot.forEach(doc => {
      const notificationData = doc.data();
      notifications.push({
        id: doc.id,
        ...notificationData,
        createdAt: notificationData.createdAt.toDate(),
        updatedAt: notificationData.updatedAt.toDate()
      });
    });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error('Get staff notifications error:', error);
    next(error);
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const db = getFirestore();
    
    const notificationDoc = await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notificationId).get();
    
    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    const notificationData = notificationDoc.data();
    
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notificationId).update({
      isRead: true,
      updatedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Mark notification as read error:', error);
    next(error);
  }
};

// Helper functions
const getApplicationsStatsData = async (db, user) => {
  try {
    const applicationsCollection = db.collection(COLLECTIONS.APPLICATIONS);
    
    // Get total applications count
    const totalSnapshot = await applicationsCollection.get();
    
    // Get status-wise counts
    const pendingSnapshot = await applicationsCollection.where('status', '==', 'pending').get();
    const underReviewSnapshot = await applicationsCollection.where('status', '==', 'under_review').get();
    const approvedSnapshot = await applicationsCollection.where('status', '==', 'approved').get();
    const rejectedSnapshot = await applicationsCollection.where('status', '==', 'rejected').get();
    const completedSnapshot = await applicationsCollection.where('status', '==', 'completed').get();
    
    // Get today's applications
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySnapshot = await applicationsCollection.where('createdAt', '>=', today).get();
    
    // Get this week's applications
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSnapshot = await applicationsCollection.where('createdAt', '>=', weekAgo).get();
    
    return {
      total: totalSnapshot.size,
      pending: pendingSnapshot.size,
      underReview: underReviewSnapshot.size,
      approved: approvedSnapshot.size,
      rejected: rejectedSnapshot.size,
      completed: completedSnapshot.size,
      todaysApplications: todaySnapshot.size,
      thisWeeksApplications: weekSnapshot.size
    };
  } catch (error) {
    logger.error('Get applications stats data error:', error);
    return {
      total: 0,
      pending: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      todaysApplications: 0,
      thisWeeksApplications: 0
    };
  }
};

const getServiceApplicationCount = async (db, serviceId) => {
  try {
    const applicationsSnapshot = await db.collection(COLLECTIONS.APPLICATIONS)
      .where('serviceId', '==', serviceId)
      .get();
    return applicationsSnapshot.size;
  } catch (error) {
    logger.error('Get service application count error:', error);
    return 0;
  }
};

const createNotificationForApplicant = async (userId, notificationData) => {
  try {
    const db = getFirestore();
    
    const notification = {
      userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'general',
      relatedId: notificationData.relatedId || null,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection(COLLECTIONS.NOTIFICATIONS).add(notification);
    logger.info(`Notification created for applicant ${userId}: ${notificationData.title}`);
  } catch (error) {
    logger.error('Create notification for applicant error:', error);
  }
};

module.exports = {
  getDashboard,
  getAllServices,
  getServiceDetails,
  getApplications,
  getApplicationDetails,
  updateApplicationStatus,
  addApplicationComment,
  getApplicationHistory,
  getApplicationsStats,
  searchApplications,
  getStaffNotifications,
  markNotificationAsRead
};
