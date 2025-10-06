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
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge, validateField, autoCorrect, validateDateConsistency } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';

// Step Components
const DeceasedPersonStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    // Apply auto-corrections
    if (field === 'deceasedName' || field === 'fatherHusbandName') {
      correctedValue = autoCorrect.name(value);
    }
    
    const updates = { [field]: correctedValue };
    
    // Auto-calculate age when date of birth changes
    if (field === 'dateOfBirth') {
      updates.ageAtDeath = calculateAge(value, formData.dateOfDeath);
    }
    
    // Validate date consistency when death date changes
    if (field === 'dateOfDeath') {
      updates.ageAtDeath = calculateAge(formData.dateOfBirth, value);
      
      // Cross-field validation
      const dateErrors = validateDateConsistency(formData.dateOfBirth, value);
      if (dateErrors.deathDate) {
        updates.dateOfDeathError = dateErrors.deathDate;
      } else {
        updates.dateOfDeathError = null;
      }
    }
    
    updateFormData(updates);
  };

  const handleBlur = (field, value) => {
    const validationRules = {
      deceasedName: { type: 'name', required: true },
      fatherHusbandName: { type: 'name', required: true }
    };
    
    if (validationRules[field]) {
      const error = validateField(value, validationRules[field].type, validationRules[field].required);
      updateFormData({ [`${field}Error`]: error });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Deceased Person Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide complete details of the deceased person
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name of Deceased *"
            value={formData.deceasedName || ''}
            onChange={(e) => handleChange('deceasedName', e.target.value)}
            onBlur={(e) => handleBlur('deceasedName', e.target.value)}
            error={!!errors.deceasedName || !!formData.deceasedNameError}
            helperText={errors.deceasedName || formData.deceasedNameError || 'Full name as per ID documents'}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's/Husband's Name *"
            value={formData.fatherHusbandName || ''}
            onChange={(e) => handleChange('fatherHusbandName', e.target.value)}
            onBlur={(e) => handleBlur('fatherHusbandName', e.target.value)}
            error={!!errors.fatherHusbandName || !!formData.fatherHusbandNameError}
            helperText={errors.fatherHusbandName || formData.fatherHusbandNameError}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
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
              minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Death *"
              value={formData.dateOfDeath || null}
              onChange={(value) => handleChange('dateOfDeath', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateOfDeath || !!formData.dateOfDeathError}
                  helperText={errors.dateOfDeath || formData.dateOfDeathError}
                />
              )}
              maxDate={new Date()}
              minDate={formData.dateOfBirth || new Date(1900, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Time of Death"
              value={formData.timeOfDeath || null}
              onChange={(value) => handleChange('timeOfDeath', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Approximate time of death"
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Age at Death"
            value={formData.ageAtDeath || ''}
            InputProps={{ readOnly: true }}
            helperText="Auto-calculated from birth and death dates"
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
          <FormControl fullWidth>
            <InputLabel>Occupation</InputLabel>
            <Select
              value={formData.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              label="Occupation"
            >
              <MenuItem value="Agriculture">Agriculture</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Government Service">Government Service</MenuItem>
              <MenuItem value="Private Service">Private Service</MenuItem>
              <MenuItem value="Daily Wage Labor">Daily Wage Labor</MenuItem>
              <MenuItem value="Housewife">Housewife</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Address of Deceased *"
            value={formData.deceasedAddress || ''}
            onChange={(e) => handleChange('deceasedAddress', e.target.value)}
            error={!!errors.deceasedAddress}
            helperText={errors.deceasedAddress || 'Last known address of deceased'}
            inputProps={{ 
              minLength: 10,
              maxLength: 200
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DeathDetailsStep = ({ formData, updateFormData, errors }) => {
  const states = getStates();
  const districts = formData.stateOfDeath ? getDistrictsByState(formData.stateOfDeath) : [];

  const handleChange = (field, value) => {
    let updates = { [field]: value };
    
    // Clear district when state changes
    if (field === 'stateOfDeath') {
      updates.districtOfDeath = '';
    }
    
    // Apply auto-corrections for location fields
    if (field === 'placeOfDeath' || field === 'districtOfDeath' || field === 'stateOfDeath') {
      updates[field] = autoCorrect.name(value);
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Death Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details about the place and circumstances of death
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Place of Death *"
            value={formData.placeOfDeath || ''}
            onChange={(e) => handleChange('placeOfDeath', e.target.value)}
            error={!!errors.placeOfDeath}
            helperText={errors.placeOfDeath || 'Exact place where death occurred'}
            inputProps={{ 
              maxLength: 100
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.stateOfDeath}>
            <InputLabel>State of Death *</InputLabel>
            <Select
              value={formData.stateOfDeath || ''}
              onChange={(e) => handleChange('stateOfDeath', e.target.value)}
              label="State of Death *"
            >
              {states.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.districtOfDeath}>
            <InputLabel>District of Death *</InputLabel>
            <Select
              value={formData.districtOfDeath || ''}
              onChange={(e) => handleChange('districtOfDeath', e.target.value)}
              label="District of Death *"
              disabled={!formData.stateOfDeath}
            >
              {districts.map(district => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Where did the death occur? *
          </Typography>
          <RadioGroup
            value={formData.deathLocation || ''}
            onChange={(e) => handleChange('deathLocation', e.target.value)}
            row
          >
            <FormControlLabel value="home" control={<Radio />} label="At Home" />
            <FormControlLabel value="hospital" control={<Radio />} label="At Hospital" />
            <FormControlLabel value="other" control={<Radio />} label="Other Place" />
          </RadioGroup>
        </Grid>

        {formData.deathLocation === 'hospital' && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hospital Name *"
              value={formData.hospitalName || ''}
              onChange={(e) => handleChange('hospitalName', e.target.value)}
              error={!!errors.hospitalName}
              helperText={errors.hospitalName || 'Name of hospital where death occurred'}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Was the death medically attended? *
          </Typography>
          <RadioGroup
            value={formData.medicallyAttended || ''}
            onChange={(e) => handleChange('medicallyAttended', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Disease/Cause of Death *"
            value={formData.causeOfDeath || ''}
            onChange={(e) => handleChange('causeOfDeath', e.target.value)}
            error={!!errors.causeOfDeath}
            helperText={errors.causeOfDeath || 'Primary cause of death'}
            placeholder="e.g., Heart Attack, Cancer, Accident, Natural Death"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Body disposal method *
          </Typography>
          <RadioGroup
            value={formData.disposalMethod || ''}
            onChange={(e) => handleChange('disposalMethod', e.target.value)}
            row
          >
            <FormControlLabel value="cremated" control={<Radio />} label="Cremated" />
            <FormControlLabel value="buried" control={<Radio />} label="Buried" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ApplicantDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    // Apply auto-corrections
    if (field === 'applicantName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'aadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  const handleBlur = (field, value) => {
    const validationRules = {
      applicantName: { type: 'name', required: true },
      mobile: { type: 'mobile', required: true },
      aadhaar: { type: 'aadhaar', required: true }
    };
    
    if (validationRules[field]) {
      const error = validateField(value, validationRules[field].type, validationRules[field].required);
      updateFormData({ [`${field}Error`]: error });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Applicant Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Details of the person applying for the death certificate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name *"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            onBlur={(e) => handleBlur('applicantName', e.target.value)}
            error={!!errors.applicantName || !!formData.applicantNameError}
            helperText={errors.applicantName || formData.applicantNameError}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.relationshipWithDeceased}>
            <InputLabel>Relationship with Deceased *</InputLabel>
            <Select
              value={formData.relationshipWithDeceased || ''}
              onChange={(e) => handleChange('relationshipWithDeceased', e.target.value)}
              label="Relationship with Deceased *"
            >
              <MenuItem value="Son">Son</MenuItem>
              <MenuItem value="Daughter">Daughter</MenuItem>
              <MenuItem value="Spouse">Spouse</MenuItem>
              <MenuItem value="Father">Father</MenuItem>
              <MenuItem value="Mother">Mother</MenuItem>
              <MenuItem value="Brother">Brother</MenuItem>
              <MenuItem value="Sister">Sister</MenuItem>
              <MenuItem value="Grandson">Grandson</MenuItem>
              <MenuItem value="Granddaughter">Granddaughter</MenuItem>
              <MenuItem value="Other Relative">Other Relative</MenuItem>
              <MenuItem value="Legal Representative">Legal Representative</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Applicant Address *"
            value={formData.applicantAddress || ''}
            onChange={(e) => handleChange('applicantAddress', e.target.value)}
            error={!!errors.applicantAddress}
            helperText={errors.applicantAddress || 'Current address of applicant'}
            inputProps={{ 
              minLength: 10,
              maxLength: 200
            }}
          />
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

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Type of death *
          </Typography>
          <RadioGroup
            value={formData.deathType || ''}
            onChange={(e) => handleChange('deathType', e.target.value)}
            row
          >
            <FormControlLabel value="natural" control={<Radio />} label="Natural Death" />
            <FormControlLabel value="unnatural" control={<Radio />} label="Unnatural Death" />
          </RadioGroup>
        </Grid>

        {formData.deathType === 'unnatural' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Police Station & FIR Number"
              value={formData.policeDetails || ''}
              onChange={(e) => handleChange('policeDetails', e.target.value)}
              helperText="Required for unnatural deaths"
              placeholder="Police Station Name, FIR Number, Date"
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Identity proof of deceased',
    'Identity proof of applicant',
    'Address proof of deceased',
    'Medical certificate/Hospital certificate',
    'Cremation/Burial certificate',
    'Police report (if unnatural death)',
    'Affidavit from applicant',
    'Relationship proof (if not immediate family)',
    'Passport size photographs'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload all required documents for death certificate processing
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
const DeathCertificateForm = () => {
  const steps = [
    { id: 'deceased', title: 'Deceased Person Info', icon: 'Person' },
    { id: 'death', title: 'Death Details', icon: 'LocationOn' },
    { id: 'applicant', title: 'Applicant Information', icon: 'ContactPhone' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Deceased Person Information
    deceasedName: { type: 'name', required: true },
    fatherHusbandName: { type: 'name', required: true },
    dateOfBirth: { type: 'birthDate', required: true },
    dateOfDeath: { type: 'deathDate', required: true },
    gender: { type: 'text', required: true },
    deceasedAddress: { type: 'address', required: true },
    
    // Death Details
    placeOfDeath: { type: 'text', required: true },
    stateOfDeath: { type: 'location', required: true },
    districtOfDeath: { type: 'location', required: true },
    deathLocation: { type: 'text', required: true },
    medicallyAttended: { type: 'text', required: true },
    causeOfDeath: { type: 'text', required: true },
    disposalMethod: { type: 'text', required: true },
    
    // Applicant Information
    applicantName: { type: 'name', required: true },
    relationshipWithDeceased: { type: 'text', required: true },
    applicantAddress: { type: 'address', required: true },
    mobile: { type: 'mobile', required: true },
    aadhaar: { type: 'aadhaar', required: true },
    deathType: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Death Certificate Application"
      serviceType="death_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <DeceasedPersonStep />
      <DeathDetailsStep />
      <ApplicantDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default DeathCertificateForm;
