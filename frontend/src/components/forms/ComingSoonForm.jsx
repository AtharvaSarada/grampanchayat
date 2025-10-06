import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

const ComingSoonForm = ({ serviceName }) => (
  <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom color="primary">
      {serviceName}
    </Typography>
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Form Coming Soon!
      </Typography>
      <Typography variant="body1">
        The {serviceName} application form is currently under development. 
        Please check back soon or contact the office for assistance.
      </Typography>
    </Alert>
    <Typography variant="body2" color="text.secondary">
      For immediate assistance, please visit the Gram Panchayat office or call our helpline.
    </Typography>
  </Box>
);

export default ComingSoonForm;
