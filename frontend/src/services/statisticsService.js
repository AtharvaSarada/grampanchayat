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
  console.log('📊 getUserStatistics called with userId:', userId);
  
  if (!userId) {
    console.log('❌ No userId provided');
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
    
    console.log('🔍 Querying applications for userId:', userId);
    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(userQuery1),
      getDocs(userQuery2)
    ]);
    
    console.log('📊 Query results - userId field:', snapshot1.size, 'user_id field:', snapshot2.size);
    
    // Combine results from both queries
    const allDocs = [...snapshot1.docs, ...snapshot2.docs];
    const snapshot = { docs: allDocs, empty: allDocs.length === 0 };
    
    console.log('📊 Total applications found:', allDocs.length);
    
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

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Application data:', { id: doc.id, status: data.status, userId: data.userId, user_id: data.user_id });
      totalApplications++;
      
      switch (data.status) {
        case 'pending':
        case 'submitted':
        case 'under_review':
          pendingApplications++;
          break;
        case 'completed':
        case 'approved':
          completedApplications++;
          break;
      }
      
      // Add fee amount if available
      if (data.fee_amount && typeof data.fee_amount === 'number') {
        totalAmountPaid += data.fee_amount;
      }
    });

    const result = {
      totalApplications,
      pendingApplications,
      completedApplications,
      totalAmountPaid: Math.round(totalAmountPaid) // Round to nearest rupee
    };
    
    console.log('📊 Final user statistics:', result);
    return result;

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
  console.log('🔍 getRecentApplications called with userId:', userId, 'limit:', limitCount);
  
  if (!userId) {
    console.log('❌ No userId provided to getRecentApplications');
    return [];
  }

  try {
    const applicationsCollection = collection(db, 'applications');
    
    // Query 1: Try with 'userId' field
    console.log('📋 Trying query with userId field...');
    const query1 = query(applicationsCollection, where('userId', '==', userId));
    const snapshot1 = await getDocs(query1);
    console.log('📊 Query 1 result (userId):', snapshot1.size, 'documents found');
    
    // Query 2: Try with 'user_id' field (alternative naming)
    console.log('📋 Trying query with user_id field...');
    const query2 = query(applicationsCollection, where('user_id', '==', userId));
    const snapshot2 = await getDocs(query2);
    console.log('📊 Query 2 result (user_id):', snapshot2.size, 'documents found');
    
    // Combine results from both queries and remove duplicates
    const allDocs = [...snapshot1.docs, ...snapshot2.docs];
    const uniqueDocs = allDocs.filter((doc, index, self) => 
      index === self.findIndex(d => d.id === doc.id)
    );
    
    console.log('📊 Total unique applications found:', uniqueDocs.length);
    
    if (uniqueDocs.length === 0) {
      console.log('📊 No applications found for user:', userId);
      return [];
    }

    const applications = [];
    uniqueDocs.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing recent application:', doc.id, {
        serviceType: data.serviceType,
        service_id: data.service_id,
        status: data.status,
        submittedAt: data.submittedAt,
        createdAt: data.createdAt
      });
      
      // Handle different timestamp field names and formats
      const submittedDate = data.submittedAt?.toDate ? data.submittedAt.toDate() : 
                           data.submitted_at?.toDate ? data.submitted_at.toDate() :
                           data.createdAt?.toDate ? data.createdAt.toDate() :
                           new Date();
      
      const estimatedCompletion = new Date(submittedDate.getTime() + 10 * 24 * 60 * 60 * 1000);
      
      // Use serviceType (new format) or service_id (old format)
      const serviceId = data.serviceType || data.service_id || 'unknown';
      
      applications.push({
        id: doc.id,
        applicationId: data.applicationId || data.application_id || doc.id,
        serviceId: serviceId,
        serviceName: getServiceDisplayName(serviceId),
        status: data.status || 'pending',
        applicationDate: submittedDate.toISOString(),
        submittedAt: submittedDate, // Add for sorting
        estimatedCompletion: estimatedCompletion.toISOString(),
        statusColor: getStatusColor(data.status || 'pending')
      });
    });

    // Sort by submittedAt in JavaScript (most recent first)
    applications.sort((a, b) => b.submittedAt - a.submittedAt);
    
    // Apply limit
    const limitedApplications = applications.slice(0, limitCount);
    
    console.log('✅ Returning', limitedApplications.length, 'recent applications for user:', userId);
    limitedApplications.forEach((app, index) => {
      console.log(`📄 Recent Application ${index + 1}:`, {
        id: app.id,
        serviceName: app.serviceName,
        status: app.status,
        applicationDate: app.applicationDate
      });
    });

    return limitedApplications;

  } catch (error) {
    console.error('❌ Error fetching recent applications:', error);
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
    // New format (with hyphens)
    'birth-certificate': 'Birth Certificate',
    'death-certificate': 'Death Certificate',
    'marriage-certificate': 'Marriage Certificate',
    'water-connection': 'Water Connection',
    'trade-license': 'Trade License',
    'building-permission': 'Building Permission',
    'income-certificate': 'Income Certificate',
    'caste-certificate': 'Caste Certificate',
    'domicile-certificate': 'Domicile Certificate',
    'bpl-certificate': 'BPL Certificate',
    'agricultural-subsidy': 'Agricultural Subsidy',
    'crop-insurance': 'Crop Insurance',
    'school-transfer-certificate': 'School Transfer Certificate',
    'scholarship': 'Scholarship Application',
    'vaccination-certificate': 'Vaccination Certificate',
    'health-certificate': 'Health Certificate',
    'street-light-installation': 'Street Light Installation',
    'drainage-connection': 'Drainage Connection',
    'property-tax-payment': 'Property Tax Payment',
    'property-tax-assessment': 'Property Tax Assessment',
    'water-tax-payment': 'Water Tax Payment',
    
    // Old format (with underscores) - for backward compatibility
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
    'scholarship_application': 'Scholarship Application',
    'vaccination_certificate': 'Vaccination Certificate',
    'health_certificate': 'Health Certificate'
  };
  
  if (serviceNames[serviceId]) {
    return serviceNames[serviceId];
  }
  
  // Fallback: convert serviceId to readable format
  return serviceId.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
  console.log('🔄 subscribeToUserStatistics called with userId:', userId);
  
  if (!userId) {
    console.log('❌ No userId provided to subscription');
    callback({
      totalApplications: 0,
      pendingApplications: 0,
      completedApplications: 0,
      totalAmountPaid: 0
    });
    return () => {};
  }

  const applicationsCollection = collection(db, 'applications');
  
  // Listen to the entire applications collection and filter in callback
  // This ensures we catch all applications regardless of field name
  const unsubscribe = onSnapshot(
    applicationsCollection,
    () => {
      console.log('🔄 Applications collection changed, recalculating stats for user:', userId);
      // When applications change, recalculate statistics
      getUserStatistics(userId).then(callback);
    },
    (error) => {
      console.error('❌ Error in applications listener:', error);
      callback({
        totalApplications: 0,
        pendingApplications: 0,
        completedApplications: 0,
        totalAmountPaid: 0
      });
    }
  );
  
  // Initial data fetch
  console.log('🔄 Initial data fetch for user:', userId);
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
