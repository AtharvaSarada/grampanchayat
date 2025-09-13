import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

// Import shared services data
import { getServiceById } from '../../data/servicesData';

const ApplicationForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  
  useEffect(() => {
    const serviceInfo = getServiceById(serviceId);
    if (serviceInfo) {
      setService(serviceInfo);
    } else {
      // Redirect to services page if service not found
      navigate('/services');
    }
  }, [serviceId, navigate]);
  
  if (!service) {
    return null;
  }
  
  const handleBackToServices = () => {
    navigate('/services');
  };
  
  const handleViewServiceDetails = () => {
    navigate(`/services/${serviceId}`);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToServices}
            sx={{ mr: 2 }}
          >
            Back to Services
          </Button>
          <Button
            variant="outlined"
            onClick={handleViewServiceDetails}
            size="small"
          >
            View Service Details
          </Button>
        </Box>
        
        {/* Service header */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ fontSize: 48 }}>
              {service.icon}
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom color="primary">
                {service.title} Application
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {service.description}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Chip 
                label={service.hasForm ? "Online Form Available" : "Coming Soon"}
                color={service.hasForm ? "success" : "warning"}
                variant="outlined"
              />
            </Box>
          </Box>
        </Paper>
        
        {/* Form content */}
        {service.hasForm && service.component ? (
          // Render the specific service form
          <service.component />
        ) : (
          // Show coming soon message for services without forms yet
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom color="text.secondary">
                Application Form Coming Soon
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                The online application form for <strong>{service.title}</strong> is currently under development.
              </Typography>
              <Alert severity="info" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="body2">
                  <strong>Alternative Options:</strong><br/>
                  • Visit your local Gram Panchayat office<br/>
                  • Call the helpline for assistance<br/>
                  • Check back soon for online application facility
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={handleViewServiceDetails}
                >
                  View Requirements & Details
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleBackToServices}
                >
                  Browse Other Services
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ApplicationForm;
