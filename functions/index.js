require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const { populateServices } = require('./populateServices');
const { getChatbotAnalytics } = require('./analytics');
const { populateEnhancedServices } = require('./populateEnhancedServices');
const { populateSimpleServices } = require('./populateSimpleServices');
const { populateTestApplications, clearTestApplications } = require('./populateTestApplications');
// NEW: Gemini Pro Intelligent Chat System (replaces all old RAG systems)
const { intelligentChat, getAllServices, getServiceDetails } = require('./geminiIntelligentChat');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Gram Panchayath Services API is running on Firebase Functions',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic auth endpoints for now
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });
    
    // Save user profile to Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      phoneNumber,
      role: 'user',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email,
        firstName,
        lastName,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

app.get('/auth/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }
    
    res.json({
      success: true,
      data: userDoc.data()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// Populate services endpoint
app.post('/populate-services', populateServices);

// 🤖 NEW: GEMINI PRO INTELLIGENT CHAT - Replaces ALL old recommendation systems
app.post('/intelligent-chat', intelligentChat);
app.post('/chat', intelligentChat); // Alias for backward compatibility
app.post('/service-recommendation', intelligentChat); // Replaces old service recommendation
app.post('/rag-service-recommendation', intelligentChat); // Replaces old RAG system
app.post('/simple-rag-recommendation', intelligentChat); // Replaces simple RAG
app.post('/intelligent-rag-recommendation', intelligentChat); // Replaces intelligent RAG

// Service information endpoints
app.get('/services/all', getAllServices);
app.get('/services/:serviceId', getServiceDetails);

// Analytics endpoint (kept as is)
app.get('/chatbot-analytics', getChatbotAnalytics);

// Utility endpoints (kept for data management)
app.post('/populate-enhanced-services', populateEnhancedServices);
app.post('/populate-simple-services', populateSimpleServices);

// Test applications endpoints
app.post('/populate-test-applications', populateTestApplications);
app.post('/clear-test-applications', clearTestApplications);

// Populate user applications endpoint for user statistics testing
app.post('/populate-user-applications', async (req, res) => {
  try {
    console.log('Starting to populate user applications...');
    
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
    
    const batch = admin.firestore().batch();
    
    sampleApplications.forEach(app => {
      const docRef = admin.firestore().collection('applications').doc();
      batch.set(docRef, app);
    });
    
    await batch.commit();
    
    console.log(`Successfully populated ${sampleApplications.length} sample applications`);
    
    // Calculate summary for test-user-123
    const userApps = sampleApplications.filter(app => app.user_id === 'test-user-123');
    const totalAmount = userApps.reduce((sum, app) => sum + app.fee_amount, 0);
    const completedApps = userApps.filter(app => app.status === 'completed').length;
    const pendingApps = userApps.filter(app => app.status === 'pending').length;
    
    res.status(200).json({
      success: true,
      message: 'Successfully populated sample applications',
      data: {
        totalApplicationsCreated: sampleApplications.length,
        testUserSummary: {
          userId: 'test-user-123',
          totalApplications: userApps.length,
          completedApplications: completedApps,
          pendingApplications: pendingApps,
          totalAmountPaid: totalAmount
        }
      }
    });
    
  } catch (error) {
    console.error('Error populating user applications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to populate applications', 
      details: error.message 
    });
  }
});

// Basic services endpoint
app.get('/services', async (req, res) => {
  try {
    const servicesCollection = admin.firestore().collection('services');
    const snapshot = await servicesCollection.get();
    
    const services = [];
    snapshot.forEach(doc => {
      services.push(doc.data());
    });
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Export the API as a Firebase Function
exports.api = functions.https.onRequest(app);
