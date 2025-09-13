const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { applicationSchema } = require('../utils/validationSchemas');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @desc    Search services
// @route   GET /api/users/services/search
// @access  Private (User)
router.get('/services/search', authorize('user', 'staff', 'officer', 'admin'), userController.searchServices);

// @desc    Get all services
// @route   GET /api/users/services
// @access  Private (User)
router.get('/services', authorize('user', 'staff', 'officer', 'admin'), userController.getAllServices);

// @desc    Get service details
// @route   GET /api/users/services/:serviceId
// @access  Private (User)
router.get('/services/:serviceId', authorize('user', 'staff', 'officer', 'admin'), userController.getServiceDetails);

// @desc    Submit application for service
// @route   POST /api/users/applications
// @access  Private (User)
router.post('/applications', authorize('user'), validateRequest(applicationSchema), userController.submitApplication);

// @desc    Get user's applications
// @route   GET /api/users/applications
// @access  Private (User)
router.get('/applications', authorize('user', 'staff', 'officer', 'admin'), userController.getUserApplications);

// @desc    Get application details
// @route   GET /api/users/applications/:applicationId
// @access  Private (User)
router.get('/applications/:applicationId', authorize('user', 'staff', 'officer', 'admin'), userController.getApplicationDetails);

// @desc    Get application status
// @route   GET /api/users/applications/:applicationId/status
// @access  Private (User)
router.get('/applications/:applicationId/status', authorize('user', 'staff', 'officer', 'admin'), userController.getApplicationStatus);

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private (User)
router.get('/notifications', authorize('user'), userController.getUserNotifications);

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:notificationId/read
// @access  Private (User)
router.put('/notifications/:notificationId/read', authorize('user'), userController.markNotificationAsRead);

// @desc    Delete notification
// @route   DELETE /api/users/notifications/:notificationId
// @access  Private (User)
router.delete('/notifications/:notificationId', authorize('user'), userController.deleteNotification);

module.exports = router;
