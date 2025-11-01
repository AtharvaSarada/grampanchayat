import React, { useState, useEffect, useRef } from 'react';
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
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
import { useLanguage } from '../../i18n/LanguageProvider';

const MultiStepForm = ({
  serviceType,
  serviceName,
  steps,
  validationRules,
  children,
  onSubmit,
  initialData = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stepSnackOpen, setStepSnackOpen] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useLanguage();
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
      setActiveStep(prev => {
        const newStep = prev + 1;
        console.log(`📱 Step navigation: ${prev} → ${newStep}`);
        return newStep;
      });
      setStepSnackOpen(true);
    } else {
      toast.error('Please fill all required fields correctly');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => {
      const newStep = prev - 1;
      console.log(`📱 Step navigation: ${prev} → ${newStep}`);
      return newStep;
    });
    setStepSnackOpen(true);
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
    <Box
      sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: { xs: 1.5, sm: 3 } }}
    >
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom color="primary">
            {serviceName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: { xs: 'none', sm: 'block' } }}>
            {t("multiStepForm.fillAllRequired")}
          </Typography>

          {/* Draft Status Indicators */}
          {lastSaved && (
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Chip
                icon={<SaveIcon />}
                label={t("multiStepForm.autoSaved", { time: new Date(lastSaved).toLocaleTimeString() })}
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
                {t("multiStepForm.clearDraft")}
              </Button>
            </Box>
          )}

          {isSaving && (
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<ChakraSpinner size="16px" />}
                label={t("multiStepForm.savingDraft")}
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
                {t("multiStepForm.stepOf", { current: activeStep + 1, total: steps.length })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {t("multiStepForm.percentComplete", { percent: Math.round(progress) })}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        </Box>

        {/* Stepper - responsive */}
        {isMobile ? (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0.5 }}>
              {steps.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    bgcolor: idx < activeStep ? 'success.main' : (idx === activeStep ? 'primary.main' : 'grey.400'),
                    color: 'common.white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    transform: idx === activeStep ? 'scale(1.1)' : 'scale(1.0)',
                    transition: 'transform 0.2s ease, background-color 0.2s ease, opacity 0.2s ease',
                    opacity: idx === activeStep ? 1 : 0.85
                  }}
                  aria-label={`Step ${idx + 1} of ${steps.length}`}
                >
                  {idx + 1}
                </Box>
              ))}
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 1, textAlign: 'center' }}>
              {steps[activeStep]?.title}
            </Typography>
          </Box>
        ) : (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((step) => (
              <Step key={step.id}>
                <StepLabel>
                  <Typography variant="body2">{step.title}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

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
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: { xs: 'sticky', sm: 'static' },
          bottom: { xs: 0, sm: 'auto' },
          bgcolor: { xs: 'background.paper', sm: 'transparent' },
          py: { xs: 0.5, sm: 0 },
          px: { xs: 1, sm: 0 },
          zIndex: 1,
          borderTop: { xs: '1px solid', sm: 'none' },
          borderColor: { xs: 'divider', sm: 'transparent' }
        }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<BackIcon />}
            variant="outlined"
            size="small"
            sx={{ minWidth: { xs: 72, sm: 100 }, py: { xs: 0.5, sm: 1 } }}
          >
            {t("multiStepForm.back")}
          </Button>

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            {!isMobile && (
              <Button
                onClick={saveDraftManual}
                startIcon={<SaveIcon />}
                variant="outlined"
                color="secondary"
                size="small"
              >
                {t("multiStepForm.saveDraft")}
              </Button>
            )}

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                startIcon={<SubmitIcon />}
                variant="contained"
                color="primary"
                disabled={loading}
                size="small"
                sx={{ minWidth: { xs: 92, sm: 120 }, py: { xs: 0.75, sm: 1 } }}
              >
                {loading ? t("multiStepForm.submitting") : t("multiStepForm.submit")}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                endIcon={<NextIcon />}
                variant="contained"
                color="primary"
                size="small"
                sx={{ minWidth: { xs: 92, sm: 120 }, py: { xs: 0.75, sm: 1.25 } }}
              >
                {t("multiStepForm.next")}
              </Button>
            )}
          </Box>
        </Box>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              {t("multiStepForm.correctErrors")}
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

      {/* Floating Save Draft on mobile */}
      {isMobile && (
        <Tooltip title={t("multiStepForm.saveDraft")} placement="left" TransitionComponent={Zoom}>
          <Fab
            color="secondary"
            aria-label="save-draft"
            onClick={saveDraftManual}
            sx={{ position: 'fixed', bottom: 88, right: 16, zIndex: 1400 }}
          >
            <SaveIcon />
          </Fab>
        </Tooltip>
      )}

      {/* Success Dialog */}
      <Dialog open={submitDialog} onClose={() => setSubmitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <SuccessIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" color="success.main">
            {t("multiStepForm.successTitle")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {t("multiStepForm.successMessage")}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {t("multiStepForm.applicationId", { id: applicationId })}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t("multiStepForm.saveIdMessage")}
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
            {t("multiStepForm.goToDashboard")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Step change snackbar */}
      <Snackbar
        open={stepSnackOpen}
        onClose={() => setStepSnackOpen(false)}
        autoHideDuration={1200}
        message={t("multiStepForm.stepOf", { current: activeStep + 1, total: steps.length })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default MultiStepForm;
