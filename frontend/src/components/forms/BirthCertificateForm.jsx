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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { useLanguage } from '../../i18n/LanguageProvider';

const BirthCertificateForm = () => {
  const { t } = useLanguage();
  
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
    { id: 'child', title: t('forms.birthCertificate.step1') },
    { id: 'parents', title: t('forms.birthCertificate.step2') },
    { id: 'address', title: t('forms.birthCertificate.step3') },
    { id: 'documents', title: t('forms.birthCertificate.step4') }
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
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {t('forms.birthCertificate.childInformation')}
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.childFullName')}
            value={formData.childName || ''}
            onChange={(e) => updateFormData({ childName: e.target.value })}
            error={!!errors.childName}
            helperText={errors.childName}
            placeholder={t('forms.common.enterValid') + ' ' + t('forms.birthCertificate.childFullName')}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.common.dateOfBirth')}
              value={formData.dateOfBirth}
              onChange={(date) => updateFormData({ dateOfBirth: date })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.timeOfBirth')}
            type="time"
            value={formData.timeOfBirth || ''}
            onChange={(e) => updateFormData({ timeOfBirth: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.placeOfBirth')}
            value={formData.placeOfBirth || ''}
            onChange={(e) => updateFormData({ placeOfBirth: e.target.value })}
            error={!!errors.placeOfBirth}
            helperText={errors.placeOfBirth}
            placeholder={t('forms.birthCertificate.placeOfBirthPlaceholder')}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender} size="small">
            <InputLabel>{t('forms.common.gender')}</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              label={t('forms.common.gender')}
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              <MenuItem value="Male">{t('forms.common.male')}</MenuItem>
              <MenuItem value="Female">{t('forms.common.female')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.weightAtBirth')}
            type="number"
            value={formData.weight || ''}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            placeholder="3.2"
            inputProps={{ step: 0.1, min: 0 }}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const ParentsInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {t('forms.birthCertificate.parentsInformation')}
      </Typography>
      
      {/* Father Information */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'bold', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
        {t('forms.birthCertificate.fatherDetails')}
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherFullName')}
            value={formData.fatherName || ''}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherAge')}
            type="number"
            value={formData.fatherAge || ''}
            onChange={(e) => updateFormData({ fatherAge: e.target.value })}
            inputProps={{ min: 18, max: 100 }}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherOccupation')}
            value={formData.fatherOccupation || ''}
            onChange={(e) => updateFormData({ fatherOccupation: e.target.value })}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.fatherEducation')}
            value={formData.fatherEducation || ''}
            onChange={(e) => updateFormData({ fatherEducation: e.target.value })}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Mother Information */}
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
        {t('forms.birthCertificate.motherDetails')}
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherFullName')}
            value={formData.motherName || ''}
            onChange={(e) => updateFormData({ motherName: e.target.value })}
            error={!!errors.motherName}
            helperText={errors.motherName}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherAge')}
            type="number"
            value={formData.motherAge || ''}
            onChange={(e) => updateFormData({ motherAge: e.target.value })}
            inputProps={{ min: 18, max: 100 }}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherOccupation')}
            value={formData.motherOccupation || ''}
            onChange={(e) => updateFormData({ motherOccupation: e.target.value })}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.motherEducation')}
            value={formData.motherEducation || ''}
            onChange={(e) => updateFormData({ motherEducation: e.target.value })}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const AddressStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {t('forms.birthCertificate.addressContactInfo')}
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.permanentAddress')}
            multiline
            rows={3}
            value={formData.permanentAddress || ''}
            onChange={(e) => updateFormData({ permanentAddress: e.target.value })}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress}
            placeholder={t('forms.birthCertificate.permanentAddressPlaceholder')}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.villageTown')}
            value={formData.village || ''}
            onChange={(e) => updateFormData({ village: e.target.value })}
            error={!!errors.village}
            helperText={errors.village}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.district')}
            value={formData.district || ''}
            onChange={(e) => updateFormData({ district: e.target.value })}
            error={!!errors.district}
            helperText={errors.district}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.state')}
            value={formData.state || ''}
            onChange={(e) => updateFormData({ state: e.target.value })}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.pincode')}
            value={formData.pincode || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
              updateFormData({ pincode: value });
            }}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.mobileNumber')}
            value={formData.mobile || ''}
            onChange={(e) => updateFormData({ mobile: e.target.value })}
            error={!!errors.mobile}
            helperText={errors.mobile}
            inputProps={{ maxLength: 10 }}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.birthCertificate.emailAddress')}
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value.toLowerCase() })}
            error={!!errors.email}
            helperText={errors.email}
            size="small"
            sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.9rem', sm: '1rem' } } }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
        {t('forms.birthCertificate.requiredDocuments')}
      </Typography>
      <Alert severity="info" sx={{ mb: 3, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
        {t('forms.birthCertificate.uploadInfo')}
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
          {t('forms.birthCertificate.requiredDocuments')}:
        </Typography>
        <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem' }}>
          <li>{t('forms.birthCertificate.hospitalBirthCert')}</li>
          <li>{t('forms.birthCertificate.parentsIdProof')}</li>
          <li>{t('forms.birthCertificate.parentsAddressProof')}</li>
          <li>{t('forms.birthCertificate.marriageCertificate')}</li>
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
      serviceName={t('forms.birthCertificate.title')}
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
