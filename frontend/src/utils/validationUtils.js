/**
 * Comprehensive validation utilities for Gram Panchayat forms
 */

// Aadhaar validation
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) return null;
  
  // Remove spaces and hyphens
  const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');
  
  // Check if 12 digits
  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return 'Aadhaar must be 12 digits';
  }
  
  // Basic checksum validation (Verhoeff algorithm)
  const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ];
  
  const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ];
  
  let c = 0;
  const myArray = cleanAadhaar.split('').map(Number).reverse();
  
  for (let i = 0; i < myArray.length; i++) {
    c = d[c][p[((i + 1) % 8)][myArray[i]]];
  }
  
  return c === 0 ? null : 'Invalid Aadhaar number';
};

// Mobile number validation
export const validateMobile = (mobile) => {
  if (!mobile) return null;
  
  const cleanMobile = mobile.replace(/[\s-]/g, '');
  
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    return 'Mobile number must be 10 digits starting with 6-9';
  }
  
  return null;
};

// Email validation
export const validateEmail = (email) => {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : 'Invalid email format';
};

// PAN validation
export const validatePAN = (pan) => {
  if (!pan) return null;
  
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase()) ? null : 'Invalid PAN format (ABCDE1234F)';
};

// Pincode validation
export const validatePincode = (pincode) => {
  if (!pincode) return null;
  
  if (!/^\d{6}$/.test(pincode)) {
    return 'Pincode must be 6 digits';
  }
  
  return null;
};

// Date validation
export const validateDate = (date, label = 'Date') => {
  if (!date) return null;
  
  const selectedDate = new Date(date);
  const today = new Date();
  
  if (selectedDate > today) {
    return `${label} cannot be in the future`;
  }
  
  const minDate = new Date('1900-01-01');
  if (selectedDate < minDate) {
    return `${label} cannot be before 1900`;
  }
  
  return null;
};

// Age validation based on date of birth
export const validateAge = (dateOfBirth, minAge = 0, maxAge = 150) => {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return `Age must be at least ${minAge} years`;
  }
  
  if (age > maxAge) {
    return `Age cannot exceed ${maxAge} years`;
  }
  
  return null;
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
    required = false
  } = options;
  
  if (!file) {
    return required ? 'File is required' : null;
  }
  
  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return `File type not allowed. Allowed types: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
  }
  
  return null;
};

// Survey number validation
export const validateSurveyNumber = (surveyNo) => {
  if (!surveyNo) return null;
  
  // Basic format: numbers, hyphens, slashes allowed
  if (!/^[\d\/\-]+$/.test(surveyNo)) {
    return 'Invalid survey number format';
  }
  
  return null;
};

// Bank account validation
export const validateBankAccount = (accountNo) => {
  if (!accountNo) return null;
  
  const cleanAccount = accountNo.replace(/[\s-]/g, '');
  
  if (!/^\d{9,18}$/.test(cleanAccount)) {
    return 'Bank account number must be 9-18 digits';
  }
  
  return null;
};

// IFSC code validation
export const validateIFSC = (ifsc) => {
  if (!ifsc) return null;
  
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.toUpperCase()) ? null : 'Invalid IFSC code format';
};

// Income validation
export const validateIncome = (income, minIncome = 0, maxIncome = 10000000) => {
  if (!income) return null;
  
  const numIncome = parseFloat(income);
  
  if (isNaN(numIncome)) {
    return 'Income must be a valid number';
  }
  
  if (numIncome < minIncome) {
    return `Income must be at least ₹${minIncome}`;
  }
  
  if (numIncome > maxIncome) {
    return `Income cannot exceed ₹${maxIncome.toLocaleString()}`;
  }
  
  return null;
};

// Area validation (for land/property)
export const validateArea = (area, unit = 'sq ft') => {
  if (!area) return null;
  
  const numArea = parseFloat(area);
  
  if (isNaN(numArea) || numArea <= 0) {
    return `Area must be a positive number in ${unit}`;
  }
  
  return null;
};

// Generic required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Name validation (no numbers or special chars)
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return null;
  
  if (!/^[a-zA-Z\s.]+$/.test(name)) {
    return `${fieldName} should contain only letters, spaces, and dots`;
  }
  
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters`;
  }
  
  if (name.length > 100) {
    return `${fieldName} cannot exceed 100 characters`;
  }
  
  return null;
};

// Validation composer - runs multiple validations
export const validateField = (value, validations = []) => {
  for (const validation of validations) {
    const error = validation(value);
    if (error) return error;
  }
  return null;
};

// Form-specific validation sets
export const getValidationRules = (serviceType) => {
  const baseRules = {
    name: [
      (value) => validateRequired(value, 'Name'),
      (value) => validateName(value)
    ],
    mobile: [
      (value) => validateRequired(value, 'Mobile number'),
      validateMobile
    ],
    email: [validateEmail],
    aadhaar: [validateAadhaar],
    date: [
      (value) => validateRequired(value, 'Date'),
      validateDate
    ],
    address: [
      (value) => validateRequired(value, 'Address'),
      (value) => value && value.length < 10 ? 'Address must be at least 10 characters' : null
    ]
  };
  
  // Service-specific rules
  const serviceRules = {
    birth_certificate: {
      childName: baseRules.name,
      dateOfBirth: [
        (value) => validateRequired(value, 'Date of Birth'),
        (value) => validateDate(value, 'Date of Birth')
      ],
      fatherName: baseRules.name,
      motherName: baseRules.name,
      placeOfBirth: [
        (value) => validateRequired(value, 'Place of Birth'),
        (value) => validateName(value, 'Place of Birth')
      ]
    },
    // Add more service-specific rules as needed
  };
  
  return { ...baseRules, ...(serviceRules[serviceType] || {}) };
};

export default {
  validateAadhaar,
  validateMobile,
  validateEmail,
  validatePAN,
  validatePincode,
  validateDate,
  validateAge,
  validateFile,
  validateSurveyNumber,
  validateBankAccount,
  validateIFSC,
  validateIncome,
  validateArea,
  validateRequired,
  validateName,
  validateField,
  getValidationRules
};
