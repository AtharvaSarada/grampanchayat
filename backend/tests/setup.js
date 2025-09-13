// Jest is available globally in test environment

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.LOG_LEVEL = 'error';

// Firebase test configuration
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_CLIENT_EMAIL = 'test@test-project.iam.gserviceaccount.com';
process.env.FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nTEST_KEY\n-----END PRIVATE KEY-----';
process.env.FIREBASE_CLIENT_ID = '123456789';
process.env.FIREBASE_PRIVATE_KEY_ID = 'test-key-id';
process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';

// JWT test configuration
process.env.JWT_SECRET = 'test-secret-key-for-jwt-tokens';
process.env.JWT_EXPIRES_IN = '7d';

// API configuration
process.env.FRONTEND_URL = 'http://localhost:3000';

// Global test utilities
global.mockFirebaseUser = {
  uid: 'test-user-uid',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
};

global.mockFirebaseAdmin = {
  uid: 'test-admin-uid',
  email: 'admin@example.com',
  emailVerified: true,
  displayName: 'Test Admin',
  customClaims: { role: 'admin' },
};

global.mockFirebaseStaff = {
  uid: 'test-staff-uid',
  email: 'staff@example.com',
  emailVerified: true,
  displayName: 'Test Staff',
  customClaims: { role: 'staff' },
};

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(() => ({
    auth: jest.fn(),
    firestore: jest.fn(),
    storage: jest.fn(),
  })),
  credential: {
    cert: jest.fn(() => ({})),
  },
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserByEmail: jest.fn(),
    setCustomUserClaims: jest.fn(),
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
        orderBy: jest.fn(() => ({
          get: jest.fn(),
          limit: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
      get: jest.fn(),
    })),
  })),
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      file: jest.fn(() => ({
        save: jest.fn(),
        delete: jest.fn(),
        getSignedUrl: jest.fn(),
      })),
    })),
  })),
}));

// Mock Winston logger
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
}));

// Mock audit logger
jest.mock('../src/utils/auditLogger', () => ({
  createAuditLog: jest.fn(() => Promise.resolve('mock-audit-id')),
  getAuditLogs: jest.fn(() => Promise.resolve([])),
  getUserAuditLogs: jest.fn(() => Promise.resolve([])),
}));

// Global test helpers
global.createMockRequest = (overrides = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ip: '127.0.0.1',
    get: jest.fn((header) => {
      const headers = {
        'user-agent': 'Jest Test Agent',
        'authorization': 'Bearer mock-token',
        ...overrides.headers,
      };
      return headers[header.toLowerCase()];
    }),
    ...overrides,
  };
};

global.createMockResponse = () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    send: jest.fn(() => res),
    cookie: jest.fn(() => res),
    clearCookie: jest.fn(() => res),
    redirect: jest.fn(() => res),
    statusCode: 200,
  };
  return res;
};

global.createMockNext = () => jest.fn();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Increase timeout for integration tests
jest.setTimeout(30000);

console.log('Test environment initialized');
