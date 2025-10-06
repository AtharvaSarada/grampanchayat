import React from 'react';
import { Box, Typography } from '@mui/material';
import ChakraSpinner from './ChakraSpinner';

const LoadingSpinner = ({ message = 'Loading...', size = 40 }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <ChakraSpinner size={`${size}px`} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
