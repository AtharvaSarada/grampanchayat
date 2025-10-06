import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Divider,
  FormHelperText,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';

const BirthCertificateForm = () => {
  // Initial data structure - will be managed by MultiStepForm
  const initialFormData = {
    // Child Information
    childName: '',
    dateOfBirth: null,
    timeOfBirth: '',
    placeOfBirth: '',
    gender: '',
    weight: '',
    
    // Father Information
    fatherName: '',
    fatherAge: '',
    fatherOccupation: '',
    fatherEducation: '',
    fatherNationality: 'Indian',
    
    // Mother Information
    motherName: '',
    motherAge: '',
    motherOccupation: '',
    motherEducation: '',
    motherNationality: 'Indian',
    
    // Address Information
    permanentAddress: '',
    village: '',
    district: '',
    state: 'Your State',
    pincode: '',
    
    // Contact Information
    mobile: '',
    email: '',
    
    // Documents
    documents: []
  };

  const steps = [
    { id: 'child', title: 'Child Information' },
    { id: 'parents', title: 'Parents Information' },
    { id: 'address', title: 'Address Details' },
    { id: 'documents', title: 'Documents' }
  ];

  const validationRules = {
    childName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid child name' },
    dateOfBirth: { required: true, message: 'Date of birth is required' },
    placeOfBirth: { required: true, message: 'Place of birth is required' },
    gender: { required: true, message: 'Gender is required' },
    fatherName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid father name' },
    motherName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid mother name' },
    permanentAddress: { required: true, message: 'Address is required' },
    village: { required: true, message: 'Village is required' },
    district: { required: true, message: 'District is required' },
    pincode: { required: true, pattern: /^\d{6}$/, message: 'Enter valid 6-digit PIN code' },
    mobile: { required: true, pattern: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email address' }
  };

  const ChildInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Child Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Child's Full Name *"
            value={formData.childName || ''}
            onChange={(e) => updateFormData({ childName: e.target.value })}
            error={!!errors.childName}
            helperText={errors.childName}
            placeholder="Enter child's full name"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth *"
              value={formData.dateOfBirth}
              onChange={(date) => updateFormData({ dateOfBirth: date })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Time of Birth"
            type="time"
            value={formData.timeOfBirth || ''}
            onChange={(e) => updateFormData({ timeOfBirth: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Place of Birth *"
            value={formData.placeOfBirth || ''}
            onChange={(e) => updateFormData({ placeOfBirth: e.target.value })}
            error={!!errors.placeOfBirth}
            helperText={errors.placeOfBirth}
            placeholder="Hospital/Home/City name"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender *</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              label="Gender *"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Weight at Birth (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            placeholder="e.g., 3.2"
            inputProps={{ step: 0.1, min: 0 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const ParentsInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Parents Information
      </Typography>
      
      {/* Father Information */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        Father's Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Full Name *"
            value={formData.fatherName || ''}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Age"
            type="number"
            value={formData.fatherAge || ''}
            onChange={(e) => updateFormData({ fatherAge: e.target.value })}
            inputProps={{ min: 18, max: 100 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Occupation"
            value={formData.fatherOccupation || ''}
            onChange={(e) => updateFormData({ fatherOccupation: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Education"
            value={formData.fatherEducation || ''}
            onChange={(e) => updateFormData({ fatherEducation: e.target.value })}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Mother Information */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
        Mother's Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Full Name *"
            value={formData.motherName || ''}
            onChange={(e) => updateFormData({ motherName: e.target.value })}
            error={!!errors.motherName}
            helperText={errors.motherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Age"
            type="number"
            value={formData.motherAge || ''}
            onChange={(e) => updateFormData({ motherAge: e.target.value })}
            inputProps={{ min: 18, max: 100 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Occupation"
            value={formData.motherOccupation || ''}
            onChange={(e) => updateFormData({ motherOccupation: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Education"
            value={formData.motherEducation || ''}
            onChange={(e) => updateFormData({ motherEducation: e.target.value })}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const AddressStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Address & Contact Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Permanent Address *"
            multiline
            rows={3}
            value={formData.permanentAddress || ''}
            onChange={(e) => updateFormData({ permanentAddress: e.target.value })}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress}
            placeholder="Enter complete permanent address"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Village/Town *"
            value={formData.village || ''}
            onChange={(e) => updateFormData({ village: e.target.value })}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="District *"
            value={formData.district || ''}
            onChange={(e) => updateFormData({ district: e.target.value })}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State *"
            value={formData.state || ''}
            onChange={(e) => updateFormData({ state: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="PIN Code *"
            value={formData.pincode || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              updateFormData({ pincode: value });
            }}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile Number *"
            value={formData.mobile || ''}
            onChange={(e) => updateFormData({ mobile: e.target.value })}
            error={!!errors.mobile}
            helperText={errors.mobile}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value.toLowerCase() })}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Required Documents
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload the following documents (PDF, JPG, PNG format, max 5MB each):
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Required Documents:
        </Typography>
        <ul>
          <li>Hospital Birth Certificate / Delivery Certificate</li>
          <li>Parents' ID Proof (Aadhaar/Voter ID/Passport)</li>
          <li>Parents' Address Proof</li>
          <li>Marriage Certificate of Parents (if available)</li>
        </ul>
      </Box>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={5}
        acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />
    </Paper>
  );

  return (
    <MultiStepForm
      serviceName="Birth Certificate Application"
      serviceType="birth-certificate"
      steps={steps}
      validationRules={validationRules}
      initialData={initialFormData}
    >
      <ChildInformationStep />
      <ParentsInformationStep />
      <AddressStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default BirthCertificateForm;
