import React from 'react';
import {
  Assignment,
  AccountBalance,
  Business,
  LocalHospital,
  Receipt,
  People,
  Home,
  School,
  Agriculture,
  Build
} from '@mui/icons-material';

// Comprehensive service data - aligned with original servicesData.js IDs
export const allServicesData = {
  // 1. Birth Certificate
  1: {
    id: 1,
    title: 'Birth Certificate',
    description: 'Registration and issuance of birth certificate',
    category: 'Civil Registration',
    icon: <Assignment color="primary" />,
    processingTime: '7-10 days',
    fee: '₹50',
    formFields: {
      childName: { type: 'text', required: true, label: 'Child Full Name' },
      dateOfBirth: { type: 'date', required: true, label: 'Date of Birth' },
      timeOfBirth: { type: 'time', required: false, label: 'Time of Birth' },
      gender: { type: 'select', required: true, label: 'Gender', options: ['Male', 'Female', 'Other'] },
      placeOfBirth: { type: 'text', required: true, label: 'Place of Birth' },
      hospitalName: { type: 'text', required: false, label: 'Hospital/Institution Name' },
      fatherName: { type: 'text', required: true, label: 'Father Full Name' },
      fatherAge: { type: 'number', required: true, label: 'Father Age' },
      fatherAadhaar: { type: 'aadhaar', required: false, label: 'Father Aadhaar' },
      motherName: { type: 'text', required: true, label: 'Mother Full Name' },
      motherAge: { type: 'number', required: true, label: 'Mother Age' },
      motherAadhaar: { type: 'aadhaar', required: false, label: 'Mother Aadhaar' },
      address: { type: 'textarea', required: true, label: 'Permanent Address' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      informantName: { type: 'text', required: true, label: 'Informant Name' },
      informantRelation: { type: 'text', required: true, label: 'Relation to Child' },
      hospitalSlip: { type: 'file', required: true, label: 'Hospital Birth Slip', accept: 'image/*,application/pdf' },
      affidavitFile: { type: 'file', required: false, label: 'Delayed Registration Affidavit', accept: 'application/pdf' }
    },
    hasForm: true
  },

  // 2. Death Certificate  
  2: {
    id: 2,
    title: 'Death Certificate',
    description: 'Registration and issuance of death certificate',
    category: 'Civil Registration',
    icon: <Assignment color="primary" />,
    processingTime: '5-7 days',
    fee: '₹50',
    formFields: {
      deceasedName: { type: 'text', required: true, label: 'Deceased Full Name' },
      fatherHusbandName: { type: 'text', required: false, label: 'Father/Husband Name' },
      dateOfDeath: { type: 'date', required: true, label: 'Date of Death' },
      placeOfDeath: { type: 'text', required: true, label: 'Place of Death' },
      ageAtDeath: { type: 'number', required: true, label: 'Age at Death' },
      causeOfDeath: { type: 'text', required: false, label: 'Cause of Death' },
      informantName: { type: 'text', required: true, label: 'Informant Name' },
      relationToDeceased: { type: 'text', required: true, label: 'Relation to Deceased' },
      address: { type: 'textarea', required: true, label: 'Address' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      deathProof: { type: 'file', required: true, label: 'Death Proof', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 3. Marriage Certificate
  3: {
    id: 3,
    title: 'Marriage Certificate',
    description: 'Registration and issuance of marriage certificate',
    category: 'Civil Registration',
    icon: <Assignment color="primary" />,
    processingTime: '10-15 days',
    fee: '₹100',
    formFields: {
      brideName: { type: 'text', required: true, label: 'Bride Full Name' },
      brideAge: { type: 'number', required: true, label: 'Bride Age' },
      brideAadhaar: { type: 'aadhaar', required: true, label: 'Bride Aadhaar' },
      groomName: { type: 'text', required: true, label: 'Groom Full Name' },
      groomAge: { type: 'number', required: true, label: 'Groom Age' },
      groomAadhaar: { type: 'aadhaar', required: true, label: 'Groom Aadhaar' },
      marriageDate: { type: 'date', required: true, label: 'Date of Marriage' },
      marriagePlace: { type: 'text', required: true, label: 'Place of Marriage' },
      witness1Name: { type: 'text', required: true, label: 'Witness 1 Name' },
      witness1Address: { type: 'textarea', required: true, label: 'Witness 1 Address' },
      witness2Name: { type: 'text', required: true, label: 'Witness 2 Name' },
      witness2Address: { type: 'textarea', required: true, label: 'Witness 2 Address' },
      marriageInvitation: { type: 'file', required: true, label: 'Marriage Invitation', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 7. Trade License (from original)
  7: {
    id: 7,
    title: 'Trade License',
    description: 'Apply for new trade license or renewal',
    category: 'Business Services',
    icon: <Business color="primary" />,
    processingTime: '15-30 days',
    fee: '₹500-2000',
    formFields: {
      proprietorName: { type: 'text', required: true, label: 'Proprietor Name' },
      businessName: { type: 'text', required: true, label: 'Business Name' },
      businessType: { type: 'text', required: true, label: 'Business Type' },
      businessAddress: { type: 'textarea', required: true, label: 'Business Address' },
      natureOfBusiness: { type: 'text', required: true, label: 'Nature of Services/Goods' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      ownershipProof: { type: 'file', required: true, label: 'Lease/Ownership Proof', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 8. Building Permission (from original)
  8: {
    id: 8,
    title: 'Building Permission',
    description: 'Permission for construction of residential/commercial buildings',
    category: 'Business Services',
    icon: <Build color="primary" />,
    processingTime: '30-45 days',
    fee: '₹1000-5000',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      plotNumber: { type: 'text', required: true, label: 'Plot/Survey Number' },
      ownershipProof: { type: 'text', required: true, label: 'Ownership Type' },
      proposedUse: { type: 'select', required: true, label: 'Proposed Use', options: ['Residential', 'Commercial', 'Industrial'] },
      floorDetails: { type: 'text', required: true, label: 'Floor Details' },
      setbackDetails: { type: 'text', required: true, label: 'Setback Details' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      architectName: { type: 'text', required: false, label: 'Architect Name' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      buildingPlans: { type: 'file', required: true, label: 'Building Plans', accept: 'image/*,application/pdf' },
      titleDeed: { type: 'file', required: true, label: 'Title Deed/Khata', accept: 'image/*,application/pdf' },
      siteDeclaration: { type: 'file', required: true, label: 'Site Declaration', accept: 'application/pdf' }
    },
    hasForm: true
  },

  // 9. Income Certificate (from original)
  9: {
    id: 9,
    title: 'Income Certificate',
    description: 'Certificate of income for various government benefits',
    category: 'Social Welfare',
    icon: <Receipt color="primary" />,
    processingTime: '7-15 days',
    fee: '₹30',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      fatherHusbandName: { type: 'text', required: true, label: 'Father/Husband Name' },
      address: { type: 'textarea', required: true, label: 'Address' },
      annualIncome: { type: 'number', required: true, label: 'Annual Income (₹)' },
      sourceOfIncome: { type: 'text', required: true, label: 'Source of Income' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      employerSlip: { type: 'file', required: true, label: 'Employer Slip/Income Proof', accept: 'image/*,application/pdf' },
      rationCard: { type: 'file', required: false, label: 'Ration Card', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 10. Caste Certificate (from original)
  10: {
    id: 10,
    title: 'Caste Certificate',
    description: 'Certificate of caste for reservation benefits',
    category: 'Social Welfare',
    icon: <People color="primary" />,
    processingTime: '15-30 days',
    fee: '₹30',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      fatherHusbandName: { type: 'text', required: true, label: 'Father/Husband Name' },
      caste: { type: 'text', required: true, label: 'Caste' },
      subCaste: { type: 'text', required: true, label: 'Sub-Caste' },
      religion: { type: 'select', required: true, label: 'Religion', options: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other'] },
      address: { type: 'textarea', required: true, label: 'Address' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      purpose: { type: 'text', required: true, label: 'Purpose' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      parentCasteCertificate: { type: 'file', required: true, label: 'Parent Caste Certificate', accept: 'image/*,application/pdf' },
      affidavit: { type: 'file', required: true, label: 'Caste Affidavit', accept: 'application/pdf' }
    },
    hasForm: true
  },

  // 11. Domicile Certificate (from original)
  11: {
    id: 11,
    title: 'Domicile Certificate',
    description: 'Certificate of permanent residence',
    category: 'Social Welfare',
    icon: <Home color="primary" />,
    processingTime: '10-20 days',
    fee: '₹30',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      fatherHusbandName: { type: 'text', required: true, label: 'Father/Husband Name' },
      dateOfBirth: { type: 'date', required: true, label: 'Date of Birth' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      permanentAddress: { type: 'textarea', required: true, label: 'Permanent Address' },
      yearsOfStay: { type: 'number', required: true, label: 'Years of Stay' },
      purpose: { type: 'text', required: true, label: 'Purpose' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      residenceProof: { type: 'file', required: true, label: 'Residence Proof', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 12. BPL Certificate (from original)
  12: {
    id: 12,
    title: 'BPL Certificate',
    description: 'Below Poverty Line certificate for subsidies',
    category: 'Social Welfare',
    icon: <People color="primary" />,
    processingTime: '20-30 days',
    fee: 'Free',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      fatherHusbandName: { type: 'text', required: true, label: 'Father/Husband Name' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      rationCardNumber: { type: 'text', required: true, label: 'Ration Card Number' },
      address: { type: 'textarea', required: true, label: 'Address' },
      familyMembers: { type: 'repeater', required: true, label: 'Family Members', 
        fields: {
          name: { type: 'text', required: true, label: 'Name' },
          age: { type: 'number', required: true, label: 'Age' },
          relation: { type: 'text', required: true, label: 'Relation' }
        }
      },
      annualIncome: { type: 'number', required: true, label: 'Annual Household Income (₹)' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      incomeProof: { type: 'file', required: true, label: 'Income Proof', accept: 'image/*,application/pdf' },
      rationCard: { type: 'file', required: true, label: 'Ration Card', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 18. Agricultural Subsidy (from original)
  18: {
    id: 18,
    title: 'Agricultural Subsidy',
    description: 'Subsidy applications for farming equipment and seeds',
    category: 'Agriculture',
    icon: <Agriculture color="primary" />,
    processingTime: '30-60 days',
    fee: 'Free',
    formFields: {
      farmerName: { type: 'text', required: true, label: 'Farmer Name' },
      fatherName: { type: 'text', required: true, label: 'Father Name' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar/Farmer ID' },
      surveyNumber: { type: 'text', required: true, label: 'Survey Number' },
      landArea: { type: 'number', required: true, label: 'Land Area (Acres)' },
      cropType: { type: 'text', required: true, label: 'Crop Type' },
      season: { type: 'select', required: true, label: 'Season', options: ['Kharif', 'Rabi', 'Summer'] },
      subsidyType: { type: 'text', required: true, label: 'Subsidy Type' },
      bankAccount: { type: 'text', required: true, label: 'Bank Account Number' },
      ifscCode: { type: 'text', required: true, label: 'IFSC Code' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      landOwnershipProof: { type: 'file', required: true, label: 'Land Ownership Proof', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 19. Crop Insurance (from original)
  19: {
    id: 19,
    title: 'Crop Insurance',
    description: 'Registration for crop insurance schemes',
    category: 'Agriculture',
    icon: <Agriculture color="primary" />,
    processingTime: '15-30 days',
    fee: 'As per scheme',
    formFields: {
      farmerName: { type: 'text', required: true, label: 'Farmer Name' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar/Farmer ID' },
      surveyNumber: { type: 'text', required: false, label: 'Survey Number' },
      cropType: { type: 'text', required: true, label: 'Crop Type' },
      landArea: { type: 'number', required: true, label: 'Area (Acres)' },
      insuranceScheme: { type: 'text', required: true, label: 'Insurance Scheme' },
      season: { type: 'select', required: true, label: 'Season', options: ['Kharif', 'Rabi', 'Summer'] },
      bankAccount: { type: 'text', required: true, label: 'Bank Account Number' },
      ifscCode: { type: 'text', required: true, label: 'IFSC Code' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      landRecord: { type: 'file', required: true, label: 'Land Record', accept: 'image/*,application/pdf' },
      sowingReceipt: { type: 'file', required: false, label: 'Sowing Receipt', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 20. School Transfer Certificate
  20: {
    id: 20,
    title: 'School Transfer Certificate',
    description: 'Transfer certificate for school students',
    category: 'Education',
    icon: <School color="primary" />,
    processingTime: '5-10 days',
    fee: '₹50',
    formFields: {
      studentName: { type: 'text', required: true, label: 'Student Name' },
      parentName: { type: 'text', required: true, label: 'Parent Name' },
      currentClass: { type: 'text', required: true, label: 'Current Class/Section' },
      previousSchool: { type: 'text', required: true, label: 'Previous School Details' },
      reasonForTransfer: { type: 'text', required: true, label: 'Reason for Transfer' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      previousReportCard: { type: 'file', required: true, label: 'Previous Report Card', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 21. Scholarship Application
  21: {
    id: 21,
    title: 'Scholarship Application',
    description: 'Application for government scholarships',
    category: 'Education',
    icon: <School color="primary" />,
    processingTime: '45-60 days',
    fee: 'Free',
    formFields: {
      studentName: { type: 'text', required: true, label: 'Student Name' },
      parentName: { type: 'text', required: true, label: 'Parent Name' },
      dateOfBirth: { type: 'date', required: true, label: 'Date of Birth' },
      schoolCollege: { type: 'text', required: true, label: 'School/College Name' },
      classCourse: { type: 'text', required: true, label: 'Class/Course' },
      caste: { type: 'text', required: true, label: 'Caste' },
      category: { type: 'select', required: true, label: 'Category', options: ['SC', 'ST', 'OBC', 'General'] },
      annualFamilyIncome: { type: 'number', required: true, label: 'Annual Family Income (₹)' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      bankAccount: { type: 'text', required: true, label: 'Bank Account Number' },
      ifscCode: { type: 'text', required: true, label: 'IFSC Code' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      bonafideCertificate: { type: 'file', required: true, label: 'Bonafide Certificate', accept: 'image/*,application/pdf' },
      marksheet: { type: 'file', required: true, label: 'Previous Marksheet', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 4. Property Tax Payment (from original)
  4: {
    id: 4,
    title: 'Property Tax Payment',
    description: 'Online payment of property tax with instant receipt',
    category: 'Revenue Services',
    icon: <AccountBalance color="primary" />,
    processingTime: 'Instant',
    fee: 'As per assessment',
    formFields: {
      propertyId: { type: 'text', required: true, label: 'Property ID/Survey Number' },
      ownerName: { type: 'text', required: true, label: 'Property Owner Name' },
      propertyAddress: { type: 'textarea', required: true, label: 'Property Address' },
      propertyType: { type: 'select', required: true, label: 'Property Type', options: ['Residential', 'Commercial', 'Industrial', 'Agricultural'] },
      assessmentYear: { type: 'select', required: true, label: 'Assessment Year', options: ['2023-24', '2024-25'] },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      paymentMode: { type: 'select', required: true, label: 'Payment Mode', options: ['Online', 'Cash', 'Cheque', 'DD'] },
      propertyDocument: { type: 'file', required: true, label: 'Property Document/Title Deed', accept: 'image/*,application/pdf' },
      previousReceipt: { type: 'file', required: false, label: 'Previous Tax Receipt', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 13. Health Certificate (from original)
  13: {
    id: 13,
    title: 'Health Certificate',
    description: 'Medical fitness certificate for various purposes',
    category: 'Health Services',
    icon: <LocalHospital color="primary" />,
    processingTime: '3-5 days',
    fee: '₹100',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      fatherHusbandName: { type: 'text', required: true, label: 'Father/Husband Name' },
      dateOfBirth: { type: 'date', required: true, label: 'Date of Birth' },
      age: { type: 'number', required: true, label: 'Age' },
      gender: { type: 'select', required: true, label: 'Gender', options: ['Male', 'Female', 'Other'] },
      address: { type: 'textarea', required: true, label: 'Address' },
      purpose: { type: 'text', required: true, label: 'Purpose of Certificate' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      medicalReport: { type: 'file', required: true, label: 'Medical Examination Report', accept: 'image/*,application/pdf' },
      photograph: { type: 'file', required: true, label: 'Passport Size Photograph', accept: 'image/*' }
    },
    hasForm: true
  },

  // 14. Vaccination Certificate (from original)
  14: {
    id: 14,
    title: 'Vaccination Certificate',
    description: 'Certificate of vaccination for travel/employment',
    category: 'Health Services',
    icon: <LocalHospital color="primary" />,
    processingTime: '1-3 days',
    fee: '₹50',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      dateOfBirth: { type: 'date', required: true, label: 'Date of Birth' },
      age: { type: 'number', required: true, label: 'Age' },
      gender: { type: 'select', required: true, label: 'Gender', options: ['Male', 'Female', 'Other'] },
      address: { type: 'textarea', required: true, label: 'Address' },
      vaccinationType: { type: 'select', required: true, label: 'Vaccination Type', options: ['COVID-19', 'Hepatitis', 'Typhoid', 'Yellow Fever', 'Other'] },
      vaccinationDate: { type: 'date', required: true, label: 'Date of Vaccination' },
      vaccinationCenter: { type: 'text', required: true, label: 'Vaccination Center' },
      purpose: { type: 'text', required: true, label: 'Purpose (Travel/Employment)' },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      vaccinationRecord: { type: 'file', required: true, label: 'Vaccination Record/Card', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  },

  // 15. Water Connection (from original)
  15: {
    id: 15,
    title: 'Water Connection',
    description: 'New water connection or transfer of existing connection',
    category: 'Infrastructure',
    icon: <Home color="primary" />,
    processingTime: '10-15 days',
    fee: '₹1000',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      connectionType: { type: 'select', required: true, label: 'Connection Type', options: ['New Connection', 'Transfer', 'Additional Connection'] },
      propertyType: { type: 'select', required: true, label: 'Property Type', options: ['Residential', 'Commercial', 'Industrial'] },
      propertyAddress: { type: 'textarea', required: true, label: 'Property Address' },
      surveyNumber: { type: 'text', required: true, label: 'Survey/Plot Number' },
      ownershipType: { type: 'select', required: true, label: 'Ownership Type', options: ['Own', 'Rented', 'Leased'] },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      emergencyContact: { type: 'mobile', required: false, label: 'Emergency Contact Number' },
      propertyDocument: { type: 'file', required: true, label: 'Property Ownership Document', accept: 'image/*,application/pdf' },
      sitePlan: { type: 'file', required: true, label: 'Site Plan', accept: 'image/*,application/pdf' },
      photograph: { type: 'file', required: true, label: 'Property Photograph', accept: 'image/*' }
    },
    hasForm: true
  },

  // 16. Drainage Connection (from original)
  16: {
    id: 16,
    title: 'Drainage Connection',
    description: 'Connection to public drainage system',
    category: 'Infrastructure', 
    icon: <Build color="primary" />,
    processingTime: '15-20 days',
    fee: '₹1500',
    formFields: {
      applicantName: { type: 'text', required: true, label: 'Applicant Name' },
      propertyAddress: { type: 'textarea', required: true, label: 'Property Address' },
      surveyNumber: { type: 'text', required: true, label: 'Survey/Plot Number' },
      propertyType: { type: 'select', required: true, label: 'Property Type', options: ['Residential', 'Commercial', 'Industrial'] },
      connectionType: { type: 'select', required: true, label: 'Drainage Type', options: ['House Drainage', 'Toilet Drainage', 'Kitchen Drainage', 'Combined'] },
      ownershipType: { type: 'select', required: true, label: 'Ownership Type', options: ['Own', 'Rented', 'Leased'] },
      aadhaarNumber: { type: 'aadhaar', required: true, label: 'Aadhaar Number' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      propertyDocument: { type: 'file', required: true, label: 'Property Document', accept: 'image/*,application/pdf' },
      buildingPlan: { type: 'file', required: true, label: 'Building Plan', accept: 'image/*,application/pdf' },
      nocNeighbors: { type: 'file', required: true, label: 'NOC from Neighbors', accept: 'application/pdf' },
      sitePlan: { type: 'file', required: true, label: 'Site Plan', accept: 'image/*,application/pdf' }
    },
    hasForm: true
  }

};

export default allServicesData;
