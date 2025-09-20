#!/usr/bin/env node

/**
 * EMERGENCY SERVICE POPULATION SCRIPT
 * This script populates Firestore with the essential services to fix the zero statistics issue
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs } = require('firebase/firestore');

// Firebase configuration (you'll need to update this with your project config)
const firebaseConfig = {
  apiKey: "AIzaSyCCbHEfFYE32mxcyR7hzTOb6HazOTcJJE0",
  authDomain: "grampanchayat-9e014.firebaseapp.com", 
  projectId: "grampanchayat-9e014",
  storageBucket: "grampanchayat-9e014.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Essential services data to populate
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
    createdAt: new Date(),
    updatedAt: new Date()
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
    createdAt: new Date(),
    updatedAt: new Date()
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
    createdAt: new Date(),
    updatedAt: new Date()
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
    createdAt: new Date(),
    updatedAt: new Date()
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
    createdAt: new Date(),
    updatedAt: new Date()
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
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample applications to populate for testing
const SAMPLE_APPLICATIONS = [
  {
    id: 'APP_001',
    serviceType: 'birth_certificate',
    serviceName: 'Birth Certificate',
    userId: 'sample-user-1',
    applicantId: 'sample-user-1',
    status: 'completed',
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
    submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
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
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    formData: {
      applicantName: 'Amit Kumar',
      annualIncome: 150000
    }
  }
];

async function populateServices() {
  console.log('🔥 EMERGENCY: Populating services in Firestore...');
  
  try {
    // Check if services already exist
    const servicesRef = collection(db, 'services');
    const existingServices = await getDocs(servicesRef);
    
    if (!existingServices.empty) {
      console.log(`⚠️  Found ${existingServices.size} existing services. Skipping service population.`);
    } else {
      // Populate services
      for (const service of ESSENTIAL_SERVICES) {
        const serviceRef = doc(db, 'services', service.id);
        await setDoc(serviceRef, service);
        console.log(`✅ Added service: ${service.title}`);
      }
      console.log(`🎉 Successfully populated ${ESSENTIAL_SERVICES.length} services!`);
    }
    
    // Check if applications exist
    const applicationsRef = collection(db, 'applications');
    const existingApplications = await getDocs(applicationsRef);
    
    if (!existingApplications.empty) {
      console.log(`⚠️  Found ${existingApplications.size} existing applications. Skipping sample applications.`);
    } else {
      // Populate sample applications
      for (const application of SAMPLE_APPLICATIONS) {
        const appRef = doc(db, 'applications', application.id);
        await setDoc(appRef, application);
        console.log(`✅ Added sample application: ${application.serviceName}`);
      }
      console.log(`🎉 Successfully populated ${SAMPLE_APPLICATIONS.length} sample applications!`);
    }
    
    console.log('🚀 EMERGENCY POPULATION COMPLETE!');
    console.log('📊 Dashboard statistics should now show:');
    console.log(`   - Total Services: ${ESSENTIAL_SERVICES.length}`);
    console.log('   - Applications Processed: 2');
    console.log('   - Pending Applications: 2');
    console.log('   - Average Processing Time: ~12 days');
    
  } catch (error) {
    console.error('❌ Error populating data:', error);
    throw error;
  }
}

// Run the population script
if (require.main === module) {
  populateServices()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { populateServices, ESSENTIAL_SERVICES, SAMPLE_APPLICATIONS };
