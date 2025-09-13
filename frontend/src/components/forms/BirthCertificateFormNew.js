import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Person,
  Event,
  Home,
  Phone,
  Upload,
  Send,
  Assignment,
  Group
} from '@mui/icons-material';
import FileUpload from './FileUpload';
import { SERVICE_TYPES } from '../../services/applicationService';

const BirthCertificateForm = ({ onSubmit, onCancel, loading = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Child Information
    childName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    gender: '',
    placeOfBirth: '',
    hospitalName: '',
    weight: '',
    
    // Parent Information
    fatherName: '',
    fatherAge: '',
    fatherOccupation: '',
    fatherEducation: '',
    fatherNationality: 'Indian',
    motherName: '',
    motherAge: '',
    motherOccupation: '',
    motherEducation: '',
    motherNationality: 'Indian',
    marriageDate: '',
    
    // Address Information
    parentAddress: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    permanentAddress: '',
    
    // Informant Details
    informantName: '',
    informantRelation: '',
    informantPhone: '',
    informantAddress: '',
    informantId: '',
    
    // Additional Information
    registrationPurpose: '',
    delayReason: '',
    previousApplicationNo: '',
    
    // Documents
    supportingDocuments: []
  });

  const [errors, setErrors] = useState({});
  const [documentError, setDocumentError] = useState('');

  const steps = [
    'Child Information',
    'Parent Information', 
    'Address Details',
    'Informant Details',
    'Documents & Submit'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDocumentChange = (files) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: files
    }));
    setDocumentError('');
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    
    switch (stepIndex) {
      case 0: // Child Information
        const childFields = ['childName', 'dateOfBirth', 'gender', 'placeOfBirth'];
        childFields.forEach(field => {
          if (!formData[field] || formData[field].trim() === '') {
            newErrors[field] = 'This field is required';
          }
        });
        
        // Validate date of birth
        if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
          newErrors.dateOfBirth = 'Date of birth cannot be in the future';
        }
        break;
        
      case 1: // Parent Information
        const parentFields = ['fatherName', 'motherName', 'fatherAge', 'motherAge'];
        parentFields.forEach(field => {
          if (!formData[field] || formData[field].trim() === '') {
            newErrors[field] = 'This field is required';
          }
        });
        break;
        
      case 2: // Address Information
        const addressFields = ['parentAddress', 'city', 'district', 'state', 'pincode'];
        addressFields.forEach(field => {
          if (!formData[field] || formData[field].trim() === '') {
            newErrors[field] = 'This field is required';
          }
        });
        
        // Validate pincode
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
          newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }
        break;
        
      case 3: // Informant Details
        const informantFields = ['informantName', 'informantRelation', 'informantPhone'];
        informantFields.forEach(field => {
          if (!formData[field] || formData[field].trim() === '') {
            newErrors[field] = 'This field is required';
          }
        });
        
        // Validate phone number
        if (formData.informantPhone && !/^\d{10}$/.test(formData.informantPhone)) {
          newErrors.informantPhone = 'Please enter a valid 10-digit phone number';
        }
        break;
        
      case 4: // Documents
        if (formData.supportingDocuments.length === 0) {
          setDocumentError('Please upload at least one supporting document');
          return false;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    try {
      await onSubmit({
        formData,
        serviceType: SERVICE_TYPES.BIRTH_CERTIFICATE,
        documents: formData.supportingDocuments
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Child Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="childName"
                label="Child's Full Name"
                value={formData.childName}
                onChange={handleChange}
                error={!!errors.childName}
                helperText={errors.childName}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                name="timeOfBirth"
                label="Time of Birth"
                type="time"
                value={formData.timeOfBirth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth required error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.gender && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="placeOfBirth"
                label="Place of Birth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                error={!!errors.placeOfBirth}
                helperText={errors.placeOfBirth}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="weight"
                label="Weight at Birth (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                inputProps={{ step: "0.1", min: "0" }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="hospitalName"
                label="Hospital/Institution Name (if applicable)"
                value={formData.hospitalName}
                onChange={handleChange}
                helperText="Leave blank if born at home"
              />
            </Grid>
          </Grid>
        );
        
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                Parent Information
              </Typography>
            </Grid>
            
            {/* Father's Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                Father's Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="fatherName"
                label="Father's Full Name"
                value={formData.fatherName}
                onChange={handleChange}
                error={!!errors.fatherName}
                helperText={errors.fatherName}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                name="fatherAge"
                label="Father's Age"
                type="number"
                value={formData.fatherAge}
                onChange={handleChange}
                error={!!errors.fatherAge}
                helperText={errors.fatherAge}
                inputProps={{ min: "18", max: "100" }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                name="fatherNationality"
                label="Father's Nationality"
                value={formData.fatherNationality}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="fatherOccupation"
                label="Father's Occupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="fatherEducation"
                label="Father's Education"
                value={formData.fatherEducation}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Mother's Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                Mother's Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="motherName"
                label="Mother's Full Name"
                value={formData.motherName}
                onChange={handleChange}
                error={!!errors.motherName}
                helperText={errors.motherName}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                name="motherAge"
                label="Mother's Age"
                type="number"
                value={formData.motherAge}
                onChange={handleChange}
                error={!!errors.motherAge}
                helperText={errors.motherAge}
                inputProps={{ min: "16", max: "100" }}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                name="motherNationality"
                label="Mother's Nationality"
                value={formData.motherNationality}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="motherOccupation"
                label="Mother's Occupation"
                value={formData.motherOccupation}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="motherEducation"
                label="Mother's Education"
                value={formData.motherEducation}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="marriageDate"
                label="Date of Marriage"
                type="date"
                value={formData.marriageDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        );
        
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <Home sx={{ mr: 1, verticalAlign: 'middle' }} />
                Address Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="parentAddress"
                label="Parents' Complete Address"
                multiline
                rows={3}
                value={formData.parentAddress}
                onChange={handleChange}
                error={!!errors.parentAddress}
                helperText={errors.parentAddress}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="city"
                label="City/Town/Village"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="district"
                label="District"
                value={formData.district}
                onChange={handleChange}
                error={!!errors.district}
                helperText={errors.district}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                name="pincode"
                label="Pincode"
                value={formData.pincode}
                onChange={handleChange}
                error={!!errors.pincode}
                helperText={errors.pincode}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="permanentAddress"
                label="Permanent Address (if different from above)"
                multiline
                rows={2}
                value={formData.permanentAddress}
                onChange={handleChange}
                helperText="Leave blank if same as current address"
              />
            </Grid>
          </Grid>
        );
        
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informant Details
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                The informant is the person who is providing information about the birth and submitting this application.
              </Alert>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="informantName"
                label="Informant's Full Name"
                value={formData.informantName}
                onChange={handleChange}
                error={!!errors.informantName}
                helperText={errors.informantName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.informantRelation}>
                <InputLabel>Relation to Child</InputLabel>
                <Select
                  name="informantRelation"
                  value={formData.informantRelation}
                  onChange={handleChange}
                  label="Relation to Child"
                >
                  <MenuItem value="Father">Father</MenuItem>
                  <MenuItem value="Mother">Mother</MenuItem>
                  <MenuItem value="Grandfather">Grandfather</MenuItem>
                  <MenuItem value="Grandmother">Grandmother</MenuItem>
                  <MenuItem value="Uncle">Uncle</MenuItem>
                  <MenuItem value="Aunt">Aunt</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Midwife">Midwife</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                {errors.informantRelation && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.informantRelation}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="informantPhone"
                label="Informant's Phone Number"
                value={formData.informantPhone}
                onChange={handleChange}
                error={!!errors.informantPhone}
                helperText={errors.informantPhone}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="informantId"
                label="Informant's ID Number"
                value={formData.informantId}
                onChange={handleChange}
                helperText="Aadhar/Voter ID/Driving License"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="informantAddress"
                label="Informant's Address (if different from parents)"
                multiline
                rows={2}
                value={formData.informantAddress}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="registrationPurpose"
                label="Purpose of Registration"
                multiline
                rows={2}
                value={formData.registrationPurpose}
                onChange={handleChange}
                helperText="Please specify the purpose for which you need this birth certificate"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="delayReason"
                label="Reason for Delay (if registration is after 1 year)"
                multiline
                rows={2}
                value={formData.delayReason}
                onChange={handleChange}
                helperText="Required if child is older than 1 year"
              />
            </Grid>
          </Grid>
        );
        
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                <Upload sx={{ mr: 1, verticalAlign: 'middle' }} />
                Supporting Documents
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please upload the following documents:
                <ul>
                  <li>Hospital discharge summary/Birth certificate from hospital</li>
                  <li>Parents' Aadhar Cards</li>
                  <li>Parents' Marriage Certificate</li>
                  <li>Proof of Address</li>
                  <li>Informant's ID Proof (if different from parents)</li>
                </ul>
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <FileUpload
                label="Supporting Documents"
                helperText="Upload all required documents (JPEG, PNG, PDF format, max 5MB each)"
                multiple={true}
                required={true}
                files={formData.supportingDocuments}
                onChange={handleDocumentChange}
                error={documentError}
                accept="image/*,.pdf"
                maxSize={5 * 1024 * 1024}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="previousApplicationNo"
                label="Previous Application Number (if reapplying)"
                value={formData.previousApplicationNo}
                onChange={handleChange}
                helperText="Leave blank if this is a fresh application"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Declaration:</strong> By submitting this application, I declare that the information provided is true and correct to the best of my knowledge. I understand that providing false information is a punishable offense.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );
        
      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Birth Certificate Application
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please fill out all the required information to apply for a birth certificate.
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        {renderStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={activeStep === 0 ? onCancel : handleBack}
            disabled={loading}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={<Send />}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  );
};

export default BirthCertificateForm;
