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
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';

const HealthCertificateForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    applicantName: '',
    fatherName: '',
    dateOfBirth: null,
    age: '',
    gender: '',
    mobile: '',
    email: '',
    aadhaar: '',
    
    // Address Information
    address: '',
    village: '',
    district: '',
    state: 'Your State',
    pincode: '',
    
    // Health Information
    purpose: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    bloodGroup: '',
    height: '',
    weight: '',
    
    // Medical Conditions
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    asthma: false,
    tuberculosis: false,
    hepatitis: false,
    hiv: false,
    otherConditions: '',
    
    // Physical Fitness
    physicalDisability: false,
    disabilityDetails: '',
    mentalHealth: 'Good',
    
    // Documents
    documents: []
  });

  const steps = [
    { id: 'personal', title: 'Personal Information' },
    { id: 'health', title: 'Health Information' },
    { id: 'medical', title: 'Medical History' },
    { id: 'documents', title: 'Documents' }
  ];

  const validationRules = {
    applicantName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid applicant name' },
    fatherName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid father name' },
    dateOfBirth: { required: true, message: 'Date of birth is required' },
    gender: { required: true, message: 'Gender is required' },
    mobile: { required: true, pattern: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' },
    aadhaar: { required: true, pattern: /^\d{12}$/, message: 'Enter valid 12-digit Aadhaar number' },
    address: { required: true, message: 'Address is required' },
    village: { required: true, message: 'Village is required' },
    district: { required: true, message: 'District is required' },
    pincode: { required: true, pattern: /^\d{6}$/, message: 'Enter valid 6-digit PIN code' },
    purpose: { required: true, message: 'Purpose is required' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email address' }
  };

  const purposes = [
    'Employment',
    'Visa Application',
    'Educational Institution',
    'Sports/Competition',
    'Marriage',
    'Insurance',
    'Government Job',
    'Driving License',
    'Food Handler License',
    'Other'
  ];

  const bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'
  ];

  const mentalHealthOptions = [
    'Excellent', 'Good', 'Fair', 'Poor'
  ];

  const PersonalInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Personal Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name *"
            value={formData.applicantName || ''}
            onChange={(e) => updateFormData({ applicantName: e.target.value })}
            error={!!errors.applicantName}
            helperText={errors.applicantName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Name *"
            value={formData.fatherName || ''}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth *"
              value={formData.dateOfBirth}
              onChange={(date) => {
                updateFormData({ dateOfBirth: date });
                if (date) {
                  const age = new Date().getFullYear() - date.getFullYear();
                  updateFormData({ age: age.toString() });
                }
              }}
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
            label="Age"
            type="number"
            value={formData.age || ''}
            onChange={(e) => updateFormData({ age: e.target.value })}
            inputProps={{ min: 0, max: 120 }}
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
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aadhaar Number *"
            value={formData.aadhaar || ''}
            onChange={(e) => updateFormData({ aadhaar: e.target.value })}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address *"
            multiline
            rows={3}
            value={formData.address || ''}
            onChange={(e) => updateFormData({ address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address}
            placeholder="Enter complete address"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Village/Town *"
            value={formData.village || ''}
            onChange={(e) => updateFormData({ village: e.target.value })}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="District *"
            value={formData.district || ''}
            onChange={(e) => updateFormData({ district: e.target.value })}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="PIN Code *"
            value={formData.pincode || ''}
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const HealthInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Health Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.purpose}>
            <InputLabel>Purpose of Certificate *</InputLabel>
            <Select
              value={formData.purpose || ''}
              onChange={(e) => updateFormData({ purpose: e.target.value })}
              label="Purpose of Certificate *"
            >
              {purposes.map((purpose) => (
                <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
              ))}
            </Select>
            {errors.purpose && <FormHelperText>{errors.purpose}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Blood Group</InputLabel>
            <Select
              value={formData.bloodGroup || ''}
              onChange={(e) => updateFormData({ bloodGroup: e.target.value })}
              label="Blood Group"
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>{group}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Height (cm)"
            type="number"
            value={formData.height || ''}
            onChange={(e) => updateFormData({ height: e.target.value })}
            inputProps={{ min: 50, max: 250 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Weight (kg)"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            inputProps={{ min: 10, max: 300, step: 0.1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical History"
            multiline
            rows={3}
            value={formData.medicalHistory || ''}
            onChange={(e) => updateFormData({ medicalHistory: e.target.value })}
            placeholder="Any previous surgeries, major illnesses, hospitalizations"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Current Medications"
            multiline
            rows={2}
            value={formData.currentMedications || ''}
            onChange={(e) => updateFormData({ currentMedications: e.target.value })}
            placeholder="List any medications you are currently taking"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Known Allergies"
            multiline
            rows={2}
            value={formData.allergies || ''}
            onChange={(e) => updateFormData({ allergies: e.target.value })}
            placeholder="Food, drug, or environmental allergies"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const MedicalHistoryStep = ({ formData, updateFormData }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Medical History & Physical Fitness
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        Do you have any of the following conditions?
      </Typography>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.diabetes || false}
                  onChange={(e) => updateFormData({ diabetes: e.target.checked })}
                />
              }
              label="Diabetes"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hypertension || false}
                  onChange={(e) => updateFormData({ hypertension: e.target.checked })}
                />
              }
              label="Hypertension (High Blood Pressure)"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.heartDisease || false}
                  onChange={(e) => updateFormData({ heartDisease: e.target.checked })}
                />
              }
              label="Heart Disease"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.asthma || false}
                  onChange={(e) => updateFormData({ asthma: e.target.checked })}
                />
              }
              label="Asthma"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tuberculosis || false}
                  onChange={(e) => updateFormData({ tuberculosis: e.target.checked })}
                />
              }
              label="Tuberculosis"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hepatitis || false}
                  onChange={(e) => updateFormData({ hepatitis: e.target.checked })}
                />
              }
              label="Hepatitis"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hiv || false}
                  onChange={(e) => updateFormData({ hiv: e.target.checked })}
                />
              }
              label="HIV/AIDS"
            />
          </Grid>
        </Grid>
      </FormGroup>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Other Medical Conditions"
            multiline
            rows={2}
            value={formData.otherConditions || ''}
            onChange={(e) => updateFormData({ otherConditions: e.target.value })}
            placeholder="Any other medical conditions not listed above"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.physicalDisability || false}
                onChange={(e) => updateFormData({ physicalDisability: e.target.checked })}
              />
            }
            label="Do you have any physical disability?"
          />
        </Grid>
        {formData.physicalDisability && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Disability Details"
              value={formData.disabilityDetails || ''}
              onChange={(e) => updateFormData({ disabilityDetails: e.target.value })}
              placeholder="Please describe the disability"
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Mental Health Status</InputLabel>
            <Select
              value={formData.mentalHealth || 'Good'}
              onChange={(e) => updateFormData({ mentalHealth: e.target.value })}
              label="Mental Health Status"
            >
              {mentalHealthOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <li>Aadhaar Card</li>
          <li>Recent Medical Test Reports (if any)</li>
          <li>Previous Health Certificate (if renewal)</li>
          <li>Doctor's Prescription/Medical Records (if applicable)</li>
          <li>Passport Size Photograph</li>
        </ul>
      </Box>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={6}
        acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />
    </Paper>
  );

  return (
    <MultiStepForm
      serviceName="Health Certificate Application"
      serviceType="health-certificate"
      steps={steps}
      validationRules={validationRules}
      initialData={formData}
    >
      <PersonalInformationStep />
      <HealthInformationStep />
      <MedicalHistoryStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default HealthCertificateForm;
