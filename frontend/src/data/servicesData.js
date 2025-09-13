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

// Import form components
import BirthCertificateForm from '../components/forms/BirthCertificateForm';
import PropertyTaxForm from '../components/forms/PropertyTaxForm';

// Comprehensive service data - single source of truth
export const servicesData = {
  // Civil Registration Services (IDs 1-3)
  1: {
    id: 1,
    title: 'Birth Certificate',
    description: 'Registration and issuance of birth certificate',
    category: 'Civil Registration',
    icon: <Assignment color="primary" />,
    processingTime: '7-10 days',
    fee: '₹50',
    documentsRequired: [
      'Birth proof from hospital/medical certificate',
      'Identity proof of parents (Aadhar/PAN/Passport)',
      'Address proof (Ration card/Electricity bill/Rent agreement)',
      'Marriage certificate of parents (if available)',
      'Affidavit (if birth registration is delayed)'
    ],
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
      affidavitRequired: { type: 'checkbox', required: false, label: 'Delayed Registration (requires affidavit)' },
      hospitalSlip: { type: 'file', required: true, label: 'Hospital Birth Slip/Medical Certificate', accept: 'image/*,application/pdf' },
      parentIds: { type: 'file', required: true, label: 'Parents Aadhaar/ID Proof', accept: 'image/*,application/pdf' },
      addressProof: { type: 'file', required: true, label: 'Address Proof', accept: 'image/*,application/pdf' },
      marriageCertificate: { type: 'file', required: false, label: 'Marriage Certificate', accept: 'image/*,application/pdf' },
      affidavitFile: { type: 'file', required: false, label: 'Delayed Registration Affidavit', accept: 'application/pdf' }
    },
    process: [
      'Fill the online application form',
      'Upload required documents',
      'Pay the application fee',
      'Submit the application',
      'Track application status online',
      'Collect certificate from office or get it delivered'
    ],
    eligibility: 'For births registered within 21 days - free, after 21 days - with late fee',
    hasForm: true,
    component: BirthCertificateForm
  },
  
  2: {
    id: 2,
    title: 'Death Certificate',
    description: 'Registration and issuance of death certificate',
    category: 'Civil Registration',
    icon: <Assignment color="primary" />,
    processingTime: '5-7 days',
    fee: '₹50',
    documentsRequired: [
      'Death proof from hospital/doctor',
      'ID proof of deceased',
      'Applicant ID proof',
      'Address proof'
    ],
    formFields: {
      deceasedName: { type: 'text', required: true, label: 'Deceased Full Name' },
      fatherHusbandName: { type: 'text', required: false, label: 'Father/Husband Name' },
      dateOfDeath: { type: 'date', required: true, label: 'Date of Death' },
      timeOfDeath: { type: 'time', required: false, label: 'Time of Death' },
      placeOfDeath: { type: 'text', required: true, label: 'Place of Death' },
      ageAtDeath: { type: 'number', required: true, label: 'Age at Death' },
      gender: { type: 'select', required: true, label: 'Gender', options: ['Male', 'Female', 'Other'] },
      causeOfDeath: { type: 'text', required: false, label: 'Cause of Death' },
      informantName: { type: 'text', required: true, label: 'Informant Name' },
      relationToDeceased: { type: 'text', required: true, label: 'Relation to Deceased' },
      informantAddress: { type: 'textarea', required: true, label: 'Informant Address' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      deathProof: { type: 'file', required: true, label: 'Death Proof (Medical Certificate)', accept: 'image/*,application/pdf' },
      deceasedId: { type: 'file', required: false, label: 'Deceased ID Proof', accept: 'image/*,application/pdf' },
      informantId: { type: 'file', required: true, label: 'Informant ID Proof', accept: 'image/*,application/pdf' },
      addressProof: { type: 'file', required: true, label: 'Address Proof', accept: 'image/*,application/pdf' }
    },
    process: [
      'Fill the death certificate application',
      'Upload required documents',
      'Pay the application fee',
      'Submit for verification',
      'Collect certificate'
    ],
    eligibility: 'Family members or legal representatives',
    hasForm: true
  },
  
  3: {
    id: 3,
    title: 'Marriage Certificate',
    description: 'Registration and issuance of marriage certificate',
    category: 'Civil Registration',
    icon: <Assignment color="primary" />,
    processingTime: '10-15 days',
    fee: '₹100',
    documentsRequired: [
      'Marriage proof',
      'Age proof of both parties',
      'Address proof',
      '2 witnesses',
      'Photographs'
    ],
    formFields: {
      brideName: { type: 'text', required: true, label: 'Bride Full Name' },
      brideAge: { type: 'number', required: true, label: 'Bride Age' },
      brideAadhaar: { type: 'aadhaar', required: true, label: 'Bride Aadhaar' },
      brideFatherName: { type: 'text', required: true, label: 'Bride Father Name' },
      groomName: { type: 'text', required: true, label: 'Groom Full Name' },
      groomAge: { type: 'number', required: true, label: 'Groom Age' },
      groomAadhaar: { type: 'aadhaar', required: true, label: 'Groom Aadhaar' },
      groomFatherName: { type: 'text', required: true, label: 'Groom Father Name' },
      marriageDate: { type: 'date', required: true, label: 'Date of Marriage' },
      marriagePlace: { type: 'text', required: true, label: 'Place of Marriage' },
      marriageType: { type: 'select', required: true, label: 'Type of Marriage', options: ['Hindu', 'Muslim', 'Christian', 'Civil', 'Other'] },
      witness1Name: { type: 'text', required: true, label: 'Witness 1 Name' },
      witness1Address: { type: 'textarea', required: true, label: 'Witness 1 Address' },
      witness2Name: { type: 'text', required: true, label: 'Witness 2 Name' },
      witness2Address: { type: 'textarea', required: true, label: 'Witness 2 Address' },
      contactNumber: { type: 'mobile', required: true, label: 'Contact Number' },
      marriageInvitation: { type: 'file', required: true, label: 'Marriage Invitation/Proof', accept: 'image/*,application/pdf' },
      brideId: { type: 'file', required: true, label: 'Bride ID Proof', accept: 'image/*,application/pdf' },
      groomId: { type: 'file', required: true, label: 'Groom ID Proof', accept: 'image/*,application/pdf' },
      witness1Id: { type: 'file', required: true, label: 'Witness 1 ID Proof', accept: 'image/*,application/pdf' },
      witness2Id: { type: 'file', required: true, label: 'Witness 2 ID Proof', accept: 'image/*,application/pdf' },
      marriagePhotos: { type: 'file', required: true, label: 'Marriage Photographs', accept: 'image/*' }
    },
    process: [
      'Fill marriage certificate application',
      'Upload required documents',
      'Pay application fee',
      'Witness verification',
      'Certificate issuance'
    ],
    eligibility: 'Married couples within the jurisdiction',
    hasForm: true
  },
  
  // Revenue Services (IDs 4-6)
  4: {
    id: 4,
    title: 'Property Tax Payment',
    description: 'Online payment of property tax with instant receipt',
    category: 'Revenue Services',
    icon: <AccountBalance color="primary" />,
    processingTime: 'Instant',
    fee: 'As per assessment',
    documentsRequired: [
      'Property documents/Title deed',
      'Previous tax receipt',
      'Property ID/Survey number',
      'Identity proof of property owner'
    ],
    process: [
      'Enter property ID or search by owner name',
      'View tax assessment details',
      'Verify property information',
      'Make online payment',
      'Download payment receipt',
      'Keep receipt for future reference'
    ],
    eligibility: 'Property owners within Gram Panchayat limits',
    hasForm: true,
    component: PropertyTaxForm
  },
  
  5: {
    id: 5,
    title: 'Property Tax Assessment',
    description: 'New property tax assessment and reassessment',
    category: 'Revenue Services',
    icon: <AccountBalance color="primary" />,
    processingTime: '15-30 days',
    fee: '₹200',
    documentsRequired: [
      'Property documents',
      'Construction completion certificate',
      'Survey settlement records',
      'Building plan'
    ],
    process: [
      'Submit assessment application',
      'Property inspection',
      'Tax calculation',
      'Assessment approval',
      'Tax notice issuance'
    ],
    eligibility: 'Property owners for new assessment or reassessment',
    hasForm: false
  },
  
  6: {
    id: 6,
    title: 'Water Tax Payment',
    description: 'Payment of water supply charges',
    category: 'Revenue Services',
    icon: <AccountBalance color="primary" />,
    processingTime: 'Instant',
    fee: 'As per consumption',
    documentsRequired: [
      'Water connection number',
      'Previous bill',
      'Identity proof'
    ],
    process: [
      'Enter connection number',
      'View bill details',
      'Make payment',
      'Download receipt'
    ],
    eligibility: 'Water connection holders',
    hasForm: false
  },
  
  // Business Services (IDs 7-8)
  7: {
    id: 7,
    title: 'Trade License',
    description: 'Apply for new trade license or renewal',
    category: 'Business Services',
    icon: <Business color="primary" />,
    processingTime: '15-30 days',
    fee: '₹500-2000',
    documentsRequired: [
      'Business proof/Partnership deed',
      'Shop/establishment proof',
      'Identity proof of applicant',
      'No objection certificate from neighbors',
      'Fire safety certificate (if applicable)',
      'Pollution clearance certificate (if applicable)'
    ],
    process: [
      'Fill trade license application form',
      'Upload required documents',
      'Pay application fee',
      'Submit application for verification',
      'Field inspection by officials',
      'Approval and license issuance'
    ],
    eligibility: 'Individuals/entities wanting to start business within GP limits',
    hasForm: false
  },
  
  8: {
    id: 8,
    title: 'Building Permission',
    description: 'Permission for construction of residential/commercial buildings',
    category: 'Business Services',
    icon: <Business color="primary" />,
    processingTime: '30-45 days',
    fee: '₹1000-5000',
    documentsRequired: [
      'Site plan',
      'Building plan',
      'Land documents',
      'NOC from fire department',
      'Structural plan'
    ],
    process: [
      'Submit building plan',
      'Technical verification',
      'Site inspection',
      'Approval process',
      'Permission issuance'
    ],
    eligibility: 'Land owners planning construction',
    hasForm: false
  },
  
  // Social Welfare Services (IDs 9-12)
  9: {
    id: 9,
    title: 'Income Certificate',
    description: 'Certificate of income for various government benefits',
    category: 'Social Welfare',
    icon: <Receipt color="primary" />,
    processingTime: '7-15 days',
    fee: '₹30',
    documentsRequired: [
      'Salary certificate from employer',
      'Bank statements (last 6 months)',
      'Agricultural income proof (if applicable)',
      'Identity proof (Aadhar/PAN)',
      'Address proof',
      'Ration card'
    ],
    process: [
      'Fill income certificate application',
      'Upload income proof documents',
      'Submit supporting documents',
      'Pay application fee',
      'Verification by revenue officer',
      'Certificate approval and issuance'
    ],
    eligibility: 'Residents needing income proof for scholarships, loans, etc.',
    hasForm: false
  },
  
  10: {
    id: 10,
    title: 'Caste Certificate',
    description: 'Certificate of caste for reservation benefits',
    category: 'Social Welfare',
    icon: <People color="primary" />,
    processingTime: '15-30 days',
    fee: '₹30',
    documentsRequired: [
      'Parents caste certificate',
      'School records',
      'ID proof',
      'Address proof',
      'Community verification'
    ],
    process: [
      'Fill caste certificate application',
      'Document verification',
      'Community verification',
      'Official approval',
      'Certificate issuance'
    ],
    eligibility: 'Individuals belonging to SC/ST/OBC categories',
    hasForm: false
  },
  
  11: {
    id: 11,
    title: 'Domicile Certificate',
    description: 'Certificate of permanent residence',
    category: 'Social Welfare',
    icon: <Home color="primary" />,
    processingTime: '10-20 days',
    fee: '₹30',
    documentsRequired: [
      'Address proof',
      'School leaving certificate',
      'Ration card',
      'Electoral roll',
      'Long-term residence proof'
    ],
    process: [
      'Fill domicile application',
      'Residence verification',
      'Document verification',
      'Official approval',
      'Certificate issuance'
    ],
    eligibility: 'Long-term residents of the area',
    hasForm: false
  },
  
  12: {
    id: 12,
    title: 'BPL Certificate',
    description: 'Below Poverty Line certificate for subsidies',
    category: 'Social Welfare',
    icon: <People color="primary" />,
    processingTime: '20-30 days',
    fee: 'Free',
    documentsRequired: [
      'Income proof',
      'Family details',
      'Land records',
      'Bank statements',
      'Asset declaration'
    ],
    process: [
      'Fill BPL application',
      'Economic survey',
      'Verification process',
      'Committee approval',
      'Certificate issuance'
    ],
    eligibility: 'Families below poverty line as per government norms',
    hasForm: false
  },
  
  // Health Services (IDs 13-14)
  13: {
    id: 13,
    title: 'Health Certificate',
    description: 'Medical fitness certificate for various purposes',
    category: 'Health Services',
    icon: <LocalHospital color="primary" />,
    processingTime: '3-5 days',
    fee: '₹100',
    documentsRequired: [
      'Medical examination report from registered doctor',
      'Identity proof (Aadhar/PAN/Passport)',
      'Passport size photographs (2 copies)',
      'Purpose declaration form'
    ],
    process: [
      'Get medical examination done',
      'Fill health certificate application',
      'Upload medical reports and documents',
      'Pay application fee',
      'Verification by health officer',
      'Certificate issuance'
    ],
    eligibility: 'Individuals needing medical fitness certificate',
    hasForm: false
  },
  
  14: {
    id: 14,
    title: 'Vaccination Certificate',
    description: 'Certificate of vaccination for travel/employment',
    category: 'Health Services',
    icon: <LocalHospital color="primary" />,
    processingTime: '1-3 days',
    fee: '₹50',
    documentsRequired: [
      'Vaccination record',
      'ID proof',
      'Medical certificate'
    ],
    process: [
      'Submit vaccination records',
      'Verification by health officer',
      'Certificate preparation',
      'Certificate issuance'
    ],
    eligibility: 'Individuals with completed vaccination',
    hasForm: false
  },
  
  // Infrastructure Services (IDs 15-16)
  15: {
    id: 15,
    title: 'Water Connection',
    description: 'New water connection or transfer of existing connection',
    category: 'Infrastructure',
    icon: <Home color="primary" />,
    processingTime: '10-15 days',
    fee: '₹1000',
    documentsRequired: [
      'Property documents',
      'Identity proof',
      'Address proof',
      'Site plan'
    ],
    process: [
      'Submit connection application',
      'Site survey',
      'Technical approval',
      'Connection installation',
      'Meter installation'
    ],
    eligibility: 'Property owners within service area',
    hasForm: false
  },
  
  16: {
    id: 16,
    title: 'Drainage Connection',
    description: 'Connection to public drainage system',
    category: 'Infrastructure',
    icon: <Build color="primary" />,
    processingTime: '15-20 days',
    fee: '₹1500',
    documentsRequired: [
      'Property documents',
      'Building plan',
      'NOC from neighbors',
      'Site plan'
    ],
    process: [
      'Submit connection application',
      'Site inspection',
      'Technical approval',
      'Connection work',
      'Commissioning'
    ],
    eligibility: 'Property owners in areas with drainage facility',
    hasForm: false
  },
  
  17: {
    id: 17,
    title: 'Street Light Installation',
    description: 'Request for new street light installation',
    category: 'Infrastructure',
    icon: <Build color="primary" />,
    processingTime: '20-30 days',
    fee: '₹2000',
    documentsRequired: [
      'Location details',
      'Community request',
      'Technical feasibility report',
      'Area map'
    ],
    process: [
      'Submit installation request',
      'Area assessment',
      'Technical approval',
      'Installation work',
      'Commissioning'
    ],
    eligibility: 'Residents of areas lacking street lighting',
    hasForm: false
  },
  
  // Agriculture Services (IDs 18-19)
  18: {
    id: 18,
    title: 'Agricultural Subsidy',
    description: 'Subsidy applications for farming equipment and seeds',
    category: 'Agriculture',
    icon: <Agriculture color="primary" />,
    processingTime: '30-60 days',
    fee: 'Free',
    documentsRequired: [
      'Land records',
      'Farmer ID',
      'Bank details',
      'Crop details',
      'Previous subsidy records'
    ],
    process: [
      'Submit subsidy application',
      'Land verification',
      'Eligibility check',
      'Committee approval',
      'Subsidy disbursement'
    ],
    eligibility: 'Registered farmers with valid land records',
    hasForm: false
  },
  
  19: {
    id: 19,
    title: 'Crop Insurance',
    description: 'Registration for crop insurance schemes',
    category: 'Agriculture',
    icon: <Agriculture color="primary" />,
    processingTime: '15-30 days',
    fee: 'As per scheme',
    documentsRequired: [
      'Land records',
      'Crop details',
      'Bank account',
      'Aadhar card',
      'Previous insurance records'
    ],
    process: [
      'Fill insurance application',
      'Crop assessment',
      'Premium calculation',
      'Policy issuance',
      'Coverage activation'
    ],
    eligibility: 'Farmers growing notified crops',
    hasForm: false
  },
  
  // Education Services (IDs 20-21)
  20: {
    id: 20,
    title: 'School Transfer Certificate',
    description: 'Transfer certificate for school students',
    category: 'Education',
    icon: <School color="primary" />,
    processingTime: '5-10 days',
    fee: '₹50',
    documentsRequired: [
      'Previous school records',
      'Parents ID proof',
      'Address proof',
      'Student photograph'
    ],
    process: [
      'Submit transfer application',
      'Record verification',
      'Certificate preparation',
      'Principal approval',
      'Certificate issuance'
    ],
    eligibility: 'Students changing schools',
    hasForm: false
  },
  
  21: {
    id: 21,
    title: 'Scholarship Application',
    description: 'Application for government scholarships',
    category: 'Education',
    icon: <School color="primary" />,
    processingTime: '45-60 days',
    fee: 'Free',
    documentsRequired: [
      'Academic records',
      'Income certificate',
      'Caste certificate (if applicable)',
      'Bank details',
      'Photographs'
    ],
    process: [
      'Submit scholarship application',
      'Document verification',
      'Merit assessment',
      'Committee approval',
      'Scholarship disbursement'
    ],
    eligibility: 'Students meeting scholarship criteria',
    hasForm: false
  }
};

// Helper function to get all services as array
export const getAllServices = () => Object.values(servicesData);

// Helper function to get service by ID
export const getServiceById = (id) => servicesData[parseInt(id)];

// Helper function to get services by category
export const getServicesByCategory = (category) => {
  if (category === 'All') return getAllServices();
  return getAllServices().filter(service => service.category === category);
};

// Service categories
export const serviceCategories = [
  { name: 'All', count: getAllServices().length },
  { name: 'Civil Registration', count: getServicesByCategory('Civil Registration').length, icon: <Assignment /> },
  { name: 'Revenue Services', count: getServicesByCategory('Revenue Services').length, icon: <AccountBalance /> },
  { name: 'Business Services', count: getServicesByCategory('Business Services').length, icon: <Business /> },
  { name: 'Social Welfare', count: getServicesByCategory('Social Welfare').length, icon: <People /> },
  { name: 'Health Services', count: getServicesByCategory('Health Services').length, icon: <LocalHospital /> },
  { name: 'Infrastructure', count: getServicesByCategory('Infrastructure').length, icon: <Home /> },
  { name: 'Agriculture', count: getServicesByCategory('Agriculture').length, icon: <Agriculture /> },
  { name: 'Education', count: getServicesByCategory('Education').length, icon: <School /> }
];

export default servicesData;
