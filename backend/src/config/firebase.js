const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      // Initialize Firebase Admin SDK
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
      };

      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });

      logger.info('Firebase Admin SDK initialized successfully');
    }
    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.firestore();
};

const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
};

const getStorage = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.storage();
};

// Firestore collections
const COLLECTIONS = {
  USERS: 'users',
  SERVICES: 'services',
  APPLICATIONS: 'applications',
  STAFF: 'staff',
  OFFICERS: 'officers',
  AUDIT_LOGS: 'auditLogs',
  NOTIFICATIONS: 'notifications'
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getStorage,
  COLLECTIONS,
  admin
};
