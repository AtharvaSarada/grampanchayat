import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useLanguage } from '../../i18n/LanguageProvider';

const ComingSoonForm = ({ serviceName }) => {
  const { t } = useLanguage();
  
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom color="primary">
        {serviceName}
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('forms.common.formComingSoon')}
        </Typography>
        <Typography variant="body1">
          {t('forms.common.formUnderDevelopment', { serviceName })}
        </Typography>
      </Alert>
      <Typography variant="body2" color="text.secondary">
        {t('forms.common.immediateAssistance')}
      </Typography>
    </Box>
  );
};

export default ComingSoonForm;
