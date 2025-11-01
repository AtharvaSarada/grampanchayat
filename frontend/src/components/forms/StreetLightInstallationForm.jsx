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
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';
import { useLanguage } from '../../i18n/LanguageProvider';

// Applicant Information Step
const ApplicantInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'applicantName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'email') {
      correctedValue = autoCorrect.email(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.streetLightInstallation.applicantInfo")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.streetLightInstallation.applicantInfoSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.applicantName")}
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || t("forms.streetLightInstallation.applicantNameHelper")}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.mobile")}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("forms.streetLightInstallation.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.email")}
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t("forms.streetLightInstallation.emailHelper")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.applicantType}>
            <InputLabel>{t("forms.streetLightInstallation.applicantType")}</InputLabel>
            <Select
              value={formData.applicantType || ''}
              onChange={(e) => handleChange('applicantType', e.target.value)}
              label={t("forms.streetLightInstallation.applicantType")}
            >
              <MenuItem value="Individual Resident">{t("forms.streetLightInstallation.individualResident")}</MenuItem>
              <MenuItem value="Resident Association">{t("forms.streetLightInstallation.residentAssociation")}</MenuItem>
              <MenuItem value="Community Group">{t("forms.streetLightInstallation.communityGroup")}</MenuItem>
              <MenuItem value="Local Business">{t("forms.streetLightInstallation.localBusiness")}</MenuItem>
              <MenuItem value="Religious Institution">{t("forms.streetLightInstallation.religiousInstitution")}</MenuItem>
              <MenuItem value="Educational Institution">{t("forms.streetLightInstallation.educationalInstitution")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.streetLightInstallation.applicantAddress")}
            value={formData.applicantAddress || ''}
            onChange={(e) => handleChange('applicantAddress', e.target.value)}
            error={!!errors.applicantAddress}
            helperText={errors.applicantAddress || t("forms.streetLightInstallation.applicantAddressHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.streetLightInstallation.localResidentQuestion")}
          </Typography>
          <RadioGroup
            value={formData.isLocalResident || ''}
            onChange={(e) => handleChange('isLocalResident', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label={t("forms.streetLightInstallation.yes")} />
            <FormControlLabel value="no" control={<Radio />} label={t("forms.streetLightInstallation.no")} />
          </RadioGroup>
        </Grid>

        {formData.isLocalResident === 'no' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label={t("forms.streetLightInstallation.nonResidentReason")}
              value={formData.nonResidentReason || ''}
              onChange={(e) => handleChange('nonResidentReason', e.target.value)}
              error={!!errors.nonResidentReason}
              helperText={errors.nonResidentReason || t("forms.streetLightInstallation.nonResidentReasonHelper")}
              inputProps={{ maxLength: 300 }}
            />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

// Location Details Step
const LocationDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [states] = React.useState(getStates());
  const [districts, setDistricts] = React.useState([]);

  React.useEffect(() => {
    if (formData.state) {
      setDistricts(getDistrictsByState(formData.state));
    }
  }, [formData.state]);

  const handleChange = (field, value) => {
    const updates = { [field]: value };
    
    if (field === 'state') {
      updates.district = '';
      setDistricts(getDistrictsByState(value));
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.streetLightInstallation.locationDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.streetLightInstallation.locationDetailsSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.streetLightInstallation.lightLocation")}
            value={formData.lightLocation || ''}
            onChange={(e) => handleChange('lightLocation', e.target.value)}
            error={!!errors.lightLocation}
            helperText={errors.lightLocation || t("forms.streetLightInstallation.lightLocationHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.streetName")}
            value={formData.streetName || ''}
            onChange={(e) => handleChange('streetName', e.target.value)}
            error={!!errors.streetName}
            helperText={errors.streetName || t("forms.streetLightInstallation.streetNameHelper")}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.landmark")}
            value={formData.landmark || ''}
            onChange={(e) => handleChange('landmark', e.target.value)}
            error={!!errors.landmark}
            helperText={errors.landmark || t("forms.streetLightInstallation.landmarkHelper")}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>{t("forms.streetLightInstallation.state")}</InputLabel>
            <Select
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              label={t("forms.streetLightInstallation.state")}
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
            <InputLabel>{t("forms.streetLightInstallation.district")}</InputLabel>
            <Select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              label={t("forms.streetLightInstallation.district")}
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
            label={t("forms.streetLightInstallation.pincode")}
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6, pattern: '\\d{6}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.wardNumber")}
            value={formData.wardNumber || ''}
            onChange={(e) => handleChange('wardNumber', e.target.value)}
            helperText={t("forms.streetLightInstallation.wardNumberHelper")}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.areaType}>
            <InputLabel>{t("forms.streetLightInstallation.areaType")}</InputLabel>
            <Select
              value={formData.areaType || ''}
              onChange={(e) => handleChange('areaType', e.target.value)}
              label={t("forms.streetLightInstallation.areaType")}
            >
              <MenuItem value="Residential">{t("forms.streetLightInstallation.residential")}</MenuItem>
              <MenuItem value="Commercial">{t("forms.streetLightInstallation.commercial")}</MenuItem>
              <MenuItem value="Industrial">{t("forms.streetLightInstallation.industrial")}</MenuItem>
              <MenuItem value="Mixed">{t("forms.streetLightInstallation.mixed")}</MenuItem>
              <MenuItem value="Rural">{t("forms.streetLightInstallation.rural")}</MenuItem>
              <MenuItem value="Highway">{t("forms.streetLightInstallation.highway")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.streetLightInstallation.gpsCoordinates")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t("forms.streetLightInstallation.latitude")}
                value={formData.latitude || ''}
                onChange={(e) => handleChange('latitude', e.target.value)}
                helperText={t("forms.streetLightInstallation.latitudeHelper")}
                inputProps={{ pattern: '^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t("forms.streetLightInstallation.longitude")}
                value={formData.longitude || ''}
                onChange={(e) => handleChange('longitude', e.target.value)}
                helperText={t("forms.streetLightInstallation.longitudeHelper")}
                inputProps={{ pattern: '^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\\.{1}\\d{1,6}' }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Installation Requirements Step
const InstallationRequirementsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [estimatedCost, setEstimatedCost] = React.useState(0);

  React.useEffect(() => {
    // Calculate estimated cost based on requirements
    let baseCost = 0;
    const lightType = formData.lightType;
    const numberOfLights = parseInt(formData.numberOfLights) || 1;

    switch (lightType) {
      case 'LED':
        baseCost = 8000;
        break;
      case 'Solar LED':
        baseCost = 15000;
        break;
      case 'CFL':
        baseCost = 5000;
        break;
      case 'Sodium Vapor':
        baseCost = 6000;
        break;
      default:
        baseCost = 8000;
    }

    const totalCost = baseCost * numberOfLights;
    const installationCost = totalCost * 0.3; // 30% installation cost
    const finalCost = totalCost + installationCost;

    setEstimatedCost(finalCost);
    updateFormData({ estimatedCost: finalCost });
  }, [formData.lightType, formData.numberOfLights]);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.streetLightInstallation.installationRequirements")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.streetLightInstallation.installationRequirementsSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.lightType}>
            <InputLabel>{t("forms.streetLightInstallation.lightType")}</InputLabel>
            <Select
              value={formData.lightType || ''}
              onChange={(e) => handleChange('lightType', e.target.value)}
              label={t("forms.streetLightInstallation.lightType")}
            >
              <MenuItem value="LED">{t("forms.streetLightInstallation.ledLight")}</MenuItem>
              <MenuItem value="Solar LED">{t("forms.streetLightInstallation.solarLedLight")}</MenuItem>
              <MenuItem value="CFL">{t("forms.streetLightInstallation.cflLight")}</MenuItem>
              <MenuItem value="Sodium Vapor">{t("forms.streetLightInstallation.sodiumVaporLight")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.streetLightInstallation.numberOfLights")}
            type="number"
            value={formData.numberOfLights || ''}
            onChange={(e) => handleChange('numberOfLights', e.target.value)}
            error={!!errors.numberOfLights}
            helperText={errors.numberOfLights || t("forms.streetLightInstallation.numberOfLightsHelper")}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.poleHeight}>
            <InputLabel>{t("forms.streetLightInstallation.poleHeight")}</InputLabel>
            <Select
              value={formData.poleHeight || ''}
              onChange={(e) => handleChange('poleHeight', e.target.value)}
              label={t("forms.streetLightInstallation.poleHeight")}
            >
              <MenuItem value="6 meters">{t("forms.streetLightInstallation.6meters")}</MenuItem>
              <MenuItem value="8 meters">{t("forms.streetLightInstallation.8meters")}</MenuItem>
              <MenuItem value="10 meters">{t("forms.streetLightInstallation.10meters")}</MenuItem>
              <MenuItem value="12 meters">{t("forms.streetLightInstallation.12meters")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.wattage}>
            <InputLabel>{t("forms.streetLightInstallation.wattage")}</InputLabel>
            <Select
              value={formData.wattage || ''}
              onChange={(e) => handleChange('wattage', e.target.value)}
              label={t("forms.streetLightInstallation.wattage")}
            >
              <MenuItem value="40W">{t("forms.streetLightInstallation.40watts")}</MenuItem>
              <MenuItem value="60W">{t("forms.streetLightInstallation.60watts")}</MenuItem>
              <MenuItem value="100W">{t("forms.streetLightInstallation.100watts")}</MenuItem>
              <MenuItem value="150W">{t("forms.streetLightInstallation.150watts")}</MenuItem>
              <MenuItem value="200W">{t("forms.streetLightInstallation.200watts")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.streetLightInstallation.electricityAvailableQuestion")}
          </Typography>
          <RadioGroup
            value={formData.electricityAvailable || ''}
            onChange={(e) => handleChange('electricityAvailable', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label={t("forms.streetLightInstallation.yes")} />
            <FormControlLabel value="no" control={<Radio />} label={t("forms.streetLightInstallation.no")} />
            <FormControlLabel value="partial" control={<Radio />} label={t("forms.streetLightInstallation.partial")} />
          </RadioGroup>
        </Grid>

        {formData.electricityAvailable === 'no' && (
          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>{t("forms.domicileCertificate.noteTitle")}</strong> {t("forms.streetLightInstallation.electricityNotAvailableNote")}
              </Typography>
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.streetLightInstallation.priorityLevel")}
          </Typography>
          <RadioGroup
            value={formData.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
            row
          >
            <FormControlLabel value="High" control={<Radio />} label={t("forms.streetLightInstallation.highPriority")} />
            <FormControlLabel value="Medium" control={<Radio />} label={t("forms.streetLightInstallation.mediumPriority")} />
            <FormControlLabel value="Low" control={<Radio />} label={t("forms.streetLightInstallation.lowPriority")} />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t("forms.streetLightInstallation.justification")}
            value={formData.justification || ''}
            onChange={(e) => handleChange('justification', e.target.value)}
            error={!!errors.justification}
            helperText={errors.justification || t("forms.streetLightInstallation.justificationHelper")}
            inputProps={{ minLength: 20, maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("forms.streetLightInstallation.preferredDate")}
              value={formData.preferredDate || null}
              onChange={(date) => handleChange('preferredDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText={t("forms.streetLightInstallation.preferredDateHelper")}
                />
              )}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
            <Typography variant="h6" color="info.main" gutterBottom>
              {t("forms.streetLightInstallation.estimatedCostBreakdown")}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>{t("forms.streetLightInstallation.equipmentCost")}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{((estimatedCost / 1.3) || 0).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.streetLightInstallation.installationCost")}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{((estimatedCost * 0.3) || 0).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="info.main">{t("forms.streetLightInstallation.totalEstimatedCost")}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="info.main" align="right">
                  ₹{estimatedCost.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {t("forms.streetLightInstallation.costDisclaimer")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  const requiredDocuments = [
    t("forms.streetLightInstallation.identityProof"),
    t("forms.streetLightInstallation.addressProof"),
    t("forms.streetLightInstallation.locationPhotographs"),
    t("forms.streetLightInstallation.siteSketch"),
    t("forms.streetLightInstallation.residentAssociationApproval"),
    t("forms.streetLightInstallation.propertyOwnershipProof"),
    t("forms.streetLightInstallation.electricityBill"),
    t("forms.streetLightInstallation.supportLetters"),
    t("forms.streetLightInstallation.previousCorrespondence"),
    t("forms.streetLightInstallation.safetyAssessment")
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.streetLightInstallation.documentUpload")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.streetLightInstallation.documentUploadSubtitle")}
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
          {t("forms.streetLightInstallation.requiredDocuments")}
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
const StreetLightInstallationForm = () => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 'applicant', title: t("forms.streetLightInstallation.step1"), icon: 'Person' },
    { id: 'location', title: t("forms.streetLightInstallation.step2"), icon: 'LocationOn' },
    { id: 'requirements', title: t("forms.streetLightInstallation.step3"), icon: 'Lightbulb' },
    { id: 'documents', title: t("forms.streetLightInstallation.step4"), icon: 'Description' }
  ];

  const validationRules = {
    // Applicant Information
    applicantName: { type: 'name', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    applicantType: { type: 'text', required: true },
    applicantAddress: { type: 'address', required: true },
    isLocalResident: { type: 'text', required: true },
    
    // Location Details
    lightLocation: { type: 'address', required: true },
    streetName: { type: 'text', required: true },
    landmark: { type: 'text', required: true },
    state: { type: 'text', required: true },
    district: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true },
    areaType: { type: 'text', required: true },
    
    // Installation Requirements
    lightType: { type: 'text', required: true },
    numberOfLights: { type: 'number', required: true },
    poleHeight: { type: 'text', required: true },
    wattage: { type: 'text', required: true },
    electricityAvailable: { type: 'text', required: true },
    priority: { type: 'text', required: true },
    justification: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName={t("forms.streetLightInstallation.title")}
      serviceType="street_light_installation"
      steps={steps}
      validationRules={validationRules}
    >
      <ApplicantInformationStep />
      <LocationDetailsStep />
      <InstallationRequirementsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default StreetLightInstallationForm;
