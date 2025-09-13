import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CheckCircle,
  Assignment,
  ArrowBack
} from '@mui/icons-material';

// Import service forms
import BirthCertificateForm from '../../components/forms/BirthCertificateFormNew';
import UniversalForm from '../../components/forms/UniversalForm';

// Import services
import { useAuth } from '../../context/AuthContext';
import { handleFormSubmission, getFormConfig } from '../../services/formSubmissionService';
import { SERVICE_TYPES } from '../../services/applicationService';
import { getAllServices } from '../../data/servicesData';
import { allServicesData } from '../../data/allServicesData';
import toast from 'react-hot-toast';

const ApplicationForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    // Load service details - try comprehensive data first, fallback to basic services
    const numericServiceId = parseInt(serviceId);
    let foundService = allServicesData[numericServiceId];
    
    if (!foundService) {
      // Fallback to basic services data
      const allServices = getAllServices();
      foundService = allServices.find(s => s.id === numericServiceId);
    }
    
    if (foundService) {
      setService(foundService);
    } else {
      console.log('Service not found. Looking for ID:', numericServiceId);
      toast.error('Service not found');
      navigate('/services');
      return;
    }
    
    setLoading(false);
  }, [serviceId, navigate]);

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !currentUser) {
      toast.error('Please login to submit an application');
      navigate('/login', { state: { returnUrl: `/apply/${serviceId}` } });
    }
  }, [currentUser, loading, serviceId, navigate]);

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    
    try {
      const result = await handleFormSubmission(formData);
      
      if (result.success) {
        setSubmissionResult(result);
        setSuccessDialog(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to submit application: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/services');
  };

  const handleSuccessClose = () => {
    setSuccessDialog(false);
    navigate('/my-applications');
  };

  const getServiceTypeFromServiceId = (serviceId) => {
    // Map numeric service IDs to service types based on servicesData.js
    const numericId = parseInt(serviceId);
    const serviceMapping = {
      1: SERVICE_TYPES.BIRTH_CERTIFICATE,        // Birth Certificate
      2: SERVICE_TYPES.DEATH_CERTIFICATE,        // Death Certificate  
      3: SERVICE_TYPES.MARRIAGE_CERTIFICATE,     // Marriage Certificate
      7: SERVICE_TYPES.BUSINESS_LICENSE,         // Trade License
      9: SERVICE_TYPES.INCOME_CERTIFICATE,      // Income Certificate
      10: SERVICE_TYPES.CASTE_CERTIFICATE,      // Caste Certificate
      11: SERVICE_TYPES.DOMICILE_CERTIFICATE,   // Domicile Certificate
      15: SERVICE_TYPES.WATER_CONNECTION,       // Water Connection
      // Add other mappings as needed
    };
    
    return serviceMapping[numericId];
  };

  const renderForm = () => {
    // Check if service has comprehensive form fields
    if (service?.formFields) {
      return (
        <UniversalForm
          serviceData={service}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          loading={submitting}
        />
      );
    }
    
    // Fallback to legacy form system
    const serviceType = getServiceTypeFromServiceId(serviceId);
    
    switch (serviceType) {
      case SERVICE_TYPES.BIRTH_CERTIFICATE:
        return (
          <BirthCertificateForm 
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        );
      
      default:
        return (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Form Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              The application form for {service?.title} is being developed and will be available soon.
            </Typography>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2 }}>
              Back to Services
            </Button>
          </Paper>
        );
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Service not found. Please go back and try again.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/services')}
            sx={{ mt: 2 }}
            startIcon={<ArrowBack />}
          >
            Back to Services
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/services')}
            sx={{ mb: 2 }}
          >
            Back to Services
          </Button>
          
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Apply for {service.title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {service.description}
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Processing Time:</strong> {service.processingTime} • 
              <strong> Fee:</strong> {service.fee}
            </Typography>
          </Alert>
        </Box>

        {/* Form */}
        {renderForm()}

        {/* Success Dialog */}
        <Dialog 
          open={successDialog} 
          onClose={handleSuccessClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
            <CheckCircle 
              sx={{ 
                fontSize: 80, 
                color: 'success.main', 
                mb: 2, 
                display: 'block', 
                mx: 'auto' 
              }} 
            />
            <Typography variant="h5" color="success.main">
              Application Submitted Successfully!
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center', px: 4 }}>
            {submissionResult && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Reference Number
                </Typography>
                <Typography 
                  variant="h4" 
                  color="primary" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    mb: 3,
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1
                  }}
                >
                  {submissionResult.referenceNumber}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Your application has been submitted successfully. You can track its progress in your applications dashboard.
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Please save this reference number for future correspondence.
                </Typography>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
            <Button 
              variant="contained" 
              onClick={handleSuccessClose}
              size="large"
            >
              View My Applications
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ApplicationForm;
