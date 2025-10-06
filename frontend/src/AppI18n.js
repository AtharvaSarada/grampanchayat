import React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LanguageProvider } from './i18n/LanguageProvider';
import { store } from './store/store';
import App from './App';

// Create a QueryClient instance
const queryClient = new QueryClient();

/**
 * AppI18n - Internationalized Entry Point
 * 
 * This is the new entry point that wraps the entire application
 * with LanguageProvider to enable bilingual support.
 * 
 * To use this instead of the original App.js:
 * 1. Update src/index.js to import AppI18n instead of App
 * 2. All components will now have access to useLanguage() hook
 * 3. Language toggle will be available in the Navbar
 * 
 * To revert to English-only:
 * - Simply change index.js back to import App instead of AppI18n
 * - Delete this file and all i18n-related files
 */
function AppI18n() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default AppI18n;
