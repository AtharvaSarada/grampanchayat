// Comprehensive form validation utilities for government forms

// Enhanced validation patterns with detailed constraints
export const VALIDATION_PATTERNS = {
  // Numeric Field Validations
  AADHAAR: /^\d{12}$/,
  MOBILE: /^[6-9]\d{9}$/,
  PIN_CODE: /^\d{6}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  
  // Text Field Validations
  NAME: /^[A-Za-z\s']{2,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CASTE_RELIGION: /^[A-Za-z\s]{2,30}$/,
  
  // Address Field Validations
  ADDRESS: /^[A-Za-z0-9\s,.\-#/]{10,200}$/,
  LOCATION: /^[A-Za-z\s]{2,50}$/,
  
  // Financial/Numeric Amount Validations
  AMOUNT: /^\d+(\.\d{1,2})?$/,
  AREA_MEASUREMENT: /^\d{1,4}(\.\d{1,2})?$/,
  FAMILY_MEMBERS: /^([1-9]|[1-4][0-9]|50)$/,
  
  // Bank Details Validation
  BANK_ACCOUNT: /^\d{9,18}$/,
  IFSC: /^[A-Z]{4}[A-Z0-9]{7}$/,
  
  // Service-Specific Validations
  SURVEY_NUMBER: /^[A-Za-z0-9\/\-]{1,20}$/,
  CROP_NAME: /^[A-Za-z\s]{2,30}$/,
  PROPERTY_ID: /^[A-Za-z0-9\-]{5,20}$/,
  BUILT_UP_AREA: /^\d{1,6}(\.\d{1,2})?$/,
  ROLL_NUMBER: /^[A-Za-z0-9]{5,15}$/,
  PERCENTAGE: /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
  
  // Other Patterns
  VOTER_ID: /^[A-Z]{3}[0-9]{7}$/,
  FILE_NAME: /^[A-Za-z0-9\-_\s.]+$/
};

// Enhanced validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  
  // Numeric Field Messages
  INVALID_AADHAAR: 'Aadhaar number must be exactly 12 digits',
  INVALID_MOBILE: 'Mobile number must be 10 digits starting with 6, 7, 8, or 9',
  INVALID_PIN: 'PIN code must be exactly 6 digits',
  INVALID_PAN: 'PAN format should be ABCDE1234F',
  INVALID_AGE: 'Age must be between 0 and 120',
  
  // Text Field Messages
  INVALID_NAME: 'Name should contain only alphabetic characters',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_CASTE_RELIGION: 'Please enter valid caste/religion/category',
  
  // Address Field Messages
  INVALID_ADDRESS: 'Address must be between 10-200 characters',
  INVALID_LOCATION: 'Please enter valid location name',
  
  // Financial/Numeric Messages
  INVALID_AMOUNT: 'Please enter valid amount',
  INVALID_AREA: 'Please enter valid area measurement',
  INVALID_FAMILY_MEMBERS: 'Family members must be between 1-50',
  
  // Bank Details Messages
  INVALID_BANK_ACCOUNT: 'Account number must be 9-18 digits',
  INVALID_IFSC: 'Invalid IFSC code format (e.g., SBIN0001234)',
  
  // Date Messages
  INVALID_DATE: 'Please enter a valid date',
  INVALID_BIRTH_DATE: 'Please enter a valid birth date',
  INVALID_DEATH_DATE: 'Death date must be after birth date',
  INVALID_MARRIAGE_DATE: 'Marriage date invalid or parties underage',
  
  // Service-Specific Messages
  INVALID_SURVEY_NUMBER: 'Invalid survey number format',
  INVALID_CROP_NAME: 'Please enter valid crop name',
  INVALID_PROPERTY_ID: 'Invalid property ID format',
  INVALID_BUILT_UP_AREA: 'Please enter valid built-up area',
  INVALID_ROLL_NUMBER: 'Invalid roll number format',
  INVALID_PERCENTAGE: 'Percentage must be between 0-100',
  
  // File Upload Messages
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Only PDF, JPG, PNG files allowed',
  INVALID_FILE_NAME: 'Invalid file name format',
  TOO_MANY_FILES: 'Maximum 10 files per application',
  TOTAL_SIZE_EXCEEDED: 'Total file size must be less than 50MB',
  
  // Age-specific Messages
  MINIMUM_AGE_BRIDE: 'Bride must be at least 18 years old on marriage date',
  MINIMUM_AGE_GROOM: 'Groom must be at least 21 years old on marriage date'
};

// Enhanced validation functions
export const validateField = (value, type, required = false, options = {}) => {
  // Check if required field is empty
  if (required && (!value || value.toString().trim() === '')) {
    return VALIDATION_MESSAGES.REQUIRED;
  }

  // If not required and empty, return null (valid)
  if (!value || value.toString().trim() === '') {
    return null;
  }

  // Type-specific validation
  switch (type) {
    // Numeric Field Validations
    case 'aadhaar':
      return VALIDATION_PATTERNS.AADHAAR.test(value) ? null : VALIDATION_MESSAGES.INVALID_AADHAAR;
    
    case 'mobile':
      return VALIDATION_PATTERNS.MOBILE.test(value) ? null : VALIDATION_MESSAGES.INVALID_MOBILE;
    
    case 'pincode':
      return VALIDATION_PATTERNS.PIN_CODE.test(value) ? null : VALIDATION_MESSAGES.INVALID_PIN;
    
    case 'pan':
      return VALIDATION_PATTERNS.PAN.test(value.toUpperCase()) ? null : VALIDATION_MESSAGES.INVALID_PAN;
    
    case 'age':
      const age = parseInt(value);
      return (age >= 0 && age <= 120) ? null : VALIDATION_MESSAGES.INVALID_AGE;
    
    // Text Field Validations
    case 'name':
      return VALIDATION_PATTERNS.NAME.test(value) ? null : VALIDATION_MESSAGES.INVALID_NAME;
    
    case 'email':
      return VALIDATION_PATTERNS.EMAIL.test(value.toLowerCase()) ? null : VALIDATION_MESSAGES.INVALID_EMAIL;
    
    case 'caste':
    case 'religion':
    case 'category':
      return VALIDATION_PATTERNS.CASTE_RELIGION.test(value) ? null : VALIDATION_MESSAGES.INVALID_CASTE_RELIGION;
    
    // Address Field Validations
    case 'address':
      return VALIDATION_PATTERNS.ADDRESS.test(value) ? null : VALIDATION_MESSAGES.INVALID_ADDRESS;
    
    case 'location':
    case 'village':
    case 'city':
    case 'district':
    case 'state':
      return VALIDATION_PATTERNS.LOCATION.test(value) ? null : VALIDATION_MESSAGES.INVALID_LOCATION;
    
    // Financial/Numeric Amount Validations
    case 'amount':
      const amount = parseFloat(value);
      return (amount >= 0 && VALIDATION_PATTERNS.AMOUNT.test(value)) ? null : VALIDATION_MESSAGES.INVALID_AMOUNT;
    
    case 'area':
      return VALIDATION_PATTERNS.AREA_MEASUREMENT.test(value) ? null : VALIDATION_MESSAGES.INVALID_AREA;
    
    case 'familyMembers':
      return VALIDATION_PATTERNS.FAMILY_MEMBERS.test(value) ? null : VALIDATION_MESSAGES.INVALID_FAMILY_MEMBERS;
    
    // Bank Details Validation
    case 'bankAccount':
      return VALIDATION_PATTERNS.BANK_ACCOUNT.test(value) ? null : VALIDATION_MESSAGES.INVALID_BANK_ACCOUNT;
    
    case 'ifsc':
      return VALIDATION_PATTERNS.IFSC.test(value.toUpperCase()) ? null : VALIDATION_MESSAGES.INVALID_IFSC;
    
    // Date Validations
    case 'date':
      const date = new Date(value);
      return !isNaN(date.getTime()) ? null : VALIDATION_MESSAGES.INVALID_DATE;
    
    case 'birthDate':
      const birthDate = new Date(value);
      const today = new Date();
      const maxAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
      return (!isNaN(birthDate.getTime()) && birthDate <= today && birthDate >= maxAge) 
        ? null : VALIDATION_MESSAGES.INVALID_BIRTH_DATE;
    
    case 'deathDate':
      if (options.birthDate) {
        const deathDate = new Date(value);
        const birthDate = new Date(options.birthDate);
        const today = new Date();
        return (!isNaN(deathDate.getTime()) && deathDate <= today && deathDate >= birthDate) 
          ? null : VALIDATION_MESSAGES.INVALID_DEATH_DATE;
      }
      return validateField(value, 'date', required);
    
    // Service-Specific Validations
    case 'surveyNumber':
      return VALIDATION_PATTERNS.SURVEY_NUMBER.test(value) ? null : VALIDATION_MESSAGES.INVALID_SURVEY_NUMBER;
    
    case 'cropName':
      return VALIDATION_PATTERNS.CROP_NAME.test(value) ? null : VALIDATION_MESSAGES.INVALID_CROP_NAME;
    
    case 'propertyId':
      return VALIDATION_PATTERNS.PROPERTY_ID.test(value) ? null : VALIDATION_MESSAGES.INVALID_PROPERTY_ID;
    
    case 'builtUpArea':
      return VALIDATION_PATTERNS.BUILT_UP_AREA.test(value) ? null : VALIDATION_MESSAGES.INVALID_BUILT_UP_AREA;
    
    case 'rollNumber':
      return VALIDATION_PATTERNS.ROLL_NUMBER.test(value) ? null : VALIDATION_MESSAGES.INVALID_ROLL_NUMBER;
    
    case 'percentage':
      return VALIDATION_PATTERNS.PERCENTAGE.test(value) ? null : VALIDATION_MESSAGES.INVALID_PERCENTAGE;
    
    default:
      return null;
  }
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return '';
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Enhanced file validation
export const validateFile = (file, existingFiles = []) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 10;
  const maxTotalSize = 50 * 1024 * 1024; // 50MB

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return VALIDATION_MESSAGES.INVALID_FILE_TYPE;
  }

  // Check individual file size
  if (file.size > maxSize) {
    return VALIDATION_MESSAGES.FILE_TOO_LARGE;
  }

  // Check file name format
  if (!VALIDATION_PATTERNS.FILE_NAME.test(file.name)) {
    return VALIDATION_MESSAGES.INVALID_FILE_NAME;
  }

  // Check maximum number of files
  if (existingFiles.length >= maxFiles) {
    return VALIDATION_MESSAGES.TOO_MANY_FILES;
  }

  // Check total size limit
  const totalSize = existingFiles.reduce((sum, f) => sum + f.size, 0) + file.size;
  if (totalSize > maxTotalSize) {
    return VALIDATION_MESSAGES.TOTAL_SIZE_EXCEEDED;
  }

  return null;
};

// Cross-field validations
export const validateMarriageAge = (brideAge, groomAge, marriageDate) => {
  const errors = {};
  
  if (brideAge < 18) {
    errors.brideAge = VALIDATION_MESSAGES.MINIMUM_AGE_BRIDE;
  }
  
  if (groomAge < 21) {
    errors.groomAge = VALIDATION_MESSAGES.MINIMUM_AGE_GROOM;
  }
  
  return errors;
};

export const validateDateConsistency = (birthDate, deathDate, marriageDate) => {
  const errors = {};
  const birth = new Date(birthDate);
  
  if (deathDate) {
    const death = new Date(deathDate);
    if (death <= birth) {
      errors.deathDate = VALIDATION_MESSAGES.INVALID_DEATH_DATE;
    }
  }
  
  if (marriageDate) {
    const marriage = new Date(marriageDate);
    const marriageAge = calculateAge(birthDate, marriage);
    if (marriageAge < 18) {
      errors.marriageDate = VALIDATION_MESSAGES.INVALID_MARRIAGE_DATE;
    }
  }
  
  return errors;
};

// Auto-correction functions
export const autoCorrect = {
  email: (value) => value ? value.toLowerCase().trim() : '',
  name: (value) => value ? value.trim().replace(/\s+/g, ' ') : '',
  mobile: (value) => value ? value.replace(/[\s\-]/g, '') : '',
  pan: (value) => value ? value.toUpperCase().trim() : '',
  ifsc: (value) => value ? value.toUpperCase().trim() : '',
  aadhaar: (value) => value ? value.replace(/\s/g, '') : '',
  pincode: (value) => value ? value.replace(/\D/g, '') : '',
  amount: (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  }
};

// Validate entire form
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(fieldName => {
    const rule = validationRules[fieldName];
    const value = formData[fieldName];
    
    const error = validateField(value, rule.type, rule.required);
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Format display values
export const formatters = {
  aadhaar: (value) => value ? value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3') : '',
  mobile: (value) => value ? `+91 ${value}` : '',
  currency: (value) => value ? `₹${parseFloat(value).toLocaleString('en-IN')}` : '',
  date: (value) => value ? new Date(value).toLocaleDateString('en-IN') : '',
  capitalize: (value) => value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''
};

// Generate application ID
export const generateApplicationId = (serviceType) => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  const serviceCode = serviceType.substring(0, 3).toUpperCase();
  return `${serviceCode}${timestamp.slice(-6)}${random}`;
};

// Form field configurations for different services
export const FORM_CONFIGS = {
  AGRICULTURAL_SUBSIDY: {
    steps: [
      { id: 'personal', title: 'Personal Information', icon: 'Person' },
      { id: 'project', title: 'Project Details', icon: 'Agriculture' },
      { id: 'land', title: 'Land Details', icon: 'Landscape' },
      { id: 'financial', title: 'Financial Details', icon: 'AccountBalance' },
      { id: 'documents', title: 'Documents', icon: 'Description' }
    ],
    validationRules: {
      applicantName: { type: 'text', required: true },
      fatherName: { type: 'text', required: true },
      dateOfBirth: { type: 'date', required: true },
      gender: { type: 'text', required: true },
      mobile: { type: 'mobile', required: true },
      email: { type: 'email', required: false },
      aadhaar: { type: 'aadhaar', required: true },
      address: { type: 'text', required: true },
      pincode: { type: 'pincode', required: true }
    }
  }
};
