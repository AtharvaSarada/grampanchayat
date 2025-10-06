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
  RadioGroup
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge, validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';

// Step Components
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    // Apply auto-corrections
    if (field === 'fullName' || field === 'fatherName' || field === 'motherName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'email') {
      correctedValue = autoCorrect.email(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'aadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    }
    
    const updates = { [field]: correctedValue };
    
    // Auto-calculate age when date of birth changes
    if (field === 'dateOfBirth') {
      updates.age = calculateAge(value);
    }
    
    updateFormData(updates);
  };

  const handleBlur = (field, value) => {
    // Validate on blur
    const validationRules = {
      fullName: { type: 'name', required: true },
      fatherName: { type: 'name', required: true },
      motherName: { type: 'name', required: true },
      mobile: { type: 'mobile', required: true },
      email: { type: 'email', required: false },
      aadhaar: { type: 'aadhaar', required: true }
    };
    
    if (validationRules[field]) {
      const error = validateField(value, validationRules[field].type, validationRules[field].required);
      if (error) {
        updateFormData({ [`${field}Error`]: error });
      } else {
        updateFormData({ [`${field}Error`]: null });
      }
    }
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
            label="Full Name *"
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={(e) => handleBlur('fullName', e.target.value)}
            error={!!errors.fullName || !!formData.fullNameError}
            helperText={errors.fullName || formData.fullNameError || 'Full name as per ID proof'}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Name *"
            value={formData.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            onBlur={(e) => handleBlur('fatherName', e.target.value)}
            error={!!errors.fatherName || !!formData.fatherNameError}
            helperText={errors.fatherName || formData.fatherNameError}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Name *"
            value={formData.motherName || ''}
            onChange={(e) => handleChange('motherName', e.target.value)}
            onBlur={(e) => handleBlur('motherName', e.target.value)}
            error={!!errors.motherName || !!formData.motherNameError}
            helperText={errors.motherName || formData.motherNameError}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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
              minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
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

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.maritalStatus}>
            <InputLabel>Marital Status</InputLabel>
            <Select
              value={formData.maritalStatus || ''}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
              label="Marital Status"
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
            label="Mobile Number *"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            onBlur={(e) => handleBlur('mobile', e.target.value)}
            error={!!errors.mobile || !!formData.mobileError}
            helperText={errors.mobile || formData.mobileError || '10-digit mobile number starting with 6-9'}
            inputProps={{ 
              maxLength: 10,
              pattern: '[6-9][0-9]{9}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email ID"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={(e) => handleBlur('email', e.target.value)}
            error={!!errors.email || !!formData.emailError}
            helperText={errors.email || formData.emailError || 'Optional but recommended'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aadhaar Number *"
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            onBlur={(e) => handleBlur('aadhaar', e.target.value)}
            error={!!errors.aadhaar || !!formData.aadhaarError}
            helperText={errors.aadhaar || formData.aadhaarError || '12-digit Aadhaar number'}
            inputProps={{ 
              maxLength: 12,
              pattern: '[0-9]{12}'
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const CasteDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'casteClaimed' || field === 'subCaste' || field === 'religion') {
      correctedValue = autoCorrect.name(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Caste Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide accurate caste and community information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.casteClaimed}>
            <InputLabel>Caste/Community Claimed *</InputLabel>
            <Select
              value={formData.casteClaimed || ''}
              onChange={(e) => handleChange('casteClaimed', e.target.value)}
              label="Caste/Community Claimed *"
            >
              <MenuItem value="SC">SC (Scheduled Caste)</MenuItem>
              <MenuItem value="ST">ST (Scheduled Tribe)</MenuItem>
              <MenuItem value="OBC">OBC (Other Backward Class)</MenuItem>
              <MenuItem value="EWS">EWS (Economically Weaker Section)</MenuItem>
              <MenuItem value="General">General</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Sub-caste (if any)"
            value={formData.subCaste || ''}
            onChange={(e) => handleChange('subCaste', e.target.value)}
            error={!!errors.subCaste}
            helperText={errors.subCaste || 'Specific sub-caste within main category'}
            inputProps={{ 
              maxLength: 30,
              pattern: '[A-Za-z\\s]{2,30}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.religion}>
            <InputLabel>Religion Declared *</InputLabel>
            <Select
              value={formData.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
              label="Religion Declared *"
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Caste"
            value={formData.fatherCaste || ''}
            onChange={(e) => handleChange('fatherCaste', e.target.value)}
            error={!!errors.fatherCaste}
            helperText={errors.fatherCaste || 'Father\'s caste/community'}
            inputProps={{ 
              maxLength: 30,
              pattern: '[A-Za-z\\s]{2,30}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Caste (before marriage)"
            value={formData.motherCaste || ''}
            onChange={(e) => handleChange('motherCaste', e.target.value)}
            error={!!errors.motherCaste}
            helperText={errors.motherCaste || 'Mother\'s caste before marriage'}
            inputProps={{ 
              maxLength: 30,
              pattern: '[A-Za-z\\s]{2,30}'
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Child Status *
          </Typography>
          <RadioGroup
            value={formData.childStatus || ''}
            onChange={(e) => handleChange('childStatus', e.target.value)}
            row
          >
            <FormControlLabel value="natural" control={<Radio />} label="Natural Born Child" />
            <FormControlLabel value="adopted" control={<Radio />} label="Adopted Child" />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

const AddressEducationStep = ({ formData, updateFormData, errors }) => {
  const states = getStates();
  const districts = formData.state ? getDistrictsByState(formData.state) : [];

  const handleChange = (field, value) => {
    let updates = { [field]: value };
    
    // Clear district when state changes
    if (field === 'state') {
      updates.district = '';
    }
    
    // Apply auto-corrections for location fields
    if (field === 'village' || field === 'district' || field === 'state') {
      updates[field] = autoCorrect.name(value);
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Address & Educational Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide current address and educational information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Current Address *"
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            error={!!errors.currentAddress}
            helperText={errors.currentAddress || 'Complete current address with landmarks'}
            inputProps={{ 
              minLength: 10,
              maxLength: 200
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Permanent Address"
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            helperText="Leave blank if same as current address"
            inputProps={{ 
              minLength: 10,
              maxLength: 200
            }}
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
              {states.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
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
              {districts.map(district => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Village *"
            value={formData.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s]{2,50}'
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Educational Details
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Educational Qualification</InputLabel>
            <Select
              value={formData.education || ''}
              onChange={(e) => handleChange('education', e.target.value)}
              label="Educational Qualification"
            >
              <MenuItem value="Illiterate">Illiterate</MenuItem>
              <MenuItem value="Primary">Primary (1st-5th)</MenuItem>
              <MenuItem value="Middle">Middle (6th-8th)</MenuItem>
              <MenuItem value="Secondary">Secondary (9th-10th)</MenuItem>
              <MenuItem value="Higher Secondary">Higher Secondary (11th-12th)</MenuItem>
              <MenuItem value="Graduate">Graduate</MenuItem>
              <MenuItem value="Post Graduate">Post Graduate</MenuItem>
              <MenuItem value="Professional">Professional Degree</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Institution Name"
            value={formData.institutionName || ''}
            onChange={(e) => handleChange('institutionName', e.target.value)}
            helperText="Name of school/college last attended"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const FamilyCertificateStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Family Certificate Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details of existing caste certificates in family
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Do any family members hold caste certificates? *
          </Typography>
          <RadioGroup
            value={formData.familyCertificateExists || ''}
            onChange={(e) => handleChange('familyCertificateExists', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {formData.familyCertificateExists === 'yes' && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certificate Holder Name *"
                value={formData.certificateHolderName || ''}
                onChange={(e) => handleChange('certificateHolderName', e.target.value)}
                error={!!errors.certificateHolderName}
                helperText={errors.certificateHolderName}
                inputProps={{ 
                  maxLength: 50,
                  pattern: '[A-Za-z\\s\']{2,50}'
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.relationWithHolder}>
                <InputLabel>Relation with Certificate Holder *</InputLabel>
                <Select
                  value={formData.relationWithHolder || ''}
                  onChange={(e) => handleChange('relationWithHolder', e.target.value)}
                  label="Relation with Certificate Holder *"
                >
                  <MenuItem value="Father">Father</MenuItem>
                  <MenuItem value="Mother">Mother</MenuItem>
                  <MenuItem value="Brother">Brother</MenuItem>
                  <MenuItem value="Sister">Sister</MenuItem>
                  <MenuItem value="Grandfather">Grandfather</MenuItem>
                  <MenuItem value="Grandmother">Grandmother</MenuItem>
                  <MenuItem value="Uncle">Uncle</MenuItem>
                  <MenuItem value="Aunt">Aunt</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Certificate Number *"
                value={formData.certificateNumber || ''}
                onChange={(e) => handleChange('certificateNumber', e.target.value)}
                error={!!errors.certificateNumber}
                helperText={errors.certificateNumber || 'Existing certificate number'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Issuing Authority *"
                value={formData.issuingAuthority || ''}
                onChange={(e) => handleChange('issuingAuthority', e.target.value)}
                error={!!errors.issuingAuthority}
                helperText={errors.issuingAuthority || 'Authority that issued the certificate'}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Purpose for Certificate *"
            value={formData.purpose || ''}
            onChange={(e) => handleChange('purpose', e.target.value)}
            error={!!errors.purpose}
            helperText={errors.purpose || 'Why do you need this certificate?'}
            placeholder="e.g., Educational admission, Government job, Scholarship"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Birth certificate',
    'School leaving certificate/SSC certificate',
    'Aadhaar card',
    'Voter ID/Electoral roll',
    'Ration card',
    'Father\'s caste certificate (if available)',
    'Self-declaration affidavit',
    'Passport size photographs',
    'Residence proof'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload all required documents for caste certificate verification
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
const CasteCertificateForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Information', icon: 'Person' },
    { id: 'caste', title: 'Caste Details', icon: 'Assignment' },
    { id: 'address', title: 'Address & Education', icon: 'Home' },
    { id: 'family', title: 'Family Certificate Details', icon: 'Group' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Personal Information
    fullName: { type: 'name', required: true },
    fatherName: { type: 'name', required: true },
    motherName: { type: 'name', required: true },
    dateOfBirth: { type: 'birthDate', required: true },
    gender: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    aadhaar: { type: 'aadhaar', required: true },
    
    // Caste Details
    casteClaimed: { type: 'caste', required: true },
    religion: { type: 'religion', required: true },
    childStatus: { type: 'text', required: true },
    
    // Address & Education
    currentAddress: { type: 'address', required: true },
    state: { type: 'location', required: true },
    district: { type: 'location', required: true },
    village: { type: 'location', required: true },
    
    // Family Certificate Details
    familyCertificateExists: { type: 'text', required: true },
    purpose: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Caste Certificate Application"
      serviceType="caste_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <CasteDetailsStep />
      <AddressEducationStep />
      <FamilyCertificateStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default CasteCertificateForm;
