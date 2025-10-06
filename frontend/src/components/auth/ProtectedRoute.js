import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import ChakraSpinner from '../common/ChakraSpinner';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <ChakraSpinner size="40px" />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user role is allowed
  if (roles.length > 0 && currentUser && !roles.includes(currentUser.role)) {
    console.log('🚫 PROTECTED ROUTE: Access denied');
    console.log('   Current user role:', currentUser.role);
    console.log('   Allowed roles:', roles);
    console.log('   Path:', location.pathname);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ PROTECTED ROUTE: Access granted');
  console.log('   Current user role:', currentUser.role);
  console.log('   Allowed roles:', roles);
  console.log('   Path:', location.pathname);

  return children;
};

export default ProtectedRoute;
