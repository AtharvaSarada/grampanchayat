import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
  ];

  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration:', missingKeys);
    throw new Error(`Missing Firebase environment variables: ${missingKeys.join(', ')}`);
  }

  return true;
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  validateFirebaseConfig();
  
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Connect to emulators in development mode
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
    try {
      // Connect to Auth emulator
      if (!auth._delegate._config.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      
      // Connect to Firestore emulator
      if (!db._delegate._databaseId.host.includes('localhost')) {
        connectFirestoreEmulator(db, 'localhost', 8080);
      }
      
      // Connect to Storage emulator
      if (!storage._delegate._host.includes('localhost')) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      
      console.log('Firebase emulators connected successfully');
    } catch (error) {
      console.warn('Firebase emulators connection failed:', error.message);
    }
  }
  
  console.log('Firebase initialized successfully');
  
} catch (error) {
  console.error('Firebase initialization failed:', error);
  
  // Fallback for missing configuration
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using Firebase configuration fallback for development');
    
    // Mock Firebase services for development without proper config
    auth = {
      currentUser: null,
      onAuthStateChanged: () => () => {},
      signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
      createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not configured')),
      signOut: () => Promise.reject(new Error('Firebase not configured')),
    };
    
    db = {};
    storage = {};
  }
}

// Auth state change listeners
const authStateListeners = [];

export const addAuthStateListener = (callback) => {
  authStateListeners.push(callback);
  return () => {
    const index = authStateListeners.indexOf(callback);
    if (index > -1) {
      authStateListeners.splice(index, 1);
    }
  };
};

// Monitor auth state changes
if (auth && auth.onAuthStateChanged) {
  auth.onAuthStateChanged((user) => {
    authStateListeners.forEach(callback => callback(user));
  });
}

// Firebase utilities
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getIdToken = async () => {
  const user = auth?.currentUser;
  if (!user) {
    throw new Error('No authenticated user');
  }
  return await user.getIdToken();
};

// Error handling utilities
export const getFirebaseErrorMessage = (error) => {
  const errorMessages = {
    'auth/user-not-found': 'No user found with this email address.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This user account has been disabled.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/requires-recent-login': 'Please log in again to complete this action.',
  };

  return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
};

// Connection status
export const isFirebaseConnected = () => {
  return !!(app && auth && db && storage);
};

// Export Firebase services
export { app, auth, db, storage };
export default app;
