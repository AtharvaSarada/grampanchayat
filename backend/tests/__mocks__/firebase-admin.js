// Mock Firebase Admin SDK for testing
const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
      delete: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
    get: jest.fn(() => Promise.resolve({ docs: [] })),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
  })),
};

const mockAuth = {
  verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'test-uid', email: 'test@example.com' })),
  getUser: jest.fn(() => Promise.resolve({ uid: 'test-uid', email: 'test@example.com' })),
  createUser: jest.fn(() => Promise.resolve({ uid: 'test-uid' })),
  updateUser: jest.fn(() => Promise.resolve({ uid: 'test-uid' })),
  deleteUser: jest.fn(() => Promise.resolve()),
};

const mockApp = {
  firestore: () => mockFirestore,
  auth: () => mockAuth,
};

module.exports = {
  initializeApp: jest.fn(() => mockApp),
  credential: {
    cert: jest.fn(() => ({})),
  },
  firestore: jest.fn(() => mockFirestore),
  auth: jest.fn(() => mockAuth),
};
