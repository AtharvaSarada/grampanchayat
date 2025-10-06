import { 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getAllServices } from '../data/servicesData';

/**
 * Statistics Service for real-time Firestore data
 */

/**
 * Get total number of services
 * @returns {Promise<number>} Total services count
 */
export const getTotalServices = async () => {
  try {
    // Get services from the actual services data instead of Firestore
    const services = getAllServices();
    return services.length;
  } catch (error) {
    console.error('Error fetching total services:', error);
    return 0;
  }
};

/**
 * Get applications processed (completed applications)
 * @returns {Promise<number>} Number of completed applications
 */
export const getApplicationsProcessed = async () => {
  try {
    const applicationsCollection = collection(db, 'applications');
    const completedQuery = query(
      applicationsCollection,
      where('status', '==', 'completed')
    );
    const snapshot = await getDocs(completedQuery);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching applications processed:', error);
    return 0;
  }
};

/**
 * Calculate average processing time for completed applications
 * @returns {Promise<number>} Average processing time in days
 */
export const getAverageProcessingTime = async () => {
  try {
    const applicationsCollection = collection(db, 'applications');
    const completedQuery = query(
      applicationsCollection,
      where('status', '==', 'completed')
    );
    const snapshot = await getDocs(completedQuery);
    
    if (snapshot.empty) {
      return 0;
    }
    
    let totalProcessingTime = 0;
    let validApplications = 0;
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const submittedAt = data.submitted_at;
      const completedAt = data.completed_at;
      
      if (submittedAt && completedAt) {
        // Convert Firestore timestamps to Date objects
        const submittedDate = submittedAt.toDate ? submittedAt.toDate() : new Date(submittedAt);
        const completedDate = completedAt.toDate ? completedAt.toDate() : new Date(completedAt);
        
        // Calculate processing time in milliseconds, then convert to days
        const processingTimeMs = completedDate.getTime() - submittedDate.getTime();
        const processingTimeDays = processingTimeMs / (1000 * 60 * 60 * 24);
        
        totalProcessingTime += processingTimeDays;
        validApplications++;
      }
    });
    
    if (validApplications === 0) {
      return 0;
    }
    
    const avgProcessingTime = totalProcessingTime / validApplications;
    // Round to 1 decimal place
    return Math.round(avgProcessingTime * 10) / 10;
    
  } catch (error) {
    console.error('Error fetching average processing time:', error);
    return 0;
  }
};

/**
 * Get all statistics at once
 * @returns {Promise<Object>} Object containing all statistics
 */
export const getAllStatistics = async () => {
  try {
    const [totalServices, applicationsProcessed, averageProcessingTime] = await Promise.all([
      getTotalServices(),
      getApplicationsProcessed(),
      getAverageProcessingTime()
    ]);
    
    return {
      totalServices,
      applicationsProcessed,
      averageProcessingTime
    };
  } catch (error) {
    console.error('Error fetching all statistics:', error);
    return {
      totalServices: 0,
      applicationsProcessed: 0,
      averageProcessingTime: 0
    };
  }
};

/**
 * Get user-specific statistics
 * @param {string} userId - User ID to filter applications
 * @returns {Promise<Object>} User statistics object
 */
export const getUserStatistics = async (userId) => {
  if (!userId) {
    return {
      totalApplications: 0,
      pendingApplications: 0,
      completedApplications: 0,
      totalAmountPaid: 0
    };
  }

  try {
    const applicationsCollection = collection(db, 'applications');
    // Try both field names to support different data structures
    const userQuery1 = query(
      applicationsCollection,
      where('userId', '==', userId)
    );
    const userQuery2 = query(
      applicationsCollection,
      where('user_id', '==', userId)
    );
    
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(userQuery1),
      getDocs(userQuery2)
    ]);
    
    // Combine results from both queries
    const allDocs = [...snapshot1.docs, ...snapshot2.docs];
    const snapshot = { docs: allDocs, empty: allDocs.length === 0 };
    
    if (snapshot.empty) {
      return {
        totalApplications: 0,
        pendingApplications: 0,
        completedApplications: 0,
        totalAmountPaid: 0
      };
    }

    let totalApplications = 0;
    let pendingApplications = 0;
    let completedApplications = 0;
    let totalAmountPaid = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalApplications++;
      
      switch (data.status) {
        case 'pending':
          pendingApplications++;
          break;
        case 'completed':
          completedApplications++;
          break;
      }
      
      // Add fee amount if available
      if (data.fee_amount && typeof data.fee_amount === 'number') {
        totalAmountPaid += data.fee_amount;
      }
    });

    return {
      totalApplications,
      pendingApplications,
      completedApplications,
      totalAmountPaid: Math.round(totalAmountPaid) // Round to nearest rupee
    };

  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return {
      totalApplications: 0,
      pendingApplications: 0,
      completedApplications: 0,
      totalAmountPaid: 0
    };
  }
};

/**
 * Get recent applications for a user
 * @param {string} userId - User ID to filter applications
 * @param {number} limit - Maximum number of applications to return
 * @returns {Promise<Array>} Array of recent applications
 */
export const getRecentApplications = async (userId, limitCount = 5) => {
  if (!userId) {
    return [];
  }

  try {
    const applicationsCollection = collection(db, 'applications');
    // Try both field names to support different data structures
    let snapshot;
    try {
      const recentQuery = query(
        applicationsCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      snapshot = await getDocs(recentQuery);
    } catch (error) {
      // Fallback to user_id and submitted_at
      const recentQuery = query(
        applicationsCollection,
        where('user_id', '==', userId),
        orderBy('submitted_at', 'desc'),
        limit(limitCount)
      );
      snapshot = await getDocs(recentQuery);
    }
    
    if (snapshot.empty) {
      return [];
    }

    const applications = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Calculate estimated completion (handle both date formats)
      const submittedDate = data.submittedAt ? new Date(data.submittedAt) : 
                           data.submitted_at?.toDate ? data.submitted_at.toDate() : 
                           data.createdAt ? new Date(data.createdAt) : new Date();
      const estimatedCompletion = new Date(submittedDate.getTime() + 10 * 24 * 60 * 60 * 1000);
      
      applications.push({
        id: doc.id,
        applicationId: data.application_id,
        serviceId: data.service_id,
        serviceName: getServiceDisplayName(data.service_id),
        status: data.status,
        applicationDate: submittedDate.toISOString(),
        estimatedCompletion: estimatedCompletion.toISOString(),
        statusColor: getStatusColor(data.status)
      });
    });

    return applications;

  } catch (error) {
    console.error('Error fetching recent applications:', error);
    return [];
  }
};

/**
 * Helper function to get display name for service
 * @param {string} serviceId - Service ID
 * @returns {string} Display name
 */
const getServiceDisplayName = (serviceId) => {
  const serviceNames = {
    'birth_certificate': 'Birth Certificate',
    'death_certificate': 'Death Certificate',
    'marriage_certificate': 'Marriage Certificate',
    'water_connection': 'Water Connection',
    'trade_license': 'Trade License',
    'building_permission': 'Building Permission',
    'income_certificate': 'Income Certificate',
    'caste_certificate': 'Caste Certificate',
    'domicile_certificate': 'Domicile Certificate',
    'bpl_certificate': 'BPL Certificate',
    'agricultural_subsidy': 'Agricultural Subsidy',
    'crop_insurance': 'Crop Insurance',
    'school_transfer_certificate': 'School Transfer Certificate',
    'scholarship_application': 'Scholarship Application'
  };
  
  return serviceNames[serviceId] || serviceId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Helper function to get status color
 * @param {string} status - Application status
 * @returns {string} MUI color
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'approved':
      return 'info';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Real-time user statistics listener
 * @param {string} userId - User ID to filter applications
 * @param {function} callback - Callback function to receive statistics updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToUserStatistics = (userId, callback) => {
  if (!userId) {
    callback({
      totalApplications: 0,
      pendingApplications: 0,
      completedApplications: 0,
      totalAmountPaid: 0
    });
    return () => {};
  }

  const applicationsCollection = collection(db, 'applications');
  // Use userId first (for new applications), fallback handled in getUserStatistics
  const userQuery = query(
    applicationsCollection,
    where('userId', '==', userId)
  );
  
  // Listen to user's applications changes
  const unsubscribe = onSnapshot(
    userQuery,
    () => {
      // When user applications change, recalculate statistics
      getUserStatistics(userId).then(callback);
    },
    (error) => {
      console.error('Error in user applications listener:', error);
      callback({
        totalApplications: 0,
        pendingApplications: 0,
        completedApplications: 0,
        totalAmountPaid: 0
      });
    }
  );
  
  // Initial data fetch
  getUserStatistics(userId).then(callback);
  
  return unsubscribe;
};

/**
 * Real-time statistics listener
 * @param {function} callback - Callback function to receive statistics updates
 * @returns {function} Unsubscribe function
 */
export const subscribeToStatistics = (callback) => {
  const unsubscribeFunctions = [];
  
  // Listen to applications collection changes only (services are static)
  const applicationsUnsubscribe = onSnapshot(
    collection(db, 'applications'),
    () => {
      // When applications change, recalculate all statistics
      getAllStatistics().then(callback);
    },
    (error) => {
      console.error('Error in applications listener:', error);
      // Provide fallback data on error
      callback({
        totalServices: getAllServices().length,
        applicationsProcessed: 0,
        averageProcessingTime: 0
      });
    }
  );
  
  unsubscribeFunctions.push(applicationsUnsubscribe);
  
  // Initial data fetch
  getAllStatistics().then(callback);
  
  // Return unsubscribe function
  return () => {
    unsubscribeFunctions.forEach(unsub => unsub());
  };
};

/**
 * Create sample application data for testing (dev only)
 * @param {number} count - Number of sample applications to create
 */
export const createSampleApplications = async (count = 5) => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Sample data creation is only available in development mode');
    return;
  }
  
  try {
    const { addDoc, collection: firestoreCollection, Timestamp } = await import('firebase/firestore');
    
    const applicationsCollection = firestoreCollection(db, 'applications');
    const sampleApplications = [];
    
    // Sample service IDs (matching your services)
    const serviceIds = ['birth_certificate', 'death_certificate', 'marriage_certificate', 'water_connection', 'trade_license'];
    const statuses = ['pending', 'approved', 'completed', 'rejected'];
    
    for (let i = 0; i < count; i++) {
      const submittedAt = Timestamp.fromDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)); // Random date within last 30 days
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let completedAt = null;
      if (status === 'completed') {
        // Add 3-15 days processing time for completed applications
        const processingDays = 3 + Math.random() * 12;
        completedAt = Timestamp.fromDate(new Date(submittedAt.toDate().getTime() + processingDays * 24 * 60 * 60 * 1000));
      }
      
      const application = {
        application_id: `APP${Date.now()}${i}`,
        service_id: serviceIds[Math.floor(Math.random() * serviceIds.length)],
        user_id: `user_${Math.floor(Math.random() * 100)}`,
        status: status,
        submitted_at: submittedAt,
        ...(completedAt && { completed_at: completedAt })
      };
      
      sampleApplications.push(application);
    }
    
    // Add all sample applications to Firestore
    const promises = sampleApplications.map(app => addDoc(applicationsCollection, app));
    await Promise.all(promises);
    
    console.log(`Created ${count} sample applications for testing`);
    return sampleApplications;
    
  } catch (error) {
    console.error('Error creating sample applications:', error);
    throw error;
  }
};

export default {
  getTotalServices,
  getApplicationsProcessed,
  getAverageProcessingTime,
  getAllStatistics,
  subscribeToStatistics,
  createSampleApplications
};
