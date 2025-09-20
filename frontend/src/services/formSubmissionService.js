import { submitApplication, generateApplicationReference } from './applicationService';
import { uploadMultipleFiles, generateStoragePath } from './storage';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Handle form submission with file uploads and data persistence
 * @param {Object} submissionData - Contains formData, serviceType, and documents
 * @returns {Promise<Object>} Submission result with application ID
 */
export const handleFormSubmission = async (submissionData) => {
  const { formData, serviceType, documents } = submissionData;
  
  try {
    // Get current user (this should be passed as parameter in real implementation)
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Temporary solution
    
    if (!currentUser) {
      throw new Error('User must be authenticated to submit application');
    }

    // Show loading toast
    const loadingToast = toast.loading('Submitting your application...');

    let documentUrls = {};
    
    // Upload documents if any
    if (documents && documents.length > 0) {
      toast.loading('Uploading documents...', { id: loadingToast });
      
      const uploadPromises = documents.map(async (doc) => {
        const storagePath = `applications/${serviceType}/${currentUser.uid}/${Date.now()}_${doc.file.name}`;
        const uploadResult = await uploadMultipleFiles([doc.file], storagePath);
        return {
          type: doc.type,
          name: doc.name,
          url: uploadResult[0] // Get the first URL from the result
        };
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      // Convert to object with document type as key
      uploadResults.forEach(result => {
        documentUrls[result.type] = {
          name: result.name,
          url: result.url
        };
      });
    }

    // Prepare application data
    const applicationData = {
      ...formData,
      documentUrls,
      applicantInfo: {
        name: currentUser.displayName || `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        email: currentUser.email,
        phone: formData.informantPhone || formData.phoneNumber || '',
        userId: currentUser.uid
      },
      submissionDetails: {
        submittedAt: new Date().toISOString(),
        submittedFrom: 'web_application',
        ipAddress: null, // Can be added if needed
        userAgent: navigator.userAgent
      }
    };

    toast.loading('Saving application...', { id: loadingToast });

    // Submit to Firestore
    const applicationId = await submitApplication(
      applicationData,
      currentUser.uid,
      serviceType
    );

    // Generate reference number
    const referenceNumber = generateApplicationReference(serviceType, applicationId);

    toast.success(
      `Application submitted successfully! Reference: ${referenceNumber}`,
      { 
        id: loadingToast,
        duration: 5000
      }
    );

    return {
      success: true,
      applicationId,
      referenceNumber,
      message: 'Application submitted successfully!'
    };

  } catch (error) {
    console.error('Error submitting application:', error);
    
    toast.error(
      `Failed to submit application: ${error.message}`,
      { duration: 5000 }
    );

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get form configuration for different service types
 * @param {string} serviceType - The service type constant
 * @returns {Object} Form configuration
 */
export const getFormConfig = (serviceType) => {
  const configs = {
    birth_certificate: {
      title: 'Birth Certificate Application',
      description: 'Apply for an official birth certificate',
      requiredDocuments: [
        'Hospital discharge summary/Birth certificate from hospital',
        'Parents\' Aadhar Cards',
        'Parents\' Marriage Certificate',
        'Proof of Address',
        'Informant\'s ID Proof (if different from parents)'
      ],
      processingTime: '7-14 working days',
      fees: 'Rs. 50/-'
    },
    death_certificate: {
      title: 'Death Certificate Application',
      description: 'Apply for an official death certificate',
      requiredDocuments: [
        'Medical certificate of cause of death',
        'Deceased\'s ID proof',
        'Informant\'s ID proof',
        'Proof of Address'
      ],
      processingTime: '7-10 working days',
      fees: 'Rs. 50/-'
    },
    business_license: {
      title: 'Business License Application',
      description: 'Apply for a business license/trade permit',
      requiredDocuments: [
        'Business registration documents',
        'PAN Card',
        'GST Certificate (if applicable)',
        'Identity proof',
        'Address proof',
        'Passport-size photographs'
      ],
      processingTime: '15-21 working days',
      fees: 'Rs. 500/-'
    },
    income_certificate: {
      title: 'Income Certificate Application',
      description: 'Apply for an official income certificate',
      requiredDocuments: [
        'Salary certificate/Income proof',
        'Bank statements (last 6 months)',
        'Identity proof',
        'Address proof',
        'Passport-size photographs'
      ],
      processingTime: '10-15 working days',
      fees: 'Rs. 100/-'
    },
    // Add more service type configurations as needed
  };

  return configs[serviceType] || {
    title: 'Service Application',
    description: 'Submit your application',
    requiredDocuments: ['Required supporting documents'],
    processingTime: '7-14 working days',
    fees: 'As applicable'
  };
};

/**
 * Validate form data before submission
 * @param {Object} formData - Form data to validate
 * @param {string} serviceType - Service type for specific validations
 * @returns {Object} Validation result
 */
export const validateFormData = (formData, serviceType) => {
  const errors = {};
  const warnings = [];

  // Common validations
  if (!formData.applicantName && !formData.childName && !formData.businessName) {
    errors.name = 'Applicant/Subject name is required';
  }

  // Service-specific validations
  switch (serviceType) {
    case 'birth_certificate':
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
      } else if (new Date(formData.dateOfBirth) > new Date()) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
      
      if (!formData.fatherName) {
        errors.fatherName = 'Father\'s name is required';
      }
      
      if (!formData.motherName) {
        errors.motherName = 'Mother\'s name is required';
      }
      break;
      
    case 'death_certificate':
      if (!formData.dateOfDeath) {
        errors.dateOfDeath = 'Date of death is required';
      }
      
      if (!formData.causeOfDeath) {
        errors.causeOfDeath = 'Cause of death is required';
      }
      break;
      
    case 'business_license':
      if (!formData.businessName) {
        errors.businessName = 'Business name is required';
      }
      
      if (!formData.businessType) {
        errors.businessType = 'Business type is required';
      }
      break;
  }

  // Phone number validation
  if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid 10-digit phone number';
  }

  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Pincode validation
  if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = 'Please enter a valid 6-digit pincode';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
};

/**
 * Generate application summary for review
 * @param {Object} formData - Form data
 * @param {string} serviceType - Service type
 * @returns {Object} Application summary
 */
export const generateApplicationSummary = (formData, serviceType) => {
  const config = getFormConfig(serviceType);
  
  return {
    serviceType: config.title,
    applicant: formData.applicantName || formData.childName || formData.businessName || 'N/A',
    submissionDate: new Date().toLocaleDateString('en-IN'),
    processingTime: config.processingTime,
    fees: config.fees,
    requiredDocuments: config.requiredDocuments,
    formData
  };
};
