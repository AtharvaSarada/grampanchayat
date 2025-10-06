# Complete Frontend Translation Plan

## Overview
This document outlines the systematic approach to translate every visible text in the frontend to support English ⇄ Marathi toggle.

## Translation Status

### ✅ Phase 1: Core Infrastructure (COMPLETED)
- [x] Translation files (en.json, mr.json) - 150+ keys
- [x] LanguageProvider context
- [x] LanguageToggle component
- [x] AppI18n entry point
- [x] HomePage (demo implementation)

### 🔄 Phase 2: Navigation & Layout (IN PROGRESS)
- [ ] Navbar.js - All menu items, buttons
- [ ] Footer.js - All links, contact info, copyright
- [ ] Sidebar (if any)

### 📋 Phase 3: Authentication Pages
- [ ] LoginPage.js
- [ ] RegisterPage.js
- [ ] ForgotPasswordPage.js

### 📄 Phase 4: Main Pages
- [ ] ServicesPage.js
- [ ] ServiceDetailsPage.js
- [ ] MyApplications.js
- [ ] UserProfile.js
- [ ] UserDashboard.js

### 👨‍💼 Phase 5: Admin Components
- [ ] AdminDashboard.js
- [ ] AdminApplications.jsx
- [ ] ApplicationReviewDialog.jsx
- [ ] AdminUsers.js
- [ ] AdminServices.js

### 👷 Phase 6: Staff Components
- [ ] StaffDashboard.js
- [ ] StaffApplications.js
- [ ] ApplicationReview.js

### 📝 Phase 7: Form Components (21 Service Forms)
- [ ] MultiStepForm.jsx (common wrapper)
- [ ] BirthCertificateForm.js
- [ ] DeathCertificateForm.js
- [ ] MarriageCertificateForm.js
- [ ] TradeLicenseForm.jsx
- [ ] HealthCertificateForm.jsx
- [ ] WaterConnectionForm.jsx
- [ ] (15 more service forms...)

### 🔔 Phase 8: Common Components
- [ ] NotificationSystem.js
- [ ] LoadingSpinner.js
- [ ] ChakraSpinner.js
- [ ] Error messages
- [ ] Toast notifications

### 📊 Phase 9: Dashboard Widgets
- [ ] Statistics cards
- [ ] Charts and graphs labels
- [ ] Table headers
- [ ] Status badges

## Implementation Strategy

### Automated Approach (Recommended)
Create a script to:
1. Scan all .js/.jsx files
2. Extract hardcoded strings
3. Replace with t() function calls
4. Add missing keys to translation files

### Manual Approach (Current)
Update each component individually:
```javascript
// 1. Import hook
import { useLanguage } from '../i18n/LanguageProvider';

// 2. Use in component
const { t } = useLanguage();

// 3. Replace text
<Typography>{t('section.key')}</Typography>
```

## Priority Order

### High Priority (User-Facing)
1. HomePage ✅
2. Navbar
3. Footer
4. ServicesPage
5. Login/Register
6. MyApplications

### Medium Priority (Authenticated Users)
7. UserDashboard
8. UserProfile
9. Service Forms
10. Notifications

### Low Priority (Admin/Staff)
11. AdminDashboard
12. StaffDashboard
13. Admin management pages

## Estimated Effort

- **Total Components**: ~50 files
- **Estimated Strings**: ~500-800 translatable strings
- **Time per Component**: 10-15 minutes
- **Total Estimated Time**: 8-12 hours

## Next Steps

1. **Immediate**: Translate high-priority components (Navbar, Footer, ServicesPage)
2. **Short-term**: Complete all user-facing pages
3. **Long-term**: Complete admin/staff interfaces and all 21 forms

## Testing Checklist

After each phase:
- [ ] Toggle works on all pages
- [ ] No untranslated text visible
- [ ] Marathi text renders correctly
- [ ] Layout doesn't break with longer text
- [ ] All buttons/links still functional
