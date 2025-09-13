# Firebase Deployment Script for Gram Panchayath Services
Write-Host "Firebase Deployment Script" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Check if Firebase CLI is installed
if (!(Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Login to Firebase (if not already logged in)
Write-Host "Please make sure you're logged into Firebase..." -ForegroundColor Yellow
firebase login

# Set the Firebase project
Write-Host "Setting Firebase project..." -ForegroundColor Yellow
firebase use grampanchayat-9e014

Write-Host "Step 1: Building frontend..." -ForegroundColor Cyan
cd frontend
npm run build
cd ..

Write-Host "Step 2: Deploying Firebase Security Rules..." -ForegroundColor Cyan
firebase deploy --only firestore:rules,storage

Write-Host "Step 3: Deploying Functions..." -ForegroundColor Cyan
cd functions
npm install
cd ..
firebase deploy --only functions

Write-Host "Step 4: Deploying Frontend to Hosting..." -ForegroundColor Cyan
firebase deploy --only hosting

Write-Host "Step 5: Complete deployment..." -ForegroundColor Cyan
firebase deploy

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Your app should be available at: https://grampanchayat-9e014.web.app" -ForegroundColor Green

# Additional instructions
Write-Host "`nIMPORTANT: Production Mode Configuration" -ForegroundColor Red
Write-Host "=========================================" -ForegroundColor Red
Write-Host "1. Go to Firebase Console: https://console.firebase.google.com/project/grampanchayat-9e014" -ForegroundColor Yellow
Write-Host "2. Navigate to Firestore Database" -ForegroundColor Yellow
Write-Host "3. Click on 'Rules' tab" -ForegroundColor Yellow
Write-Host "4. Make sure rules are in PRODUCTION mode (not test mode)" -ForegroundColor Yellow
Write-Host "5. Navigate to Storage" -ForegroundColor Yellow
Write-Host "6. Click on 'Rules' tab" -ForegroundColor Yellow  
Write-Host "7. Make sure storage rules are in PRODUCTION mode" -ForegroundColor Yellow
Write-Host "8. Test the deployed application thoroughly" -ForegroundColor Yellow
