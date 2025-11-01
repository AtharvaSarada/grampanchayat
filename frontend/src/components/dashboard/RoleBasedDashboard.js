import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography } from '@mui/material';
import ChakraSpinner from '../common/ChakraSpinner';

const RoleBasedDashboard = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Detect if running on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!loading && currentUser && !redirectAttempted) {
      // Redirect based on user role (officer is treated as admin)
      const role = currentUser.role === 'officer' ? 'admin' : currentUser.role;
      setRedirectAttempted(true);
      
      // Add a small delay for mobile devices to ensure state is properly updated
      const redirectWithDelay = async () => {
        if (isMobile) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
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
      };
      
      redirectWithDelay();
    }
  }, [currentUser, loading, navigate, redirectAttempted]);

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
