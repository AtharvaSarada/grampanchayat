# I18n Wrapper Components

This directory contains internationalized (i18n) wrapper components that add bilingual support to the existing components without modifying them.

## How It Works

Each wrapper component:
1. Imports the original component
2. Uses the `useLanguage()` hook to access translations
3. Passes translated text as props to the original component
4. Maintains all original functionality

## Usage Pattern

```javascript
import { useLanguage } from '../i18n/LanguageProvider';
import OriginalComponent from '../pages/OriginalComponent';

const OriginalComponentI18n = (props) => {
  const { t } = useLanguage();
  
  return (
    <OriginalComponent
      {...props}
      title={t('section.title')}
      subtitle={t('section.subtitle')}
      // ... other translated props
    />
  );
};

export default OriginalComponentI18n;
```

## Implementation Steps

1. **Identify text in original component** - Find all hardcoded strings
2. **Add translation keys** - Add corresponding keys to en.json and mr.json
3. **Create wrapper** - Create wrapper component that passes translated text
4. **Update routing** - Use wrapper in App.js routes instead of original

## Wrapper Components

### Created:
- `NavbarI18n.js` - Internationalized Navbar
- `HomePageI18n.js` - Internationalized Home Page
- `LoginI18n.js` - Internationalized Login Page

### To Create:
Follow the same pattern for:
- All pages in `src/pages/`
- All forms in `src/components/forms/`
- All dashboard components
- All auth components
- Footer, notifications, etc.

## Reverting to English-Only

To disable bilingual support:
1. Delete this entire `i18n_wrappers/` directory
2. Delete `src/i18n/` directory
3. Delete `src/components/LanguageToggle.js`
4. Delete `src/AppI18n.js`
5. Update `src/index.js` to use original `App` instead of `AppI18n`

The application will work exactly as before with no errors.
