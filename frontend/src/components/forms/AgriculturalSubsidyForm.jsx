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
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge } from '../../utils/formValidation';

// Step Components
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    const updates = { [field]: value };
    
    // Auto-calculate age when date of birth changes
    if (field === 'dateOfBirth') {
      updates.age = calculateAge(value);
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide your personal details as per official documents
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name *"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || 'Full name as per Aadhaar card'}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's/Husband's Name *"
            value={formData.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth *"
              value={formData.dateOfBirth || null}
              onChange={(value) => handleChange('dateOfBirth', value)}
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

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Age"
            value={formData.age || ''}
            InputProps={{ readOnly: true }}
            helperText="Auto-calculated from date of birth"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender *</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label="Gender *"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile Number *"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || '10-digit mobile number'}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email ID"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || 'Optional but recommended'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aadhaar Number *"
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || '12-digit Aadhaar number'}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Complete Address *"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address || 'House No., Street, Village, Taluka, District'}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Village *"
            value={formData.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="District *"
            value={formData.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="PIN Code *"
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode || '6-digit PIN code'}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const ProjectDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Project Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details about your agricultural project/activity
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name of Project/Activity *"
            value={formData.projectName || ''}
            onChange={(e) => handleChange('projectName', e.target.value)}
            error={!!errors.projectName}
            helperText={errors.projectName || 'e.g., Drip Irrigation System, Greenhouse Construction'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Project Location *"
            value={formData.projectLocation || ''}
            onChange={(e) => handleChange('projectLocation', e.target.value)}
            error={!!errors.projectLocation}
            helperText={errors.projectLocation || 'Survey/Khasra No., Village, Taluka, District'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Area under Cultivation (Acres) *"
            type="number"
            value={formData.cultivationArea || ''}
            onChange={(e) => handleChange('cultivationArea', e.target.value)}
            error={!!errors.cultivationArea}
            helperText={errors.cultivationArea}
            InputProps={{
              endAdornment: <InputAdornment position="end">Acres</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Plants"
            type="number"
            value={formData.numberOfPlants || ''}
            onChange={(e) => handleChange('numberOfPlants', e.target.value)}
            error={!!errors.numberOfPlants}
            helperText={errors.numberOfPlants || 'If applicable'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name of Crops/Variety *"
            value={formData.cropName || ''}
            onChange={(e) => handleChange('cropName', e.target.value)}
            error={!!errors.cropName}
            helperText={errors.cropName || 'e.g., Wheat, Rice, Sugarcane'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Source of Planting Material"
            value={formData.plantingMaterialSource || ''}
            onChange={(e) => handleChange('plantingMaterialSource', e.target.value)}
            error={!!errors.plantingMaterialSource}
            helperText={errors.plantingMaterialSource || 'e.g., Government nursery, Private supplier'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Expected Income from Project *"
            type="number"
            value={formData.expectedIncome || ''}
            onChange={(e) => handleChange('expectedIncome', e.target.value)}
            error={!!errors.expectedIncome}
            helperText={errors.expectedIncome || 'Annual expected income in rupees'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LandDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Land Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide information about the land where the project will be implemented
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Land Ownership *
          </Typography>
          <RadioGroup
            value={formData.landOwnership || ''}
            onChange={(e) => handleChange('landOwnership', e.target.value)}
            row
          >
            <FormControlLabel value="own" control={<Radio />} label="Own Land" />
            <FormControlLabel value="leased" control={<Radio />} label="Leased Land" />
          </RadioGroup>
        </Grid>

        {formData.landOwnership === 'leased' && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Lease Period *"
              value={formData.leasePeriod || ''}
              onChange={(e) => handleChange('leasePeriod', e.target.value)}
              error={!!errors.leasePeriod}
              helperText={errors.leasePeriod || 'e.g., 5 years, 10 years'}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Survey/Khasra Numbers *"
            value={formData.surveyNumbers || ''}
            onChange={(e) => handleChange('surveyNumbers', e.target.value)}
            error={!!errors.surveyNumbers}
            helperText={errors.surveyNumbers || 'Comma-separated survey numbers'}
            placeholder="e.g., 123/1, 124/2, 125"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Land Area (Acres) *"
            type="number"
            value={formData.totalLandArea || ''}
            onChange={(e) => handleChange('totalLandArea', e.target.value)}
            error={!!errors.totalLandArea}
            helperText={errors.totalLandArea}
            InputProps={{
              endAdornment: <InputAdornment position="end">Acres</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.irrigationSource}>
            <InputLabel>Irrigation Source</InputLabel>
            <Select
              value={formData.irrigationSource || ''}
              onChange={(e) => handleChange('irrigationSource', e.target.value)}
              label="Irrigation Source"
            >
              <MenuItem value="Borewell">Borewell</MenuItem>
              <MenuItem value="Canal">Canal</MenuItem>
              <MenuItem value="River">River</MenuItem>
              <MenuItem value="Pond">Pond</MenuItem>
              <MenuItem value="Rainwater">Rainwater</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Land Description"
            value={formData.landDescription || ''}
            onChange={(e) => handleChange('landDescription', e.target.value)}
            helperText="Describe soil type, topography, existing crops, etc."
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const FinancialDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Financial Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide financial information and bank details for subsidy disbursement
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Project Cost *"
            type="number"
            value={formData.projectCost || ''}
            onChange={(e) => handleChange('projectCost', e.target.value)}
            error={!!errors.projectCost}
            helperText={errors.projectCost || 'Total estimated cost in rupees'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Subsidy Amount Requested *"
            type="number"
            value={formData.subsidyAmount || ''}
            onChange={(e) => handleChange('subsidyAmount', e.target.value)}
            error={!!errors.subsidyAmount}
            helperText={errors.subsidyAmount || 'Amount of subsidy requested'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Name *"
            value={formData.bankName || ''}
            onChange={(e) => handleChange('bankName', e.target.value)}
            error={!!errors.bankName}
            helperText={errors.bankName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Branch Name *"
            value={formData.branchName || ''}
            onChange={(e) => handleChange('branchName', e.target.value)}
            error={!!errors.branchName}
            helperText={errors.branchName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Account Number *"
            value={formData.accountNumber || ''}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber || '9-18 digit account number'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="IFSC Code *"
            value={formData.ifscCode || ''}
            onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
            error={!!errors.ifscCode}
            helperText={errors.ifscCode || '11-character IFSC code'}
            inputProps={{ maxLength: 11 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Loan Details (if applicable)
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Loan Amount"
            type="number"
            value={formData.loanAmount || ''}
            onChange={(e) => handleChange('loanAmount', e.target.value)}
            helperText="If taking loan for the project"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Lending Institution"
            value={formData.lendingInstitution || ''}
            onChange={(e) => handleChange('lendingInstitution', e.target.value)}
            helperText="Bank/Financial institution providing loan"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Copy of land records (7/12, 8A extracts)',
    'Lease deed (if applicable)',
    'Income tax return copy',
    'Project report with cost estimates',
    'Bank loan application/consent letter',
    'Key map of project land',
    'Identity proof (Aadhaar/PAN)',
    'Passport size photographs',
    'Bank passbook copy',
    'Caste certificate (if applicable)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload all required documents. Ensure all documents are clear and readable.
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={15}
        acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Required Documents:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {requiredDocuments.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

// Main Form Component
const AgriculturalSubsidyForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Information', icon: 'Person' },
    { id: 'project', title: 'Project Details', icon: 'Agriculture' },
    { id: 'land', title: 'Land Details', icon: 'Landscape' },
    { id: 'financial', title: 'Financial Details', icon: 'AccountBalance' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Personal Information
    applicantName: { type: 'text', required: true },
    fatherName: { type: 'text', required: true },
    dateOfBirth: { type: 'date', required: true },
    gender: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    aadhaar: { type: 'aadhaar', required: true },
    address: { type: 'text', required: true },
    village: { type: 'text', required: true },
    district: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true },
    
    // Project Details
    projectName: { type: 'text', required: true },
    projectLocation: { type: 'text', required: true },
    cultivationArea: { type: 'amount', required: true },
    cropName: { type: 'text', required: true },
    expectedIncome: { type: 'amount', required: true },
    
    // Land Details
    landOwnership: { type: 'text', required: true },
    surveyNumbers: { type: 'text', required: true },
    totalLandArea: { type: 'amount', required: true },
    
    // Financial Details
    projectCost: { type: 'amount', required: true },
    subsidyAmount: { type: 'amount', required: true },
    bankName: { type: 'text', required: true },
    branchName: { type: 'text', required: true },
    accountNumber: { type: 'bankAccount', required: true },
    ifscCode: { type: 'ifsc', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Agricultural Subsidy Application"
      serviceType="agricultural_subsidy"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <ProjectDetailsStep />
      <LandDetailsStep />
      <FinancialDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default AgriculturalSubsidyForm;
