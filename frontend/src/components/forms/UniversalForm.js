import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Save as SaveIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import FileUpload from './FileUpload';
import { validateField, getValidationRules } from '../../utils/validationUtils';
import { saveDraft, loadDraft, clearDraft } from '../../utils/draftUtils';
import { SERVICE_TYPES } from '../../services/applicationService';
import toast from 'react-hot-toast';

const UniversalForm = ({ 
  serviceData, 
  onSubmit, 
  onCancel, 
  loading = false,
  enableAutoSave = true,
  enableDraft = true 
}) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get service type from service data
  const getServiceType = () => {
    const serviceTypeMap = {
      1: SERVICE_TYPES.BIRTH_CERTIFICATE,
      2: SERVICE_TYPES.DEATH_CERTIFICATE,
      3: SERVICE_TYPES.MARRIAGE_CERTIFICATE,
      4: SERVICE_TYPES.PROPERTY_TAX_PAYMENT,
      5: SERVICE_TYPES.PROPERTY_TAX_ASSESSMENT,
      6: SERVICE_TYPES.WATER_TAX_PAYMENT,
      7: SERVICE_TYPES.TRADE_LICENSE,
      8: SERVICE_TYPES.BUILDING_PERMISSION,
      9: SERVICE_TYPES.INCOME_CERTIFICATE,
      10: SERVICE_TYPES.CASTE_CERTIFICATE,
      11: SERVICE_TYPES.DOMICILE_CERTIFICATE,
      12: SERVICE_TYPES.BPL_CERTIFICATE,
      13: SERVICE_TYPES.HEALTH_CERTIFICATE,
      14: SERVICE_TYPES.VACCINATION_CERTIFICATE,
      15: SERVICE_TYPES.WATER_CONNECTION,
      16: SERVICE_TYPES.DRAINAGE_CONNECTION,
      17: SERVICE_TYPES.STREET_LIGHT_INSTALLATION,
      18: SERVICE_TYPES.AGRICULTURAL_SUBSIDY,
      19: SERVICE_TYPES.CROP_INSURANCE,
      20: SERVICE_TYPES.SCHOOL_TRANSFER_CERTIFICATE,
      21: SERVICE_TYPES.SCHOLARSHIP_APPLICATION
    };
    return serviceTypeMap[serviceData.id] || `service_${serviceData.id}`;
  };

  const serviceType = getServiceType();
  const validationRules = getValidationRules(serviceType);

  // Load draft data on component mount
  useEffect(() => {
    if (enableDraft && currentUser) {
      const draftData = loadDraft(serviceType, currentUser.uid);
      if (draftData) {
        setFormData(draftData);
        toast.success('Draft data loaded');
      }
    }
  }, [serviceType, currentUser?.uid, enableDraft]);

  // Auto-save functionality
  useEffect(() => {
    if (!enableAutoSave || !currentUser || !formData || Object.keys(formData).length === 0) return;

    const timeoutId = setTimeout(() => {
      setIsSaving(true);
      const success = saveDraft(serviceType, currentUser.uid, formData);
      if (success) {
        setLastSaveTime(new Date());
      }
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, serviceType, currentUser?.uid, enableAutoSave]);

  // Group fields by steps for multi-step forms with smart logic
  const getSteps = () => {
    if (!serviceData.formFields) return [];
    
    const fields = Object.entries(serviceData.formFields);
    
    // Group fields intelligently by type
    const personalInfo = [];
    const additionalDetails = [];
    const documents = [];
    
    fields.forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig.type === 'file') {
        documents.push([fieldName, fieldConfig]);
      } else if (fieldName.includes('Name') || fieldName.includes('Age') || fieldName.includes('Date') || 
                 fieldName.includes('Gender') || fieldName.includes('Place') || fieldName.includes('Address')) {
        personalInfo.push([fieldName, fieldConfig]);
      } else {
        additionalDetails.push([fieldName, fieldConfig]);
      }
    });
    
    // Build steps array, ensuring no step is empty
    const steps = [];
    if (personalInfo.length > 0) steps.push(personalInfo);
    if (additionalDetails.length > 0) steps.push(additionalDetails);
    if (documents.length > 0) steps.push(documents);
    
    // If only one step, keep as single step
    if (steps.length <= 1) {
      return [fields];
    }
    
    return steps;
  };

  const steps = getSteps();
  
  // Generate dynamic step labels based on content
  const getStepLabels = () => {
    if (steps.length === 1) {
      return ['Application Form'];
    }
    
    const labels = [];
    
    steps.forEach((stepFields, index) => {
      const hasFiles = stepFields.some(([_, config]) => config.type === 'file');
      const hasPersonalInfo = stepFields.some(([name, _]) => 
        name.includes('Name') || name.includes('Age') || name.includes('Date') || name.includes('Gender')
      );
      
      if (hasFiles) {
        labels.push('Documents & Files');
      } else if (hasPersonalInfo) {
        labels.push('Personal Information');
      } else {
        labels.push('Additional Details');
      }
    });
    
    return labels;
  };
  
  const stepLabels = getStepLabels();

  // Handle input changes
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  // Handle file uploads
  const handleFileChange = (fieldName, files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    handleChange(fieldName, fileArray);
  };

  // Validate current step
  const validateStep = (stepIndex) => {
    const stepFields = steps[stepIndex] || [];
    const stepErrors = {};
    let isValid = true;

    stepFields.forEach(([fieldName, fieldConfig]) => {
      const value = formData[fieldName];
      
      // Check if required field is empty
      if (fieldConfig.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        stepErrors[fieldName] = `${fieldConfig.label} is required`;
        isValid = false;
        return;
      }

      // Apply validation rules
      const rules = validationRules[fieldName] || [];
      const error = validateField(value, rules);
      if (error) {
        stepErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({
      ...prev,
      ...stepErrors
    }));

    return isValid;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Perform a fresh validation of all steps from scratch
    const newErrors = {};
    let isFormValid = true;
    steps.forEach((stepFields) => {
      stepFields.forEach(([fieldName, fieldConfig]) => {
        const value = formData[fieldName];
        
        // Check for required fields
        if (fieldConfig.required && (!value || value.length === 0)) {
          newErrors[fieldName] = `${fieldConfig.label} is required`;
          isFormValid = false;
          return;
        }

        // Apply advanced validation rules
        const rules = validationRules[fieldName] || [];
        const error = validateField(value, rules);
        if (error) {
          newErrors[fieldName] = error;
          isFormValid = false;
        }
      });
    });

    // Authoritatively set the new, complete error state
    setErrors(newErrors);

    if (!isFormValid) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    try {
      // Prepare submission data (this logic remains the same)
      const submissionData = {
        formData,
        serviceType,
        documents: Object.entries(formData)
          .filter(([key, value]) => serviceData.formFields[key]?.type === 'file' && value)
          .flatMap(([key, value]) => Array.isArray(value) ? value : [value])
      };

      await onSubmit(submissionData);
      
      if (enableDraft && currentUser) {
        clearDraft(serviceType, currentUser.uid);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form');
    }
  };

  // Render form field based on type
  const renderField = (fieldName, fieldConfig) => {
    const value = formData[fieldName] || '';
    const error = errors[fieldName];

    const commonProps = {
      fullWidth: true,
      variant: 'outlined',
      label: fieldConfig.label,
      required: fieldConfig.required,
      error: !!error,
      helperText: error,
      value,
      onChange: (e) => handleChange(fieldName, e.target.value)
    };

    switch (fieldConfig.type) {
      case 'text':
      case 'aadhaar':
      case 'mobile':
        return (
          <TextField
            {...commonProps}
            type="text"
            inputProps={{
              maxLength: fieldConfig.type === 'aadhaar' ? 12 : fieldConfig.type === 'mobile' ? 10 : undefined
            }}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            type="number"
            inputProps={{ min: 0 }}
          />
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'time':
        return (
          <TextField
            {...commonProps}
            type="time"
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={3}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{fieldConfig.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              label={fieldConfig.label}
            >
              {fieldConfig.options?.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleChange(fieldName, e.target.checked)}
              />
            }
            label={fieldConfig.label}
          />
        );

      case 'file':
        // Allow multiple files for certain field types
        const allowMultiple = fieldName.includes('Photos') || fieldName.includes('Documents') || 
                             fieldName.includes('Certificates') || fieldName.includes('Proofs');
        const maxFiles = allowMultiple ? 5 : 1;
        
        return (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {fieldConfig.label} {fieldConfig.required && '*'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {allowMultiple ? `Upload up to ${maxFiles} files` : 'Upload 1 file'} • Max size: 5MB per file
            </Typography>
            <FileUpload
              onFilesSelected={(files) => handleFileChange(fieldName, files)}
              accept={fieldConfig.accept || 'image/*,application/pdf'}
              maxFiles={maxFiles}
              maxSize={5 * 1024 * 1024} // 5MB
            />
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'repeater':
        // For now, render as a simple textarea
        // Can be enhanced later for dynamic rows
        return (
          <TextField
            {...commonProps}
            multiline
            rows={4}
            helperText={error || 'Enter each member on a new line (Name, Age, Relation)'}
          />
        );

      default:
        return (
          <TextField
            {...commonProps}
            type="text"
          />
        );
    }
  };

  // Render current step content
  const renderStepContent = (stepIndex) => {
    const stepFields = steps[stepIndex] || [];
    
    return (
      <Grid container spacing={3}>
        {stepFields.map(([fieldName, fieldConfig]) => (
          <Grid item xs={12} sm={fieldConfig.type === 'textarea' ? 12 : 6} key={fieldName}>
            {renderField(fieldName, fieldConfig)}
          </Grid>
        ))}
      </Grid>
    );
  };

  if (!serviceData.formFields) {
    return (
      <Alert severity="error">
        No form configuration found for this service.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Service Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          {serviceData.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {serviceData.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Chip label={`Processing: ${serviceData.processingTime}`} color="info" variant="outlined" />
          <Chip label={`Fee: ${serviceData.fee}`} color="success" variant="outlined" />
        </Box>
      </Paper>

      {/* Auto-save indicator */}
      {enableAutoSave && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {isSaving ? 'Saving draft...' : 
             lastSaveTime ? `Last saved: ${lastSaveTime.toLocaleTimeString()}` : 
             'Auto-save enabled'}
          </Typography>
          {isSaving && <LinearProgress sx={{ width: 100 }} />}
        </Box>
      )}

      {/* Multi-step form */}
      <Paper elevation={2} sx={{ p: 3 }}>
        {steps.length > 1 && (
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {stepLabels.slice(0, steps.length).map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Form Content */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={onCancel}
            startIcon={<CancelIcon />}
            variant="outlined"
          >
            Cancel
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack}>
                Back
              </Button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={<SendIcon />}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UniversalForm;
