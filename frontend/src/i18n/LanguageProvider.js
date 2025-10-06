import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from './en.json';
import mrTranslations from './mr.json';

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  mr: mrTranslations
};

export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('appLanguage');
    return savedLang || 'en';
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language === 'mr' ? 'mr' : 'en';
  }, [language]);

  // Toggle between English and Marathi
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  // Set specific language
  const setLang = (lang) => {
    if (lang === 'en' || lang === 'mr') {
      setLanguage(lang);
    }
  };

  // Translation function - supports nested keys like "dashboard.admin.title"
  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }

    return value || defaultValue || key;
  };

  const value = {
    language,
    toggleLanguage,
    setLanguage: setLang,
    t,
    isMarathi: language === 'mr',
    isEnglish: language === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageProvider;
