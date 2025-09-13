# Firebase Deployment Guide

## Prerequisites

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Set Firebase Project**:
   ```bash
   firebase use grampanchayat-9e014
   ```

## Step-by-Step Deployment

### Step 1: Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### Step 2: Deploy Security Rules (PRODUCTION MODE)
```bash
firebase deploy --only firestore:rules,storage
```

### Step 3: Deploy Backend Functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Step 4: Deploy Frontend to Hosting
```bash
firebase deploy --only hosting
```

### Step 5: Complete Deployment
```bash
firebase deploy
```

## Production Mode Configuration

### ⚠️ CRITICAL: Set Firestore to Production Mode

1. Go to [Firebase Console](https://console.firebase.google.com/project/grampanchayat-9e014)
2. Navigate to **Firestore Database**
3. Click on **Rules** tab
4. Ensure rules are deployed and in **PRODUCTION** mode (not test mode)
5. Rules should show:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Your production rules here
     }
   }
   ```

### ⚠️ CRITICAL: Set Storage to Production Mode

1. In Firebase Console, navigate to **Storage**
2. Click on **Rules** tab
3. Ensure storage rules are in **PRODUCTION** mode
4. Rules should show:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Your production storage rules here
     }
   }
   ```

## Post-Deployment URLs

- **Frontend**: https://grampanchayat-9e014.web.app
- **API Health Check**: https://grampanchayat-9e014.web.app/api/health
- **Firebase Console**: https://console.firebase.google.com/project/grampanchayat-9e014

## Verification Steps

1. **Test Frontend**: Visit https://grampanchayat-9e014.web.app
2. **Test API**: Visit https://grampanchayat-9e014.web.app/api/health
3. **Test Authentication**: Try registering/logging in
4. **Test Database**: Check if data is being saved to Firestore
5. **Test Storage**: Try uploading a file

## Production Environment Features

✅ **Firebase Functions**: Backend API deployed as serverless functions
✅ **Firebase Hosting**: Frontend deployed with CDN
✅ **Production Security Rules**: Role-based access control
✅ **Authentication**: Firebase Auth with custom claims
✅ **Database**: Firestore in production mode
✅ **Storage**: Firebase Storage with security rules
✅ **Monitoring**: Firebase performance monitoring
✅ **Analytics**: Built-in Firebase Analytics (optional)

## Troubleshooting

### Common Issues:

1. **Functions not deploying**: Check Node.js version (should be 18)
2. **Rules not applying**: Ensure you deploy rules separately first
3. **API calls failing**: Check CORS settings and function permissions
4. **Authentication issues**: Verify Firebase config in frontend

### Logs:
- **Function logs**: `firebase functions:log`
- **Deploy logs**: Check Firebase Console > Functions

## Security Checklist

- ✅ Firestore rules deployed and tested
- ✅ Storage rules deployed and tested  
- ✅ Authentication enabled with proper role management
- ✅ API endpoints protected with authentication middleware
- ✅ Input validation implemented
- ✅ Rate limiting enabled
- ✅ CORS properly configured
- ✅ Environment variables secured
