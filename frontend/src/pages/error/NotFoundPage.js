import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          NotFoundPage
        </Typography>
        <Typography variant="body1">
          This is the NotFoundPage component. Implementation coming soon.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
