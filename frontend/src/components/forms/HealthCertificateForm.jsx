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
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { useLanguage } from '../../i18n/LanguageProvider';

const HealthCertificateForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    // Personal Information
    applicantName: "",
    fatherName: "",
    dateOfBirth: null,
    age: "",
    gender: "",
    mobile: "",
    email: "",
    aadhaar: "",

    // Address Information
    address: "",
    village: "",
    district: "",
    state: "Your State",
    pincode: "",

    // Health Information
    purpose: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    bloodGroup: "",
    height: "",
    weight: "",

    // Medical Conditions
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    asthma: false,
    tuberculosis: false,
    hepatitis: false,
    hiv: false,
    otherConditions: "",

    // Physical Fitness
    physicalDisability: false,
    disabilityDetails: "",
    mentalHealth: "Good",

    // Documents
    documents: [],
  });

  const steps = [
    { id: "personal", title: t('forms.healthCertificate.step1') },
    { id: "health", title: t('forms.healthCertificate.step2') },
    { id: "medical", title: t('forms.healthCertificate.step3') },
    { id: "documents", title: t('forms.healthCertificate.step4') },
  ];

  const validationRules = {
    applicantName: {
      required: true,
      pattern: /^[A-Za-z\s']{2,50}$/,
      message: "Enter valid applicant name",
    },
    fatherName: {
      required: true,
      pattern: /^[A-Za-z\s']{2,50}$/,
      message: "Enter valid father name",
    },
    dateOfBirth: { required: true, message: "Date of birth is required" },
    gender: { required: true, message: "Gender is required" },
    mobile: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: "Enter valid 10-digit mobile number",
    },
    aadhaar: {
      required: true,
      pattern: /^\d{12}$/,
      message: "Enter valid 12-digit Aadhaar number",
    },
    address: { required: true, message: "Address is required" },
    village: { required: true, message: "Village is required" },
    district: { required: true, message: "District is required" },
    pincode: {
      required: true,
      pattern: /^\d{6}$/,
      message: "Enter valid 6-digit PIN code",
    },
    purpose: { required: true, message: "Purpose is required" },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter valid email address",
    },
  };

  const purposes = [
    { value: "employment", label: t('forms.healthCertificate.purposeInfo.employment') },
    { value: "visa", label: t('forms.healthCertificate.purposeInfo.visa') },
    { value: "education", label: t('forms.healthCertificate.purposeInfo.education') },
    { value: "sports", label: t('forms.healthCertificate.purposeInfo.sports') },
    { value: "marriage", label: t('forms.healthCertificate.purposeInfo.marriage') },
    { value: "insurance", label: t('forms.healthCertificate.purposeInfo.insurance') },
    { value: "government", label: t('forms.healthCertificate.purposeInfo.government') },
    { value: "driving", label: t('forms.healthCertificate.purposeInfo.driving') },
    { value: "other", label: t('forms.healthCertificate.purposeInfo.other') },
  ];

  const bloodGroups = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "Unknown",
  ];

  const mentalHealthOptions = ["Excellent", "Good", "Fair", "Poor"];

  const PersonalInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.healthCertificate.personalInfo.title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.personalInfo.fullName')}
            value={formData.applicantName || ""}
            onChange={(e) => updateFormData({ applicantName: e.target.value })}
            error={!!errors.applicantName}
            helperText={errors.applicantName}
            placeholder={t('forms.healthCertificate.personalInfo.fullNameHelper')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.personalInfo.fatherName')}
            value={formData.fatherName || ""}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.healthCertificate.personalInfo.dateOfBirth')}
              value={formData.dateOfBirth}
              onChange={(date) => {
                updateFormData({ dateOfBirth: date });
                if (date) {
                  const age = new Date().getFullYear() - date.getFullYear();
                  updateFormData({ age: age.toString() });
                }
              }}
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
          <TextField
            fullWidth
            label={t('forms.healthCertificate.personalInfo.age')}
            type="number"
            value={formData.age || ""}
            onChange={(e) => updateFormData({ age: e.target.value })}
            inputProps={{ min: 0, max: 120 }}
            helperText={t('forms.healthCertificate.personalInfo.ageHelper')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t('forms.healthCertificate.personalInfo.gender')}</InputLabel>
            <Select
              value={formData.gender || ""}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              label={t('forms.healthCertificate.personalInfo.gender')}
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
            value={formData.mobile || ""}
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
            value={formData.email || ""}
            onChange={(e) =>
              updateFormData({ email: e.target.value.toLowerCase() })
            }
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.aadhaar')}
            value={formData.aadhaar || ""}
            onChange={(e) => updateFormData({ aadhaar: e.target.value })}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.common.address')}
            multiline
            rows={3}
            value={formData.address || ""}
            onChange={(e) => updateFormData({ address: e.target.value })}
            error={!!errors.address}
            helperText={errors.address}
            placeholder={t('forms.common.permanentAddressHelper')}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t('forms.common.city')}
            value={formData.village || ""}
            onChange={(e) => updateFormData({ village: e.target.value })}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t('forms.common.district')}
            value={formData.district || ""}
            onChange={(e) => updateFormData({ district: e.target.value })}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t('forms.common.pincode')}
            value={formData.pincode || ""}
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const HealthInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.healthCertificate.healthDetails.title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.purpose}>
            <InputLabel>{t('forms.healthCertificate.purposeInfo.purposeOfCertificate')}</InputLabel>
            <Select
              value={formData.purpose || ""}
              onChange={(e) => updateFormData({ purpose: e.target.value })}
              label={t('forms.healthCertificate.purposeInfo.purposeOfCertificate')}
            >
              {purposes.map((purpose) => (
                <MenuItem key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </MenuItem>
              ))}
            </Select>
            {errors.purpose && (
              <FormHelperText>{errors.purpose}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t('forms.healthCertificate.personalInfo.bloodGroup')}</InputLabel>
            <Select
              value={formData.bloodGroup || ""}
              onChange={(e) => updateFormData({ bloodGroup: e.target.value })}
              label={t('forms.healthCertificate.personalInfo.bloodGroup')}
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.healthDetails.height')}
            type="number"
            value={formData.height || ""}
            onChange={(e) => updateFormData({ height: e.target.value })}
            inputProps={{ min: 50, max: 250 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.healthDetails.weight')}
            type="number"
            value={formData.weight || ""}
            onChange={(e) => updateFormData({ weight: e.target.value })}
            inputProps={{ min: 10, max: 300, step: 0.1 }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.healthDetails.surgicalHistory')}
            multiline
            rows={3}
            value={formData.medicalHistory || ""}
            onChange={(e) => updateFormData({ medicalHistory: e.target.value })}
            placeholder="कोणत्याही मागील शस्त्रक्रिया, मोठे आजार, रुग्णालयात दाखल"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.healthDetails.currentMedication')}
            multiline
            rows={2}
            value={formData.currentMedications || ""}
            onChange={(e) =>
              updateFormData({ currentMedications: e.target.value })
            }
            placeholder="सध्या घेत असलेली कोणतीही औषधे सूचीबद्ध करा"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.healthDetails.allergies')}
            multiline
            rows={2}
            value={formData.allergies || ""}
            onChange={(e) => updateFormData({ allergies: e.target.value })}
            placeholder="अन्न, औषध किंवा पर्यावरणीय ऍलर्जी"
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const MedicalHistoryStep = ({ formData, updateFormData }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.healthCertificate.purposeInfo.title')}
      </Typography>

      <Typography variant="subtitle1" sx={{ mt: 2, mb: 2, fontWeight: "bold" }}>
        {t('forms.healthCertificate.healthDetails.chronicDiseases')}
      </Typography>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.diabetes || false}
                  onChange={(e) =>
                    updateFormData({ diabetes: e.target.checked })
                  }
                />
              }
              label={t('forms.healthCertificate.healthDetails.diabetes')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hypertension || false}
                  onChange={(e) =>
                    updateFormData({ hypertension: e.target.checked })
                  }
                />
              }
              label={t('forms.healthCertificate.healthDetails.hypertension')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.heartDisease || false}
                  onChange={(e) =>
                    updateFormData({ heartDisease: e.target.checked })
                  }
                />
              }
              label={t('forms.healthCertificate.healthDetails.heartDisease')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.asthma || false}
                  onChange={(e) => updateFormData({ asthma: e.target.checked })}
                />
              }
              label={t('forms.healthCertificate.healthDetails.asthma')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.tuberculosis || false}
                  onChange={(e) =>
                    updateFormData({ tuberculosis: e.target.checked })
                  }
                />
              }
              label={t('forms.healthCertificate.healthDetails.tuberculosis')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hepatitis || false}
                  onChange={(e) =>
                    updateFormData({ hepatitis: e.target.checked })
                  }
                />
              }
              label={t('forms.healthCertificate.healthDetails.hepatitis')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.hiv || false}
                  onChange={(e) => updateFormData({ hiv: e.target.checked })}
                />
              }
              label={t('forms.healthCertificate.healthDetails.hiv')}
            />
          </Grid>
        </Grid>
      </FormGroup>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.healthCertificate.healthDetails.otherDiseases')}
            multiline
            rows={2}
            value={formData.otherConditions || ""}
            onChange={(e) =>
              updateFormData({ otherConditions: e.target.value })
            }
            placeholder="वर सूचीबद्ध नसलेली कोणतीही इतर वैद्यकीय परिस्थिती"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.physicalDisability || false}
                onChange={(e) =>
                  updateFormData({ physicalDisability: e.target.checked })
                }
              />
            }
            label={t('forms.healthCertificate.healthDetails.physicalDisability')}
          />
        </Grid>
        {formData.physicalDisability && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('forms.healthCertificate.healthDetails.disabilityDetails')}
              value={formData.disabilityDetails || ""}
              onChange={(e) =>
                updateFormData({ disabilityDetails: e.target.value })
              }
              placeholder={t('forms.healthCertificate.healthDetails.disabilityDetailsHelper')}
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t('forms.healthCertificate.healthDetails.mentalHealth')}</InputLabel>
            <Select
              value={formData.mentalHealth || "Good"}
              onChange={(e) => updateFormData({ mentalHealth: e.target.value })}
              label={t('forms.healthCertificate.healthDetails.mentalHealth')}
            >
              {mentalHealthOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );

  const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.healthCertificate.documents.title')}
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        {t('forms.healthCertificate.documents.uploadInfo')}
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t('forms.common.requiredDocuments')}:
        </Typography>
        <ul>
          <li>{t('forms.healthCertificate.documents.aadhaarCard')}</li>
          <li>{t('forms.healthCertificate.documents.medicalReports')}</li>
          <li>{t('forms.healthCertificate.documents.previousHealthCertificates')}</li>
          <li>{t('forms.healthCertificate.documents.prescriptionDocuments')}</li>
          <li>{t('forms.healthCertificate.documents.passportPhotos')}</li>
        </ul>
      </Box>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={6}
        acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />
    </Paper>
  );

  return (
    <MultiStepForm
      serviceName={t('forms.healthCertificate.title')}
      serviceType="health-certificate"
      steps={steps}
      validationRules={validationRules}
      initialData={formData}
    >
      <PersonalInformationStep />
      <HealthInformationStep />
      <MedicalHistoryStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default HealthCertificateForm;
