# PowerShell script to create all missing React components
Write-Host "Creating React components..." -ForegroundColor Green

# Create directory structure
$directories = @(
    "src\components\layout",
    "src\components\auth", 
    "src\components\common",
    "src\pages",
    "src\pages\auth",
    "src\pages\services", 
    "src\pages\user",
    "src\pages\staff",
    "src\pages\admin", 
    "src\pages\error"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
        Write-Host "Created directory: $dir" -ForegroundColor Yellow
    }
}

# Component templates
$basicComponent = @"
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const COMPONENT_NAME = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          COMPONENT_NAME
        </Typography>
        <Typography variant="body1">
          This is the COMPONENT_NAME component. Implementation coming soon.
        </Typography>
      </Box>
    </Container>
  );
};

export default COMPONENT_NAME;
"@

# List of components to create
$components = @{
    "src\components\layout\Footer.js" = "Footer"
    "src\components\auth\ProtectedRoute.js" = "ProtectedRoute"
    "src\components\common\LoadingSpinner.js" = "LoadingSpinner"
    "src\pages\HomePage.js" = "HomePage"
    "src\pages\auth\LoginPage.js" = "LoginPage"
    "src\pages\auth\RegisterPage.js" = "RegisterPage"
    "src\pages\services\ServicesPage.js" = "ServicesPage"
    "src\pages\services\ServiceDetailsPage.js" = "ServiceDetailsPage"
    "src\pages\user\UserDashboard.js" = "UserDashboard"
    "src\pages\user\UserApplications.js" = "UserApplications"
    "src\pages\user\ApplicationForm.js" = "ApplicationForm"
    "src\pages\user\UserProfile.js" = "UserProfile"
    "src\pages\staff\StaffDashboard.js" = "StaffDashboard"
    "src\pages\staff\StaffApplications.js" = "StaffApplications"
    "src\pages\staff\ApplicationReview.js" = "ApplicationReview"
    "src\pages\admin\AdminDashboard.js" = "AdminDashboard"
    "src\pages\admin\AdminUsers.js" = "AdminUsers"
    "src\pages\admin\AdminServices.js" = "AdminServices"
    "src\pages\admin\AdminApplications.js" = "AdminApplications"
    "src\pages\admin\AdminReports.js" = "AdminReports"
    "src\pages\error\NotFoundPage.js" = "NotFoundPage"
    "src\pages\error\UnauthorizedPage.js" = "UnauthorizedPage"
}

# Create components
foreach ($component in $components.GetEnumerator()) {
    $content = $basicComponent -replace "COMPONENT_NAME", $component.Value
    Set-Content -Path $component.Key -Value $content -Encoding UTF8
    Write-Host "Created component: $($component.Key)" -ForegroundColor Green
}

Write-Host "All components created successfully!" -ForegroundColor Green
