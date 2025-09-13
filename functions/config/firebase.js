const admin = require('firebase-admin');

// Firebase Admin SDK is automatically initialized in Cloud Functions
// We don't need manual initialization in the Functions environment
const initializeFirebase = () => {
  // No-op for Functions environment - admin is already initialized
  return admin.app();
};

const getFirestore = () => {
  return admin.firestore();
};

const getAuth = () => {
  return admin.auth();
};

const getStorage = () => {
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
