const express = require('express');
const officerController = require('../controllers/officerController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { serviceSchema, applicationStatusSchema } = require('../utils/validationSchemas');

const router = express.Router();

// All routes require authentication and officer/admin role
router.use(authenticate);
router.use(authorize('officer', 'admin'));

// @desc    Get admin dashboard data
// @route   GET /api/officers/dashboard
// @access  Private (Officer/Admin)
router.get('/dashboard', officerController.getAdminDashboard);

// @desc    Get system analytics
// @route   GET /api/officers/analytics
// @access  Private (Officer/Admin)
router.get('/analytics', officerController.getSystemAnalytics);

// === SERVICE MANAGEMENT ===
// @desc    Create new service
// @route   POST /api/officers/services
// @access  Private (Officer/Admin)
router.post('/services', validateRequest(serviceSchema), officerController.createService);

// @desc    Get all services (including inactive)
// @route   GET /api/officers/services
// @access  Private (Officer/Admin)
router.get('/services', officerController.getAllServicesAdmin);

// @desc    Get service details
// @route   GET /api/officers/services/:serviceId
// @access  Private (Officer/Admin)
router.get('/services/:serviceId', officerController.getServiceDetailsAdmin);

// @desc    Update service
// @route   PUT /api/officers/services/:serviceId
// @access  Private (Officer/Admin)
router.put('/services/:serviceId', validateRequest(serviceSchema), officerController.updateService);

// @desc    Delete service
// @route   DELETE /api/officers/services/:serviceId
// @access  Private (Officer/Admin)
router.delete('/services/:serviceId', officerController.deleteService);

// @desc    Toggle service status
// @route   PATCH /api/officers/services/:serviceId/toggle-status
// @access  Private (Officer/Admin)
router.patch('/services/:serviceId/toggle-status', officerController.toggleServiceStatus);

// === APPLICATION MANAGEMENT ===
// @desc    Get all applications with advanced filtering
// @route   GET /api/officers/applications
// @access  Private (Officer/Admin)
router.get('/applications', officerController.getAllApplications);

// @desc    Get application details
// @route   GET /api/officers/applications/:applicationId
// @access  Private (Officer/Admin)
router.get('/applications/:applicationId', officerController.getApplicationDetailsAdmin);

// @desc    Update application status
// @route   PUT /api/officers/applications/:applicationId/status
// @access  Private (Officer/Admin)
router.put('/applications/:applicationId/status', validateRequest(applicationStatusSchema), officerController.updateApplicationStatusAdmin);

// @desc    Bulk update application status
// @route   PUT /api/officers/applications/bulk-status-update
// @access  Private (Officer/Admin)
router.put('/applications/bulk-status-update', officerController.bulkUpdateApplicationStatus);

// @desc    Delete application
// @route   DELETE /api/officers/applications/:applicationId
// @access  Private (Officer/Admin)
router.delete('/applications/:applicationId', officerController.deleteApplication);

// === USER MANAGEMENT ===
// @desc    Get all users
// @route   GET /api/officers/users
// @access  Private (Officer/Admin)
router.get('/users', officerController.getAllUsers);

// @desc    Get user details
// @route   GET /api/officers/users/:userId
// @access  Private (Officer/Admin)
router.get('/users/:userId', officerController.getUserDetails);

// @desc    Update user role
// @route   PATCH /api/officers/users/:userId/role
// @access  Private (Admin only)
router.patch('/users/:userId/role', authorize('admin'), officerController.updateUserRole);

// @desc    Toggle user active status
// @route   PATCH /api/officers/users/:userId/toggle-status
// @access  Private (Officer/Admin)
router.patch('/users/:userId/toggle-status', officerController.toggleUserStatus);

// === STAFF MANAGEMENT ===
// @desc    Create staff account
// @route   POST /api/officers/staff
// @access  Private (Officer/Admin)
router.post('/staff', officerController.createStaffAccount);

// @desc    Get all staff members
// @route   GET /api/officers/staff
// @access  Private (Officer/Admin)
router.get('/staff', officerController.getAllStaff);

// @desc    Update staff details
// @route   PUT /api/officers/staff/:staffId
// @access  Private (Officer/Admin)
router.put('/staff/:staffId', officerController.updateStaffDetails);

// @desc    Delete staff account
// @route   DELETE /api/officers/staff/:staffId
// @access  Private (Officer/Admin)
router.delete('/staff/:staffId', officerController.deleteStaffAccount);

// === SCHEME MANAGEMENT ===
// @desc    Create new scheme
// @route   POST /api/officers/schemes
// @access  Private (Officer/Admin)
router.post('/schemes', officerController.createScheme);

// @desc    Get all schemes
// @route   GET /api/officers/schemes
// @access  Private (Officer/Admin)
router.get('/schemes', officerController.getAllSchemes);

// @desc    Update scheme
// @route   PUT /api/officers/schemes/:schemeId
// @access  Private (Officer/Admin)
router.put('/schemes/:schemeId', officerController.updateScheme);

// @desc    Delete scheme
// @route   DELETE /api/officers/schemes/:schemeId
// @access  Private (Officer/Admin)
router.delete('/schemes/:schemeId', officerController.deleteScheme);

// === REPORTS & AUDIT ===
// @desc    Get audit logs
// @route   GET /api/officers/audit-logs
// @access  Private (Officer/Admin)
router.get('/audit-logs', officerController.getAuditLogsController);

// @desc    Generate reports
// @route   GET /api/officers/reports/:reportType
// @access  Private (Officer/Admin)
router.get('/reports/:reportType', officerController.generateReport);

// @desc    Export data
// @route   GET /api/officers/export/:dataType
// @access  Private (Officer/Admin)
router.get('/export/:dataType', officerController.exportData);

module.exports = router;
