import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          UnauthorizedPage
        </Typography>
        <Typography variant="body1">
          This is the UnauthorizedPage component. Implementation coming soon.
        </Typography>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
