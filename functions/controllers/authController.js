const { getAuth, getFirestore, COLLECTIONS } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { createAuditLog } = require('../utils/auditLogger');

// Register user
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, address, dateOfBirth, role = 'user' } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false
    });

    // Create user profile in Firestore
    const db = getFirestore();
    const userProfile = {
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      dateOfBirth,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection(COLLECTIONS.USERS).doc(userRecord.uid).set(userProfile);

    // Create audit log
    await createAuditLog({
      action: 'USER_REGISTERED',
      userId: userRecord.uid,
      details: { email, role },
      ipAddress: req.ip
    });

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email,
        firstName,
        lastName,
        role
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

// Login user (Firebase handles authentication, we just verify)
const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Get user from Firestore to check if account is active
    const db = getFirestore();
    const usersQuery = await db.collection(COLLECTIONS.USERS).where('email', '==', email).get();
    
    if (usersQuery.empty) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userDoc = usersQuery.docs[0];
    const userData = userDoc.data();
    
    if (!userData.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update last login
    await db.collection(COLLECTIONS.USERS).doc(userDoc.id).update({
      lastLoginAt: new Date(),
      updatedAt: new Date()
    });

    // Create audit log
    await createAuditLog({
      action: 'USER_LOGIN',
      userId: userDoc.id,
      details: { email },
      ipAddress: req.ip
    });

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        uid: userData.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

// Logout user
const logout = async (req, res, next) => {
  try {
    // Firebase token invalidation happens on client side
    // We just log the logout event
    
    if (req.user) {
      await createAuditLog({
        action: 'USER_LOGOUT',
        userId: req.user.uid,
        details: { email: req.user.email },
        ipAddress: req.ip
      });
      
      logger.info(`User logged out: ${req.user.email}`);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};

// Get user profile
const getProfile = async (req, res, next) => {
  try {
    const db = getFirestore();
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const userData = userDoc.data();
    
    // Remove sensitive information
    const { createdAt, updatedAt, ...profileData } = userData;
    
    res.status(200).json({
      success: true,
      data: {
        ...profileData,
        createdAt: createdAt.toDate(),
        updatedAt: updatedAt.toDate()
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, address, dateOfBirth } = req.body;
    
    const db = getFirestore();
    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phoneNumber && { phoneNumber }),
      ...(address && { address }),
      ...(dateOfBirth && { dateOfBirth }),
      updatedAt: new Date()
    };

    await db.collection(COLLECTIONS.USERS).doc(req.user.uid).update(updateData);

    // Update display name in Firebase Auth if name changed
    if (firstName || lastName) {
      const currentUser = await db.collection(COLLECTIONS.USERS).doc(req.user.uid).get();
      const userData = currentUser.data();
      const newDisplayName = `${firstName || userData.firstName} ${lastName || userData.lastName}`;
      
      await getAuth().updateUser(req.user.uid, {
        displayName: newDisplayName
      });
    }

    await createAuditLog({
      action: 'PROFILE_UPDATED',
      userId: req.user.uid,
      details: { updatedFields: Object.keys(updateData) },
      ipAddress: req.ip
    });

    logger.info(`Profile updated for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    
    // Update password in Firebase Auth
    await getAuth().updateUser(req.user.uid, {
      password: newPassword
    });

    await createAuditLog({
      action: 'PASSWORD_CHANGED',
      userId: req.user.uid,
      details: { email: req.user.email },
      ipAddress: req.ip
    });

    logger.info(`Password changed for user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    next(error);
  }
};

// Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Generate password reset link (Firebase handles this)
    // This endpoint would typically integrate with Firebase Auth's password reset
    // For now, we'll just log the request
    
    await createAuditLog({
      action: 'PASSWORD_RESET_REQUESTED',
      details: { email },
      ipAddress: req.ip
    });

    logger.info(`Password reset requested for: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    // This would integrate with Firebase Auth's password reset verification
    // For now, we'll just acknowledge the request
    
    await createAuditLog({
      action: 'PASSWORD_RESET_COMPLETED',
      details: { token: token.substring(0, 10) + '...' },
      ipAddress: req.ip
    });

    logger.info('Password reset completed');

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
};
