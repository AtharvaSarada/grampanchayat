const admin = require('firebase-admin');

// Initialize Firebase Admin with application default credentials
try {
  admin.initializeApp({
    projectId: 'grampanchayat-9e014'
  });
} catch (error) {
  // If already initialized, continue
}

const db = admin.firestore();

// Simplified services data without React components
const servicesData = {
  1: {
    id: 1,
    title: 'Birth Certificate',
    description: 'Registration and issuance of birth certificate for newborns',
    category: 'Civil Registration',
    processingTime: '7-10 days',
    fee: '₹50'
  },
  2: {
    id: 2,
    title: 'Death Certificate',
    description: 'Registration and issuance of death certificate',
    category: 'Civil Registration',
    processingTime: '5-7 days',
    fee: '₹50'
  },
  3: {
    id: 3,
    title: 'Marriage Certificate',
    description: 'Registration and issuance of marriage certificate',
    category: 'Civil Registration',
    processingTime: '10-15 days',
    fee: '₹100'
  },
  7: {
    id: 7,
    title: 'Trade License',
    description: 'Apply for new trade license or renewal for business operations',
    category: 'Business Services',
    processingTime: '15-30 days',
    fee: '₹500-2000'
  },
  8: {
    id: 8,
    title: 'Building Permission',
    description: 'Permission for construction of residential/commercial buildings',
    category: 'Business Services',
    processingTime: '30-45 days',
    fee: '₹1000-5000'
  },
  9: {
    id: 9,
    title: 'Income Certificate',
    description: 'Certificate of income for various government benefits and schemes',
    category: 'Social Welfare',
    processingTime: '7-15 days',
    fee: '₹30'
  },
  10: {
    id: 10,
    title: 'Caste Certificate',
    description: 'Certificate of caste for reservation benefits in education and jobs',
    category: 'Social Welfare',
    processingTime: '15-30 days',
    fee: '₹30'
  },
  11: {
    id: 11,
    title: 'Domicile Certificate',
    description: 'Certificate of permanent residence for various applications',
    category: 'Social Welfare',
    processingTime: '10-20 days',
    fee: '₹30'
  },
  12: {
    id: 12,
    title: 'BPL Certificate',
    description: 'Below Poverty Line certificate for subsidies and government schemes',
    category: 'Social Welfare',
    processingTime: '20-30 days',
    fee: 'Free'
  },
  18: {
    id: 18,
    title: 'Agricultural Subsidy',
    description: 'Subsidy applications for farming equipment, seeds, and agricultural inputs',
    category: 'Agriculture',
    processingTime: '30-60 days',
    fee: 'Free'
  },
  19: {
    id: 19,
    title: 'Crop Insurance',
    description: 'Registration for crop insurance schemes to protect against crop losses',
    category: 'Agriculture',
    processingTime: '15-30 days',
    fee: 'As per scheme'
  },
  20: {
    id: 20,
    title: 'School Transfer Certificate',
    description: 'Transfer certificate for school students moving to different schools',
    category: 'Education',
    processingTime: '5-10 days',
    fee: '₹50'
  },
  21: {
    id: 21,
    title: 'Scholarship Application',
    description: 'Application for government scholarships for students',
    category: 'Education',
    processingTime: '45-60 days',
    fee: 'Free'
  }
};


// Function to extract meaningful data from service objects
function processServiceData(service) {
  // Define common document requirements based on service category
  const documentsByCategory = {
    'Civil Registration': ['Aadhaar Card', 'Address Proof', 'Identity Proof'],
    'Business Services': ['Aadhaar Card', 'Address Proof', 'Business Registration'],
    'Social Welfare': ['Aadhaar Card', 'Income Certificate', 'Address Proof'],
    'Agriculture': ['Aadhaar/Farmer ID', 'Land Records', 'Bank Details'],
    'Education': ['Aadhaar Card', 'School Records', 'Identity Proof']
  };

  const documentsRequired = documentsByCategory[service.category] || ['Aadhaar Card', 'Address Proof'];
  
  return {
    id: service.id,
    service_name: service.title,
    description: service.description,
    category: service.category,
    processing_time: service.processingTime,
    fee: service.fee,
    documents_required: documentsRequired,
    eligibility: `Applicable to residents within Gram Panchayat jurisdiction`,
    application_link: `/apply/${service.id}`,
    keywords: [
      service.title.toLowerCase(),
      service.category.toLowerCase(),
      service.description.toLowerCase()
    ].join(' ')
  };
}

async function populateServices() {
  try {
    console.log('Starting to populate services collection...');
    
    // Get services collection reference
    const servicesCollection = db.collection('services');
    
    // Clear existing data
    const existingDocs = await servicesCollection.get();
    const batch = db.batch();
    
    existingDocs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    if (existingDocs.docs.length > 0) {
      await batch.commit();
      console.log(`Cleared ${existingDocs.docs.length} existing documents`);
    }

    // Add new services data
    const newBatch = db.batch();
    let count = 0;

    Object.values(servicesData).forEach((service) => {
      const processedService = processServiceData(service);
      const docRef = servicesCollection.doc(service.id.toString());
      newBatch.set(docRef, processedService);
      count++;
    });

    await newBatch.commit();
    console.log(`Successfully added ${count} services to Firestore!`);
    
    // Display sample data
    console.log('\nSample service data:');
    const sampleDoc = await servicesCollection.doc('1').get();
    console.log(JSON.stringify(sampleDoc.data(), null, 2));
    
  } catch (error) {
    console.error('Error populating services:', error);
  } finally {
    process.exit();
  }
}

// Run the population script
populateServices();
