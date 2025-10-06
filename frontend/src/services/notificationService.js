import { db } from './firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  APPLICATION: 'application',
  USER: 'user',
  SERVICE: 'service'
};

// Create a new notification
export const createNotification = async ({
  userId,
  title,
  message,
  type = NOTIFICATION_TYPES.INFO,
  actionUrl = null,
  metadata = {}
}) => {
  try {
    const notification = {
      userId,
      title,
      message,
      type,
      actionUrl,
      metadata,
      read: false,
      createdAt: new Date(),
      readAt: null
    };

    const docRef = await addDoc(collection(db, 'notifications'), notification);
    
    // Show toast notification if user is currently active
    if (type === NOTIFICATION_TYPES.SUCCESS) {
      toast.success(title);
    } else if (type === NOTIFICATION_TYPES.ERROR) {
      toast.error(title);
    } else if (type === NOTIFICATION_TYPES.WARNING) {
      toast.warning(title);
    } else {
      toast(title);
    }

    return docRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send notification (alias for createNotification)
export const sendNotification = createNotification;

// Create notifications for multiple users
export const createBulkNotifications = async (notifications) => {
  try {
    const promises = notifications.map(notification => 
      createNotification(notification)
    );
    
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

// Application status change notifications
export const notifyApplicationStatusChange = async (application, newStatus, updatedBy) => {
  const statusMessages = {
    'Pending': 'Your application has been submitted and is pending review.',
    'Under Review': 'Your application is now under review by our staff.',
    'Approved': 'Congratulations! Your application has been approved.',
    'Rejected': 'Your application has been rejected. Please check the remarks for details.',
    'Completed': 'Your application has been completed successfully.'
  };

  const statusTypes = {
    'Pending': NOTIFICATION_TYPES.INFO,
    'Under Review': NOTIFICATION_TYPES.INFO,
    'Approved': NOTIFICATION_TYPES.SUCCESS,
    'Rejected': NOTIFICATION_TYPES.ERROR,
    'Completed': NOTIFICATION_TYPES.SUCCESS
  };

  try {
    await createNotification({
      userId: application.userId,
      title: `Application Status Updated: ${newStatus}`,
      message: statusMessages[newStatus] || `Your application status has been updated to ${newStatus}.`,
      type: statusTypes[newStatus] || NOTIFICATION_TYPES.INFO,
      actionUrl: `/my-applications`,
      metadata: {
        applicationId: application.id,
        serviceId: application.serviceId,
        previousStatus: application.status,
        newStatus,
        updatedBy
      }
    });
  } catch (error) {
    console.error('Error sending application status notification:', error);
  }
};

// New service created notification (for all users)
export const notifyNewServiceCreated = async (service, createdBy) => {
  try {
    // Get all users
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    
    const notifications = usersSnapshot.docs.map(userDoc => ({
      userId: userDoc.id,
      title: 'New Service Available',
      message: `A new service "${service.name}" is now available for application.`,
      type: NOTIFICATION_TYPES.SERVICE,
      actionUrl: `/services/${service.id}`,
      metadata: {
        serviceId: service.id,
        serviceName: service.name,
        createdBy
      }
    }));

    await createBulkNotifications(notifications);
  } catch (error) {
    console.error('Error sending new service notifications:', error);
  }
};

// Application assignment notification (for staff)
export const notifyApplicationAssignment = async (application, assignedToUserId, assignedBy) => {
  try {
    await createNotification({
      userId: assignedToUserId,
      title: 'New Application Assigned',
      message: `A new application has been assigned to you for review.`,
      type: NOTIFICATION_TYPES.APPLICATION,
      actionUrl: `/staff/applications/${application.id}`,
      metadata: {
        applicationId: application.id,
        serviceId: application.serviceId,
        applicantId: application.userId,
        assignedBy
      }
    });
  } catch (error) {
    console.error('Error sending application assignment notification:', error);
  }
};

// User role change notification
export const notifyUserRoleChange = async (userId, newRole, changedBy) => {
  const roleMessages = {
    'admin': 'You have been granted administrator privileges.',
    'officer': 'You have been assigned as an officer.',
    'staff': 'You have been assigned as a staff member.',
    'user': 'Your role has been updated to regular user.'
  };

  try {
    await createNotification({
      userId,
      title: 'Role Updated',
      message: roleMessages[newRole] || `Your role has been updated to ${newRole}.`,
      type: NOTIFICATION_TYPES.USER,
      actionUrl: '/profile',
      metadata: {
        newRole,
        changedBy
      }
    });
  } catch (error) {
    console.error('Error sending role change notification:', error);
  }
};

// System maintenance notification (for all users)
export const notifySystemMaintenance = async (maintenanceInfo) => {
  try {
    // Get all users
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    
    const notifications = usersSnapshot.docs.map(userDoc => ({
      userId: userDoc.id,
      title: 'System Maintenance Notice',
      message: maintenanceInfo.message || 'System maintenance is scheduled. Some services may be temporarily unavailable.',
      type: NOTIFICATION_TYPES.WARNING,
      actionUrl: null,
      metadata: {
        maintenanceStart: maintenanceInfo.startTime,
        maintenanceEnd: maintenanceInfo.endTime,
        affectedServices: maintenanceInfo.affectedServices || []
      }
    }));

    await createBulkNotifications(notifications);
  } catch (error) {
    console.error('Error sending maintenance notifications:', error);
  }
};

// Document upload reminder
export const notifyDocumentUploadReminder = async (application, daysRemaining) => {
  try {
    await createNotification({
      userId: application.userId,
      title: 'Document Upload Reminder',
      message: `Please upload the required documents for your application. ${daysRemaining} days remaining.`,
      type: NOTIFICATION_TYPES.WARNING,
      actionUrl: `/my-applications`,
      metadata: {
        applicationId: application.id,
        daysRemaining,
        reminderType: 'document_upload'
      }
    });
  } catch (error) {
    console.error('Error sending document upload reminder:', error);
  }
};

// Payment reminder notification
export const notifyPaymentReminder = async (application, amount) => {
  try {
    await createNotification({
      userId: application.userId,
      title: 'Payment Reminder',
      message: `Payment of ₹${amount} is required to process your application.`,
      type: NOTIFICATION_TYPES.WARNING,
      actionUrl: `/payments/${application.id}`,
      metadata: {
        applicationId: application.id,
        amount,
        reminderType: 'payment'
      }
    });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
  }
};

// Welcome notification for new users
export const notifyWelcomeNewUser = async (userId, userName) => {
  try {
    await createNotification({
      userId,
      title: 'Welcome to Gram Panchayat Services!',
      message: `Welcome ${userName}! Your account has been created successfully. You can now browse and apply for various government services.`,
      type: NOTIFICATION_TYPES.SUCCESS,
      actionUrl: '/services',
      metadata: {
        welcomeMessage: true,
        registrationDate: new Date()
      }
    });
  } catch (error) {
    console.error('Error sending welcome notification:', error);
  }
};

// Password created notification for admin-created users
export const notifyPasswordCreated = async (email, password, firstName, lastName) => {
  try {
    // In a real application, this would send an actual email
    // For now, we'll create a notification and log the password
    console.log(`Password created for ${email}: ${password}`);
    
    // Create a notification for the user (if they have an account)
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email.toLowerCase())
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    if (!usersSnapshot.empty) {
      const userId = usersSnapshot.docs[0].id;
      
      await createNotification({
        userId,
        title: 'Account Created',
        message: `Welcome ${firstName}! Your account has been created by an administrator. Please check your email for login credentials.`,
        type: NOTIFICATION_TYPES.INFO,
        actionUrl: '/profile',
        metadata: {
          accountCreated: true,
          createdByAdmin: true
        }
      });
    }
    
    // In production, this would integrate with an email service like SendGrid, AWS SES, etc.
    // For now, we'll simulate the email by showing it in console
    const emailContent = `
      Subject: Your Gram Panchayat Account Has Been Created
      
      Dear ${firstName} ${lastName},
      
      Your account has been created by an administrator for the Gram Panchayat Services portal.
      
      Login Credentials:
      Email: ${email}
      Password: ${password}
      
      Please login and change your password immediately for security.
      
      Visit: ${window.location.origin}/login
      
      Best regards,
      Gram Panchayat Administration
    `;
    
    console.log('Email would be sent:', emailContent);
    
    // TODO: Replace with actual email service integration
    // await emailService.send({
    //   to: email,
    //   subject: 'Your Gram Panchayat Account Has Been Created',
    //   html: emailTemplate,
    //   text: emailContent
    // });
    
  } catch (error) {
    console.error('Error sending password notification:', error);
    throw error;
  }
};