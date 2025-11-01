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
import { useLanguage } from '../../i18n/LanguageProvider';

// Step Components
const DeceasedPersonStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    // Handle date objects properly
    if (field === 'dateOfBirth' || field === 'dateOfDeath' || field === 'timeOfDeath') {
      // If value is a Date object, keep it as is for calculations
      // If value is null/undefined, keep it as null
      correctedValue = value;
    } else if (field === 'deceasedName' || field === 'fatherHusbandName') {
      // Apply auto-corrections for text fields
      correctedValue = autoCorrect.name(value);
    }
    
    const updates = { [field]: correctedValue };
    
    // Auto-calculate age when date of birth changes
    if (field === 'dateOfBirth' && formData.dateOfDeath && value) {
      updates.ageAtDeath = calculateAge(value, formData.dateOfDeath);
    }
    
    // Auto-calculate age when date of death changes
    if (field === 'dateOfDeath' && value) {
      if (formData.dateOfBirth) {
        updates.ageAtDeath = calculateAge(formData.dateOfBirth, value);
      }
      
      // Cross-field validation
      if (formData.dateOfBirth) {
        const dateErrors = validateDateConsistency(formData.dateOfBirth, value);
        if (dateErrors && dateErrors.deathDate) {
          updates.dateOfDeathError = dateErrors.deathDate;
        } else {
          updates.dateOfDeathError = null;
        }
      }
    }
    
    // Recalculate age if both dates are available
    if ((field === 'dateOfBirth' || field === 'dateOfDeath') && value) {
      const birthDate = field === 'dateOfBirth' ? value : formData.dateOfBirth;
      const deathDate = field === 'dateOfDeath' ? value : formData.dateOfDeath;
      
      if (birthDate && deathDate) {
        updates.ageAtDeath = calculateAge(birthDate, deathDate);
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
        {t('forms.deathCertificate.deceasedPersonInfo')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.deathCertificate.provideDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.deathCertificate.deceasedFullName')}
            value={formData.deceasedName || ''}
            onChange={(e) => handleChange('deceasedName', e.target.value)}
            onBlur={(e) => handleBlur('deceasedName', e.target.value)}
            error={!!errors.deceasedName || !!formData.deceasedNameError}
            helperText={errors.deceasedName || formData.deceasedNameError}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.deathCertificate.fatherHusbandName')}
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
              label={t('forms.common.dateOfBirth')}
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
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
              label={t('forms.deathCertificate.dateOfDeath')}
              value={formData.dateOfDeath ? new Date(formData.dateOfDeath) : null}
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
              minDate={formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date(1900, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={t('forms.deathCertificate.timeOfDeath')}
              value={formData.timeOfDeath ? new Date(formData.timeOfDeath) : null}
              onChange={(value) => handleChange('timeOfDeath', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText={t('forms.deathCertificate.timeOfDeath')}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t('forms.deathCertificate.ageAtDeath')}
            value={formData.ageAtDeath || ''}
            InputProps={{ readOnly: true }}
            helperText={t('forms.deathCertificate.autoCalculated')}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t('forms.common.gender')}</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label={t('forms.common.gender')}
            >
              <MenuItem value="Male">{t('forms.common.male')}</MenuItem>
              <MenuItem value="Female">{t('forms.common.female')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>{t('forms.deathCertificate.occupation')}</InputLabel>
            <Select
              value={formData.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              label={t('forms.deathCertificate.occupation')}
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
            label={t('forms.deathCertificate.deceasedAddress')}
            value={formData.deceasedAddress || ''}
            onChange={(e) => handleChange('deceasedAddress', e.target.value)}
            error={!!errors.deceasedAddress}
            helperText={errors.deceasedAddress || t('forms.deathCertificate.lastKnownAddress')}
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
  const { t } = useLanguage();
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
        {t('forms.deathCertificate.deathDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.deathCertificate.provideDeathDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.deathCertificate.placeOfDeath')}
            value={formData.placeOfDeath || ''}
            onChange={(e) => handleChange('placeOfDeath', e.target.value)}
            error={!!errors.placeOfDeath}
            helperText={errors.placeOfDeath || t('forms.deathCertificate.exactPlace')}
            inputProps={{ 
              maxLength: 100
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.stateOfDeath}>
            <InputLabel>{t('forms.deathCertificate.stateOfDeath')}</InputLabel>
            <Select
              value={formData.stateOfDeath || ''}
              onChange={(e) => handleChange('stateOfDeath', e.target.value)}
              label={t('forms.deathCertificate.stateOfDeath')}
            >
              {states.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.districtOfDeath}>
            <InputLabel>{t('forms.deathCertificate.districtOfDeath')}</InputLabel>
            <Select
              value={formData.districtOfDeath || ''}
              onChange={(e) => handleChange('districtOfDeath', e.target.value)}
              label={t('forms.deathCertificate.districtOfDeath')}
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
            {t('forms.deathCertificate.whereDidDeathOccur')}
          </Typography>
          <RadioGroup
            value={formData.deathLocation || ''}
            onChange={(e) => handleChange('deathLocation', e.target.value)}
            row
          >
            <FormControlLabel value="home" control={<Radio />} label={t('forms.deathCertificate.atHome')} />
            <FormControlLabel value="hospital" control={<Radio />} label={t('forms.deathCertificate.atHospital')} />
            <FormControlLabel value="other" control={<Radio />} label={t('forms.deathCertificate.otherPlace')} />
          </RadioGroup>
        </Grid>

        {formData.deathLocation === 'hospital' && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('forms.deathCertificate.hospitalName')}
              value={formData.hospitalName || ''}
              onChange={(e) => handleChange('hospitalName', e.target.value)}
              error={!!errors.hospitalName}
              helperText={errors.hospitalName}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.deathCertificate.medicallyAttended')}
          </Typography>
          <RadioGroup
            value={formData.medicallyAttended || ''}
            onChange={(e) => handleChange('medicallyAttended', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label={t('forms.deathCertificate.yes')} />
            <FormControlLabel value="no" control={<Radio />} label={t('forms.deathCertificate.no')} />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.deathCertificate.causeOfDeath')}
            value={formData.causeOfDeath || ''}
            onChange={(e) => handleChange('causeOfDeath', e.target.value)}
            error={!!errors.causeOfDeath}
            helperText={errors.causeOfDeath || t('forms.deathCertificate.primaryCause')}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.deathCertificate.bodyDisposal')}
          </Typography>
          <RadioGroup
            value={formData.disposalMethod || ''}
            onChange={(e) => handleChange('disposalMethod', e.target.value)}
            row
          >
            <FormControlLabel value="cremated" control={<Radio />} label={t('forms.deathCertificate.cremated')} />
            <FormControlLabel value="buried" control={<Radio />} label={t('forms.deathCertificate.buried')} />
            <FormControlLabel value="other" control={<Radio />} label={t('forms.deathCertificate.other')} />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ApplicantDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t('forms.deathCertificate.applicantInfo')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.deathCertificate.applicantDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.deathCertificate.applicantName')}
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
            <InputLabel>{t('forms.deathCertificate.relationshipWithDeceased')}</InputLabel>
            <Select
              value={formData.relationshipWithDeceased || ''}
              onChange={(e) => handleChange('relationshipWithDeceased', e.target.value)}
              label={t('forms.deathCertificate.relationshipWithDeceased')}
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
            label={t('forms.deathCertificate.applicantAddress')}
            value={formData.applicantAddress || ''}
            onChange={(e) => handleChange('applicantAddress', e.target.value)}
            error={!!errors.applicantAddress}
            helperText={errors.applicantAddress || t('forms.deathCertificate.currentAddress')}
            inputProps={{ 
              minLength: 10,
              maxLength: 200
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.mobile')}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            onBlur={(e) => handleBlur('mobile', e.target.value)}
            error={!!errors.mobile || !!formData.mobileError}
            helperText={errors.mobile || formData.mobileError}
            inputProps={{ 
              maxLength: 10,
              pattern: '[6-9][0-9]{9}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.aadhaar')}
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            onBlur={(e) => handleBlur('aadhaar', e.target.value)}
            error={!!errors.aadhaar || !!formData.aadhaarError}
            helperText={errors.aadhaar || formData.aadhaarError}
            inputProps={{ 
              maxLength: 12,
              pattern: '[0-9]{12}'
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.deathCertificate.deathType')}
          </Typography>
          <RadioGroup
            value={formData.deathType || ''}
            onChange={(e) => handleChange('deathType', e.target.value)}
            row
          >
            <FormControlLabel value="natural" control={<Radio />} label={t('forms.deathCertificate.naturalDeath')} />
            <FormControlLabel value="unnatural" control={<Radio />} label={t('forms.deathCertificate.unnaturalDeath')} />
          </RadioGroup>
        </Grid>

        {formData.deathType === 'unnatural' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('forms.deathCertificate.policeDetails')}
              value={formData.policeDetails || ''}
              onChange={(e) => handleChange('policeDetails', e.target.value)}
              helperText={t('forms.deathCertificate.requiredForUnnatural')}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
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
        {t('forms.deathCertificate.documentUpload')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.deathCertificate.uploadAllDocs')}
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
          {t('forms.common.requiredDocuments')}:
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
  const { t } = useLanguage();
  const steps = [
    { id: 'deceased', title: t('forms.deathCertificate.step1'), icon: 'Person' },
    { id: 'death', title: t('forms.deathCertificate.step2'), icon: 'LocationOn' },
    { id: 'applicant', title: t('forms.deathCertificate.step3'), icon: 'ContactPhone' },
    { id: 'documents', title: t('forms.deathCertificate.step4'), icon: 'Description' }
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
      serviceName={t('forms.deathCertificate.title')}
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
