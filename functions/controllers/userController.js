const { getFirestore, COLLECTIONS } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { createAuditLog } = require('../utils/auditLogger');
const { v4: uuidv4 } = require('uuid');

// Search services
const searchServices = async (req, res, next) => {
  try {
    const { query, category, minFees, maxFees, processingTime } = req.query;
    const db = getFirestore();
    
    let servicesQuery = db.collection(COLLECTIONS.SERVICES);
    
    // Apply filters
    if (category) {
      servicesQuery = servicesQuery.where('category', '==', category);
    }
    
    servicesQuery = servicesQuery.where('isActive', '==', true);
    
    const snapshot = await servicesQuery.get();
    let services = [];
    
    snapshot.forEach(doc => {
      const serviceData = doc.data();
      services.push({
        id: doc.id,
        ...serviceData,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      });
    });
    
    // Apply text search filter (client-side for Firestore)
    if (query) {
      const searchQuery = query.toLowerCase();
      services = services.filter(service => 
        service.name.toLowerCase().includes(searchQuery) ||
        service.description.toLowerCase().includes(searchQuery) ||
        service.category.toLowerCase().includes(searchQuery)
      );
    }
    
    // Apply fees filter
    if (minFees !== undefined) {
      services = services.filter(service => service.fees >= parseFloat(minFees));
    }
    
    if (maxFees !== undefined) {
      services = services.filter(service => service.fees <= parseFloat(maxFees));
    }
    
    // Apply processing time filter
    if (processingTime) {
      services = services.filter(service => service.processingTime === processingTime);
    }
    
    await createAuditLog({
      action: 'SERVICES_SEARCHED',
      userId: req.user.uid,
      details: { query, category, resultsCount: services.length },
      ipAddress: req.ip
    });
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    logger.error('Search services error:', error);
    next(error);
  }
};

// Get all services
const getAllServices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const db = getFirestore();
    
    let servicesQuery = db.collection(COLLECTIONS.SERVICES)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc');
    
    if (category) {
      servicesQuery = servicesQuery.where('category', '==', category);
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
    
    snapshot.forEach(doc => {
      const serviceData = doc.data();
      services.push({
        id: doc.id,
        ...serviceData,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      });
    });
    
    // Get total count for pagination
    const totalSnapshot = await db.collection(COLLECTIONS.SERVICES)
      .where('isActive', '==', true)
      .get();
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
    logger.error('Get all services error:', error);
    next(error);
  }
};

// Submit application for service
const submitApplication = async (req, res, next) => {
  try {
    const { serviceId, applicantDetails, additionalInfo, documents } = req.body;
    const db = getFirestore();
    
    // Verify service exists and is active
    const serviceDoc = await db.collection(COLLECTIONS.SERVICES).doc(serviceId).get();
    if (!serviceDoc.exists || !serviceDoc.data().isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or not available'
      });
    }
    
    const applicationId = uuidv4();
    const applicationData = {
      id: applicationId,
      serviceId,
      applicantId: req.user.uid,
      applicantDetails,
      additionalInfo: additionalInfo || {},
      documents: documents || [],
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        remarks: 'Application submitted'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection(COLLECTIONS.APPLICATIONS).doc(applicationId).set(applicationData);
    
    // Create notification for user
    await createNotification(req.user.uid, {
      title: 'Application Submitted',
      message: `Your application for ${serviceDoc.data().name} has been submitted successfully.`,
      type: 'application_submitted',
      relatedId: applicationId
    });
    
    await createAuditLog({
      action: 'APPLICATION_SUBMITTED',
      userId: req.user.uid,
      resourceId: applicationId,
      resourceType: 'application',
      details: { 
        serviceId, 
        serviceName: serviceDoc.data().name,
        applicantEmail: applicantDetails.email 
      },
      ipAddress: req.ip
    });
    
    logger.info(`Application submitted: ${applicationId} by ${req.user.email}`);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId,
        status: 'pending',
        createdAt: applicationData.createdAt
      }
    });
  } catch (error) {
    logger.error('Submit application error:', error);
    next(error);
  }
};

// Helper function to create notifications
const createNotification = async (userId, notificationData) => {
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
    logger.info(`Notification created for user ${userId}: ${notificationData.title}`);
  } catch (error) {
    logger.error('Create notification error:', error);
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
    
    res.status(200).json({
      success: true,
      data: {
        id: serviceDoc.id,
        ...serviceData,
        createdAt: serviceData.createdAt.toDate(),
        updatedAt: serviceData.updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get service details error:', error);
    next(error);
  }
};

// Get user's applications
const getUserApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const db = getFirestore();
    
    let applicationsQuery = db.collection(COLLECTIONS.APPLICATIONS)
      .where('applicantId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');
    
    if (status) {
      applicationsQuery = applicationsQuery.where('status', '==', status);
    }
    
    const snapshot = await applicationsQuery.limit(parseInt(limit)).get();
    const applications = [];
    
    snapshot.forEach(doc => {
      const appData = doc.data();
      applications.push({
        id: doc.id,
        ...appData,
        createdAt: appData.createdAt.toDate(),
        updatedAt: appData.updatedAt.toDate()
      });
    });
    
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    logger.error('Get user applications error:', error);
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
    
    // Check if user owns this application or has proper role
    if (appData.applicantId !== req.user.uid && !['staff', 'officer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: applicationDoc.id,
        ...appData,
        createdAt: appData.createdAt.toDate(),
        updatedAt: appData.updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get application details error:', error);
    next(error);
  }
};

// Get application status
const getApplicationStatus = async (req, res, next) => {
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
    
    // Check if user owns this application
    if (appData.applicantId !== req.user.uid && !['staff', 'officer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        applicationId: applicationDoc.id,
        status: appData.status,
        statusHistory: appData.statusHistory,
        lastUpdated: appData.updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get application status error:', error);
    next(error);
  }
};

// Get user notifications
const getUserNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const db = getFirestore();
    
    let notificationsQuery = db.collection(COLLECTIONS.NOTIFICATIONS)
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');
    
    if (unreadOnly === 'true') {
      notificationsQuery = notificationsQuery.where('isRead', '==', false);
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
    logger.error('Get user notifications error:', error);
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
    
    // Check if user owns this notification
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

// Delete notification
const deleteNotification = async (req, res, next) => {
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
    
    // Check if user owns this notification
    if (notificationData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await db.collection(COLLECTIONS.NOTIFICATIONS).doc(notificationId).delete();
    
    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    next(error);
  }
};

module.exports = {
  searchServices,
  getAllServices,
  getServiceDetails,
  submitApplication,
  getUserApplications,
  getApplicationDetails,
  getApplicationStatus,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  createNotification
};
