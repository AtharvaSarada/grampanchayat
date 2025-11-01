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
import { calculateAge, validateField, autoCorrect, validateMarriageAge } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';
import { useLanguage } from '../../i18n/LanguageProvider';

// Bride Information Step
const BrideInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'brideName' || field === 'brideFatherName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'brideMobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'brideAadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    }
    
    const updates = { [field]: correctedValue };
    
    if (field === 'brideDateOfBirth') {
      updates.brideAge = calculateAge(value);
      // Validate marriage age if marriage date exists
      if (formData.marriageDate) {
        const marriageAge = calculateAge(value, formData.marriageDate);
        if (marriageAge < 18) {
          updates.brideDateOfBirthError = 'Bride must be at least 18 years old on marriage date';
        } else {
          updates.brideDateOfBirthError = null;
        }
      }
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.marriageCertificate.brideInformation')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.marriageCertificate.provideBrideDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.brideFullName')}
            value={formData.brideName || ''}
            onChange={(e) => handleChange('brideName', e.target.value)}
            error={!!errors.brideName}
            helperText={errors.brideName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.brideFatherName')}
            value={formData.brideFatherName || ''}
            onChange={(e) => handleChange('brideFatherName', e.target.value)}
            error={!!errors.brideFatherName}
            helperText={errors.brideFatherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.marriageCertificate.brideDateOfBirth')}
              value={formData.brideDateOfBirth || null}
              onChange={(value) => handleChange('brideDateOfBirth', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.brideDateOfBirth || !!formData.brideDateOfBirthError}
                  helperText={errors.brideDateOfBirth || formData.brideDateOfBirthError}
                />
              )}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 80, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.brideAge')}
            value={formData.brideAge || ''}
            InputProps={{ readOnly: true }}
            helperText={t('forms.deathCertificate.autoCalculated')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.brideMobile')}
            value={formData.brideMobile || ''}
            onChange={(e) => handleChange('brideMobile', e.target.value)}
            error={!!errors.brideMobile}
            helperText={errors.brideMobile}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.brideAadhaar')}
            value={formData.brideAadhaar || ''}
            onChange={(e) => handleChange('brideAadhaar', e.target.value)}
            error={!!errors.brideAadhaar}
            helperText={errors.brideAadhaar}
            inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t('forms.marriageCertificate.brideAddress')}
            value={formData.brideAddress || ''}
            onChange={(e) => handleChange('brideAddress', e.target.value)}
            error={!!errors.brideAddress}
            helperText={errors.brideAddress}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Groom Information Step
const GroomInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'groomName' || field === 'groomFatherName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'groomMobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'groomAadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    }
    
    const updates = { [field]: correctedValue };
    
    if (field === 'groomDateOfBirth') {
      updates.groomAge = calculateAge(value);
      // Validate marriage age if marriage date exists
      if (formData.marriageDate) {
        const marriageAge = calculateAge(value, formData.marriageDate);
        if (marriageAge < 21) {
          updates.groomDateOfBirthError = 'Groom must be at least 21 years old on marriage date';
        } else {
          updates.groomDateOfBirthError = null;
        }
      }
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.marriageCertificate.groomInformation')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.marriageCertificate.provideGroomDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.groomFullName')}
            value={formData.groomName || ''}
            onChange={(e) => handleChange('groomName', e.target.value)}
            error={!!errors.groomName}
            helperText={errors.groomName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.groomFatherName')}
            value={formData.groomFatherName || ''}
            onChange={(e) => handleChange('groomFatherName', e.target.value)}
            error={!!errors.groomFatherName}
            helperText={errors.groomFatherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.marriageCertificate.groomDateOfBirth')}
              value={formData.groomDateOfBirth || null}
              onChange={(value) => handleChange('groomDateOfBirth', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.groomDateOfBirth || !!formData.groomDateOfBirthError}
                  helperText={errors.groomDateOfBirth || formData.groomDateOfBirthError}
                />
              )}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 80, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.groomAge')}
            value={formData.groomAge || ''}
            InputProps={{ readOnly: true }}
            helperText={t('forms.deathCertificate.autoCalculated')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.groomMobile')}
            value={formData.groomMobile || ''}
            onChange={(e) => handleChange('groomMobile', e.target.value)}
            error={!!errors.groomMobile}
            helperText={errors.groomMobile}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.groomAadhaar')}
            value={formData.groomAadhaar || ''}
            onChange={(e) => handleChange('groomAadhaar', e.target.value)}
            error={!!errors.groomAadhaar}
            helperText={errors.groomAadhaar}
            inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t('forms.marriageCertificate.groomAddress')}
            value={formData.groomAddress || ''}
            onChange={(e) => handleChange('groomAddress', e.target.value)}
            error={!!errors.groomAddress}
            helperText={errors.groomAddress}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Marriage Details Step
const MarriageDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const states = getStates();
  const districts = formData.marriageState ? getDistrictsByState(formData.marriageState) : [];

  const handleChange = (field, value) => {
    let updates = { [field]: value };
    
    if (field === 'marriageState') {
      updates.marriageDistrict = '';
    }
    
    if (field === 'marriageDate') {
      // Validate age requirements when marriage date changes
      if (formData.brideDateOfBirth) {
        const brideAge = calculateAge(formData.brideDateOfBirth, value);
        if (brideAge < 18) {
          updates.marriageDateError = 'Bride must be at least 18 years old on marriage date';
        }
      }
      
      if (formData.groomDateOfBirth) {
        const groomAge = calculateAge(formData.groomDateOfBirth, value);
        if (groomAge < 21) {
          updates.marriageDateError = 'Groom must be at least 21 years old on marriage date';
        }
      }
      
      if (!updates.marriageDateError) {
        updates.marriageDateError = null;
      }
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.marriageCertificate.marriageDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.marriageCertificate.provideMarriageDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.marriageCertificate.dateOfMarriage')}
              value={formData.marriageDate || null}
              onChange={(value) => handleChange('marriageDate', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.marriageDate || !!formData.marriageDateError}
                  helperText={errors.marriageDate || formData.marriageDateError}
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.placeOfMarriage')}
            value={formData.marriagePlace || ''}
            onChange={(e) => handleChange('marriagePlace', e.target.value)}
            error={!!errors.marriagePlace}
            helperText={errors.marriagePlace || t('forms.marriageCertificate.exactPlace')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.marriageState}>
            <InputLabel>{t('forms.marriageCertificate.stateOfMarriage')}</InputLabel>
            <Select
              value={formData.marriageState || ''}
              onChange={(e) => handleChange('marriageState', e.target.value)}
              label={t('forms.marriageCertificate.stateOfMarriage')}
            >
              {states.map(state => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.marriageDistrict}>
            <InputLabel>{t('forms.marriageCertificate.districtOfMarriage')}</InputLabel>
            <Select
              value={formData.marriageDistrict || ''}
              onChange={(e) => handleChange('marriageDistrict', e.target.value)}
              label={t('forms.marriageCertificate.districtOfMarriage')}
              disabled={!formData.marriageState}
            >
              {districts.map(district => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.marriageCertificate.marriageType')}
          </Typography>
          <RadioGroup
            value={formData.marriageType || ''}
            onChange={(e) => handleChange('marriageType', e.target.value)}
            row
          >
            <FormControlLabel value="hindu" control={<Radio />} label="Hindu Marriage" />
            <FormControlLabel value="muslim" control={<Radio />} label="Muslim Marriage" />
            <FormControlLabel value="christian" control={<Radio />} label="Christian Marriage" />
            <FormControlLabel value="civil" control={<Radio />} label="Civil Marriage" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.witness1Name')}
            value={formData.witness1Name || ''}
            onChange={(e) => handleChange('witness1Name', e.target.value)}
            error={!!errors.witness1Name}
            helperText={errors.witness1Name}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.marriageCertificate.witness2Name')}
            value={formData.witness2Name || ''}
            onChange={(e) => handleChange('witness2Name', e.target.value)}
            error={!!errors.witness2Name}
            helperText={errors.witness2Name}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  const requiredDocuments = [
    'Marriage invitation card',
    'Marriage photographs',
    'Bride\'s birth certificate',
    'Groom\'s birth certificate',
    'Bride\'s Aadhaar card',
    'Groom\'s Aadhaar card',
    'Address proof of both parties',
    'Affidavit from bride and groom',
    'Witness identity proofs',
    'Priest/Registrar certificate'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.marriageCertificate.documentUpload')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.marriageCertificate.uploadAllDocs')}
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
const MarriageCertificateForm = () => {
  const { t } = useLanguage();
  const steps = [
    { id: 'bride', title: t('forms.marriageCertificate.step1'), icon: 'Person' },
    { id: 'groom', title: t('forms.marriageCertificate.step2'), icon: 'Person' },
    { id: 'marriage', title: t('forms.marriageCertificate.step3'), icon: 'Favorite' },
    { id: 'documents', title: t('forms.marriageCertificate.step4'), icon: 'Description' }
  ];

  const validationRules = {
    // Bride Information
    brideName: { type: 'name', required: true },
    brideFatherName: { type: 'name', required: true },
    brideDateOfBirth: { type: 'birthDate', required: true },
    brideMobile: { type: 'mobile', required: true },
    brideAadhaar: { type: 'aadhaar', required: true },
    brideAddress: { type: 'address', required: true },
    
    // Groom Information
    groomName: { type: 'name', required: true },
    groomFatherName: { type: 'name', required: true },
    groomDateOfBirth: { type: 'birthDate', required: true },
    groomMobile: { type: 'mobile', required: true },
    groomAadhaar: { type: 'aadhaar', required: true },
    groomAddress: { type: 'address', required: true },
    
    // Marriage Details
    marriageDate: { type: 'date', required: true },
    marriagePlace: { type: 'text', required: true },
    marriageState: { type: 'location', required: true },
    marriageDistrict: { type: 'location', required: true },
    marriageType: { type: 'text', required: true },
    witness1Name: { type: 'name', required: true },
    witness2Name: { type: 'name', required: true }
  };

  return (
    <MultiStepForm
      serviceName={t('forms.marriageCertificate.title')}
      serviceType="marriage_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <BrideInformationStep />
      <GroomInformationStep />
      <MarriageDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default MarriageCertificateForm;
