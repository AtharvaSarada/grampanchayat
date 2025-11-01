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
import { validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';
import { useLanguage } from '../../i18n/LanguageProvider';

// Step Components
const ChildDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    // Handle date objects properly
    if (field === 'dateOfBirth' || field === 'timeOfBirth') {
      correctedValue = value;
    } else if (field === 'childName') {
      correctedValue = autoCorrect.name(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  const handleBlur = (field, value) => {
    const validationRules = {
      childName: { type: 'name', required: true }
    };
    
    if (validationRules[field]) {
      const error = validateField(value, validationRules[field].type, validationRules[field].required);
      updateFormData({ [`${field}Error`]: error });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.birthCertificate.childDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.birthCertificate.provideChildDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.childName')}
            value={formData.childName || ''}
            onChange={(e) => handleChange('childName', e.target.value)}
            onBlur={(e) => handleBlur('childName', e.target.value)}
            error={!!errors.childName || !!formData.childNameError}
            helperText={errors.childName || formData.childNameError}
            inputProps={{ 
              maxLength: 50,
              pattern: '[A-Za-z\\s\']{2,50}'
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
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

        <Grid item xs={12} md={6}>
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
              minDate={new Date(new Date().getFullYear() - 1, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={t('forms.birthCertificate.timeOfBirth')}
              value={formData.timeOfBirth ? new Date(formData.timeOfBirth) : null}
              onChange={(value) => handleChange('timeOfBirth', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText={t('forms.birthCertificate.timeOfBirthHelper')}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.placeOfBirth')}
            value={formData.placeOfBirth || ''}
            onChange={(e) => handleChange('placeOfBirth', e.target.value)}
            error={!!errors.placeOfBirth}
            helperText={errors.placeOfBirth || t('forms.birthCertificate.placeOfBirthHelper')}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.weight')}
            value={formData.weight || ''}
            onChange={(e) => handleChange('weight', e.target.value)}
            type="number"
            inputProps={{ step: 0.1, min: 0, max: 10 }}
            helperText={t('forms.birthCertificate.weightHelper')}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const ParentDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'fatherName' || field === 'motherName') {
      correctedValue = autoCorrect.name(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  const handleBlur = (field, value) => {
    const validationRules = {
      fatherName: { type: 'name', required: true },
      motherName: { type: 'name', required: true }
    };
    
    if (validationRules[field]) {
      const error = validateField(value, validationRules[field].type, validationRules[field].required);
      updateFormData({ [`${field}Error`]: error });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.birthCertificate.parentDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.birthCertificate.provideParentDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t('forms.birthCertificate.fatherDetails')}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherName')}
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
            label={t('forms.birthCertificate.fatherAge')}
            value={formData.fatherAge || ''}
            onChange={(e) => handleChange('fatherAge', e.target.value)}
            type="number"
            inputProps={{ min: 18, max: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherEducation')}
            value={formData.fatherEducation || ''}
            onChange={(e) => handleChange('fatherEducation', e.target.value)}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherOccupation')}
            value={formData.fatherOccupation || ''}
            onChange={(e) => handleChange('fatherOccupation', e.target.value)}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t('forms.birthCertificate.motherDetails')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherName')}
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
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherAge')}
            value={formData.motherAge || ''}
            onChange={(e) => handleChange('motherAge', e.target.value)}
            type="number"
            inputProps={{ min: 18, max: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherEducation')}
            value={formData.motherEducation || ''}
            onChange={(e) => handleChange('motherEducation', e.target.value)}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherOccupation')}
            value={formData.motherOccupation || ''}
            onChange={(e) => handleChange('motherOccupation', e.target.value)}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const AddressHospitalStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const states = getStates();
  const districts = formData.state ? getDistrictsByState(formData.state) : [];

  const handleChange = (field, value) => {
    let updates = { [field]: value };
    
    // Clear district when state changes
    if (field === 'state') {
      updates.district = '';
    }
    
    // Apply auto-corrections for location fields
    if (field === 'city' || field === 'district' || field === 'state') {
      updates[field] = autoCorrect.name(value);
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.birthCertificate.addressHospitalDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.birthCertificate.provideAddressDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t('forms.birthCertificate.addressDetails')}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.birthCertificate.permanentAddress')}
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress}
            inputProps={{ 
              minLength: 10,
              maxLength: 200
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.city')}
            value={formData.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>{t('forms.common.state')}</InputLabel>
            <Select
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              label={t('forms.common.state')}
            >
              {states.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.district}>
            <InputLabel>{t('forms.common.district')}</InputLabel>
            <Select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              label={t('forms.common.district')}
              disabled={!formData.state}
            >
              {districts.map(district => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.pincode')}
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
            inputProps={{ 
              maxLength: 6,
              pattern: '[0-9]{6}'
            }}
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t('forms.birthCertificate.hospitalDetails')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.hospitalName')}
            value={formData.hospitalName || ''}
            onChange={(e) => handleChange('hospitalName', e.target.value)}
            error={!!errors.hospitalName}
            helperText={errors.hospitalName}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.doctorName')}
            value={formData.doctorName || ''}
            onChange={(e) => handleChange('doctorName', e.target.value)}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t('forms.birthCertificate.hospitalAddress')}
            value={formData.hospitalAddress || ''}
            onChange={(e) => handleChange('hospitalAddress', e.target.value)}
            inputProps={{ maxLength: 200 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  
  const requiredDocuments = [
    'Hospital birth certificate/Medical certificate',
    'Parents identity proof (Aadhaar/PAN/Passport)',
    'Address proof (Ration card/Electricity bill/Rent agreement)',
    'Parents marriage certificate (if available)',
    'Affidavit (if birth registration is delayed)'
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.birthCertificate.documentUpload')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.birthCertificate.uploadAllDocs')}
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={10}
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
const BirthCertificateForm = () => {
  const { t } = useLanguage();
  const steps = [
    { id: 'child', title: t('forms.birthCertificate.step1'), icon: 'Person' },
    { id: 'parents', title: t('forms.birthCertificate.step2'), icon: 'Family' },
    { id: 'address', title: t('forms.birthCertificate.step3'), icon: 'LocationOn' },
    { id: 'documents', title: t('forms.birthCertificate.step4'), icon: 'Description' }
  ];

  const validationRules = {
    // Child Details
    childName: { type: 'name', required: true },
    dateOfBirth: { type: 'birthDate', required: true },
    gender: { type: 'text', required: true },
    placeOfBirth: { type: 'text', required: true },
    
    // Parent Details
    fatherName: { type: 'name', required: true },
    motherName: { type: 'name', required: true },
    
    // Address Details
    permanentAddress: { type: 'address', required: true },
    city: { type: 'text', required: true },
    state: { type: 'location', required: true },
    district: { type: 'location', required: true },
    
    // Hospital Details
    hospitalName: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName={t('forms.birthCertificate.title')}
      serviceType="birth_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <ChildDetailsStep />
      <ParentDetailsStep />
      <AddressHospitalStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};



export default BirthCertificateForm;
