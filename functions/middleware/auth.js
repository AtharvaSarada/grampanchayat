const jwt = require('jsonwebtoken');
const { getAuth, getFirestore, COLLECTIONS } = require('../config/firebase');
const { logger } = require('../utils/logger');

// Verify JWT token and Firebase token
const authenticate = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Extract token from "Bearer <token>"
    if (token.startsWith('Bearer ')) {
      token = token.slice(7);
    }

    // Verify Firebase token
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Get user from Firestore
    const db = getFirestore();
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();
    
    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userData.role,
      ...userData
    };

    logger.info(`User ${req.user.email} authenticated with role: ${req.user.role}`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by ${req.user.email} with role ${req.user.role} to endpoint requiring roles: ${roles.join(', ')}`);
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user owns resource or has admin privileges
const authorizeOwnerOrAdmin = (resourceUserIdPath = 'params.userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get the resource user ID from the specified path
    const pathParts = resourceUserIdPath.split('.');
    let resourceUserId = req;
    
    for (const part of pathParts) {
      resourceUserId = resourceUserId[part];
    }

    // Allow if user owns the resource or is admin/officer
    if (req.user.uid === resourceUserId || ['admin', 'officer'].includes(req.user.role)) {
      return next();
    }

    logger.warn(`Unauthorized resource access attempt by ${req.user.email}`);
    res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.slice(7); // Remove "Bearer "
    
    if (!token) {
      return next();
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const db = getFirestore();
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(decodedToken.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: userData.role,
        ...userData
      };
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
    logger.debug('Optional authentication failed:', error.message);
  }
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnerOrAdmin,
  optionalAuth
};
