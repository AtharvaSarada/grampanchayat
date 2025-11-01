# Gram Panchayat E-Services Platform

A comprehensive digital platform for Gram Panchayat services, enabling citizens to access government services online with multilingual support (English/Marathi).

## 🚀 Features

### Citizen Services
- **Digital Applications**: Online forms for various government services
- **Application Tracking**: Real-time status updates and notifications
- **Document Management**: Secure document upload and storage
- **Payment Integration**: Online fee payments for services
- **Multilingual Support**: Full English and Marathi language support

### Administrative Features
- **Admin Dashboard**: Comprehensive application management
- **User Management**: Role-based access control (Admin, Staff, Officer, User)
- **Real-time Statistics**: Live data updates and analytics
- **Application Processing**: Streamlined workflow for government officers
- **Notification System**: Automated SMS and email notifications

### Available Services
- Birth Certificate
- Death Certificate
- Marriage Certificate
- Domicile Certificate
- Caste Certificate
- Income Certificate
- Property Tax Assessment & Payment
- Water Connection & Tax Payment
- Building Permission
- Scholarship Applications
- Crop Insurance
- Agricultural Subsidy
- BPL Certificate
- Health Certificate
- Vaccination Certificate
- Street Light Installation
- Drainage Connection

## 🛠 Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **Material-UI (MUI)** - Professional component library
- **Redux** - State management
- **React Router** - Navigation
- **React Hot Toast** - Notifications

### Backend & Database
- **Firebase Authentication** - Secure user authentication
- **Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Functions** - Serverless backend

### Additional Features
- **PWA Support** - Progressive Web App capabilities
- **Responsive Design** - Mobile-first approach
- **Real-time Updates** - Live data synchronization
- **Form Validation** - Comprehensive input validation
- **File Upload** - Secure document handling

## 📱 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gram-panchayat-services.git
   cd gram-panchayat-services
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies (if applicable)
   cd ../backend
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `frontend/src/services/firebase.js`

4. **Environment Variables**
   Create `.env` file in the frontend directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the application**
   ```bash
   # Start frontend development server
   cd frontend
   npm start
   
   # The application will open at http://localhost:3000
   ```

## 🏗 Project Structure

```
gram-panchayat-services/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/          # Service application forms
│   │   │   ├── documents/      # Document management
│   │   │   └── appointments/   # Appointment scheduling
│   │   ├── pages/
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── user/           # User dashboard pages
│   │   │   └── services/       # Service pages
│   │   ├── services/           # API services
│   │   ├── context/            # React context providers
│   │   ├── i18n/              # Internationalization
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── .env
├── backend/                    # Backend services (if applicable)
├── .gitignore
└── README.md
```

## 🌐 Deployment

### Frontend Deployment (Firebase Hosting)
```bash
# Build the project
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Deploy to Firebase
firebase deploy
```

### Environment Setup
- **Development**: Local development server
- **Staging**: Firebase hosting staging environment
- **Production**: Firebase hosting production environment

## 🔐 Security Features

- **Authentication**: Firebase Authentication with email/password
- **Authorization**: Role-based access control
- **Data Validation**: Client and server-side validation
- **Secure File Upload**: Validated file types and sizes
- **HTTPS**: Secure data transmission
- **Input Sanitization**: XSS protection

## 🌍 Internationalization

The platform supports multiple languages:
- **English** (Default)
- **Marathi** (मराठी)

Language files are located in `frontend/src/i18n/`:
- `en.json` - English translations
- `mr.json` - Marathi translations

## 📊 Features Overview

### User Dashboard
- Application status tracking
- Service browsing
- Document management
- Profile management
- Payment history

### Admin Dashboard
- Application management
- User management
- Statistics and analytics
- System configuration
- Report generation

### Mobile Responsive
- Optimized for mobile devices
- Touch-friendly interface
- Progressive Web App (PWA)
- Offline capability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and queries:
- Email: support@grampanchayat.gov.in
- Phone: +91 XXXXX XXXXX

## 🙏 Acknowledgments

- Government of India Digital India Initiative
- Ministry of Panchayati Raj
- State Government IT Department
- Local Gram Panchayat Administration

---

**Made with ❤️ for Digital India Initiative**