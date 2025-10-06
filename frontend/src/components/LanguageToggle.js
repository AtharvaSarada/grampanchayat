import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { Language, Translate } from '@mui/icons-material';
import { useLanguage } from '../i18n/LanguageProvider';

const LanguageToggle = ({ variant = 'icon' }) => {
  const { language, toggleLanguage, isMarathi } = useLanguage();

  if (variant === 'switch') {
    // Switch variant with EN/MR labels
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 0.5,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          onClick={toggleLanguage}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            position: 'relative',
            bgcolor: 'grey.100',
            borderRadius: 1.5,
            p: 0.5
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              left: isMarathi ? 'calc(50% + 2px)' : '4px',
              width: 'calc(50% - 6px)',
              height: 'calc(100% - 8px)',
              bgcolor: 'primary.main',
              borderRadius: 1,
              transition: 'left 0.3s ease',
              zIndex: 0
            }}
          />
          <Typography
            variant="body2"
            sx={{
              px: 1.5,
              py: 0.5,
              fontWeight: !isMarathi ? 'bold' : 'normal',
              color: !isMarathi ? 'white' : 'text.primary',
              position: 'relative',
              zIndex: 1,
              transition: 'color 0.3s ease'
            }}
          >
            EN
          </Typography>
          <Typography
            variant="body2"
            sx={{
              px: 1.5,
              py: 0.5,
              fontWeight: isMarathi ? 'bold' : 'normal',
              color: isMarathi ? 'white' : 'text.primary',
              position: 'relative',
              zIndex: 1,
              transition: 'color 0.3s ease'
            }}
          >
            मर
          </Typography>
        </Box>
      </Box>
    );
  }

  // Icon button variant (default)
  return (
    <Tooltip title={isMarathi ? 'Switch to English' : 'मराठीत बदला'}>
      <IconButton
        onClick={toggleLanguage}
        color="inherit"
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Language />
          <Typography variant="caption" fontWeight="bold">
            {isMarathi ? 'EN' : 'मर'}
          </Typography>
        </Box>
      </IconButton>
    </Tooltip>
  );
};

export default LanguageToggle;
