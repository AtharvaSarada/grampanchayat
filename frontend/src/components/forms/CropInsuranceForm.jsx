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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Alert,
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';
import { useLanguage } from '../../i18n/LanguageProvider';

// Farmer Information Step
const FarmerInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [states] = React.useState(getStates());
  const [districts, setDistricts] = React.useState([]);

  React.useEffect(() => {
    if (formData.state) {
      setDistricts(getDistrictsByState(formData.state));
    }
  }, [formData.state]);

  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'farmerName' || field === 'fatherName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'aadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    } else if (field === 'email') {
      correctedValue = autoCorrect.email(value);
    }
    
    const updates = { [field]: correctedValue };
    
    if (field === 'state') {
      updates.district = '';
      setDistricts(getDistrictsByState(value));
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.cropInsurance.farmerInfo.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.cropInsurance.farmerInfo.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.cropInsurance.farmerInfo.farmerName")}
            value={formData.farmerName || ''}
            onChange={(e) => handleChange('farmerName', e.target.value)}
            error={!!errors.farmerName}
            helperText={errors.farmerName || t("forms.cropInsurance.farmerInfo.farmerNameHelper")}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.cropInsurance.farmerInfo.fatherName")}
            value={formData.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("forms.cropInsurance.farmerInfo.dateOfBirth")}
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

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("common.gender")} *</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label={t("common.gender") + " *"}
            >
              <MenuItem value="Male">{t("common.male")}</MenuItem>
              <MenuItem value="Female">{t("common.female")}</MenuItem>
              <MenuItem value="Other">{t("common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.mobile")}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("forms.cropInsurance.farmerInfo.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.email')}
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t("forms.cropInsurance.farmerInfo.emailHelper")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.aadhaar")}
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || t("forms.cropInsurance.farmerInfo.aadhaarHelper")}
            inputProps={{ maxLength: 12, pattern: '\\d{12}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>{t("common.category")} *</InputLabel>
            <Select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              label={t("common.category") + " *"}
            >
              <MenuItem value="General">{t("common.general")}</MenuItem>
              <MenuItem value="OBC">{t("common.obc")}</MenuItem>
              <MenuItem value="SC">{t("common.sc")}</MenuItem>
              <MenuItem value="ST">{t("common.st")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.cropInsurance.farmerInfo.address")}
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address || t("forms.cropInsurance.farmerInfo.addressHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>{t("common.state")} *</InputLabel>
            <Select
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              label={t("common.state") + " *"}
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
            <InputLabel>{t("common.district")} *</InputLabel>
            <Select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              label={t("common.district") + " *"}
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
            label={t("forms.cropInsurance.farmerInfo.pincode")}
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6, pattern: '\\d{6}' }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Land Details Step
const LandDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [landRecords, setLandRecords] = React.useState(formData.landRecords || []);

  const addLandRecord = () => {
    const newRecord = {
      id: Date.now(),
      surveyNumber: '',
      village: '',
      area: '',
      landType: '',
      irrigationType: ''
    };
    const updatedRecords = [...landRecords, newRecord];
    setLandRecords(updatedRecords);
    updateFormData({ landRecords: updatedRecords });
  };

  const removeLandRecord = (id) => {
    const updatedRecords = landRecords.filter(record => record.id !== id);
    setLandRecords(updatedRecords);
    updateFormData({ landRecords: updatedRecords });
  };

  const updateLandRecord = (id, field, value) => {
    const updatedRecords = landRecords.map(record =>
      record.id === id ? { ...record, [field]: value } : record
    );
    setLandRecords(updatedRecords);
    updateFormData({ landRecords: updatedRecords });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.cropInsurance.landDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.cropInsurance.landDetails.subtitle")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addLandRecord}
          sx={{ mb: 2 }}
        >
          {t("forms.cropInsurance.landDetails.addLandRecord")}
        </Button>

        {landRecords.length === 0 && (
          <Alert severity="info">
            {t("forms.cropInsurance.landDetails.noLandRecords")}
          </Alert>
        )}
      </Box>

      {landRecords.map((record, index) => (
        <Paper key={record.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              {t("forms.cropInsurance.landDetails.landRecord")} {index + 1}
            </Typography>
            <IconButton
              color="error"
              onClick={() => removeLandRecord(record.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.landDetails.surveyNumber")}
                value={record.surveyNumber || ''}
                onChange={(e) => updateLandRecord(record.id, 'surveyNumber', e.target.value)}
                inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\/\\-]{1,20}' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.landDetails.village")}
                value={record.village || ''}
                onChange={(e) => updateLandRecord(record.id, 'village', e.target.value)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.landDetails.area")}
                type="number"
                value={record.area || ''}
                onChange={(e) => updateLandRecord(record.id, 'area', e.target.value)}
                inputProps={{ min: 0.1, max: 9999, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t("forms.cropInsurance.landDetails.landType")}</InputLabel>
                <Select
                  value={record.landType || ''}
                  onChange={(e) => updateLandRecord(record.id, 'landType', e.target.value)}
                  label={t("forms.cropInsurance.landDetails.landType")}
                >
                  <MenuItem value="Irrigated">{t("forms.cropInsurance.landDetails.irrigated")}</MenuItem>
                  <MenuItem value="Rainfed">{t("forms.cropInsurance.landDetails.rainfed")}</MenuItem>
                  <MenuItem value="Semi-irrigated">{t("forms.cropInsurance.landDetails.semiIrrigated")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t("forms.cropInsurance.landDetails.irrigationType")}</InputLabel>
                <Select
                  value={record.irrigationType || ''}
                  onChange={(e) => updateLandRecord(record.id, 'irrigationType', e.target.value)}
                  label={t("forms.cropInsurance.landDetails.irrigationType")}
                >
                  <MenuItem value="Canal">{t("forms.cropInsurance.landDetails.canal")}</MenuItem>
                  <MenuItem value="Borewell">{t("forms.cropInsurance.landDetails.borewell")}</MenuItem>
                  <MenuItem value="Tank">{t("forms.cropInsurance.landDetails.tank")}</MenuItem>
                  <MenuItem value="River">{t("forms.cropInsurance.landDetails.river")}</MenuItem>
                  <MenuItem value="None">{t("forms.cropInsurance.landDetails.none")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {landRecords.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {t("forms.cropInsurance.landDetails.summary")}
          </Typography>
          <Typography variant="body1">
            {t("forms.cropInsurance.landDetails.totalLandRecords")} <strong>{landRecords.length}</strong>
          </Typography>
          <Typography variant="body1">
            {t("forms.cropInsurance.landDetails.totalArea")} <strong>{landRecords.reduce((sum, record) => sum + (parseFloat(record.area) || 0), 0).toFixed(2)} {t("common.acres")}</strong>
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

// Crop Details Step
const CropDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [cropDetails, setCropDetails] = React.useState(formData.cropDetails || []);

  const addCropDetail = () => {
    const newCrop = {
      id: Date.now(),
      cropName: '',
      variety: '',
      sowingDate: null,
      expectedHarvestDate: null,
      areaUnderCrop: '',
      expectedYield: '',
      sumInsured: ''
    };
    const updatedCrops = [...cropDetails, newCrop];
    setCropDetails(updatedCrops);
    updateFormData({ cropDetails: updatedCrops });
  };

  const removeCropDetail = (id) => {
    const updatedCrops = cropDetails.filter(crop => crop.id !== id);
    setCropDetails(updatedCrops);
    updateFormData({ cropDetails: updatedCrops });
  };

  const updateCropDetail = (id, field, value) => {
    const updatedCrops = cropDetails.map(crop =>
      crop.id === id ? { ...crop, [field]: value } : crop
    );
    setCropDetails(updatedCrops);
    updateFormData({ cropDetails: updatedCrops });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.cropInsurance.cropDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.cropInsurance.cropDetails.subtitle")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCropDetail}
          sx={{ mb: 2 }}
        >
          {t("forms.cropInsurance.cropDetails.addCrop")}
        </Button>

        {cropDetails.length === 0 && (
          <Alert severity="info">
            {t("forms.cropInsurance.cropDetails.noCropDetails")}
          </Alert>
        )}
      </Box>

      {cropDetails.map((crop, index) => (
        <Paper key={crop.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              {t("forms.cropInsurance.cropDetails.crop")} {index + 1}
            </Typography>
            <IconButton
              color="error"
              onClick={() => removeCropDetail(crop.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.cropDetails.cropName")}
                value={crop.cropName || ''}
                onChange={(e) => updateCropDetail(crop.id, 'cropName', e.target.value)}
                inputProps={{ maxLength: 30, pattern: '[A-Za-z\\s]{2,30}' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.cropDetails.variety")}
                value={crop.variety || ''}
                onChange={(e) => updateCropDetail(crop.id, 'variety', e.target.value)}
                inputProps={{ maxLength: 30 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("forms.cropInsurance.cropDetails.sowingDate")}
                  value={crop.sowingDate || null}
                  onChange={(date) => updateCropDetail(crop.id, 'sowingDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t("forms.cropInsurance.cropDetails.expectedHarvestDate")}
                  value={crop.expectedHarvestDate || null}
                  onChange={(date) => updateCropDetail(crop.id, 'expectedHarvestDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={crop.sowingDate}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.cropDetails.areaUnderCrop")}
                type="number"
                value={crop.areaUnderCrop || ''}
                onChange={(e) => updateCropDetail(crop.id, 'areaUnderCrop', e.target.value)}
                inputProps={{ min: 0.1, max: 9999, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.cropDetails.expectedYield")}
                type="number"
                value={crop.expectedYield || ''}
                onChange={(e) => updateCropDetail(crop.id, 'expectedYield', e.target.value)}
                inputProps={{ min: 1, max: 99999 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label={t("forms.cropInsurance.cropDetails.sumInsured")}
                type="number"
                value={crop.sumInsured || ''}
                onChange={(e) => updateCropDetail(crop.id, 'sumInsured', e.target.value)}
                inputProps={{ min: 1000, max: 10000000 }}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      {cropDetails.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            {t("forms.cropInsurance.cropDetails.insuranceSummary")}
          </Typography>
          <Typography variant="body1">
            {t("forms.cropInsurance.cropDetails.totalCrops")} <strong>{cropDetails.length}</strong>
          </Typography>
          <Typography variant="body1">
            {t("forms.cropInsurance.landDetails.totalArea")} <strong>{cropDetails.reduce((sum, crop) => sum + (parseFloat(crop.areaUnderCrop) || 0), 0).toFixed(2)} {t("common.acres")}</strong>
          </Typography>
          <Typography variant="body1">
            {t("forms.cropInsurance.cropDetails.totalSumInsured")} <strong>₹{cropDetails.reduce((sum, crop) => sum + (parseFloat(crop.sumInsured) || 0), 0).toLocaleString()}</strong>
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  
  const requiredDocuments = [
    t("forms.cropInsurance.documents.aadhaarCard"),
    t("forms.cropInsurance.documents.landOwnership"),
    t("forms.cropInsurance.documents.surveyRecords"),
    t("forms.cropInsurance.documents.bankDetails"),
    t("forms.cropInsurance.documents.sowingCertificate"),
    t("forms.cropInsurance.documents.harvestRecords"),
    t("forms.cropInsurance.documents.irrigationCertificate"),
    t("forms.cropInsurance.documents.soilHealthCard"),
    t("forms.cropInsurance.documents.cropCuttingReport")
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.cropInsurance.documents.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.cropInsurance.documents.subtitle")}
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
          {t("forms.cropInsurance.documents.requiredDocuments")}
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
const CropInsuranceForm = () => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 'farmer', title: t("forms.cropInsurance.step1"), icon: 'Person' },
    { id: 'land', title: t("forms.cropInsurance.step2"), icon: 'Landscape' },
    { id: 'crop', title: t("forms.cropInsurance.step3"), icon: 'Agriculture' },
    { id: 'documents', title: t("forms.cropInsurance.step4"), icon: 'Description' }
  ];

  const validationRules = {
    // Farmer Information
    farmerName: { type: 'name', required: true },
    fatherName: { type: 'name', required: true },
    dateOfBirth: { type: 'date', required: true },
    gender: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    aadhaar: { type: 'aadhaar', required: true },
    category: { type: 'text', required: true },
    address: { type: 'address', required: true },
    state: { type: 'text', required: true },
    district: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true }
  };

  return (
    <MultiStepForm
      serviceName={t("forms.cropInsurance.title")}
      serviceType="crop_insurance"
      steps={steps}
      validationRules={validationRules}
    >
      <FarmerInformationStep />
      <LandDetailsStep />
      <CropDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default CropInsuranceForm;
