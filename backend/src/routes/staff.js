const express = require('express');
const staffController = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { applicationStatusSchema } = require('../utils/validationSchemas');

const router = express.Router();

// All routes require authentication and staff/officer/admin role
router.use(authenticate);
router.use(authorize('staff', 'officer', 'admin'));

// @desc    Get staff dashboard data
// @route   GET /api/staff/dashboard
// @access  Private (Staff/Officer/Admin)
router.get('/dashboard', staffController.getDashboard);

// @desc    Get all services
// @route   GET /api/staff/services
// @access  Private (Staff/Officer/Admin)
router.get('/services', staffController.getAllServices);

// @desc    Get service details
// @route   GET /api/staff/services/:serviceId
// @access  Private (Staff/Officer/Admin)
router.get('/services/:serviceId', staffController.getServiceDetails);

// @desc    Get applications assigned to staff/all applications
// @route   GET /api/staff/applications
// @access  Private (Staff/Officer/Admin)
router.get('/applications', staffController.getApplications);

// @desc    Get application details
// @route   GET /api/staff/applications/:applicationId
// @access  Private (Staff/Officer/Admin)
router.get('/applications/:applicationId', staffController.getApplicationDetails);

// @desc    Update application status
// @route   PUT /api/staff/applications/:applicationId/status
// @access  Private (Staff/Officer/Admin)
router.put('/applications/:applicationId/status', validateRequest(applicationStatusSchema), staffController.updateApplicationStatus);

// @desc    Add comment to application
// @route   POST /api/staff/applications/:applicationId/comments
// @access  Private (Staff/Officer/Admin)
router.post('/applications/:applicationId/comments', staffController.addApplicationComment);

// @desc    Get application history
// @route   GET /api/staff/applications/:applicationId/history
// @access  Private (Staff/Officer/Admin)
router.get('/applications/:applicationId/history', staffController.getApplicationHistory);

// @desc    Get applications statistics
// @route   GET /api/staff/applications/stats
// @access  Private (Staff/Officer/Admin)
router.get('/applications/stats', staffController.getApplicationsStats);

// @desc    Search applications
// @route   GET /api/staff/applications/search
// @access  Private (Staff/Officer/Admin)
router.get('/applications/search', staffController.searchApplications);

// @desc    Get notifications for staff
// @route   GET /api/staff/notifications
// @access  Private (Staff/Officer/Admin)
router.get('/notifications', staffController.getStaffNotifications);

// @desc    Mark notification as read
// @route   PUT /api/staff/notifications/:notificationId/read
// @access  Private (Staff/Officer/Admin)
router.put('/notifications/:notificationId/read', staffController.markNotificationAsRead);

module.exports = router;
