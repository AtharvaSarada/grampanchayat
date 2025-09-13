# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

E-Services for Gram Panchayath is a web application designed to computerize gram panchayat services, enabling citizens to apply for government services online and track their application status. The system supports three user roles: Citizens (users), Staff, and Officers/Admin.

## Architecture

This is a full-stack JavaScript application with a **separation of concerns** between frontend and backend:

### Backend Architecture (Node.js/Express)
- **Entry Point**: `backend/src/server.js` - Express server with comprehensive middleware setup
- **Route-Controller Pattern**: Routes defined in `backend/src/routes/`, controllers in `backend/src/controllers/`
- **Role-based Access Control**: Authentication middleware with user roles (user, staff, officer, admin)
- **Firebase Integration**: Firestore for database, Firebase Auth for authentication
- **Comprehensive Logging**: Winston logger with audit trails and security logging
- **API Structure**: RESTful endpoints under `/api/` prefix

### Frontend Architecture (React.js)
- **Modern React Patterns**: Functional components with hooks, Context API for global state
- **Material-UI Design System**: Consistent UI components and theming
- **Role-based Routing**: Protected routes based on user roles using `ProtectedRoute` component
- **State Management**: Redux Toolkit for complex state, React Query for server state
- **Modular Structure**: Organized by feature (pages, components, services, utils)

### Key Architectural Patterns
- **Middleware Chain**: Authentication → Validation → Business Logic → Response
- **Service Layer Pattern**: Business logic separated from controllers
- **Protected Routes**: Role-based access control on frontend routes
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Rate limiting, CORS, Helmet security headers, input validation

## Development Commands

### Initial Setup
```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Start development servers (both backend and frontend)
npm run dev
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Start backend in development mode (with nodemon)
npm run dev

# Start backend in production mode  
npm start

# Run backend tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Start development server (React)
npm start

# Build for production
npm run build

# Run frontend tests
npm test

# Lint code
npm run lint

# Format code with Prettier
npm run format
```

### Testing Commands
```bash
# Run all tests (backend + frontend)
npm test

# Backend-specific test commands
cd backend
npm test                    # Run all backend tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report

# Frontend-specific test commands  
cd frontend
npm test                   # Run React tests with Jest
npm test -- --coverage    # Run with coverage
```

### Firebase Configuration
The application requires Firebase setup for Firestore database and Authentication. Key configuration files:
- `firebase.json` - Firebase project configuration
- `firestore.rules` - Database security rules
- `firestore.indexes.json` - Database indexes
- Backend requires Firebase Admin SDK credentials
- Frontend requires Firebase web SDK configuration

## Development Workflow

### Environment Setup
1. **Backend Environment** (`.env` in backend directory):
   ```env
   PORT=5000
   NODE_ENV=development
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   JWT_SECRET=your-jwt-secret
   ```

2. **Frontend Environment** (`.env` in frontend directory):
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   ```

### API Endpoints Structure
- **Authentication**: `/api/auth/*` (login, register, logout)
- **User Management**: `/api/users/*` 
- **Staff Operations**: `/api/staff/*`
- **Officer/Admin**: `/api/officers/*`
- **Services**: `/api/services/*` (CRUD operations for government services)
- **Applications**: `/api/applications/*` (citizen applications and status updates)

### Role-Based Access Patterns
- **Citizens (users)**: Can view services, submit applications, track status
- **Staff**: Can view and update application status, process applications
- **Officers/Admin**: Full access including service creation, user management, reports

### Testing Strategy
- **Backend**: Jest with Supertest for API testing, minimum 70% coverage required
- **Frontend**: React Testing Library with Jest
- **Test Configuration**: `backend/jest.config.js` with coverage thresholds
- **Test Structure**: Unit tests for controllers, integration tests for API endpoints

### Key Development Considerations
- **Logging**: All user actions are logged with Winston logger
- **Security**: Input validation with Joi, rate limiting, CORS protection
- **Error Handling**: Centralized error handling with proper status codes
- **Performance**: Code splitting, lazy loading, database query optimization
- **Deployment**: Docker-ready with containerization support

### Common Development Tasks
When adding new features:
1. **Backend**: Create route → controller → validation schema → tests
2. **Frontend**: Create page component → add to routing → implement API calls → add tests
3. **Database**: Update Firestore rules and indexes as needed
4. **Authentication**: Ensure proper role-based access control

### Debugging
- Backend logs available through Winston logger
- Health check endpoint: `GET /health`
- Development servers run on:
  - Backend: http://localhost:5000
  - Frontend: http://localhost:3000

### Firebase Firestore Collections Structure
Based on the application modules:
- `users` - User profiles and authentication data
- `services` - Government services catalog
- `applications` - Citizen applications with status tracking
- `schemes` - Government schemes information
- `audit_logs` - System activity logs
