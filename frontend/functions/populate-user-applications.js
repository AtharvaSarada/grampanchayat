const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'grampanchayat-9e014'
  });
}

const db = admin.firestore();

// Sample user applications data
const sampleApplications = [
  {
    application_id: 'APP001',
    user_id: 'test-user-123',
    service_id: 'birth_certificate',
    status: 'completed',
    fee_amount: 50,
    submitted_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-15')),
    completed_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-20')),
    applicant_details: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    application_id: 'APP002',
    user_id: 'test-user-123',
    service_id: 'water_connection',
    status: 'pending',
    fee_amount: 200,
    submitted_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-18')),
    applicant_details: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    application_id: 'APP003',
    user_id: 'test-user-123',
    service_id: 'trade_license',
    status: 'completed',
    fee_amount: 500,
    submitted_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-10')),
    completed_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-17')),
    applicant_details: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  },
  {
    application_id: 'APP004',
    user_id: 'test-user-456',
    service_id: 'income_certificate',
    status: 'pending',
    fee_amount: 25,
    submitted_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-19')),
    applicant_details: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    }
  },
  {
    application_id: 'APP005',
    user_id: 'test-user-123',
    service_id: 'marriage_certificate',
    status: 'pending',
    fee_amount: 100,
    submitted_at: admin.firestore.Timestamp.fromDate(new Date('2024-01-20')),
    applicant_details: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  }
];

async function populateUserApplications() {
  try {
    console.log('Starting to populate user applications...');
    
    const batch = db.batch();
    
    sampleApplications.forEach(app => {
      const docRef = db.collection('applications').doc();
      batch.set(docRef, app);
    });
    
    await batch.commit();
    
    console.log(`Successfully populated ${sampleApplications.length} sample applications`);
    
    // Display summary for test-user-123
    const userApps = sampleApplications.filter(app => app.user_id === 'test-user-123');
    const totalAmount = userApps.reduce((sum, app) => sum + app.fee_amount, 0);
    const completedApps = userApps.filter(app => app.status === 'completed').length;
    const pendingApps = userApps.filter(app => app.status === 'pending').length;
    
    console.log('\nTest User (test-user-123) Summary:');
    console.log('- Total Applications:', userApps.length);
    console.log('- Completed Applications:', completedApps);
    console.log('- Pending Applications:', pendingApps);
    console.log('- Total Amount Paid: ₹', totalAmount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error populating applications:', error);
    process.exit(1);
  }
}

populateUserApplications();
