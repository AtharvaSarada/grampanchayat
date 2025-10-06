# 🚀 Bilingual System - Quick Start Guide

## ⚡ **ACTIVATE IN 3 STEPS**

### **Step 1: Update Entry Point (1 line change)**

Edit `frontend/src/index.js`:

```javascript
// Change this line:
import App from './App';

// To this:
import App from './AppI18n';
```

### **Step 2: Add Google Font (Optional but Recommended)**

Add to `frontend/public/index.html` in the `<head>` section:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&display=swap" rel="stylesheet">
```

### **Step 3: Add Language Toggle to Navbar**

Edit `frontend/src/components/layout/Navbar.js`:

```javascript
// Add this import at the top:
import LanguageToggle from '../LanguageToggle';

// Add this inside your Toolbar component (before the user menu):
<LanguageToggle variant="icon" />
```

**That's it!** Your app now supports English ⇄ Marathi toggle! 🎉

---

## 🧪 **TEST IT**

1. **Start the app**: `npm start`
2. **Look for the language toggle** in the navbar (🌐 EN or 🌐 मर)
3. **Click it** - The UI should switch languages
4. **Refresh the page** - Language preference should persist

---

## 📝 **USING TRANSLATIONS IN YOUR COMPONENTS**

### **Example 1: Simple Component**

```javascript
import { useLanguage } from '../i18n/LanguageProvider';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

### **Example 2: With Default Values**

```javascript
const { t } = useLanguage();

<Typography>{t('mySection.myKey', 'Fallback Text')}</Typography>
```

### **Example 3: Checking Current Language**

```javascript
const { language, isMarathi, isEnglish } = useLanguage();

{isMarathi && <MarathiSpecificContent />}
{isEnglish && <EnglishSpecificContent />}
```

---

## 🔑 **AVAILABLE TRANSLATION KEYS**

### **Common**
- `common.welcome` - Welcome / स्वागत आहे
- `common.submit` - Submit / सबमिट करा
- `common.cancel` - Cancel / रद्द करा
- `common.save` - Save / जतन करा
- `common.delete` - Delete / हटवा
- `common.edit` - Edit / संपादित करा
- `common.view` - View / पहा
- `common.search` - Search / शोधा
- `common.loading` - Loading... / लोड होत आहे...

### **Navigation**
- `nav.home` - Home / मुख्यपृष्ठ
- `nav.services` - Services / सेवा
- `nav.dashboard` - Dashboard / डॅशबोर्ड
- `nav.profile` - Profile / प्रोफाइल
- `nav.myApplications` - My Applications / माझे अर्ज
- `nav.logout` - Logout / लॉगआउट

### **Authentication**
- `auth.login` - Login / लॉगिन
- `auth.register` - Register / नोंदणी
- `auth.email` - Email / ईमेल
- `auth.password` - Password / पासवर्ड
- `auth.forgotPassword` - Forgot Password / पासवर्ड विसरलात?

### **Dashboard**
- `dashboard.admin.title` - Admin Dashboard / प्रशासक डॅशबोर्ड
- `dashboard.user.title` - User Dashboard / वापरकर्ता डॅशबोर्ड
- `dashboard.staff.title` - Staff Dashboard / कर्मचारी डॅशबोर्ड

### **Applications**
- `applications.title` - My Applications / माझे अर्ज
- `applications.status` - Status / स्थिती
- `applications.viewDetails` - View Details / तपशील पहा
- `applications.statusPending` - Pending / प्रलंबित
- `applications.statusApproved` - Approved / मंजूर
- `applications.statusRejected` - Rejected / नाकारले

### **Forms**
- `forms.common.firstName` - First Name / पहिले नाव
- `forms.common.lastName` - Last Name / आडनाव
- `forms.common.email` - Email / ईमेल
- `forms.common.mobile` - Mobile Number / मोबाइल नंबर
- `forms.common.submitApplication` - Submit Application / अर्ज सबमिट करा

**See full list in:** `frontend/src/i18n/en.json` and `frontend/src/i18n/mr.json`

---

## 🎨 **LANGUAGE TOGGLE VARIANTS**

### **Icon Button (Compact)**
```javascript
<LanguageToggle variant="icon" />
```
Result: 🌐 EN (switches to 🌐 मर in Marathi)

### **Switch Toggle (Clear)**
```javascript
<LanguageToggle variant="switch" />
```
Result: [EN | मर] with sliding indicator

---

## 🔄 **HOW TO DISABLE**

To revert to English-only:

1. Change `frontend/src/index.js` back to:
   ```javascript
   import App from './App';
   ```

2. (Optional) Delete these files:
   - `frontend/src/i18n/`
   - `frontend/src/i18n_wrappers/`
   - `frontend/src/components/LanguageToggle.js`
   - `frontend/src/AppI18n.js`

---

## 📚 **NEXT STEPS**

1. ✅ **Activated** - System is now bilingual
2. 📝 **Add translations** - Use `t()` function in components
3. 🎨 **Customize toggle** - Position and style the language toggle
4. 🧪 **Test thoroughly** - Check all pages in both languages
5. 📖 **Read full guide** - See `BILINGUAL_IMPLEMENTATION_GUIDE.md`

---

## 🆘 **TROUBLESHOOTING**

### **Toggle not showing?**
- Check if LanguageToggle is imported in Navbar
- Verify AppI18n is being used in index.js

### **Translations not working?**
- Ensure component is inside LanguageProvider
- Check translation key exists in both en.json and mr.json

### **Marathi text looks weird?**
- Add Noto Sans Devanagari font (Step 2 above)
- Check browser font settings

---

## ✅ **VERIFICATION CHECKLIST**

- [ ] Changed index.js to use AppI18n
- [ ] Added Noto Sans Devanagari font
- [ ] Added LanguageToggle to Navbar
- [ ] Tested language toggle
- [ ] Verified language persists on refresh
- [ ] Checked Marathi text renders correctly

---

**🎉 Congratulations! Your app now supports English and Marathi!**

For detailed implementation guide, see: `BILINGUAL_IMPLEMENTATION_GUIDE.md`
