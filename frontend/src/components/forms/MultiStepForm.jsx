import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
  Send as SubmitIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { validateForm, generateApplicationId } from '../../utils/formValidation';
import { useAuth } from '../../context/AuthContext';
import { submitApplication } from '../../services/realWorldApplicationService';
import { useFormDraft } from '../../hooks/useFormDraft';
import ChakraSpinner from '../common/ChakraSpinner';
import toast from 'react-hot-toast';

const MultiStepForm = ({
  serviceType,
  serviceName,
  steps,
  validationRules,
  children,
  onSubmit,
  initialData = {}
}) => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [tempApplicationId, setTempApplicationId] = useState(null);

  // Use the new auto-save draft hook
  const {
    formData,
    setFormData,
    lastSaved,
    isSaving,
    clearDraft: clearDraftHook,
    saveDraft: saveDraftManual,
    hasDraft
  } = useFormDraft(serviceType, initialData, 1000); // 1-second debounce

  // Initialize temporary application ID for file uploads
  useEffect(() => {
    if (currentUser && !tempApplicationId) {
      const tempId = `temp_${serviceType}_${Date.now()}_${currentUser.uid.substring(0, 8)}`;
      setTempApplicationId(tempId);
    }
  }, [currentUser, serviceType, tempApplicationId]);

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const validateCurrentStep = () => {
    const currentStepFields = getCurrentStepFields();
    const stepValidationRules = {};
    
    currentStepFields.forEach(field => {
      if (validationRules[field]) {
        stepValidationRules[field] = validationRules[field];
      }
    });

    const { isValid, errors: stepErrors } = validateForm(formData, stepValidationRules);
    setErrors(stepErrors);
    return isValid;
  };

  const getCurrentStepFields = () => {
    // This would be customized based on the step configuration
    // For now, return all fields for the current step
    const stepId = steps[activeStep]?.id;
    
    // Define field mappings for each step
    const stepFieldMappings = {
      personal: ['applicantName', 'fatherName', 'dateOfBirth', 'gender', 'mobile', 'email', 'aadhaar'],
      address: ['address', 'village', 'district', 'state', 'pincode'],
      project: ['projectName', 'location', 'cropArea', 'cropName'],
      land: ['landOwnership', 'surveyNumber'],
      financial: ['projectCost', 'subsidyAmount', 'bankName', 'accountNumber'],
      family: ['familyMembers', 'earningMembers'],
      economic: ['annualIncome', 'occupation'],
      documents: ['documents']
    };

    return stepFieldMappings[stepId] || [];
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep(prev => prev + 1);
    } else {
      toast.error('Please fill all required fields correctly');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Check authentication
      if (!currentUser || !currentUser.uid) {
        toast.error('User must be authenticated to submit application');
        setLoading(false);
        return;
      }

      // Final validation
      const { isValid, errors: formErrors } = validateForm(formData, validationRules);
      
      if (!isValid) {
        setErrors(formErrors);
        toast.error('Please correct all errors before submitting');
        setLoading(false);
        return;
      }

      // Debug: Log what we're submitting
      console.log('=== SUBMITTING APPLICATION ===');
      console.log('formData:', JSON.stringify(formData, null, 2));
      console.log('serviceType:', serviceType);
      console.log('userId:', currentUser.uid);
      console.log('formData.documents length:', formData.documents?.length || 0);
      console.log('formData keys:', Object.keys(formData));
      console.log('============================');
      
      // CRITICAL: Check if formData has actual user data
      if (!formData.childName && !formData.applicantName && !formData.name) {
        console.error('❌ CRITICAL: formData appears to be empty or invalid!');
        console.error('formData:', formData);
        toast.error('Form data is missing. Please fill out the form again.');
        setLoading(false);
        return;
      }

      // Submit application using real-world service
      const result = await submitApplication(formData, currentUser.uid, serviceType);
      
      if (result.success) {
        setApplicationId(result.applicationId);
      } else {
        throw new Error('Failed to submit application');
      }

      // Clear draft after successful submission
      clearDraftHook();

      // Show success dialog
      setSubmitDialog(true);

      // Call parent onSubmit if provided
      if (onSubmit) {
        onSubmit(result);
      }

      toast.success('Application submitted successfully!');

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = activeStep === steps.length - 1;
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            {serviceName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Please fill all the required information accurately. Fields marked with * are mandatory.
          </Typography>
          
          {/* Draft Status Indicators */}
          {lastSaved && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                icon={<SaveIcon />}
                label={`Auto-saved ${new Date(lastSaved).toLocaleTimeString()}`}
                color="success"
                size="small"
                variant="outlined"
              />
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                onClick={clearDraftHook}
                color="error"
                variant="text"
              >
                Clear Draft
              </Button>
            </Box>
          )}
          
          {isSaving && (
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<ChakraSpinner size="16px" />}
                label="Saving draft..."
                color="info"
                size="small"
                variant="outlined"
              />
            </Box>
          )}

          {/* Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel>
                <Typography variant="body2">{step.title}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Content */}
        <Box sx={{ minHeight: 400, mb: 4 }}>
          {React.Children.map(children, (child, index) => {
            if (index === activeStep) {
              return React.cloneElement(child, {
                formData,
                updateFormData,
                errors,
                setErrors,
                tempApplicationId
              });
            }
            return null;
          })}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<BackIcon />}
            variant="outlined"
          >
            Back
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={saveDraftManual}
              startIcon={<SaveIcon />}
              variant="outlined"
              color="secondary"
            >
              Save Draft
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                startIcon={<SubmitIcon />}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                endIcon={<NextIcon />}
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Please correct the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>
                  <Typography variant="body2">{error}</Typography>
                </li>
              ))}
            </ul>
          </Alert>
        )}
      </Paper>

      {/* Success Dialog */}
      <Dialog open={submitDialog} onClose={() => setSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="success.main">
            Application Submitted Successfully!
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Your application has been submitted successfully.
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            Application ID: {applicationId}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Please save this Application ID for future reference. You will receive SMS and email confirmations shortly.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => {
              setSubmitDialog(false);
              // Navigate to applications page or dashboard
              window.location.href = '/dashboard';
            }}
            variant="contained"
            color="primary"
          >
            Go to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MultiStepForm;
