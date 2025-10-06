import React from 'react';
import { useLanguage } from '../i18n/LanguageProvider';
import Navbar from '../components/layout/Navbar';
import LanguageToggle from '../components/LanguageToggle';
import { Box } from '@mui/material';

/**
 * NavbarI18n - Internationalized Navbar Wrapper
 * 
 * This wrapper adds:
 * 1. Language toggle button to the navbar
 * 2. Translated navigation items
 * 
 * Usage: Replace Navbar import with NavbarI18n in App.js
 */
const NavbarI18n = (props) => {
  const { t } = useLanguage();

  // Create translated navigation items
  const translatedNavItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.services'), path: '/services' },
    { label: t('nav.dashboard'), path: '/dashboard' },
    { label: t('nav.myApplications'), path: '/my-applications' },
    { label: t('nav.profile'), path: '/profile' }
  ];

  return (
    <Box sx={{ position: 'relative' }}>
      <Navbar 
        {...props}
        navItems={translatedNavItems}
      />
      {/* Add language toggle to top right */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 80,
          zIndex: 1200
        }}
      >
        <LanguageToggle variant="icon" />
      </Box>
    </Box>
  );
};

export default NavbarI18n;
