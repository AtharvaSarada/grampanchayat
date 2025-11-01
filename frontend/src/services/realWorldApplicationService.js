import { 
  collection, 
  doc, 
  addDoc,
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { sendNotification } from './notificationService';

/**
 * REAL-WORLD APPLICATION SERVICE
 * Complete backend integration for Gram Panchayat E-Services
 */

// Application statuses with proper workflow
export const APPLICATION_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'pending',  // Changed from 'submitted' to 'pending' to match admin dashboard
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  DOCUMENTS_REQUIRED: 'documents_required',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Service categories with processing times
export const SERVICE_CATEGORIES = {
  'birth-certificate': { 
    category: 'Civil Registration', 
    processingDays: 7, 
    fee: 50,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Hospital Certificate', 'Parent ID Proof', 'Address Proof']
  },
  'death-certificate': { 
    category: 'Civil Registration', 
    processingDays: 5, 
    fee: 50,
    priority: PRIORITY_LEVELS.HIGH,
    requiredDocuments: ['Death Certificate from Hospital', 'ID Proof', 'Address Proof']
  },
  'marriage-certificate': { 
    category: 'Civil Registration', 
    processingDays: 10, 
    fee: 100,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Marriage Proof', 'Age Proof', 'Witness Documents']
  },
  'income-certificate': { 
    category: 'Social Welfare', 
    processingDays: 15, 
    fee: 30,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Salary Certificate', 'Bank Statements', 'ID Proof']
  },
  'caste-certificate': { 
    category: 'Social Welfare', 
    processingDays: 30, 
    fee: 30,
    priority: PRIORITY_LEVELS.LOW,
    requiredDocuments: ['Parent Caste Certificate', 'School Records', 'Community Verification']
  },
  'bpl-certificate': { 
    category: 'Social Welfare', 
    processingDays: 30, 
    fee: 0,
    priority: PRIORITY_LEVELS.HIGH,
    requiredDocuments: ['Income Proof', 'Asset Declaration', 'Family Details']
  },
  'agricultural-subsidy': { 
    category: 'Agriculture', 
    processingDays: 60, 
    fee: 0,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Land Records', 'Farmer ID', 'Bank Details', 'Project Report']
  },
  'building-permission': { 
    category: 'Business Services', 
    processingDays: 45, 
    fee: 2000,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Site Plan', 'Building Plan', 'Land Documents', 'NOC']
  },
  'water-connection': { 
    category: 'Utilities', 
    processingDays: 21, 
    fee: 1500,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Property Documents', 'ID Proof', 'Address Proof', 'Site Plan', 'NOC from Society']
  },
  'street-light-installation': { 
    category: 'Infrastructure', 
    processingDays: 30, 
    fee: 0,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Location Photos', 'Site Sketch', 'Resident Approval', 'Safety Assessment']
  },
  'domicile-certificate': { 
    category: 'Civil Registration', 
    processingDays: 15, 
    fee: 50,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Birth Certificate', 'School Records', 'Residence Proof', 'Affidavit']
  },
  // Additional service types with underscore naming
  'birth_certificate': { 
    category: 'Civil Registration', 
    processingDays: 7, 
    fee: 50,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Hospital Certificate', 'Parent ID Proof', 'Address Proof']
  },
  'death_certificate': { 
    category: 'Civil Registration', 
    processingDays: 5, 
    fee: 50,
    priority: PRIORITY_LEVELS.HIGH,
    requiredDocuments: ['Death Certificate from Hospital', 'ID Proof', 'Address Proof']
  },
  'marriage_certificate': { 
    category: 'Civil Registration', 
    processingDays: 10, 
    fee: 100,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Marriage Proof', 'Age Proof', 'Witness Documents']
  },
  'income_certificate': { 
    category: 'Social Welfare', 
    processingDays: 15, 
    fee: 30,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Salary Certificate', 'Bank Statements', 'ID Proof']
  },
  'caste_certificate': { 
    category: 'Social Welfare', 
    processingDays: 30, 
    fee: 30,
    priority: PRIORITY_LEVELS.LOW,
    requiredDocuments: ['Parent Caste Certificate', 'School Records', 'Community Verification']
  },
  'bpl_certificate': { 
    category: 'Social Welfare', 
    processingDays: 30, 
    fee: 0,
    priority: PRIORITY_LEVELS.HIGH,
    requiredDocuments: ['Income Proof', 'Asset Declaration', 'Family Details']
  },
  'domicile_certificate': { 
    category: 'Civil Registration', 
    processingDays: 15, 
    fee: 50,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Birth Certificate', 'School Records', 'Residence Proof', 'Affidavit']
  },
  'agricultural_subsidy': { 
    category: 'Agriculture', 
    processingDays: 60, 
    fee: 0,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Land Records', 'Farmer ID', 'Bank Details', 'Project Report']
  },
  'building_permission': { 
    category: 'Business Services', 
    processingDays: 45, 
    fee: 2000,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Site Plan', 'Building Plan', 'Land Documents', 'NOC']
  },
  'street_light_installation': { 
    category: 'Infrastructure', 
    processingDays: 30, 
    fee: 0,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Location Photos', 'Site Sketch', 'Resident Approval', 'Safety Assessment']
  },
  'health-certificate': { 
    category: 'Health Services', 
    processingDays: 10, 
    fee: 100,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Medical Records', 'ID Proof', 'Address Proof', 'Medical Test Reports']
  },
  'vaccination_certificate': { 
    category: 'Health Services', 
    processingDays: 7, 
    fee: 50,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Vaccination Records', 'ID Proof', 'Medical History']
  },
  'trade-license': { 
    category: 'Business Services', 
    processingDays: 30, 
    fee: 1000,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Business Plan', 'Property Documents', 'ID Proof', 'NOC']
  },
  'scholarship': { 
    category: 'Education', 
    processingDays: 45, 
    fee: 0,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Academic Records', 'Income Certificate', 'Caste Certificate', 'Bank Details']
  },
  'school_transfer_certificate': { 
    category: 'Education', 
    processingDays: 15, 
    fee: 100,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Previous School Records', 'Transfer Request', 'ID Proof', 'Address Proof']
  },
  'property_tax_payment': { 
    category: 'Revenue', 
    processingDays: 1, 
    fee: 0,
    priority: PRIORITY_LEVELS.HIGH,
    requiredDocuments: ['Property Documents', 'Previous Tax Receipts', 'ID Proof']
  },
  'property_tax_assessment': { 
    category: 'Revenue', 
    processingDays: 21, 
    fee: 500,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Property Documents', 'Construction Details', 'Site Plan', 'Ownership Proof']
  },
  'water_tax_payment': { 
    category: 'Utilities', 
    processingDays: 1, 
    fee: 0,
    priority: PRIORITY_LEVELS.HIGH,
    requiredDocuments: ['Water Connection Details', 'Previous Bills', 'ID Proof']
  },
  'drainage_connection': { 
    category: 'Utilities', 
    processingDays: 30, 
    fee: 2000,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Property Documents', 'Site Plan', 'NOC', 'Technical Drawings']
  },
  'crop_insurance': { 
    category: 'Agriculture', 
    processingDays: 30, 
    fee: 0,
    priority: PRIORITY_LEVELS.MEDIUM,
    requiredDocuments: ['Land Records', 'Crop Details', 'Farmer ID', 'Bank Details']
  }
};

/**
 * Submit a new application with complete workflow
 */
export const submitApplication = async (applicationData, userId, serviceType) => {
  try {
    // CRITICAL DEBUG - Force alert to see data
    alert(`Submitting: serviceType=${serviceType}, hasData=${!!applicationData}, hasDocuments=${!!applicationData?.documents}, docsLength=${applicationData?.documents?.length || 0}`);
    
    console.log('=== submitApplication RECEIVED ===');
    console.log('applicationData:', applicationData);
    console.log('applicationData.documents:', applicationData.documents);
    console.log('userId:', userId);
    console.log('serviceType:', serviceType);
    console.log('applicationData keys:', Object.keys(applicationData || {}));
    
    const serviceConfig = SERVICE_CATEGORIES[serviceType];
    if (!serviceConfig) {
      throw new Error(`Service type ${serviceType} not found`);
    }

    // Generate unique application ID
    const timestamp = Date.now();
    const applicationId = `${serviceType}_${userId}_${timestamp}`;

    // Calculate expected completion date
    const expectedCompletion = new Date();
    expectedCompletion.setDate(expectedCompletion.getDate() + serviceConfig.processingDays);

    // Extract applicant name based on service type
    let applicantName = 'N/A';
    console.log('Extracting applicant name for serviceType:', serviceType);
    console.log('Available fields:', {
      fatherName: applicationData.fatherName,
      motherName: applicationData.motherName,
      childName: applicationData.childName
    });
    
    if (serviceType === 'birth-certificate' || serviceType === 'birth_certificate') {
      applicantName = applicationData.fatherName || applicationData.motherName || applicationData.childName || 'N/A';
    } else if (serviceType === 'death-certificate' || serviceType === 'death_certificate') {
      applicantName = applicationData.informantName || applicationData.deceasedName || 'N/A';
    } else {
      applicantName = applicationData.applicantName || applicationData.name || applicationData.fullName || 'N/A';
    }
    
    console.log('Extracted applicantName:', applicantName);

    // Prepare complete application document
    const application = {
      // Basic Information
      applicationId,
      serviceType,
      serviceName: getServiceDisplayName(serviceType),
      category: serviceConfig.category,
      
      // User Information
      userId,
      applicantName,
      applicantEmail: applicationData.email || '',
      applicantPhone: applicationData.mobile || applicationData.phone || '',
      
      // Application Data - Store in both fields for compatibility
      applicationData: applicationData, // Primary field for new applications
      formData: applicationData,        // Backup field for compatibility
      status: APPLICATION_STATUS.SUBMITTED,
      priority: serviceConfig.priority,
      
      // Financial Information
      fee: serviceConfig.fee,
      paymentStatus: serviceConfig.fee > 0 ? 'pending' : 'not_required',
      paymentId: null,
      
      // Processing Information
      submittedAt: serverTimestamp(),
      expectedCompletion,
      actualCompletion: null,
      processingDays: serviceConfig.processingDays,
      
      // Assignment and Tracking
      assignedTo: null,
      assignedDepartment: serviceConfig.category,
      reviewedBy: null,
      approvedBy: null,
      
      // Documents and Communication
      documents: applicationData.documents || [],
      requiredDocuments: serviceConfig.requiredDocuments,
      comments: [],
      statusHistory: [{
        status: APPLICATION_STATUS.SUBMITTED,
        timestamp: new Date().toISOString(), // Use ISO string instead of serverTimestamp in array
        updatedBy: userId,
        remarks: 'Application submitted by citizen'
      }],
      
      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: 1
    };
    
    console.log('=== APPLICATION TO SAVE ===');
    console.log('application.formData:', application.formData);
    console.log('application.documents:', application.documents);
    console.log('==========================');

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'applications'), application);
    
    // Update application statistics
    await updateApplicationStats(serviceType, 'submitted');
    
    // Send confirmation notification
    await sendNotification({
      userId,
      title: 'Application Submitted Successfully',
      message: `Your ${getServiceDisplayName(serviceType)} application has been submitted. Application ID: ${applicationId}`,
      type: 'success',
      metadata: { applicationId }
    });

    // Auto-assign to appropriate department/staff
    await autoAssignApplication(docRef.id, serviceType, serviceConfig.category);

    return {
      success: true,
      applicationId,
      docId: docRef.id,
      expectedCompletion,
      fee: serviceConfig.fee
    };

  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error(`Failed to submit application: ${error.message}`);
  }
};

/**
 * Get user's applications with real-time updates
 */
export const getUserApplications = async (userId) => {
  try {
    console.log('🔍 getUserApplications called with userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId provided');
      return [];
    }
    
    // Try multiple query approaches to handle different data structures
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
    
    const applications = uniqueDocs.map(doc => {
      const data = doc.data();
      console.log('📄 Processing application doc:', doc.id, {
        serviceType: data.serviceType,
        status: data.status,
        userId: data.userId,
        user_id: data.user_id,
        hasApplicationData: !!data.applicationData,
        hasFormData: !!data.formData,
        createdAt: data.createdAt,
        submittedAt: data.submittedAt
      });
      
      return {
        id: doc.id,
        ...data,
        // Handle different timestamp field names and formats
        submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : 
                    data.submitted_at?.toDate ? data.submitted_at.toDate() :
                    data.createdAt?.toDate ? data.createdAt.toDate() :
                    new Date(),
        expectedCompletion: data.expectedCompletion?.toDate ? data.expectedCompletion.toDate() : 
                           data.expected_completion?.toDate ? data.expected_completion.toDate() :
                           new Date(),
        actualCompletion: data.actualCompletion?.toDate ? data.actualCompletion.toDate() : 
                         data.actual_completion?.toDate ? data.actual_completion.toDate() :
                         null,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : 
                  data.created_at?.toDate ? data.created_at.toDate() :
                  new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : 
                  data.updated_at?.toDate ? data.updated_at.toDate() :
                  new Date(),
        // Ensure we have the application data in a consistent format
        applicationData: data.applicationData || data.formData || data.form_data || {},
        // Ensure we have a consistent status format
        status: data.status || 'pending'
      };
    });

    // Sort by submittedAt in JavaScript instead of Firestore
    applications.sort((a, b) => b.submittedAt - a.submittedAt);
    
    console.log('✅ Returning', applications.length, 'applications for user:', userId);
    applications.forEach((app, index) => {
      console.log(`📄 Application ${index + 1}:`, {
        id: app.id,
        serviceType: app.serviceType,
        status: app.status,
        submittedAt: app.submittedAt,
        hasApplicationData: !!app.applicationData && Object.keys(app.applicationData).length > 0
      });
    });
    
    return applications;
  } catch (error) {
    console.error('❌ Error fetching user applications:', error);
    console.error('Error details:', error.message, error.code);
    throw error;
  }
};

/**
 * Get all applications for admin with filtering
 */
export const getAllApplications = async (filters = {}) => {
  try {
    let applicationsQuery = collection(db, 'applications');
    const constraints = [];

    // Apply filters
    if (filters.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.serviceType) {
      constraints.push(where('serviceType', '==', filters.serviceType));
    }
    if (filters.assignedTo) {
      constraints.push(where('assignedTo', '==', filters.assignedTo));
    }
    if (filters.priority) {
      constraints.push(where('priority', '==', filters.priority));
    }

    // Add ordering
    constraints.push(orderBy('submittedAt', 'desc'));

    // Apply limit if specified
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    if (constraints.length > 0) {
      applicationsQuery = query(applicationsQuery, ...constraints);
    }

    const snapshot = await getDocs(applicationsQuery);
    const applications = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        expectedCompletion: data.expectedCompletion?.toDate() || new Date(),
        actualCompletion: data.actualCompletion?.toDate() || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

/**
 * Update application status with complete workflow
 */
export const updateApplicationStatus = async (applicationId, newStatus, updatedBy, remarks = '') => {
  try {
    const applicationRef = doc(db, 'applications', applicationId);
    const applicationDoc = await getDoc(applicationRef);
    
    if (!applicationDoc.exists()) {
      throw new Error('Application not found');
    }

    const currentData = applicationDoc.data();
    const updateData = {
      status: newStatus,
      updatedAt: serverTimestamp(),
      latestComment: remarks, // Store latest comment for easy access
      statusHistory: arrayUnion({
        status: newStatus,
        timestamp: new Date().toISOString(), // Use ISO string instead of serverTimestamp in array
        updatedBy,
        remarks
      })
    };

    // Handle specific status changes
    switch (newStatus) {
      case APPLICATION_STATUS.UNDER_REVIEW:
        updateData.reviewedBy = updatedBy;
        updateData.reviewStarted = serverTimestamp();
        break;
      
      case APPLICATION_STATUS.APPROVED:
        updateData.approvedBy = updatedBy;
        updateData.approvedAt = serverTimestamp();
        break;
      
      case APPLICATION_STATUS.COMPLETED:
        updateData.actualCompletion = serverTimestamp();
        updateData.completedBy = updatedBy;
        break;
      
      case APPLICATION_STATUS.REJECTED:
        updateData.rejectedBy = updatedBy;
        updateData.rejectedAt = serverTimestamp();
        updateData.rejectionReason = remarks;
        break;
    }

    await updateDoc(applicationRef, updateData);

    // Send notification to applicant (if userId exists)
    const userId = currentData.userId || currentData.applicantId;
    if (userId) {
      try {
        await sendNotification({
          userId,
          title: `Application ${newStatus.replace('_', ' ').toUpperCase()}`,
          message: `Your ${currentData.serviceName || currentData.serviceType} application status has been updated to ${newStatus}. ${remarks}`,
          type: getNotificationType(newStatus),
          metadata: { applicationId: currentData.applicationId || applicationId }
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the whole operation if notification fails
      }
    }

    // Update statistics
    try {
      await updateApplicationStats(currentData.serviceType, newStatus);
    } catch (statsError) {
      console.error('Error updating stats:', statsError);
      // Don't fail the whole operation if stats update fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

/**
 * Auto-assign application to appropriate staff/department
 */
const autoAssignApplication = async (applicationDocId, serviceType, category) => {
  try {
    // Find available staff for this category
    const staffQuery = query(
      collection(db, 'users'),
      where('role', 'in', ['staff', 'officer']),
      where('department', '==', category),
      where('status', '==', 'active')
    );

    const staffSnapshot = await getDocs(staffQuery);
    
    if (!staffSnapshot.empty) {
      // Simple round-robin assignment (can be enhanced with workload balancing)
      const staffList = staffSnapshot.docs;
      const randomStaff = staffList[Math.floor(Math.random() * staffList.length)];
      
      const applicationRef = doc(db, 'applications', applicationDocId);
      await updateDoc(applicationRef, {
        assignedTo: randomStaff.id,
        assignedAt: serverTimestamp(),
        status: APPLICATION_STATUS.UNDER_REVIEW
      });

      // Notify assigned staff
      await sendNotification({
        userId: randomStaff.id,
        title: 'New Application Assigned',
        message: `A new ${getServiceDisplayName(serviceType)} application has been assigned to you.`,
        type: 'info',
        metadata: { applicationId: applicationDocId }
      });
    }
  } catch (error) {
    console.error('Error auto-assigning application:', error);
    // Don't throw error as this is not critical
  }
};

/**
 * Update application statistics
 */
const updateApplicationStats = async (serviceType, status) => {
  try {
    const statsRef = doc(db, 'statistics', 'applications');
    const updates = {};
    
    updates[`byService.${serviceType}.total`] = increment(1);
    updates[`byStatus.${status}`] = increment(1);
    updates['totalApplications'] = increment(1);
    updates['lastUpdated'] = serverTimestamp();

    await setDoc(statsRef, updates, { merge: true });
  } catch (error) {
    console.error('Error updating application stats:', error);
  }
};

/**
 * Get application statistics for dashboard
 */
export const getApplicationStatistics = async () => {
  try {
    const statsDoc = await getDoc(doc(db, 'statistics', 'applications'));
    
    if (statsDoc.exists()) {
      return statsDoc.data();
    }

    // If no stats exist, calculate from applications
    const applications = await getAllApplications();
    
    const stats = {
      totalApplications: applications.length,
      byStatus: {},
      byService: {},
      byPriority: {},
      averageProcessingTime: 0,
      lastUpdated: new Date()
    };

    // Calculate statistics
    applications.forEach(app => {
      // By status
      stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;
      
      // By service
      if (!stats.byService[app.serviceType]) {
        stats.byService[app.serviceType] = { total: 0, completed: 0 };
      }
      stats.byService[app.serviceType].total++;
      if (app.status === APPLICATION_STATUS.COMPLETED) {
        stats.byService[app.serviceType].completed++;
      }
      
      // By priority
      stats.byPriority[app.priority] = (stats.byPriority[app.priority] || 0) + 1;
    });

    // Calculate average processing time
    const completedApps = applications.filter(app => 
      app.status === APPLICATION_STATUS.COMPLETED && app.actualCompletion
    );
    
    if (completedApps.length > 0) {
      const totalProcessingTime = completedApps.reduce((sum, app) => {
        const processingTime = app.actualCompletion.getTime() - app.submittedAt.getTime();
        return sum + (processingTime / (1000 * 60 * 60 * 24)); // Convert to days
      }, 0);
      
      stats.averageProcessingTime = Math.round(totalProcessingTime / completedApps.length);
    }

    // Save calculated stats
    await setDoc(doc(db, 'statistics', 'applications'), stats);
    
    return stats;
  } catch (error) {
    console.error('Error getting application statistics:', error);
    return {
      totalApplications: 0,
      byStatus: {},
      byService: {},
      byPriority: {},
      averageProcessingTime: 0,
      lastUpdated: new Date()
    };
  }
};

/**
 * Helper functions
 */
const getServiceDisplayName = (serviceType) => {
  const displayNames = {
    'birth-certificate': 'Birth Certificate',
    'death-certificate': 'Death Certificate',
    'marriage-certificate': 'Marriage Certificate',
    'income-certificate': 'Income Certificate',
    'caste-certificate': 'Caste Certificate',
    'domicile-certificate': 'Domicile Certificate',
    'bpl-certificate': 'BPL Certificate',
    'agricultural-subsidy': 'Agricultural Subsidy',
    'crop-insurance': 'Crop Insurance',
    'building-permission': 'Building Permission',
    'trade-license': 'Trade License',
    'water-connection': 'Water Connection',
    'drainage-connection': 'Drainage Connection',
    'property-tax-payment': 'Property Tax Payment',
    'property-tax-assessment': 'Property Tax Assessment',
    'vaccination-certificate': 'Vaccination Certificate',
    'health-certificate': 'Health Certificate',
    'school-transfer-certificate': 'School Transfer Certificate',
    'scholarship': 'Scholarship Application',
    'water-tax-payment': 'Water Tax Payment',
    'street-light-installation': 'Street Light Installation'
  };
  
  return displayNames[serviceType] || serviceType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getNotificationType = (status) => {
  switch (status) {
    case APPLICATION_STATUS.APPROVED:
    case APPLICATION_STATUS.COMPLETED:
      return 'success';
    case APPLICATION_STATUS.REJECTED:
      return 'error';
    case APPLICATION_STATUS.DOCUMENTS_REQUIRED:
      return 'warning';
    default:
      return 'info';
  }
};

export default {
  submitApplication,
  getUserApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStatistics,
  APPLICATION_STATUS,
  PRIORITY_LEVELS,
  SERVICE_CATEGORIES
};
