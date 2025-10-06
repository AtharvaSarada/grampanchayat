import React from 'react';
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
  Alert,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge, validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';

// Personal Information Step
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const [age, setAge] = React.useState(0);

  React.useEffect(() => {
    if (formData.dateOfBirth) {
      const calculatedAge = calculateAge(formData.dateOfBirth);
      setAge(calculatedAge);
      updateFormData({ age: calculatedAge });
    }
  }, [formData.dateOfBirth]);

  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'applicantName' || field === 'fatherName' || field === 'motherName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'aadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    } else if (field === 'email') {
      correctedValue = autoCorrect.email(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your personal details for domicile certificate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name *"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || 'Full name as per Aadhaar'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Name *"
            value={formData.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Name *"
            value={formData.motherName || ''}
            onChange={(e) => handleChange('motherName', e.target.value)}
            error={!!errors.motherName}
            helperText={errors.motherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth *"
              value={formData.dateOfBirth || null}
              onChange={(date) => handleChange('dateOfBirth', date)}
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

        {age > 0 && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              value={`${age} years`}
              disabled
              helperText="Calculated from date of birth"
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
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
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || 'Optional email address'}
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
            inputProps={{ maxLength: 12, pattern: '\\d{12}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.maritalStatus}>
            <InputLabel>Marital Status *</InputLabel>
            <Select
              value={formData.maritalStatus || ''}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
              label="Marital Status *"
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Occupation *"
            value={formData.occupation || ''}
            onChange={(e) => handleChange('occupation', e.target.value)}
            error={!!errors.occupation}
            helperText={errors.occupation || 'Current occupation/profession'}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.religion}>
            <InputLabel>Religion *</InputLabel>
            <Select
              value={formData.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
              label="Religion *"
            >
              <MenuItem value="Hindu">Hindu</MenuItem>
              <MenuItem value="Muslim">Muslim</MenuItem>
              <MenuItem value="Christian">Christian</MenuItem>
              <MenuItem value="Sikh">Sikh</MenuItem>
              <MenuItem value="Buddhist">Buddhist</MenuItem>
              <MenuItem value="Jain">Jain</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Address Details Step
const AddressDetailsStep = ({ formData, updateFormData, errors }) => {
  const [states] = React.useState(getStates());
  const [districts, setDistricts] = React.useState([]);

  React.useEffect(() => {
    if (formData.state) {
      setDistricts(getDistrictsByState(formData.state));
    }
  }, [formData.state]);

  const handleChange = (field, value) => {
    const updates = { [field]: value };
    
    if (field === 'state') {
      updates.district = '';
      setDistricts(getDistrictsByState(value));
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Address Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide your current and permanent address details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Current Address
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Current Address *"
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            error={!!errors.currentAddress}
            helperText={errors.currentAddress || 'Complete current residential address'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>State *</InputLabel>
            <Select
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              label="State *"
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.district}>
            <InputLabel>District *</InputLabel>
            <Select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              label="District *"
              disabled={!formData.state}
            >
              {districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="PIN Code *"
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6, pattern: '\\d{6}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Tehsil/Taluka *"
            value={formData.tehsil || ''}
            onChange={(e) => handleChange('tehsil', e.target.value)}
            error={!!errors.tehsil}
            helperText={errors.tehsil}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Village/City *"
            value={formData.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary" sx={{ mt: 2 }}>
            Permanent Address
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Is your permanent address same as current address?
          </Typography>
          <RadioGroup
            value={formData.sameAddress || 'no'}
            onChange={(e) => handleChange('sameAddress', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {formData.sameAddress === 'no' && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Permanent Address *"
                value={formData.permanentAddress || ''}
                onChange={(e) => handleChange('permanentAddress', e.target.value)}
                error={!!errors.permanentAddress}
                helperText={errors.permanentAddress || 'Complete permanent address'}
                inputProps={{ minLength: 10, maxLength: 200 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Permanent State *"
                value={formData.permanentState || ''}
                onChange={(e) => handleChange('permanentState', e.target.value)}
                error={!!errors.permanentState}
                helperText={errors.permanentState}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Permanent PIN Code *"
                value={formData.permanentPincode || ''}
                onChange={(e) => handleChange('permanentPincode', e.target.value)}
                error={!!errors.permanentPincode}
                helperText={errors.permanentPincode}
                inputProps={{ maxLength: 6, pattern: '\\d{6}' }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

// Residence Details Step
const ResidenceDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Residence Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide information about your residence in this area
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Residence Since *"
              value={formData.residenceSince || null}
              onChange={(date) => handleChange('residenceSince', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.residenceSince}
                  helperText={errors.residenceSince || 'Date since residing in this area'}
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Duration of Residence"
            value={formData.residenceDuration || ''}
            onChange={(e) => handleChange('residenceDuration', e.target.value)}
            helperText="e.g., 5 years 3 months"
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.residenceType}>
            <InputLabel>Residence Type *</InputLabel>
            <Select
              value={formData.residenceType || ''}
              onChange={(e) => handleChange('residenceType', e.target.value)}
              label="Residence Type *"
            >
              <MenuItem value="Own House">Own House</MenuItem>
              <MenuItem value="Rented House">Rented House</MenuItem>
              <MenuItem value="Family House">Family House</MenuItem>
              <MenuItem value="Government Quarters">Government Quarters</MenuItem>
              <MenuItem value="Company Accommodation">Company Accommodation</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="House Number/Plot Number"
            value={formData.houseNumber || ''}
            onChange={(e) => handleChange('houseNumber', e.target.value)}
            helperText="House/Plot number if available"
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Purpose of Domicile Certificate *
          </Typography>
          <FormControl fullWidth error={!!errors.purpose}>
            <InputLabel>Purpose *</InputLabel>
            <Select
              value={formData.purpose || ''}
              onChange={(e) => handleChange('purpose', e.target.value)}
              label="Purpose *"
            >
              <MenuItem value="Education">Education</MenuItem>
              <MenuItem value="Employment">Employment</MenuItem>
              <MenuItem value="Government Job">Government Job</MenuItem>
              <MenuItem value="Admission">College/University Admission</MenuItem>
              <MenuItem value="Scholarship">Scholarship Application</MenuItem>
              <MenuItem value="Legal Proceedings">Legal Proceedings</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {formData.purpose === 'Other' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Purpose *"
              value={formData.otherPurpose || ''}
              onChange={(e) => handleChange('otherPurpose', e.target.value)}
              error={!!errors.otherPurpose}
              helperText={errors.otherPurpose || 'Please specify the purpose'}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Information"
            value={formData.additionalInfo || ''}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            helperText="Any additional information about your residence"
            inputProps={{ maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> You must be a continuous resident of this area for the domicile certificate to be issued. 
              Supporting documents will be verified during the application process.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Aadhaar Card',
    'Birth Certificate',
    'School/College certificates (if applicable)',
    'Residence proof (Electricity bill/Water bill/Rent agreement)',
    'Property documents (if own house)',
    'Employment certificate (if applicable)',
    'Affidavit of residence',
    'Passport size photographs',
    'Previous domicile certificate (if any)',
    'Character certificate from local authority'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for domicile certificate application
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={12}
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
const DomicileCertificateForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Information', icon: 'Person' },
    { id: 'address', title: 'Address Details', icon: 'Home' },
    { id: 'residence', title: 'Residence Details', icon: 'LocationCity' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Personal Information
    applicantName: { type: 'name', required: true },
    fatherName: { type: 'name', required: true },
    motherName: { type: 'name', required: true },
    dateOfBirth: { type: 'date', required: true },
    gender: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    aadhaar: { type: 'aadhaar', required: true },
    maritalStatus: { type: 'text', required: true },
    occupation: { type: 'text', required: true },
    religion: { type: 'text', required: true },
    
    // Address Details
    currentAddress: { type: 'address', required: true },
    state: { type: 'text', required: true },
    district: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true },
    tehsil: { type: 'text', required: true },
    village: { type: 'text', required: true },
    
    // Residence Details
    residenceSince: { type: 'date', required: true },
    residenceType: { type: 'text', required: true },
    purpose: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Domicile Certificate Application"
      serviceType="domicile_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <AddressDetailsStep />
      <ResidenceDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default DomicileCertificateForm;
