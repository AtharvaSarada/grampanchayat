import { db } from '../services/firebase';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Create sample applications for testing
export const createSampleApplications = async () => {
  try {
    const applications = [
      {
        applicationId: 'APP001',
        serviceId: 'agricultural-subsidy',
        serviceName: 'Agricultural Subsidy',
        applicantName: 'Rajesh Kumar',
        status: 'pending',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        userId: 'user1'
      },
      {
        applicationId: 'APP002',
        serviceId: 'bpl-certificate',
        serviceName: 'BPL Certificate',
        applicantName: 'Priya Sharma',
        status: 'approved',
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        userId: 'user2'
      },
      {
        applicationId: 'APP003',
        serviceId: 'income-certificate',
        serviceName: 'Income Certificate',
        applicantName: 'Amit Patel',
        status: 'completed',
        submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        userId: 'user3'
      },
      {
        applicationId: 'APP004',
        serviceId: 'building-permission',
        serviceName: 'Building Permission',
        applicantName: 'Sunita Devi',
        status: 'in_review',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        userId: 'user4'
      },
      {
        applicationId: 'APP005',
        serviceId: 'death-certificate',
        serviceName: 'Death Certificate',
        applicantName: 'Mohan Singh',
        status: 'completed',
        submittedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        userId: 'user5'
      }
    ];

    for (const app of applications) {
      await addDoc(collection(db, 'applications'), app);
    }

    console.log('Sample applications created successfully');
    return applications;
  } catch (error) {
    console.error('Error creating sample applications:', error);
    throw error;
  }
};

// Create sample appointments
export const createSampleAppointments = async () => {
  try {
    const appointments = [
      {
        title: 'Document Verification - Birth Certificate',
        description: 'Verification of submitted documents for birth certificate application',
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        duration: 30,
        location: 'Gram Panchayat Office - Room 1',
        serviceType: 'Birth Certificate',
        status: 'scheduled',
        userId: 'user1',
        userName: 'Rajesh Kumar',
        userEmail: 'rajesh@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Property Assessment Visit',
        description: 'On-site property assessment for tax calculation',
        appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        duration: 60,
        location: 'Property Location',
        serviceType: 'Property Tax Assessment',
        status: 'confirmed',
        userId: 'user2',
        userName: 'Priya Sharma',
        userEmail: 'priya@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Income Verification Meeting',
        description: 'Meeting to verify income documents and details',
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        duration: 45,
        location: 'Gram Panchayat Office - Room 2',
        serviceType: 'Income Certificate',
        status: 'scheduled',
        userId: 'user3',
        userName: 'Amit Patel',
        userEmail: 'amit@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const appointment of appointments) {
      await addDoc(collection(db, 'appointments'), appointment);
    }

    console.log('Sample appointments created successfully');
    return appointments;
  } catch (error) {
    console.error('Error creating sample appointments:', error);
    throw error;
  }
};

// Create sample documents
export const createSampleDocuments = async () => {
  try {
    const documents = [
      {
        title: 'Aadhaar Card Copy',
        category: 'identity',
        fileName: 'aadhaar_copy.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        downloadURL: 'https://example.com/sample-doc.pdf',
        storagePath: 'documents/user1/aadhaar_copy.pdf',
        uploadedBy: 'user1',
        uploadedByName: 'Rajesh Kumar',
        applicationId: 'APP001',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'verified'
      },
      {
        title: 'Income Certificate',
        category: 'income',
        fileName: 'income_cert.pdf',
        fileSize: 512000,
        fileType: 'application/pdf',
        downloadURL: 'https://example.com/sample-doc2.pdf',
        storagePath: 'documents/user2/income_cert.pdf',
        uploadedBy: 'user2',
        uploadedByName: 'Priya Sharma',
        applicationId: 'APP002',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        title: 'Property Documents',
        category: 'property',
        fileName: 'property_docs.pdf',
        fileSize: 2048000,
        fileType: 'application/pdf',
        downloadURL: 'https://example.com/sample-doc3.pdf',
        storagePath: 'documents/user3/property_docs.pdf',
        uploadedBy: 'user3',
        uploadedByName: 'Amit Patel',
        applicationId: 'APP003',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'verified'
      }
    ];

    for (const doc of documents) {
      await addDoc(collection(db, 'documents'), doc);
    }

    console.log('Sample documents created successfully');
    return documents;
  } catch (error) {
    console.error('Error creating sample documents:', error);
    throw error;
  }
};

// Create all sample data
export const createAllSampleData = async () => {
  try {
    console.log('Creating sample data...');
    
    const applications = await createSampleApplications();
    const appointments = await createSampleAppointments();
    const documents = await createSampleDocuments();
    
    console.log('All sample data created successfully!');
    return {
      applications,
      appointments,
      documents
    };
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};
