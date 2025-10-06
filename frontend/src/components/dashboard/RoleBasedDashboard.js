import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography } from '@mui/material';
import ChakraSpinner from '../common/ChakraSpinner';

const RoleBasedDashboard = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      // Redirect based on user role (officer is treated as admin)
      const role = currentUser.role === 'officer' ? 'admin' : currentUser.role;
      
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'staff':
          navigate('/staff/dashboard', { replace: true });
          break;
        case 'user':
        default:
          navigate('/user/dashboard', { replace: true });
          break;
      }
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          gap: 2
        }}
      >
        <ChakraSpinner size="40px" />
        <Typography variant="body1" color="text.secondary">
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        gap: 2
      }}
    >
      <ChakraSpinner size="40px" />
      <Typography variant="body1" color="text.secondary">
        Redirecting to your dashboard...
      </Typography>
    </Box>
  );
};

export default RoleBasedDashboard;
