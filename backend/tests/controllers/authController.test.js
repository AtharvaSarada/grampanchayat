const authController = require('../../src/controllers/authController');
const { getAuth, getFirestore } = require('../../src/config/firebase');
const { createAuditLog } = require('../../src/utils/auditLogger');
const { logger } = require('../../src/utils/logger');

// Mock Firebase services
jest.mock('../../src/config/firebase');
jest.mock('../../src/utils/auditLogger');

describe('AuthController', () => {
  let mockAuth, mockFirestore, mockDoc, mockCollection;
  
  beforeEach(() => {
    // Mock Firestore
    mockDoc = {
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    
    mockCollection = {
      doc: jest.fn(() => mockDoc),
      add: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
      })),
    };
    
    mockFirestore = {
      collection: jest.fn(() => mockCollection),
    };
    
    // Mock Auth
    mockAuth = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      verifyIdToken: jest.fn(),
      getUserByEmail: jest.fn(),
    };
    
    getAuth.mockReturnValue(mockAuth);
    getFirestore.mockReturnValue(mockFirestore);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          address: {
            street: '123 Main St',
            village: 'Test Village',
            district: 'Test District',
            state: 'Test State',
            pinCode: '123456',
          },
          dateOfBirth: '1990-01-01',
          role: 'user',
        },
        ip: '127.0.0.1',
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      // Mock Firebase Auth createUser
      const mockUserRecord = {
        uid: 'test-user-uid',
        email: 'test@example.com',
        displayName: 'John Doe',
      };
      mockAuth.createUser.mockResolvedValue(mockUserRecord);
      
      // Mock Firestore set operation
      mockDoc.set.mockResolvedValue();
      
      // Mock audit log creation
      createAuditLog.mockResolvedValue('audit-log-id');
      
      await authController.register(req, res, next);
      
      // Assertions
      expect(mockAuth.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'John Doe',
        emailVerified: false,
      });
      
      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockDoc.set).toHaveBeenCalled();
      expect(createAuditLog).toHaveBeenCalledWith({
        action: 'USER_REGISTERED',
        userId: 'test-user-uid',
        details: { email: 'test@example.com', role: 'user' },
        ipAddress: '127.0.0.1',
      });
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          uid: 'test-user-uid',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        },
      });
    });

    it('should handle registration errors', async () => {
      const req = createMockRequest({
        body: {
          email: 'invalid-email',
          password: 'short',
        },
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      // Mock Firebase error
      const firebaseError = new Error('Invalid email');
      firebaseError.code = 'auth/invalid-email';
      mockAuth.createUser.mockRejectedValue(firebaseError);
      
      await authController.register(req, res, next);
      
      expect(next).toHaveBeenCalledWith(firebaseError);
    });
  });

  describe('login', () => {
    it('should login user successfully with active account', async () => {
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
        },
        ip: '127.0.0.1',
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      // Mock Firestore user query
      const mockUserData = {
        uid: 'test-user-uid',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true,
      };
      
      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          id: 'test-user-uid',
          data: () => mockUserData,
        }],
      };
      
      mockCollection.where.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      });
      
      mockDoc.update.mockResolvedValue();
      createAuditLog.mockResolvedValue('audit-log-id');
      
      await authController.login(req, res, next);
      
      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockDoc.update).toHaveBeenCalledWith({
        lastLoginAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      
      expect(createAuditLog).toHaveBeenCalledWith({
        action: 'USER_LOGIN',
        userId: 'test-user-uid',
        details: { email: 'test@example.com' },
        ipAddress: '127.0.0.1',
      });
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          uid: 'test-user-uid',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        },
      });
    });

    it('should reject login for inactive user', async () => {
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
        },
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      // Mock inactive user
      const mockUserData = {
        uid: 'test-user-uid',
        email: 'test@example.com',
        isActive: false,
      };
      
      const mockQuerySnapshot = {
        empty: false,
        docs: [{
          id: 'test-user-uid',
          data: () => mockUserData,
        }],
      };
      
      mockCollection.where.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      });
      
      await authController.login(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Account is deactivated',
      });
    });

    it('should handle user not found', async () => {
      const req = createMockRequest({
        body: {
          email: 'nonexistent@example.com',
        },
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      // Mock empty query result
      const mockQuerySnapshot = {
        empty: true,
      };
      
      mockCollection.where.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockQuerySnapshot),
      });
      
      await authController.login(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const req = createMockRequest({
        user: {
          uid: 'test-user-uid',
          email: 'test@example.com',
        },
        ip: '127.0.0.1',
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      createAuditLog.mockResolvedValue('audit-log-id');
      
      await authController.logout(req, res, next);
      
      expect(createAuditLog).toHaveBeenCalledWith({
        action: 'USER_LOGOUT',
        userId: 'test-user-uid',
        details: { email: 'test@example.com' },
        ipAddress: '127.0.0.1',
      });
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const req = createMockRequest({
        user: {
          uid: 'test-user-uid',
        },
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      const mockUserData = {
        uid: 'test-user-uid',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockDoc.get.mockResolvedValue({
        exists: true,
        data: () => mockUserData,
      });
      
      await authController.getProfile(req, res, next);
      
      expect(mockFirestore.collection).toHaveBeenCalledWith('users');
      expect(mockDoc.get).toHaveBeenCalled();
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          uid: 'test-user-uid',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        }),
      });
    });

    it('should handle profile not found', async () => {
      const req = createMockRequest({
        user: {
          uid: 'nonexistent-user',
        },
      });
      
      const res = createMockResponse();
      const next = createMockNext();
      
      mockDoc.get.mockResolvedValue({
        exists: false,
      });
      
      await authController.getProfile(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User profile not found',
      });
    });
  });
});

describe('AuthController Error Handling', () => {
  it('should handle database errors gracefully', async () => {
    const req = createMockRequest({
      body: {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      },
    });
    
    const res = createMockResponse();
    const next = createMockNext();
    
    // Mock Firebase Auth success
    mockAuth.createUser.mockResolvedValue({
      uid: 'test-user-uid',
      email: 'test@example.com',
    });
    
    // Mock Firestore error
    mockDoc.set.mockRejectedValue(new Error('Database connection failed'));
    
    await authController.register(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
