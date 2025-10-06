import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Build,
  Schedule,
  AttachMoney,
  Description,
  Edit,
  Delete,
  Visibility,
  Person
} from '@mui/icons-material';

const ServiceList = ({ 
  services = [], 
  onEdit, 
  onDelete, 
  onView, 
  onApply,
  showActions = true,
  showApplyButton = false,
  currentUser = null,
  loading = false 
}) => {
  
  const handleEdit = (service) => {
    if (onEdit) onEdit(service);
  };

  const handleDelete = (service) => {
    if (onDelete) {
      if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
        onDelete(service.id);
      }
    }
  };

  const handleView = (service) => {
    if (onView) onView(service);
  };

  const handleApply = (service) => {
    if (onApply) onApply(service.id);
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Loading...</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (services.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Build sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No services found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No services are currently available.
        </Typography>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {services.map((service) => (
        <Grid item xs={12} md={6} lg={4} key={service.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Build color="primary" sx={{ mr: 1 }} />
                <Box sx={{ ml: 'auto' }}>
                  {service.category && (
                    <Chip
                      label={service.category}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
              
              <Typography variant="h6" component="h3" gutterBottom noWrap>
                {service.name}
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {service.description}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {service.processingTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Processing Time:
                  </Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ ml: 'auto' }}>
                    {service.processingTime}
                  </Typography>
                </Box>
              )}
              
              {service.fee && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Fee:
                  </Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ ml: 'auto' }}>
                    {service.fee}
                  </Typography>
                </Box>
              )}
              
              {service.requiredDocuments && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Description sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Documents Required
                  </Typography>
                </Box>
              )}

              {service.createdBy && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Created by Admin
                  </Typography>
                </Box>
              )}
            </CardContent>
            
            {showActions && (
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Box>
                  {onView && (
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleView(service)}
                        color="primary"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {onEdit && currentUser && ['admin', 'officer'].includes(currentUser.role) && (
                    <Tooltip title="Edit Service">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(service)}
                        color="secondary"
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {onDelete && currentUser && ['admin', 'officer'].includes(currentUser.role) && (
                    <Tooltip title="Delete Service">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(service)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                {showApplyButton && onApply && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleApply(service)}
                    disabled={!currentUser}
                  >
                    {currentUser ? 'Apply Now' : 'Login to Apply'}
                  </Button>
                )}
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceList;
