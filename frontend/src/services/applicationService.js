import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Application status constants
 */
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

/**
 * Service types constants
 */
export const SERVICE_TYPES = {
  BIRTH_CERTIFICATE: 'birth_certificate',
  DEATH_CERTIFICATE: 'death_certificate',
  MARRIAGE_CERTIFICATE: 'marriage_certificate',
  BPL_CERTIFICATE: 'bpl_certificate',
  CASTE_CERTIFICATE: 'caste_certificate',
  DOMICILE_CERTIFICATE: 'domicile_certificate',
  INCOME_CERTIFICATE: 'income_certificate',
  SCHOLARSHIP_APPLICATION: 'scholarship_application',
  AGRICULTURAL_SUBSIDY: 'agricultural_subsidy',
  CROP_INSURANCE: 'crop_insurance',
  BUILDING_PERMISSION: 'building_permission',
  DRAINAGE_CONNECTION: 'drainage_connection',
  STREET_LIGHT_INSTALLATION: 'street_light_installation',
  WATER_CONNECTION: 'water_connection',
  PROPERTY_TAX_ASSESSMENT: 'property_tax_assessment',
  PROPERTY_TAX_PAYMENT: 'property_tax_payment',
  WATER_TAX_PAYMENT: 'water_tax_payment',
  TRADE_LICENSE: 'trade_license',
  HEALTH_CERTIFICATE: 'health_certificate',
  VACCINATION_CERTIFICATE: 'vaccination_certificate',
  SCHOOL_TRANSFER_CERTIFICATE: 'school_transfer_certificate',
  // Legacy services
  BUSINESS_LICENSE: 'business_license',
  LAND_PROPERTY: 'land_property',
  PENSION_CERTIFICATE: 'pension_certificate'
};

/**
 * Submit a new application
 * @param {Object} applicationData - Application form data
 * @param {string} userId - User ID
 * @param {string} serviceType - Type of service
 * @returns {Promise<string>} Application ID
 */
export const submitApplication = async (applicationData, userId, serviceType) => {
  try {
    const applicationId = `${serviceType}_${userId}_${Date.now()}`;
    const applicationRef = doc(db, 'applications', applicationId);

    const application = {
      id: applicationId,
      userId,
      serviceType,
      status: APPLICATION_STATUS.PENDING,
      applicationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      statusHistory: [
        {
          status: APPLICATION_STATUS.PENDING,
          timestamp: serverTimestamp(),
          remarks: 'Application submitted'
        }
      ]
    };

    await setDoc(applicationRef, application);
    return applicationId;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error(`Failed to submit application: ${error.message}`);
  }
};

/**
 * Get user's applications
 * @param {string} userId - User ID
 * @returns {Promise<Array>} User applications
 */
export const getUserApplications = async (userId) => {
  try {
    const applicationsQuery = query(
      collection(db, 'applications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};

/**
 * Get all applications (for admin)
 * @param {string} serviceType - Optional service type filter
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} All applications
 */
export const getAllApplications = async (serviceType = null, status = null) => {
  try {
    let applicationsQuery = collection(db, 'applications');
    const constraints = [];

    if (serviceType) {
      constraints.push(where('serviceType', '==', serviceType));
    }
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));

    if (constraints.length > 0) {
      applicationsQuery = query(applicationsQuery, ...constraints);
    }

    const snapshot = await getDocs(applicationsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching all applications:', error);
    throw error;
  }
};

/**
 * Get single application by ID
 * @param {string} applicationId - Application ID
 * @returns {Promise<Object>} Application data
 */
export const getApplication = async (applicationId) => {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    const snapshot = await getDoc(applicationRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      };
    } else {
      throw new Error('Application not found');
    }
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
};

/**
 * Update application status (for admin)
 * @param {string} applicationId - Application ID
 * @param {string} newStatus - New status
 * @param {string} remarks - Optional remarks
 * @param {string} adminId - Admin user ID
 * @returns {Promise<void>}
 */
export const updateApplicationStatus = async (applicationId, newStatus, remarks = '', adminId) => {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    
    const statusUpdate = {
      status: newStatus,
      updatedAt: serverTimestamp(),
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: serverTimestamp(),
        remarks,
        updatedBy: adminId
      })
    };

    await updateDoc(applicationRef, statusUpdate);
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

/**
 * Get application statistics (for dashboard)
 * @returns {Promise<Object>} Statistics object
 */
export const getApplicationStatistics = async () => {
  try {
    const applications = await getAllApplications();
    
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === APPLICATION_STATUS.PENDING).length,
      underReview: applications.filter(app => app.status === APPLICATION_STATUS.UNDER_REVIEW).length,
      approved: applications.filter(app => app.status === APPLICATION_STATUS.APPROVED).length,
      rejected: applications.filter(app => app.status === APPLICATION_STATUS.REJECTED).length,
      completed: applications.filter(app => app.status === APPLICATION_STATUS.COMPLETED).length,
      byService: {}
    };

    // Count by service type
    Object.values(SERVICE_TYPES).forEach(serviceType => {
      stats.byService[serviceType] = applications.filter(app => app.serviceType === serviceType).length;
    });

    return stats;
  } catch (error) {
    console.error('Error fetching application statistics:', error);
    throw error;
  }
};

/**
 * Generate application reference number
 * @param {string} serviceType - Service type
 * @param {string} applicationId - Application ID
 * @returns {string} Reference number
 */
export const generateApplicationReference = (serviceType, applicationId) => {
  const serviceCode = serviceType.toUpperCase().substring(0, 3);
  const timestamp = Date.now().toString().slice(-6);
  return `GP-${serviceCode}-${timestamp}`;
};

/**
 * Get service type display name
 * @param {string} serviceType - Service type constant
 * @returns {string} Display name
 */
export const getServiceDisplayName = (serviceType) => {
  const displayNames = {
    [SERVICE_TYPES.BIRTH_CERTIFICATE]: 'Birth Certificate',
    [SERVICE_TYPES.DEATH_CERTIFICATE]: 'Death Certificate',
    [SERVICE_TYPES.BUSINESS_LICENSE]: 'Business License',
    [SERVICE_TYPES.LAND_PROPERTY]: 'Land & Property Records',
    [SERVICE_TYPES.PENSION_CERTIFICATE]: 'Pension Certificate',
    [SERVICE_TYPES.INCOME_CERTIFICATE]: 'Income Certificate',
    [SERVICE_TYPES.CASTE_CERTIFICATE]: 'Caste Certificate',
    [SERVICE_TYPES.WATER_CONNECTION]: 'Water Connection',
    [SERVICE_TYPES.MARRIAGE_CERTIFICATE]: 'Marriage Certificate',
    [SERVICE_TYPES.DOMICILE_CERTIFICATE]: 'Domicile Certificate'
  };

  return displayNames[serviceType] || serviceType;
};
