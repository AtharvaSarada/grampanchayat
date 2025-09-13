# 🏛️ Gram Panchayat Digital Services Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-https://grampanchayat--9e014.web.app-green?style=for-the-badge)](https://grampanchayat-9e014.web.app)
[![Firebase](https://img.shields.io/badge/Firebase-Functions_+_Hosting-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_Pro-AI_Powered-purple?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

A comprehensive digital transformation solution for Indian Gram Panchayat (village government) services, featuring an **AI-powered chatbot** and **18+ government service applications** with intelligent form generation.

## 🎯 **Live Demo**
**🌐 Website:** https://grampanchayat-9e014.web.app  
**🤖 API:** https://api-vastrf6wqa-uc.a.run.app

## ✨ **Key Features**

### 🤖 **Gemini Pro AI Chatbot**
- **Context-Aware Conversations:** Understands life situations like "I'm getting married" or "I want to start a business"
- **Dual Query Intelligence:** 
  - **Single Service:** "I need birth certificate" → Specific recommendation
  - **List Queries:** "what services require Aadhaar card" → Complete list with count
- **Real-time Recommendations:** Direct application links with service details
- **Warm & Helpful Responses:** Natural language with emotional understanding

### 📋 **18+ Government Services**
**Civil Registration:**
- Birth Certificate, Death Certificate, Marriage Certificate

**Business Services:**
- Trade License, Building Permission

**Social Welfare:**
- Income Certificate, Caste Certificate, Domicile Certificate, BPL Certificate

**Infrastructure:**
- Water Connection, Drainage Connection, Property Tax

**Agriculture:**
- Agricultural Subsidy, Crop Insurance

**Education:**
- School Transfer Certificate, Scholarship Application

**Health Services:**
- Health Certificate, Vaccination Certificate

### 🎯 **Smart Form System**
- **Dynamic Form Generation:** Service data drives form creation
- **Multi-Step Forms:** Intelligent field grouping (Personal Info → Details → Documents)
- **Real-time Validation:** Field-level validation with helpful error messages
- **Auto-save & Drafts:** Never lose progress with automatic saving
- **File Upload Management:** Document handling with size/type validation
- **Mobile Responsive:** Works seamlessly on all devices

### 🔐 **Complete Backend**
- **Firebase Functions:** Serverless Node.js API
- **Firestore Database:** Real-time NoSQL database
- **Firebase Storage:** Secure document storage
- **Firebase Authentication:** User management
- **Admin Dashboard:** Application management interface

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ **React 18** - Modern UI library with hooks
- 🎨 **Material-UI (MUI)** - Google's Material Design components
- 🧭 **React Router** - Client-side routing
- 🔥 **Firebase SDK** - Authentication & real-time features

### **Backend**
- 🔥 **Firebase Functions** - Serverless Node.js (v20) API
- 📊 **Firestore** - NoSQL real-time database
- 💾 **Firebase Storage** - File upload management
- 🤖 **Google Gemini Pro API** - Advanced AI conversations

### **Deployment**
- 🚀 **Firebase Hosting** - Fast global CDN
- ⚡ **Firebase Functions** - Auto-scaling serverless backend

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud Project with Firebase enabled
- Gemini Pro API key

### **1. Clone Repository**
```bash
git clone https://github.com/AtharvaSarada/grampanchayat.git
cd grampanchayat
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure Firebase config in .env.local
npm start
```

### **3. Backend Setup**
```bash
cd functions
npm install
cp .env.example .env
# Add GEMINI_API_KEY to .env file
```

### **4. Firebase Configuration**
```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Deploy Functions
firebase deploy --only functions

# Deploy Hosting
firebase deploy --only hosting
```

### **5. Environment Variables**

**Functions (.env):**
```env
GEMINI_API_KEY=your_gemini_pro_api_key_here
```

**Frontend (.env.local):**
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_config
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config
```

## 📱 **Screenshots & Features**

### 🤖 **AI Chatbot in Action**
![Chatbot Demo](https://via.placeholder.com/800x400?text=AI+Chatbot+Demo)

**Features:**
- Natural language understanding
- Context-aware responses
- Direct application links
- Service recommendations

### 📋 **Dynamic Forms**
![Form System](https://via.placeholder.com/800x400?text=Dynamic+Form+System)

**Features:**
- Multi-step form wizard
- Real-time validation
- Auto-save functionality
- File upload with progress

### 📊 **Admin Dashboard**
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard)

**Features:**
- Application management
- User analytics
- Service statistics
- System monitoring

## 🏗️ **Project Structure**

```
grampanchayat/
├── 📁 frontend/                 # React 18 Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable components
│   │   │   ├── 📁 chatbot/      # Gemini Pro chatbot
│   │   │   ├── 📁 forms/        # Dynamic form components
│   │   │   └── 📁 layout/       # Navigation & layout
│   │   ├── 📁 pages/            # Page components
│   │   │   ├── 📁 admin/        # Admin dashboard
│   │   │   ├── 📁 user/         # User dashboard
│   │   │   └── 📁 applications/ # Application forms
│   │   ├── 📁 services/         # API services
│   │   ├── 📁 data/             # Service definitions
│   │   └── 📁 utils/            # Utility functions
│   └── 📁 build/                # Production build
├── 📁 functions/                # Firebase Functions
│   ├── 📄 index.js             # Main functions entry
│   ├── 📄 geminiIntelligentChat.js # AI chatbot logic
│   ├── 📄 enhancedServicesData.js  # Service definitions
│   └── 📁 routes/              # API endpoints
├── 📁 scripts/                 # Deployment scripts
├── 📄 firebase.json            # Firebase configuration
├── 📄 firestore.rules         # Database security rules
└── 📄 README.md               # This file
```

## 🎯 **Key Innovations**

### **1. Context-Aware AI Chatbot**
Unlike traditional chatbots, our Gemini Pro integration understands:
- **Life Events:** "I'm getting married" → Marriage Certificate
- **Business Needs:** "I want to start a shop" → Trade License  
- **Document Requirements:** "what services need Aadhaar" → Complete list

### **2. Dynamic Form Generation**
Forms are generated from service data, enabling:
- **Consistent UI/UX** across all services
- **Easy maintenance** - update data, forms update automatically
- **Smart field grouping** and validation

### **3. Dual Query Intelligence**
Our AI distinguishes between:
- **Single Service Queries:** Returns one specific recommendation
- **List Queries:** Returns complete lists with counts and details

### **4. Real-time Everything**
- **Auto-save** form progress
- **Real-time** application status updates
- **Instant** AI responses
- **Live** document uploads

## 📈 **API Documentation**

### **Base URLs**
- **Production:** `https://api-vastrf6wqa-uc.a.run.app`
- **Local:** `http://localhost:5001`

### **Key Endpoints**

#### **🤖 AI Chatbot**
```http
POST /intelligent-chat
Content-Type: application/json

{
  "query": "what services require Aadhaar card"
}

Response:
{
  "success": true,
  "message": "Here are the 12 services that require Aadhaar card:\n\n1. **Birth Certificate**...",
  "query_type": "list_query",
  "recommended_services": [...],
  "application_links": ["/apply/1", "/apply/3", ...]
}
```

#### **📊 Services**
```http
GET /services              # Get all services
GET /services/:id          # Get service details
```

#### **📝 Applications**
```http
POST /applications         # Submit application
GET /applications/:userId  # Get user applications
PUT /applications/:id      # Update application status
```

## 🧪 **Testing**

### **Test the Chatbot**
Visit the live site and try these queries:

**Single Service Queries:**
- "I'm getting married next month"
- "I need birth certificate for my baby"
- "I want to start a small business"

**List Queries:**
- "what services require Aadhaar card"
- "which services cost less than 100 rupees"
- "services that take less than 15 days"
- "all services for business"

### **Test Forms**
1. Ask the chatbot for a recommendation
2. Click "Apply Now" in the response
3. Fill out the multi-step form
4. Test file uploads and validation

## 🚀 **Deployment Guide**

### **Firebase Setup**
1. Create Firebase project
2. Enable Authentication, Firestore, Functions, Hosting
3. Get Gemini Pro API key
4. Configure environment variables

### **Deploy Commands**
```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only functions
firebase deploy --only hosting
```

### **Production URLs**
- **Website:** https://grampanchayat-9e014.web.app
- **API:** https://api-vastrf6wqa-uc.a.run.app

## 🎯 **Future Enhancements**

### **Planned Features**
- 📱 **Mobile App** - React Native version
- 🔗 **WhatsApp Integration** - Chatbot on WhatsApp
- 📊 **Advanced Analytics** - AI-powered insights
- 🌍 **Multi-language** - Regional language support
- 📧 **Email Notifications** - Status updates via email
- 💳 **Payment Gateway** - Online fee payments
- 📱 **SMS Integration** - SMS status updates

### **Technical Improvements**
- 🔄 **Offline Support** - Progressive Web App
- ⚡ **Performance** - Advanced caching strategies
- 🔒 **Enhanced Security** - Advanced authentication
- 📈 **Scalability** - Load balancing & optimization

## 🤝 **Contributing**

### **How to Contribute**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow **React** best practices
- Use **Material-UI** components
- Write **comprehensive** tests
- Follow **conventional** commit messages
- Update **documentation**

## 📝 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Google Gemini Pro** - For amazing AI capabilities
- **Firebase** - For comprehensive backend services
- **Material-UI** - For beautiful React components
- **React Community** - For excellent documentation
- **Open Source Community** - For various libraries used

## 📞 **Support**

### **Need Help?**
- 🐛 **Bug Reports:** [Create an Issue](https://github.com/AtharvaSarada/grampanchayat/issues)
- 💡 **Feature Requests:** [Discussions](https://github.com/AtharvaSarada/grampanchayat/discussions)
- 📧 **Email:** [support@grampanchayat.com](mailto:support@grampanchayat.com)

### **Live Demo Issues?**
If the live demo is not working:
1. Check if you're using a modern browser
2. Ensure JavaScript is enabled
3. Try refreshing the page
4. Check the browser console for errors

---

**⭐ If you found this project helpful, please give it a star!**

**🤖 Built with AI-powered intelligence for the future of government services**
