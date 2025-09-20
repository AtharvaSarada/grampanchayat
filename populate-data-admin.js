#!/usr/bin/env node

/**
 * ADMIN POPULATION SCRIPT
 * Uses Firebase Admin SDK with service account for admin access
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin with project ID only (works with CLI auth)
admin.initializeApp({
  projectId: 'grampanchayat-9e014'
});

const db = admin.firestore();

// Essential services data
const ESSENTIAL_SERVICES = [
  {
    id: 'birth_certificate',
    title: 'Birth Certificate',
    description: 'Registration and issuance of birth certificate',
    category: 'Civil Registration',
    processingTime: '7-10 days',
    fee: '₹50',
    isActive: true,
    documentsRequired: [
      'Hospital Birth Certificate',
      'Parents Aadhaar Cards', 
      'Address Proof',
      'Marriage Certificate'
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    id: 'death_certificate',
    title: 'Death Certificate',
    description: 'Registration and issuance of death certificate',
    category: 'Civil Registration',
    processingTime: '5-7 days',
    fee: '₹50',
    isActive: true,
    documentsRequired: [
      'Medical Death Certificate',
      'Deceased ID Proof',
      'Informant ID Proof',
      'Address Proof'
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    id: 'marriage_certificate',
    title: 'Marriage Certificate',
    description: 'Registration and issuance of marriage certificate',
    category: 'Civil Registration',
    processingTime: '10-15 days',
    fee: '₹100',
    isActive: true,
    documentsRequired: [
      'Marriage Invitation',
      'Bride & Groom Aadhaar',
      'Witness ID Proofs',
      'Marriage Photos'
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    id: 'trade_license',
    title: 'Trade License',
    description: 'License for business operations',
    category: 'Business Services',
    processingTime: '15-30 days',
    fee: '₹500-2000',
    isActive: true,
    documentsRequired: [
      'Business Registration',
      'Proprietor Aadhaar',
      'Shop Address Proof',
      'Lease Agreement'
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    id: 'water_connection',
    title: 'Water Connection',
    description: 'New household water connection',
    category: 'Infrastructure',
    processingTime: '15-30 days',
    fee: '₹2000-5000',
    isActive: true,
    documentsRequired: [
      'Property Ownership Proof',
      'Aadhaar Card',
      'Address Proof',
      'Site Plan'
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  },
  {
    id: 'income_certificate',
    title: 'Income Certificate',
    description: 'Certificate of income for government benefits',
    category: 'Social Welfare',
    processingTime: '7-15 days',
    fee: '₹30',
    isActive: true,
    documentsRequired: [
      'Salary Certificate',
      'Bank Statements',
      'Aadhaar Card',
      'Address Proof'
    ],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now()
  }
];

// Sample applications with proper timestamps
const SAMPLE_APPLICATIONS = [
  {
    id: 'APP_001',
    serviceType: 'birth_certificate',
    serviceName: 'Birth Certificate',
    userId: 'sample-user-1',
    applicantId: 'sample-user-1',
    status: 'completed',
    submittedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
    createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
    formData: {
      childName: 'Rahul Sharma',
      fatherName: 'Vijay Sharma',
      motherName: 'Priya Sharma'
    }
  },
  {
    id: 'APP_002', 
    serviceType: 'water_connection',
    serviceName: 'Water Connection',
    userId: 'sample-user-1',
    applicantId: 'sample-user-1', 
    status: 'pending',
    submittedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)),
    formData: {
      applicantName: 'Vijay Sharma',
      propertyAddress: '123 Main Street, Village'
    }
  },
  {
    id: 'APP_003',
    serviceType: 'trade_license', 
    serviceName: 'Trade License',
    userId: 'sample-user-2',
    applicantId: 'sample-user-2',
    status: 'completed',
    submittedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)),
    formData: {
      businessName: 'Village Grocery Store',
      proprietorName: 'Amit Kumar'
    }
  },
  {
    id: 'APP_004',
    serviceType: 'income_certificate',
    serviceName: 'Income Certificate', 
    userId: 'sample-user-2',
    applicantId: 'sample-user-2',
    status: 'pending',
    submittedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    createdAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    updatedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
    formData: {
      applicantName: 'Amit Kumar',
      annualIncome: 150000
    }
  }
];

async function populateData() {
  console.log('🔥 ADMIN: Populating services and applications...');
  
  try {
    // Populate services
    console.log('📝 Adding services...');
    for (const service of ESSENTIAL_SERVICES) {
      await db.collection('services').doc(service.id).set(service);
      console.log(`✅ Added service: ${service.title}`);
    }
    console.log(`🎉 Successfully populated ${ESSENTIAL_SERVICES.length} services!`);

    // Populate sample applications  
    console.log('📋 Adding sample applications...');
    for (const app of SAMPLE_APPLICATIONS) {
      await db.collection('applications').doc(app.id).set(app);
      console.log(`✅ Added application: ${app.serviceName}`);
    }
    console.log(`🎉 Successfully populated ${SAMPLE_APPLICATIONS.length} sample applications!`);

    console.log('🚀 ADMIN POPULATION COMPLETE!');
    console.log('');
    console.log('📊 Expected Dashboard Statistics:');
    console.log('- Total Services: 6');
    console.log('- Applications Processed: 2 (completed)');
    console.log('- Pending Applications: 2'); 
    console.log('- Average Processing Time: ~12 days');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating data:', error);
    process.exit(1);
  }
}

// Run the population
populateData();
