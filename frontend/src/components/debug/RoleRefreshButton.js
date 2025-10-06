import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const RoleRefreshButton = ({ variant = "outlined", size = "small", showText = true }) => {
  const { refreshUserData, currentUser } = useAuth();

  const handleRefresh = async () => {
    if (refreshUserData) {
      await refreshUserData();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Tooltip title="Refresh user role and profile data from Firestore">
      <Button
        variant={variant}
        size={size}
        startIcon={<Refresh />}
        onClick={handleRefresh}
        color="secondary"
      >
        {showText ? 'Refresh Role' : ''}
      </Button>
    </Tooltip>
  );
};

export default RoleRefreshButton;
