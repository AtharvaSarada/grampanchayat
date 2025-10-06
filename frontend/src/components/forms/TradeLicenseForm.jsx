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
  FormControlLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';

const TradeLicenseForm = () => {
  const [formData, setFormData] = useState({
    // Applicant Information
    applicantName: '',
    fatherName: '',
    dateOfBirth: null,
    gender: '',
    mobile: '',
    email: '',
    aadhaar: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    businessCategory: '',
    businessDescription: '',
    establishmentDate: null,
    numberOfEmployees: '',
    
    // Address Information
    businessAddress: '',
    village: '',
    district: '',
    state: 'Your State',
    pincode: '',
    
    // License Information
    licenseType: '',
    licenseValidity: '1', // years
    previousLicense: false,
    previousLicenseNumber: '',
    
    // Financial Information
    investmentAmount: '',
    expectedTurnover: '',
    
    // Documents
    documents: []
  });

  const steps = [
    { id: 'applicant', title: 'Applicant Details' },
    { id: 'business', title: 'Business Information' },
    { id: 'address', title: 'Address & License' },
    { id: 'documents', title: 'Documents' }
  ];

  const validationRules = {
    applicantName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid applicant name' },
    fatherName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid father name' },
    dateOfBirth: { required: true, message: 'Date of birth is required' },
    gender: { required: true, message: 'Gender is required' },
    mobile: { required: true, pattern: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' },
    aadhaar: { required: true, pattern: /^\d{12}$/, message: 'Enter valid 12-digit Aadhaar number' },
    businessName: { required: true, message: 'Business name is required' },
    businessType: { required: true, message: 'Business type is required' },
    businessCategory: { required: true, message: 'Business category is required' },
    businessAddress: { required: true, message: 'Business address is required' },
    village: { required: true, message: 'Village is required' },
    district: { required: true, message: 'District is required' },
    pincode: { required: true, pattern: /^\d{6}$/, message: 'Enter valid 6-digit PIN code' },
    licenseType: { required: true, message: 'License type is required' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email address' }
  };

  const businessTypes = [
    'Retail Trade',
    'Wholesale Trade',
    'Manufacturing',
    'Service Provider',
    'Restaurant/Food Service',
    'Medical/Healthcare',
    'Educational Services',
    'Transportation',
    'Construction',
    'Agriculture Related',
    'Other'
  ];

  const businessCategories = [
    'Micro Enterprise',
    'Small Enterprise',
    'Medium Enterprise',
    'Large Enterprise'
  ];

  const licenseTypes = [
    'General Trade License',
    'Food Business License',
    'Medical Store License',
    'Petrol Pump License',
    'Liquor License',
    'Factory License',
    'Other'
  ];

  const ApplicantDetailsStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Applicant Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant's Full Name *"
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
      </Grid>
    </Paper>
  );

  const BusinessInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Business Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Name *"
            value={formData.businessName || ''}
            onChange={(e) => updateFormData({ businessName: e.target.value })}
            error={!!errors.businessName}
            helperText={errors.businessName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.businessType}>
            <InputLabel>Business Type *</InputLabel>
            <Select
              value={formData.businessType || ''}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              label="Business Type *"
            >
              {businessTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.businessType && <FormHelperText>{errors.businessType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.businessCategory}>
            <InputLabel>Business Category *</InputLabel>
            <Select
              value={formData.businessCategory || ''}
              onChange={(e) => updateFormData({ businessCategory: e.target.value })}
              label="Business Category *"
            >
              {businessCategories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
            {errors.businessCategory && <FormHelperText>{errors.businessCategory}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Establishment Date"
              value={formData.establishmentDate}
              onChange={(date) => updateFormData({ establishmentDate: date })}
              renderInput={(params) => (
                <TextField {...params} fullWidth />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Business Description"
            multiline
            rows={3}
            value={formData.businessDescription || ''}
            onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            placeholder="Describe your business activities"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Employees"
            type="number"
            value={formData.numberOfEmployees || ''}
            onChange={(e) => updateFormData({ numberOfEmployees: e.target.value })}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Investment Amount (₹)"
            type="number"
            value={formData.investmentAmount || ''}
            onChange={(e) => updateFormData({ investmentAmount: e.target.value })}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Expected Annual Turnover (₹)"
            type="number"
            value={formData.expectedTurnover || ''}
            onChange={(e) => updateFormData({ expectedTurnover: e.target.value })}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const AddressLicenseStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Business Address & License Details
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        Business Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Business Address *"
            multiline
            rows={3}
            value={formData.businessAddress || ''}
            onChange={(e) => updateFormData({ businessAddress: e.target.value })}
            error={!!errors.businessAddress}
            helperText={errors.businessAddress}
            placeholder="Enter complete business address"
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
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
        License Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.licenseType}>
            <InputLabel>License Type *</InputLabel>
            <Select
              value={formData.licenseType || ''}
              onChange={(e) => updateFormData({ licenseType: e.target.value })}
              label="License Type *"
            >
              {licenseTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.licenseType && <FormHelperText>{errors.licenseType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>License Validity</InputLabel>
            <Select
              value={formData.licenseValidity || '1'}
              onChange={(e) => updateFormData({ licenseValidity: e.target.value })}
              label="License Validity"
            >
              <MenuItem value="1">1 Year</MenuItem>
              <MenuItem value="3">3 Years</MenuItem>
              <MenuItem value="5">5 Years</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.previousLicense || false}
                onChange={(e) => updateFormData({ previousLicense: e.target.checked })}
              />
            }
            label="Do you have a previous trade license?"
          />
        </Grid>
        {formData.previousLicense && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Previous License Number"
              value={formData.previousLicenseNumber || ''}
              onChange={(e) => updateFormData({ previousLicenseNumber: e.target.value })}
            />
          </Grid>
        )}
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
          <li>Aadhaar Card of Applicant</li>
          <li>Business Address Proof (Rent Agreement/Property Documents)</li>
          <li>Business Plan/Project Report</li>
          <li>Partnership Deed (if applicable)</li>
          <li>NOC from Fire Department (if required)</li>
          <li>Pollution Clearance Certificate (if applicable)</li>
          <li>Previous License Copy (if renewal)</li>
        </ul>
      </Box>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={8}
        acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />
    </Paper>
  );

  return (
    <MultiStepForm
      serviceName="Trade License Application"
      serviceType="trade-license"
      steps={steps}
      validationRules={validationRules}
      initialData={formData}
    >
      <ApplicantDetailsStep />
      <BusinessInformationStep />
      <AddressLicenseStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default TradeLicenseForm;
