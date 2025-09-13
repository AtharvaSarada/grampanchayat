const express = require('express');
const authController = require('../controllers/authController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { registerSchema, loginSchema, profileUpdateSchema, passwordChangeSchema } = require('../utils/validationSchemas');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRequest(registerSchema), authController.register);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', validateRequest(loginSchema), authController.login);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', optionalAuth, authController.logout);

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticate, authController.getProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticate, validateRequest(profileUpdateSchema), authController.updateProfile);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', authenticate, validateRequest(passwordChangeSchema), authController.changePassword);

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', authController.forgotPassword);

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', authController.resetPassword);

module.exports = router;
