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
import { useLanguage } from '../../i18n/LanguageProvider';

// Personal Information Step
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t('forms.vaccinationCertificate.personalDetails.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.vaccinationCertificate.personalDetails.subtitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.vaccinationCertificate.personalDetails.fullName')}
            value={formData.patientName || ''}
            onChange={(e) => handleChange('patientName', e.target.value)}
            error={!!errors.patientName}
            helperText={errors.patientName || t('forms.common.fullNameHelper')}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.vaccinationCertificate.personalDetails.dateOfBirth')}
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
              label={t('forms.vaccinationCertificate.personalDetails.age')}
              value={`${age} ${t('forms.common.ageYears')}`}
              disabled
              helperText={t('forms.vaccinationCertificate.personalDetails.ageHelper')}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t('forms.vaccinationCertificate.personalDetails.gender')}</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label={t('forms.vaccinationCertificate.personalDetails.gender')}
            >
              <MenuItem value="Male">{t('forms.common.male')}</MenuItem>
              <MenuItem value="Female">{t('forms.common.female')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {age >= 18 && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('forms.vaccinationCertificate.personalDetails.fatherName')}
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
                label={t('forms.vaccinationCertificate.personalDetails.motherName')}
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
                label={t('forms.vaccinationCertificate.personalDetails.fatherName') + ' *'}
                value={formData.fatherName || ''}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                error={!!errors.fatherName}
                helperText={errors.fatherName || t('forms.vaccinationCertificate.personalDetails.fatherNameHelper')}
                inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('forms.vaccinationCertificate.personalDetails.motherName') + ' *'}
                value={formData.motherName || ''}
                onChange={(e) => handleChange('motherName', e.target.value)}
                error={!!errors.motherName}
                helperText={errors.motherName || t('forms.vaccinationCertificate.personalDetails.motherNameHelper')}
                inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.aadhaar')}
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || t('forms.vaccinationCertificate.personalDetails.aadhaarHelper')}
            inputProps={{ maxLength: 12, pattern: '\\d{12}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.mobile')}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t('forms.common.mobileHelper')}
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
            helperText={errors.email || t('forms.vaccinationCertificate.personalDetails.emailHelper')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t('forms.vaccinationCertificate.personalDetails.nationality')}</InputLabel>
            <Select
              value={formData.nationality || 'Indian'}
              onChange={(e) => handleChange('nationality', e.target.value)}
              label={t('forms.vaccinationCertificate.personalDetails.nationality')}
            >
              <MenuItem value="Indian">{t('forms.vaccinationCertificate.personalDetails.indian')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.common.permanentAddress')}
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address || t('forms.common.permanentAddressHelper')}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Vaccination History Step
const VaccinationHistoryStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t('forms.vaccinationCertificate.vaccinationRecords.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.vaccinationCertificate.vaccinationRecords.subtitle')}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addVaccination}
          sx={{ mb: 2 }}
        >
          {t('forms.vaccinationCertificate.vaccinationDetails.addVaccination')}
        </Button>

        {vaccinations.length === 0 && (
          <Alert severity="info">
            {t('forms.vaccinationCertificate.vaccinationDetails.addVaccinationInfo')}
          </Alert>
        )}
      </Box>

      {vaccinations.map((vaccination, index) => (
        <Paper key={vaccination.id} variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              {t('forms.vaccinationCertificate.vaccinationDetails.vaccination')} {index + 1}
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
                <InputLabel>{t('forms.vaccinationCertificate.vaccinationDetails.vaccineName')}</InputLabel>
                <Select
                  value={vaccination.vaccineName || ''}
                  onChange={(e) => updateVaccination(vaccination.id, 'vaccineName', e.target.value)}
                  label={t('forms.vaccinationCertificate.vaccinationDetails.vaccineName')}
                >
                  <MenuItem value="COVID-19 (Covishield)">{t('forms.vaccinationCertificate.vaccines.covidCovishield')}</MenuItem>
                  <MenuItem value="COVID-19 (Covaxin)">{t('forms.vaccinationCertificate.vaccines.covidCovaxin')}</MenuItem>
                  <MenuItem value="COVID-19 (Sputnik V)">{t('forms.vaccinationCertificate.vaccines.covidSputnik')}</MenuItem>
                  <MenuItem value="Hepatitis B">{t('forms.vaccinationCertificate.vaccines.hepatitisB')}</MenuItem>
                  <MenuItem value="Hepatitis A">{t('forms.vaccinationCertificate.vaccines.hepatitisA')}</MenuItem>
                  <MenuItem value="Typhoid">{t('forms.vaccinationCertificate.vaccines.typhoid')}</MenuItem>
                  <MenuItem value="Japanese Encephalitis">{t('forms.vaccinationCertificate.vaccines.japaneseEncephalitis')}</MenuItem>
                  <MenuItem value="Influenza">{t('forms.vaccinationCertificate.vaccines.influenza')}</MenuItem>
                  <MenuItem value="Pneumococcal">{t('forms.vaccinationCertificate.vaccines.pneumococcal')}</MenuItem>
                  <MenuItem value="Meningococcal">{t('forms.vaccinationCertificate.vaccines.meningococcal')}</MenuItem>
                  <MenuItem value="HPV">{t('forms.vaccinationCertificate.vaccines.hpv')}</MenuItem>
                  <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('forms.vaccinationCertificate.vaccinationDetails.manufacturer')}
                value={vaccination.manufacturer || ''}
                onChange={(e) => updateVaccination(vaccination.id, 'manufacturer', e.target.value)}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('forms.vaccinationCertificate.vaccinationDetails.batchNumber')}
                value={vaccination.batchNumber || ''}
                onChange={(e) => updateVaccination(vaccination.id, 'batchNumber', e.target.value)}
                inputProps={{ maxLength: 20 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('forms.vaccinationCertificate.vaccinationDetails.vaccinationDate')}
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
                label={t('forms.vaccinationCertificate.vaccinationDetails.vaccinationCenter')}
                value={vaccination.vaccinationCenter || ''}
                onChange={(e) => updateVaccination(vaccination.id, 'vaccinationCenter', e.target.value)}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('forms.vaccinationCertificate.vaccinationDetails.dose')}</InputLabel>
                <Select
                  value={vaccination.dose || ''}
                  onChange={(e) => updateVaccination(vaccination.id, 'dose', e.target.value)}
                  label={t('forms.vaccinationCertificate.vaccinationDetails.dose')}
                >
                  <MenuItem value="1st Dose">{t('forms.vaccinationCertificate.doses.firstDose')}</MenuItem>
                  <MenuItem value="2nd Dose">{t('forms.vaccinationCertificate.doses.secondDose')}</MenuItem>
                  <MenuItem value="3rd Dose/Booster">{t('forms.vaccinationCertificate.doses.thirdDose')}</MenuItem>
                  <MenuItem value="Single Dose">{t('forms.vaccinationCertificate.doses.singleDose')}</MenuItem>
                  <MenuItem value="Annual">{t('forms.vaccinationCertificate.doses.annual')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('forms.vaccinationCertificate.vaccinationDetails.nextDueDate')}
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
            {t('forms.vaccinationCertificate.vaccinationDetails.summary')}
          </Typography>
          <Typography variant="body1">
            {t('forms.vaccinationCertificate.vaccinationDetails.totalVaccinations')}: <strong>{vaccinations.length}</strong>
          </Typography>
          <Typography variant="body1">
            {t('forms.vaccinationCertificate.vaccinationDetails.lastVaccination')}: <strong>
              {vaccinations.length > 0 ? 
                new Date(Math.max(...vaccinations.map(v => new Date(v.vaccinationDate)))).toLocaleDateString() : 
                t('forms.vaccinationCertificate.vaccinationDetails.none')
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
  const { t } = useLanguage();
  
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.vaccinationCertificate.medicalInfo.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.vaccinationCertificate.medicalInfo.subtitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t('forms.vaccinationCertificate.medicalInfo.hasAllergies')}
          </Typography>
          <RadioGroup
            value={formData.hasAllergies || ''}
            onChange={(e) => handleChange('hasAllergies', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label={t('forms.vaccinationCertificate.medicalInfo.no')} />
            <FormControlLabel value="yes" control={<Radio />} label={t('forms.vaccinationCertificate.medicalInfo.yes')} />
          </RadioGroup>
        </Grid>

        {formData.hasAllergies === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('forms.vaccinationCertificate.medicalInfo.allergyDetails')}
              value={formData.allergyDetails || ''}
              onChange={(e) => handleChange('allergyDetails', e.target.value)}
              error={!!errors.allergyDetails}
              helperText={errors.allergyDetails || t('forms.vaccinationCertificate.medicalInfo.allergyDetailsHelper')}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t('forms.vaccinationCertificate.medicalInfo.hasConditions')}
          </Typography>
          <RadioGroup
            value={formData.hasConditions || ''}
            onChange={(e) => handleChange('hasConditions', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label={t('forms.vaccinationCertificate.medicalInfo.no')} />
            <FormControlLabel value="yes" control={<Radio />} label={t('forms.vaccinationCertificate.medicalInfo.yes')} />
          </RadioGroup>
        </Grid>

        {formData.hasConditions === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('forms.vaccinationCertificate.medicalInfo.medicalConditions')}
              value={formData.medicalConditions || ''}
              onChange={(e) => handleChange('medicalConditions', e.target.value)}
              error={!!errors.medicalConditions}
              helperText={errors.medicalConditions || t('forms.vaccinationCertificate.medicalInfo.medicalConditionsHelper')}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.vaccinationCertificate.medicalInfo.bloodGroup')}
            value={formData.bloodGroup || ''}
            onChange={(e) => handleChange('bloodGroup', e.target.value)}
            helperText={t('forms.vaccinationCertificate.medicalInfo.bloodGroupHelper')}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.vaccinationCertificate.medicalInfo.emergencyContact')}
            value={formData.emergencyContact || ''}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            helperText={t('forms.vaccinationCertificate.medicalInfo.emergencyContactHelper')}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.certificateType}>
            <InputLabel>{t('forms.vaccinationCertificate.medicalInfo.certificateType')}</InputLabel>
            <Select
              value={formData.certificateType || ''}
              onChange={(e) => handleChange('certificateType', e.target.value)}
              label={t('forms.vaccinationCertificate.medicalInfo.certificateType')}
            >
              <MenuItem value="Complete Vaccination Certificate">{t('forms.vaccinationCertificate.certificateTypes.complete')}</MenuItem>
              <MenuItem value="COVID-19 Vaccination Certificate">{t('forms.vaccinationCertificate.certificateTypes.covid19')}</MenuItem>
              <MenuItem value="Travel Vaccination Certificate">{t('forms.vaccinationCertificate.certificateTypes.travel')}</MenuItem>
              <MenuItem value="School/College Vaccination Certificate">{t('forms.vaccinationCertificate.certificateTypes.school')}</MenuItem>
              <MenuItem value="Employment Vaccination Certificate">{t('forms.vaccinationCertificate.certificateTypes.employment')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t('forms.vaccinationCertificate.medicalInfo.certificatePurpose')}
            value={formData.certificatePurpose || ''}
            onChange={(e) => handleChange('certificatePurpose', e.target.value)}
            error={!!errors.certificatePurpose}
            helperText={errors.certificatePurpose || t('forms.vaccinationCertificate.medicalInfo.certificatePurposeHelper')}
            inputProps={{ maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{t('forms.vaccinationCertificate.medicalInfo.noteTitle')}:</strong> {t('forms.vaccinationCertificate.medicalInfo.noteText')}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  
  const requiredDocuments = [
    t('forms.vaccinationCertificate.documents.identityProof'),
    t('forms.vaccinationCertificate.documents.addressProof'),
    t('forms.vaccinationCertificate.documents.vaccinationCards'),
    t('forms.vaccinationCertificate.documents.medicalRecords'),
    t('forms.vaccinationCertificate.documents.passportPhotos'),
    t('forms.vaccinationCertificate.documents.previousCertificates'),
    t('forms.vaccinationCertificate.documents.doctorPrescription'),
    t('forms.vaccinationCertificate.documents.travelDocuments'),
    t('forms.vaccinationCertificate.documents.admissionLetter'),
    t('forms.vaccinationCertificate.documents.employmentLetter')
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.vaccinationCertificate.documents.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.vaccinationCertificate.documents.subtitle')}
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
const VaccinationCertificateForm = () => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 'personal', title: t('forms.vaccinationCertificate.step1'), icon: 'Person' },
    { id: 'vaccination', title: t('forms.vaccinationCertificate.step2'), icon: 'Vaccines' },
    { id: 'medical', title: t('forms.vaccinationCertificate.step3'), icon: 'MedicalServices' },
    { id: 'documents', title: t('forms.vaccinationCertificate.step4'), icon: 'Description' }
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
      serviceName={t('forms.vaccinationCertificate.title')}
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
