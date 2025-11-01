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
    
    if (field === 'applicantName' || field === 'ownerName') {
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
        {t("forms.drainageConnection.applicantInfo")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.drainageConnection.applicantInfoSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.applicantName")}
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || t("forms.drainageConnection.applicantNameHelper")}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.ownerName")}
            value={formData.ownerName || ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName || t("forms.drainageConnection.ownerNameHelper")}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.mobile")}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("forms.drainageConnection.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.email")}
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t("forms.drainageConnection.emailHelper")}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.drainageConnection.applicantAddress")}
            value={formData.applicantAddress || ''}
            onChange={(e) => handleChange('applicantAddress', e.target.value)}
            error={!!errors.applicantAddress}
            helperText={errors.applicantAddress || t("forms.drainageConnection.applicantAddressHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.drainageConnection.relationshipToProperty")}
          </Typography>
          <RadioGroup
            value={formData.relationship || ''}
            onChange={(e) => handleChange('relationship', e.target.value)}
            row
          >
            <FormControlLabel value="Owner" control={<Radio />} label={t("forms.drainageConnection.owner")} />
            <FormControlLabel value="Tenant" control={<Radio />} label={t("forms.drainageConnection.tenant")} />
            <FormControlLabel value="Authorized Representative" control={<Radio />} label={t("forms.drainageConnection.authorizedRepresentative")} />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Property Details Step
const PropertyDetailsStep = ({ formData, updateFormData, errors }) => {
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
    
    if (field === 'propertyId') {
      correctedValue = value.toUpperCase();
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
        {t("forms.drainageConnection.propertyDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.drainageConnection.propertyDetailsSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.propertyId")}
            value={formData.propertyId || ''}
            onChange={(e) => handleChange('propertyId', e.target.value)}
            error={!!errors.propertyId}
            helperText={errors.propertyId || t("forms.drainageConnection.propertyIdHelper")}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.propertyType}>
            <InputLabel>{t("forms.drainageConnection.propertyType")}</InputLabel>
            <Select
              value={formData.propertyType || ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              label={t("forms.drainageConnection.propertyType")}
            >
              <MenuItem value="Residential">{t("forms.drainageConnection.residential")}</MenuItem>
              <MenuItem value="Commercial">{t("forms.drainageConnection.commercial")}</MenuItem>
              <MenuItem value="Industrial">{t("forms.drainageConnection.industrial")}</MenuItem>
              <MenuItem value="Mixed Use">{t("forms.drainageConnection.mixedUse")}</MenuItem>
              <MenuItem value="Institutional">{t("forms.drainageConnection.institutional")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.drainageConnection.propertyAddress")}
            value={formData.propertyAddress || ''}
            onChange={(e) => handleChange('propertyAddress', e.target.value)}
            error={!!errors.propertyAddress}
            helperText={errors.propertyAddress || t("forms.drainageConnection.propertyAddressHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>{t("forms.drainageConnection.state")}</InputLabel>
            <Select
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              label={t("forms.drainageConnection.state")}
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
            <InputLabel>{t("forms.drainageConnection.district")}</InputLabel>
            <Select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              label={t("forms.drainageConnection.district")}
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
            label={t("forms.drainageConnection.pincode")}
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
            label={t("forms.drainageConnection.builtUpArea")}
            type="number"
            value={formData.builtUpArea || ''}
            onChange={(e) => handleChange('builtUpArea', e.target.value)}
            error={!!errors.builtUpArea}
            helperText={errors.builtUpArea || t("forms.drainageConnection.builtUpAreaHelper")}
            inputProps={{ min: 1, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.plotArea")}
            type="number"
            value={formData.plotArea || ''}
            onChange={(e) => handleChange('plotArea', e.target.value)}
            helperText={t("forms.drainageConnection.plotAreaHelper")}
            inputProps={{ min: 1, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.numberOfFloors")}
            type="number"
            value={formData.numberOfFloors || ''}
            onChange={(e) => handleChange('numberOfFloors', e.target.value)}
            error={!!errors.numberOfFloors}
            helperText={errors.numberOfFloors}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.numberOfUnits")}
            type="number"
            value={formData.numberOfUnits || ''}
            onChange={(e) => handleChange('numberOfUnits', e.target.value)}
            error={!!errors.numberOfUnits}
            helperText={errors.numberOfUnits || t("forms.drainageConnection.numberOfUnitsHelper")}
            inputProps={{ min: 1, max: 100 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Connection Details Step
const ConnectionDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [connectionFee, setConnectionFee] = React.useState(0);

  React.useEffect(() => {
    // Calculate connection fee based on property type and area
    if (formData.propertyType && formData.builtUpArea) {
      const area = parseFloat(formData.builtUpArea) || 0;
      let ratePerSqFt = 0;

      switch (formData.propertyType) {
        case 'Residential':
          ratePerSqFt = 5;
          break;
        case 'Commercial':
          ratePerSqFt = 10;
          break;
        case 'Industrial':
          ratePerSqFt = 15;
          break;
        case 'Mixed Use':
          ratePerSqFt = 8;
          break;
        case 'Institutional':
          ratePerSqFt = 6;
          break;
        default:
          ratePerSqFt = 5;
      }

      const baseFee = Math.max(area * ratePerSqFt, 5000); // Minimum fee of ₹5000
      const processingFee = 500;
      const total = baseFee + processingFee;

      setConnectionFee(total);
      updateFormData({ connectionFee: total });
    }
  }, [formData.propertyType, formData.builtUpArea]);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.drainageConnection.connectionDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.drainageConnection.connectionDetailsSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.connectionType}>
            <InputLabel>{t("forms.drainageConnection.connectionType")}</InputLabel>
            <Select
              value={formData.connectionType || ''}
              onChange={(e) => handleChange('connectionType', e.target.value)}
              label={t("forms.drainageConnection.connectionType")}
            >
              <MenuItem value="New Connection">{t("forms.drainageConnection.newConnection")}</MenuItem>
              <MenuItem value="Additional Connection">{t("forms.drainageConnection.additionalConnection")}</MenuItem>
              <MenuItem value="Reconnection">{t("forms.drainageConnection.reconnection")}</MenuItem>
              <MenuItem value="Modification">{t("forms.drainageConnection.modification")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.drainageType}>
            <InputLabel>{t("forms.drainageConnection.drainageType")}</InputLabel>
            <Select
              value={formData.drainageType || ''}
              onChange={(e) => handleChange('drainageType', e.target.value)}
              label={t("forms.drainageConnection.drainageType")}
            >
              <MenuItem value="Storm Water">{t("forms.drainageConnection.stormWater")}</MenuItem>
              <MenuItem value="Sewage">{t("forms.drainageConnection.sewage")}</MenuItem>
              <MenuItem value="Combined">{t("forms.drainageConnection.combined")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.pipeDiameter")}
            type="number"
            value={formData.pipeDiameter || ''}
            onChange={(e) => handleChange('pipeDiameter', e.target.value)}
            error={!!errors.pipeDiameter}
            helperText={errors.pipeDiameter || t("forms.drainageConnection.pipeDiameterHelper")}
            inputProps={{ min: 4, max: 24, step: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.drainageConnection.connectionDistance")}
            type="number"
            value={formData.connectionDistance || ''}
            onChange={(e) => handleChange('connectionDistance', e.target.value)}
            helperText={t("forms.drainageConnection.connectionDistanceHelper")}
            inputProps={{ min: 1, max: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.drainageConnection.existingConnection")}
          </Typography>
          <RadioGroup
            value={formData.existingConnection || ''}
            onChange={(e) => handleChange('existingConnection', e.target.value)}
            row
          >
            <FormControlLabel value="Yes" control={<Radio />} label={t("forms.drainageConnection.yes")} />
            <FormControlLabel value="No" control={<Radio />} label={t("forms.drainageConnection.no")} />
          </RadioGroup>
        </Grid>

        {formData.existingConnection === 'Yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label={t("forms.drainageConnection.existingConnectionDetails")}
              value={formData.existingConnectionDetails || ''}
              onChange={(e) => handleChange('existingConnectionDetails', e.target.value)}
              error={!!errors.existingConnectionDetails}
              helperText={errors.existingConnectionDetails || t("forms.drainageConnection.existingConnectionDetailsHelper")}
              inputProps={{ maxLength: 300 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("forms.drainageConnection.preferredDate")}
              value={formData.preferredDate || null}
              onChange={(date) => handleChange('preferredDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText={t("forms.drainageConnection.preferredDateHelper")}
                />
              )}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.drainageConnection.specialRequirements")}
            value={formData.specialRequirements || ''}
            onChange={(e) => handleChange('specialRequirements', e.target.value)}
            helperText={t("forms.drainageConnection.specialRequirementsHelper")}
            inputProps={{ maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {t("forms.drainageConnection.feeCalculation")}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>{t("forms.drainageConnection.connectionFee")}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{(connectionFee - 500).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.drainageConnection.processingFee")}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹500</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="primary">{t("forms.drainageConnection.totalFee")}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="primary" align="right">
                  ₹{connectionFee.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{t("common.note")}:</strong> {t("forms.drainageConnection.feeNote")}
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
    t("forms.drainageConnection.propertyOwnershipDocs"),
    t("forms.drainageConnection.buildingPlanApproval"),
    t("forms.drainageConnection.sitePlan"),
    t("forms.drainageConnection.identityProof"),
    t("forms.drainageConnection.addressProof"),
    t("forms.drainageConnection.propertyTaxReceipt"),
    t("forms.drainageConnection.nocFromSociety"),
    t("forms.drainageConnection.existingDrainageCert"),
    t("forms.drainageConnection.soilTestReport"),
    t("forms.drainageConnection.environmentalClearance")
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.drainageConnection.documentUpload")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.drainageConnection.documentUploadSubtitle")}
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
          {t("forms.drainageConnection.requiredDocuments")}
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
const DrainageConnectionForm = () => {
  const { t } = useLanguage();
  
  const steps = [
    { id: 'applicant', title: t("forms.drainageConnection.step1"), icon: 'Person' },
    { id: 'property', title: t("forms.drainageConnection.step2"), icon: 'Home' },
    { id: 'connection', title: t("forms.drainageConnection.step3"), icon: 'Plumbing' },
    { id: 'documents', title: t("forms.drainageConnection.step4"), icon: 'Description' }
  ];

  const validationRules = {
    // Applicant Information
    applicantName: { type: 'name', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    applicantAddress: { type: 'address', required: true },
    relationship: { type: 'text', required: true },
    
    // Property Details
    propertyId: { type: 'propertyId', required: true },
    propertyType: { type: 'text', required: true },
    propertyAddress: { type: 'address', required: true },
    state: { type: 'text', required: true },
    district: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true },
    builtUpArea: { type: 'builtUpArea', required: true },
    numberOfFloors: { type: 'number', required: true },
    numberOfUnits: { type: 'number', required: true },
    
    // Connection Details
    connectionType: { type: 'text', required: true },
    drainageType: { type: 'text', required: true },
    pipeDiameter: { type: 'number', required: true },
    existingConnection: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName={t("forms.drainageConnection.title")}
      serviceType="drainage_connection"
      steps={steps}
      validationRules={validationRules}
    >
      <ApplicantInformationStep />
      <PropertyDetailsStep />
      <ConnectionDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default DrainageConnectionForm;
