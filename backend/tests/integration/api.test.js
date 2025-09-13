const request = require('supertest');
const app = require('../../src/server');

describe('API Integration Tests', () => {
  let server;
  
  beforeAll(async () => {
    // Start server on test port
    server = app.listen(5001);
  });
  
  afterAll(async () => {
    // Close server after tests
    if (server) {
      server.close();
    }
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toEqual({
        status: 'OK',
        message: 'Gram Panchayath Services API is running',
        timestamp: expect.any(String),
        version: '1.0.0',
      });
    });
  });

  describe('Authentication Endpoints', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user with valid data', async () => {
        const userData = {
          email: 'newuser@example.com',
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
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body).toEqual({
          success: true,
          message: 'User registered successfully',
          data: expect.objectContaining({
            uid: expect.any(String),
            email: 'newuser@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
          }),
        });
      });

      it('should reject registration with invalid email', async () => {
        const invalidUserData = {
          email: 'invalid-email',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidUserData)
          .expect(400);

        expect(response.body).toEqual({
          success: false,
          message: 'Validation Error',
          error: expect.any(String),
        });
      });

      it('should reject registration with short password', async () => {
        const invalidUserData = {
          email: 'valid@example.com',
          password: '123',
          firstName: 'John',
          lastName: 'Doe',
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidUserData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('password');
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login with valid credentials', async () => {
        const loginData = {
          email: 'test@example.com',
          password: 'password123',
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(200);

        expect(response.body).toEqual({
          success: true,
          message: 'Login successful',
          data: expect.objectContaining({
            uid: expect.any(String),
            email: 'test@example.com',
          }),
        });
      });

      it('should reject login with invalid email format', async () => {
        const invalidLoginData = {
          email: 'invalid-email',
          password: 'password123',
        };

        const response = await request(app)
          .post('/api/auth/login')
          .send(invalidLoginData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Protected Routes', () => {
    let authToken;
    
    beforeAll(async () => {
      // Mock getting auth token
      authToken = 'mock-firebase-token';
    });

    describe('User Routes', () => {
      it('should require authentication for user routes', async () => {
        const response = await request(app)
          .get('/api/users/services')
          .expect(401);

        expect(response.body).toEqual({
          success: false,
          message: 'Access token required',
        });
      });

      it('should access user services with valid token', async () => {
        const response = await request(app)
          .get('/api/users/services')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('Staff Routes', () => {
      it('should require staff role for staff routes', async () => {
        const response = await request(app)
          .get('/api/staff/dashboard')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(403);

        expect(response.body).toEqual({
          success: false,
          message: 'Insufficient permissions',
        });
      });
    });

    describe('Admin Routes', () => {
      it('should require admin role for admin routes', async () => {
        const response = await request(app)
          .get('/api/officers/dashboard')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(403);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'API endpoint not found',
        path: '/api/nonexistent',
      });
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('{"invalid": json}')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting after many requests', async () => {
      // Make multiple requests rapidly
      const promises = Array(110).fill().map(() => 
        request(app).get('/health')
      );
      
      const responses = await Promise.allSettled(promises);
      const rateLimitedResponses = responses.filter(
        result => result.value?.status === 429
      );
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 10000);
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .expect(204);

      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });
});
