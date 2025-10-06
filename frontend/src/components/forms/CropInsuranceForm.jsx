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

// Farmer Information Step
const FarmerInformationStep = ({ formData, updateFormData, errors }) => {
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
        Farmer Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your personal details as the primary farmer
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Farmer Name *"
            value={formData.farmerName || ''}
            onChange={(e) => handleChange('farmerName', e.target.value)}
            error={!!errors.farmerName}
            helperText={errors.farmerName || 'Full name as per Aadhaar'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's/Husband's Name *"
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
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              label="Category *"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="OBC">OBC</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="ST">ST</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Address *"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address || 'Complete residential address'}
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
      </Grid>
    </Paper>
  );
};

// Land Details Step
const LandDetailsStep = ({ formData, updateFormData, errors }) => {
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
        Land Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add details of all land holdings for crop insurance
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addLandRecord}
          sx={{ mb: 2 }}
        >
          Add Land Record
        </Button>

        {landRecords.length === 0 && (
          <Alert severity="info">
            Please add at least one land record to proceed with crop insurance application.
          </Alert>
        )}
      </Box>

      {landRecords.map((record, index) => (
        <Paper key={record.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              Land Record {index + 1}
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
                label="Survey Number *"
                value={record.surveyNumber || ''}
                onChange={(e) => updateLandRecord(record.id, 'surveyNumber', e.target.value)}
                inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\/\\-]{1,20}' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Village *"
                value={record.village || ''}
                onChange={(e) => updateLandRecord(record.id, 'village', e.target.value)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Area (Acres) *"
                type="number"
                value={record.area || ''}
                onChange={(e) => updateLandRecord(record.id, 'area', e.target.value)}
                inputProps={{ min: 0.1, max: 9999, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Land Type *</InputLabel>
                <Select
                  value={record.landType || ''}
                  onChange={(e) => updateLandRecord(record.id, 'landType', e.target.value)}
                  label="Land Type *"
                >
                  <MenuItem value="Irrigated">Irrigated</MenuItem>
                  <MenuItem value="Rainfed">Rainfed</MenuItem>
                  <MenuItem value="Semi-irrigated">Semi-irrigated</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Irrigation Type</InputLabel>
                <Select
                  value={record.irrigationType || ''}
                  onChange={(e) => updateLandRecord(record.id, 'irrigationType', e.target.value)}
                  label="Irrigation Type"
                >
                  <MenuItem value="Canal">Canal</MenuItem>
                  <MenuItem value="Borewell">Borewell</MenuItem>
                  <MenuItem value="Tank">Tank</MenuItem>
                  <MenuItem value="River">River</MenuItem>
                  <MenuItem value="None">None (Rainfed)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {landRecords.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1">
            Total Land Records: <strong>{landRecords.length}</strong>
          </Typography>
          <Typography variant="body1">
            Total Area: <strong>{landRecords.reduce((sum, record) => sum + (parseFloat(record.area) || 0), 0).toFixed(2)} Acres</strong>
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

// Crop Details Step
const CropDetailsStep = ({ formData, updateFormData, errors }) => {
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
        Crop Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add details of crops to be insured
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCropDetail}
          sx={{ mb: 2 }}
        >
          Add Crop
        </Button>

        {cropDetails.length === 0 && (
          <Alert severity="info">
            Please add at least one crop detail to proceed with insurance application.
          </Alert>
        )}
      </Box>

      {cropDetails.map((crop, index) => (
        <Paper key={crop.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              Crop {index + 1}
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
                label="Crop Name *"
                value={crop.cropName || ''}
                onChange={(e) => updateCropDetail(crop.id, 'cropName', e.target.value)}
                inputProps={{ maxLength: 30, pattern: '[A-Za-z\\s]{2,30}' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Variety"
                value={crop.variety || ''}
                onChange={(e) => updateCropDetail(crop.id, 'variety', e.target.value)}
                inputProps={{ maxLength: 30 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Sowing Date *"
                  value={crop.sowingDate || null}
                  onChange={(date) => updateCropDetail(crop.id, 'sowingDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expected Harvest Date *"
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
                label="Area Under Crop (Acres) *"
                type="number"
                value={crop.areaUnderCrop || ''}
                onChange={(e) => updateCropDetail(crop.id, 'areaUnderCrop', e.target.value)}
                inputProps={{ min: 0.1, max: 9999, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Expected Yield (Quintals) *"
                type="number"
                value={crop.expectedYield || ''}
                onChange={(e) => updateCropDetail(crop.id, 'expectedYield', e.target.value)}
                inputProps={{ min: 1, max: 99999 }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sum Insured (₹) *"
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
            Insurance Summary
          </Typography>
          <Typography variant="body1">
            Total Crops: <strong>{cropDetails.length}</strong>
          </Typography>
          <Typography variant="body1">
            Total Area: <strong>{cropDetails.reduce((sum, crop) => sum + (parseFloat(crop.areaUnderCrop) || 0), 0).toFixed(2)} Acres</strong>
          </Typography>
          <Typography variant="body1">
            Total Sum Insured: <strong>₹{cropDetails.reduce((sum, crop) => sum + (parseFloat(crop.sumInsured) || 0), 0).toLocaleString()}</strong>
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Aadhaar Card of farmer',
    'Land ownership documents (Patta/Title deed)',
    'Survey settlement records',
    'Bank account details/Passbook',
    'Crop sowing certificate',
    'Previous year harvest records',
    'Irrigation source certificate',
    'Soil health card (if available)',
    'Crop cutting experiment report (if available)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for crop insurance application
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
const CropInsuranceForm = () => {
  const steps = [
    { id: 'farmer', title: 'Farmer Information', icon: 'Person' },
    { id: 'land', title: 'Land Details', icon: 'Landscape' },
    { id: 'crop', title: 'Crop Details', icon: 'Agriculture' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
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
      serviceName="Crop Insurance Application"
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
