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
import { useLanguage } from '../../i18n/LanguageProvider';

const TradeLicenseForm = () => {
  const { t } = useLanguage();
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
    { id: 'applicant', title: t('forms.tradeLicense.step1') },
    { id: 'business', title: t('forms.tradeLicense.step2') },
    { id: 'address', title: t('forms.tradeLicense.step3') },
    { id: 'documents', title: t('forms.tradeLicense.step4') }
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
    { value: 'Retail Trade', label: t('forms.tradeLicense.retailTrade') },
    { value: 'Wholesale Trade', label: t('forms.tradeLicense.wholesaleTrade') },
    { value: 'Manufacturing', label: t('forms.tradeLicense.manufacturing') },
    { value: 'Service Provider', label: t('forms.tradeLicense.serviceProvider') },
    { value: 'Restaurant/Food Service', label: t('forms.tradeLicense.restaurant') },
    { value: 'Medical/Healthcare', label: t('forms.tradeLicense.medical') },
    { value: 'Educational Services', label: t('forms.tradeLicense.educational') },
    { value: 'Transportation', label: t('forms.tradeLicense.transportation') },
    { value: 'Construction', label: t('forms.tradeLicense.construction') },
    { value: 'Agriculture Related', label: t('forms.tradeLicense.agricultureRelated') },
    { value: 'Other', label: t('forms.common.other') }
  ];

  const businessCategories = [
    { value: 'Micro Enterprise', label: t('forms.tradeLicense.microEnterprise') },
    { value: 'Small Enterprise', label: t('forms.tradeLicense.smallEnterprise') },
    { value: 'Medium Enterprise', label: t('forms.tradeLicense.mediumEnterprise') },
    { value: 'Large Enterprise', label: t('forms.tradeLicense.largeEnterprise') }
  ];

  const licenseTypes = [
    { value: 'General Trade License', label: t('forms.tradeLicense.generalTradeLicense') },
    { value: 'Food Business License', label: t('forms.tradeLicense.foodBusinessLicense') },
    { value: 'Medical Store License', label: t('forms.tradeLicense.medicalStoreLicense') },
    { value: 'Petrol Pump License', label: t('forms.tradeLicense.petrolPumpLicense') },
    { value: 'Liquor License', label: t('forms.tradeLicense.liquorLicense') },
    { value: 'Factory License', label: t('forms.tradeLicense.factoryLicense') },
    { value: 'Other', label: t('forms.common.other') }
  ];

  const ApplicantDetailsStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.tradeLicense.applicantInfo')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.applicantFullName')}
            value={formData.applicantName || ''}
            onChange={(e) => updateFormData({ applicantName: e.target.value })}
            error={!!errors.applicantName}
            helperText={errors.applicantName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.fatherName')}
            value={formData.fatherName || ''}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
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
            <InputLabel>{t('forms.common.gender')}</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              label={t('forms.common.gender')}
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
            label={t('forms.common.mobile')}
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
            label={t('forms.common.email')}
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
            label={t('forms.common.aadhaar')}
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
        {t('forms.tradeLicense.businessInfo')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.businessName')}
            value={formData.businessName || ''}
            onChange={(e) => updateFormData({ businessName: e.target.value })}
            error={!!errors.businessName}
            helperText={errors.businessName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.businessType}>
            <InputLabel>{t('forms.tradeLicense.businessType')}</InputLabel>
            <Select
              value={formData.businessType || ''}
              onChange={(e) => updateFormData({ businessType: e.target.value })}
              label={t('forms.tradeLicense.businessType')}
            >
              {businessTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
            {errors.businessType && <FormHelperText>{errors.businessType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.businessCategory}>
            <InputLabel>{t('forms.tradeLicense.businessCategory')}</InputLabel>
            <Select
              value={formData.businessCategory || ''}
              onChange={(e) => updateFormData({ businessCategory: e.target.value })}
              label={t('forms.tradeLicense.businessCategory')}
            >
              {businessCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
              ))}
            </Select>
            {errors.businessCategory && <FormHelperText>{errors.businessCategory}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.tradeLicense.establishmentDate')}
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
            label={t('forms.tradeLicense.businessDescription')}
            multiline
            rows={3}
            value={formData.businessDescription || ''}
            onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            placeholder={t('forms.tradeLicense.businessDescriptionPlaceholder')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.numberOfEmployees')}
            type="number"
            value={formData.numberOfEmployees || ''}
            onChange={(e) => updateFormData({ numberOfEmployees: e.target.value })}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.investmentAmount')}
            type="number"
            value={formData.investmentAmount || ''}
            onChange={(e) => updateFormData({ investmentAmount: e.target.value })}
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.expectedTurnover')}
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
        {t('forms.tradeLicense.businessAddressLicense')}
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
        {t('forms.tradeLicense.businessAddress')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.businessAddress')}
            multiline
            rows={3}
            value={formData.businessAddress || ''}
            onChange={(e) => updateFormData({ businessAddress: e.target.value })}
            error={!!errors.businessAddress}
            helperText={errors.businessAddress}
            placeholder={t('forms.tradeLicense.businessAddressPlaceholder')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.tradeLicense.villageTown')}
            value={formData.village || ''}
            onChange={(e) => updateFormData({ village: e.target.value })}
            error={!!errors.village}
            helperText={errors.village}
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.state')}
            value={formData.state || ''}
            onChange={(e) => updateFormData({ state: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.pincode')}
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
        {t('forms.tradeLicense.licenseInfo')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.licenseType}>
            <InputLabel>{t('forms.tradeLicense.licenseType')}</InputLabel>
            <Select
              value={formData.licenseType || ''}
              onChange={(e) => updateFormData({ licenseType: e.target.value })}
              label={t('forms.tradeLicense.licenseType')}
            >
              {licenseTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
            {errors.licenseType && <FormHelperText>{errors.licenseType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t('forms.tradeLicense.licenseValidity')}</InputLabel>
            <Select
              value={formData.licenseValidity || '1'}
              onChange={(e) => updateFormData({ licenseValidity: e.target.value })}
              label={t('forms.tradeLicense.licenseValidity')}
            >
              <MenuItem value="1">{t('forms.tradeLicense.oneYear')}</MenuItem>
              <MenuItem value="3">{t('forms.tradeLicense.threeYears')}</MenuItem>
              <MenuItem value="5">{t('forms.tradeLicense.fiveYears')}</MenuItem>
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
            label={t('forms.tradeLicense.previousLicense')}
          />
        </Grid>
        {formData.previousLicense && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('forms.tradeLicense.previousLicenseNumber')}
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
        {t('forms.tradeLicense.requiredDocuments')}
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        {t('forms.tradeLicense.uploadInfo')}
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('forms.tradeLicense.requiredDocuments')}:
        </Typography>
        <ul>
          <li>{t('forms.tradeLicense.aadhaarCard')}</li>
          <li>{t('forms.tradeLicense.addressProof')}</li>
          <li>{t('forms.tradeLicense.businessPlan')}</li>
          <li>{t('forms.tradeLicense.partnershipDeed')}</li>
          <li>{t('forms.tradeLicense.fireNOC')}</li>
          <li>{t('forms.tradeLicense.pollutionClearance')}</li>
          <li>{t('forms.tradeLicense.previousLicenseCopy')}</li>
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
      serviceName={t('forms.tradeLicense.title')}
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
