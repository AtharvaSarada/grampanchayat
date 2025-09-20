/**
 * BROWSER CONSOLE POPULATION SCRIPT
 * Copy and paste this script into the browser console while logged into your Firebase web app
 * This will populate the Firestore database with essential services and sample applications
 */

console.log('🔥 BROWSER: Starting database population...');

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample applications data
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

// Import Firebase functions (they should be available in your app)
async function populateFirestoreData() {
  try {
    // Get Firebase and Firestore from your app
    const { db } = window; // This should be available if your app exports it globally
    if (!db) {
      throw new Error('Firestore db not found. Make sure your Firebase app is loaded.');
    }

    console.log('📝 Adding services to Firestore...');
    
    // Add services
    for (const service of ESSENTIAL_SERVICES) {
      await db.collection('services').doc(service.id).set(service);
      console.log(`✅ Added service: ${service.title}`);
    }
    console.log(`🎉 Successfully added ${ESSENTIAL_SERVICES.length} services!`);

    console.log('📋 Adding sample applications to Firestore...');
    
    // Add applications
    for (const app of SAMPLE_APPLICATIONS) {
      await db.collection('applications').doc(app.id).set(app);
      console.log(`✅ Added application: ${app.serviceName}`);
    }
    console.log(`🎉 Successfully added ${SAMPLE_APPLICATIONS.length} applications!`);

    console.log('🚀 POPULATION COMPLETE!');
    console.log('');
    console.log('📊 Expected Dashboard Statistics:');
    console.log('- Total Services: 6');
    console.log('- Applications Processed: 2 (completed)');
    console.log('- Pending Applications: 2');
    console.log('- Average Processing Time: ~12 days');
    console.log('');
    console.log('🔄 Refresh your dashboard to see the updated statistics!');

    return true;
  } catch (error) {
    console.error('❌ Error populating data:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you are logged in to the Firebase app');
    console.log('2. Check that Firebase is initialized in the app');
    console.log('3. Verify Firestore is accessible (check Firebase project settings)');
    return false;
  }
}

// Alternative method using Firebase imports if available
async function populateUsingImports() {
  try {
    // Try to import Firebase from the app
    const { initializeApp } = await import('firebase/app');
    const { getFirestore, collection, doc, setDoc } = await import('firebase/firestore');
    
    // Use your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyCCbHEfFYE32mxcyR7hzTOb6HazOTcJJE0",
      authDomain: "grampanchayat-9e014.firebaseapp.com", 
      projectId: "grampanchayat-9e014",
      storageBucket: "grampanchayat-9e014.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:abc123def456"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('📝 Adding services using Firebase imports...');
    
    // Add services
    for (const service of ESSENTIAL_SERVICES) {
      await setDoc(doc(db, 'services', service.id), service);
      console.log(`✅ Added service: ${service.title}`);
    }

    console.log('📋 Adding sample applications...');
    
    // Add applications
    for (const app of SAMPLE_APPLICATIONS) {
      await setDoc(doc(db, 'applications', app.id), app);
      console.log(`✅ Added application: ${app.serviceName}`);
    }

    console.log('🚀 POPULATION WITH IMPORTS COMPLETE!');
    return true;
  } catch (error) {
    console.error('❌ Error with imports method:', error);
    return false;
  }
}

// Run the population
console.log('🚀 Starting population process...');
console.log('');

// Try method 1 first (using global db), then method 2 (using imports)
populateFirestoreData().then(success => {
  if (!success) {
    console.log('🔄 Trying alternative method with imports...');
    return populateUsingImports();
  }
  return true;
}).then(success => {
  if (success) {
    console.log('✅ Database population successful!');
  } else {
    console.log('❌ Database population failed. Please check the troubleshooting steps above.');
  }
}).catch(error => {
  console.error('❌ Final error:', error);
  console.log('');
  console.log('🛠️ Manual Alternative:');
  console.log('If this script fails, you can manually add the data through the Firebase Console:');
  console.log('1. Go to https://console.firebase.google.com/project/grampanchayat-9e014/firestore');
  console.log('2. Create collections: services, applications');
  console.log('3. Add the documents from the data arrays above');
});

// Export data for manual use
console.log('📄 Data available for manual import:');
console.log('Services:', ESSENTIAL_SERVICES);
console.log('Applications:', SAMPLE_APPLICATIONS);
