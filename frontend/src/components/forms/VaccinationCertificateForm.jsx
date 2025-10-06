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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
    
    if (field === 'patientName' || field === 'fatherName' || field === 'motherName') {
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
        Enter patient's personal details for vaccination certificate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Patient Name *"
            value={formData.patientName || ''}
            onChange={(e) => handleChange('patientName', e.target.value)}
            error={!!errors.patientName}
            helperText={errors.patientName || 'Full name as per ID proof'}
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

        {age >= 18 && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name"
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
                label="Mother's Name"
                value={formData.motherName || ''}
                onChange={(e) => handleChange('motherName', e.target.value)}
                error={!!errors.motherName}
                helperText={errors.motherName}
                inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
              />
            </Grid>
          </>
        )}

        {age < 18 && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Father's Name *"
                value={formData.fatherName || ''}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                error={!!errors.fatherName}
                helperText={errors.fatherName || 'Required for minors'}
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
                helperText={errors.motherName || 'Required for minors'}
                inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || '12-digit Aadhaar number (if available)'}
            inputProps={{ maxLength: 12, pattern: '\\d{12}' }}
          />
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
          <FormControl fullWidth>
            <InputLabel>Nationality</InputLabel>
            <Select
              value={formData.nationality || 'Indian'}
              onChange={(e) => handleChange('nationality', e.target.value)}
              label="Nationality"
            >
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
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
      </Grid>
    </Paper>
  );
};

// Vaccination History Step
const VaccinationHistoryStep = ({ formData, updateFormData, errors }) => {
  const [vaccinations, setVaccinations] = React.useState(formData.vaccinations || []);

  const addVaccination = () => {
    const newVaccination = {
      id: Date.now(),
      vaccineName: '',
      manufacturer: '',
      batchNumber: '',
      vaccinationDate: null,
      vaccinationCenter: '',
      dose: '',
      nextDueDate: null
    };
    const updatedVaccinations = [...vaccinations, newVaccination];
    setVaccinations(updatedVaccinations);
    updateFormData({ vaccinations: updatedVaccinations });
  };

  const removeVaccination = (id) => {
    const updatedVaccinations = vaccinations.filter(vaccination => vaccination.id !== id);
    setVaccinations(updatedVaccinations);
    updateFormData({ vaccinations: updatedVaccinations });
  };

  const updateVaccination = (id, field, value) => {
    const updatedVaccinations = vaccinations.map(vaccination =>
      vaccination.id === id ? { ...vaccination, [field]: value } : vaccination
    );
    setVaccinations(updatedVaccinations);
    updateFormData({ vaccinations: updatedVaccinations });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Vaccination History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add details of all vaccinations received
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addVaccination}
          sx={{ mb: 2 }}
        >
          Add Vaccination Record
        </Button>

        {vaccinations.length === 0 && (
          <Alert severity="info">
            Please add at least one vaccination record to proceed with certificate application.
          </Alert>
        )}
      </Box>

      {vaccinations.map((vaccination, index) => (
        <Paper key={vaccination.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              Vaccination {index + 1}
            </Typography>
            <IconButton
              color="error"
              onClick={() => removeVaccination(vaccination.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Vaccine Name *</InputLabel>
                <Select
                  value={vaccination.vaccineName || ''}
                  onChange={(e) => updateVaccination(vaccination.id, 'vaccineName', e.target.value)}
                  label="Vaccine Name *"
                >
                  <MenuItem value="COVID-19 (Covishield)">COVID-19 (Covishield)</MenuItem>
                  <MenuItem value="COVID-19 (Covaxin)">COVID-19 (Covaxin)</MenuItem>
                  <MenuItem value="COVID-19 (Sputnik V)">COVID-19 (Sputnik V)</MenuItem>
                  <MenuItem value="Hepatitis B">Hepatitis B</MenuItem>
                  <MenuItem value="Hepatitis A">Hepatitis A</MenuItem>
                  <MenuItem value="Typhoid">Typhoid</MenuItem>
                  <MenuItem value="Japanese Encephalitis">Japanese Encephalitis</MenuItem>
                  <MenuItem value="Influenza">Influenza (Flu)</MenuItem>
                  <MenuItem value="Pneumococcal">Pneumococcal</MenuItem>
                  <MenuItem value="Meningococcal">Meningococcal</MenuItem>
                  <MenuItem value="HPV">HPV (Human Papillomavirus)</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Manufacturer"
                value={vaccination.manufacturer || ''}
                onChange={(e) => updateVaccination(vaccination.id, 'manufacturer', e.target.value)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Batch Number"
                value={vaccination.batchNumber || ''}
                onChange={(e) => updateVaccination(vaccination.id, 'batchNumber', e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Vaccination Date *"
                  value={vaccination.vaccinationDate || null}
                  onChange={(date) => updateVaccination(vaccination.id, 'vaccinationDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  maxDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vaccination Center *"
                value={vaccination.vaccinationCenter || ''}
                onChange={(e) => updateVaccination(vaccination.id, 'vaccinationCenter', e.target.value)}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Dose</InputLabel>
                <Select
                  value={vaccination.dose || ''}
                  onChange={(e) => updateVaccination(vaccination.id, 'dose', e.target.value)}
                  label="Dose"
                >
                  <MenuItem value="1st Dose">1st Dose</MenuItem>
                  <MenuItem value="2nd Dose">2nd Dose</MenuItem>
                  <MenuItem value="3rd Dose/Booster">3rd Dose/Booster</MenuItem>
                  <MenuItem value="Single Dose">Single Dose</MenuItem>
                  <MenuItem value="Annual">Annual</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Next Due Date"
                  value={vaccination.nextDueDate || null}
                  onChange={(date) => updateVaccination(vaccination.id, 'nextDueDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={vaccination.vaccinationDate}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>
      ))}

      {vaccinations.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
          <Typography variant="h6" color="success.main" gutterBottom>
            Vaccination Summary
          </Typography>
          <Typography variant="body1">
            Total Vaccinations: <strong>{vaccinations.length}</strong>
          </Typography>
          <Typography variant="body1">
            Latest Vaccination: <strong>
              {vaccinations.length > 0 ? 
                new Date(Math.max(...vaccinations.map(v => new Date(v.vaccinationDate)))).toLocaleDateString() : 
                'None'
              }
            </strong>
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

// Medical Information Step
const MedicalInformationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Medical Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide relevant medical information for vaccination certificate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Do you have any known allergies to vaccines? *
          </Typography>
          <RadioGroup
            value={formData.hasAllergies || ''}
            onChange={(e) => handleChange('hasAllergies', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        {formData.hasAllergies === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Allergy Details *"
              value={formData.allergyDetails || ''}
              onChange={(e) => handleChange('allergyDetails', e.target.value)}
              error={!!errors.allergyDetails}
              helperText={errors.allergyDetails || 'Describe your vaccine allergies'}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Do you have any chronic medical conditions? *
          </Typography>
          <RadioGroup
            value={formData.hasConditions || ''}
            onChange={(e) => handleChange('hasConditions', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        {formData.hasConditions === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Medical Conditions *"
              value={formData.medicalConditions || ''}
              onChange={(e) => handleChange('medicalConditions', e.target.value)}
              error={!!errors.medicalConditions}
              helperText={errors.medicalConditions || 'List your chronic medical conditions'}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Blood Group"
            value={formData.bloodGroup || ''}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            helperText="Optional blood group information"
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Emergency Contact Number"
            value={formData.emergencyContact || ''}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            helperText="Emergency contact mobile number"
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.certificateType}>
            <InputLabel>Certificate Type *</InputLabel>
            <Select
              value={formData.certificateType || ''}
              onChange={(e) => handleChange('certificateType', e.target.value)}
              label="Certificate Type *"
            >
              <MenuItem value="Complete Vaccination Certificate">Complete Vaccination Certificate</MenuItem>
              <MenuItem value="COVID-19 Vaccination Certificate">COVID-19 Vaccination Certificate</MenuItem>
              <MenuItem value="Travel Vaccination Certificate">Travel Vaccination Certificate</MenuItem>
              <MenuItem value="School/College Vaccination Certificate">School/College Vaccination Certificate</MenuItem>
              <MenuItem value="Employment Vaccination Certificate">Employment Vaccination Certificate</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Purpose of Certificate *"
            value={formData.certificatePurpose || ''}
            onChange={(e) => handleChange('certificatePurpose', e.target.value)}
            error={!!errors.certificatePurpose}
            helperText={errors.certificatePurpose || 'Specify why you need this certificate'}
            inputProps={{ maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> This vaccination certificate will be issued based on the vaccination records 
              provided and verified through official health databases. Please ensure all information is accurate 
              and complete.
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
    'Identity proof (Aadhaar/Passport/Driving License)',
    'Address proof',
    'Vaccination cards/certificates',
    'Medical records (if applicable)',
    'Passport size photographs',
    'Previous vaccination certificates',
    'Doctor prescription (if applicable)',
    'Travel documents (for travel certificate)',
    'School/College admission letter (if applicable)',
    'Employment letter (if applicable)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for vaccination certificate
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
const VaccinationCertificateForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Information', icon: 'Person' },
    { id: 'vaccination', title: 'Vaccination History', icon: 'Vaccines' },
    { id: 'medical', title: 'Medical Information', icon: 'MedicalServices' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Personal Information
    patientName: { type: 'name', required: true },
    dateOfBirth: { type: 'date', required: true },
    gender: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    address: { type: 'address', required: true },
    
    // Medical Information
    hasAllergies: { type: 'text', required: true },
    hasConditions: { type: 'text', required: true },
    certificateType: { type: 'text', required: true },
    certificatePurpose: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Vaccination Certificate Application"
      serviceType="vaccination_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <VaccinationHistoryStep />
      <MedicalInformationStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default VaccinationCertificateForm;
