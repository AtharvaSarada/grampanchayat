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

// Applicant Information Step
const ApplicantInformationStep = ({ formData, updateFormData, errors }) => {
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
        Applicant Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your details for street light installation request
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name *"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || 'Full name of applicant'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
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
          <FormControl fullWidth error={!!errors.applicantType}>
            <InputLabel>Applicant Type *</InputLabel>
            <Select
              value={formData.applicantType || ''}
              onChange={(e) => handleChange('applicantType', e.target.value)}
              label="Applicant Type *"
            >
              <MenuItem value="Individual Resident">Individual Resident</MenuItem>
              <MenuItem value="Resident Association">Resident Association</MenuItem>
              <MenuItem value="Community Group">Community Group</MenuItem>
              <MenuItem value="Local Business">Local Business</MenuItem>
              <MenuItem value="Religious Institution">Religious Institution</MenuItem>
              <MenuItem value="Educational Institution">Educational Institution</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Applicant Address *"
            value={formData.applicantAddress || ''}
            onChange={(e) => handleChange('applicantAddress', e.target.value)}
            error={!!errors.applicantAddress}
            helperText={errors.applicantAddress || 'Complete address of applicant'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Are you a resident of the area where street light is requested? *
          </Typography>
          <RadioGroup
            value={formData.isLocalResident || ''}
            onChange={(e) => handleChange('isLocalResident', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {formData.isLocalResident === 'no' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Reason for Non-Resident Application *"
              value={formData.nonResidentReason || ''}
              onChange={(e) => handleChange('nonResidentReason', e.target.value)}
              error={!!errors.nonResidentReason}
              helperText={errors.nonResidentReason || 'Explain your connection to the area'}
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
        Location Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify the exact location where street light installation is required
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Street Light Location *"
            value={formData.lightLocation || ''}
            onChange={(e) => handleChange('lightLocation', e.target.value)}
            error={!!errors.lightLocation}
            helperText={errors.lightLocation || 'Exact location/address where street light is needed'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Street/Road Name *"
            value={formData.streetName || ''}
            onChange={(e) => handleChange('streetName', e.target.value)}
            error={!!errors.streetName}
            helperText={errors.streetName || 'Name of the street or road'}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Landmark/Reference Point *"
            value={formData.landmark || ''}
            onChange={(e) => handleChange('landmark', e.target.value)}
            error={!!errors.landmark}
            helperText={errors.landmark || 'Nearby landmark for easy identification'}
            inputProps={{ maxLength: 100 }}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ward Number"
            value={formData.wardNumber || ''}
            onChange={(e) => handleChange('wardNumber', e.target.value)}
            helperText="Municipal ward number (if known)"
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.areaType}>
            <InputLabel>Area Type *</InputLabel>
            <Select
              value={formData.areaType || ''}
              onChange={(e) => handleChange('areaType', e.target.value)}
              label="Area Type *"
            >
              <MenuItem value="Residential">Residential Area</MenuItem>
              <MenuItem value="Commercial">Commercial Area</MenuItem>
              <MenuItem value="Industrial">Industrial Area</MenuItem>
              <MenuItem value="Mixed">Mixed Use Area</MenuItem>
              <MenuItem value="Rural">Rural Area</MenuItem>
              <MenuItem value="Highway">Highway/Main Road</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            GPS Coordinates (Optional)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Latitude"
                value={formData.latitude || ''}
                onChange={(e) => handleChange('latitude', e.target.value)}
                helperText="GPS latitude coordinates"
                inputProps={{ pattern: '^-?([1-8]?[1-9]|[1-9]0)\\.{1}\\d{1,6}' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Longitude"
                value={formData.longitude || ''}
                onChange={(e) => handleChange('longitude', e.target.value)}
                helperText="GPS longitude coordinates"
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
        Installation Requirements
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify your requirements for street light installation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.lightType}>
            <InputLabel>Type of Street Light *</InputLabel>
            <Select
              value={formData.lightType || ''}
              onChange={(e) => handleChange('lightType', e.target.value)}
              label="Type of Street Light *"
            >
              <MenuItem value="LED">LED Light</MenuItem>
              <MenuItem value="Solar LED">Solar LED Light</MenuItem>
              <MenuItem value="CFL">CFL Light</MenuItem>
              <MenuItem value="Sodium Vapor">Sodium Vapor Light</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Lights Required *"
            type="number"
            value={formData.numberOfLights || ''}
            onChange={(e) => handleChange('numberOfLights', e.target.value)}
            error={!!errors.numberOfLights}
            helperText={errors.numberOfLights || 'How many street lights needed'}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.poleHeight}>
            <InputLabel>Pole Height *</InputLabel>
            <Select
              value={formData.poleHeight || ''}
              onChange={(e) => handleChange('poleHeight', e.target.value)}
              label="Pole Height *"
            >
              <MenuItem value="6 meters">6 meters</MenuItem>
              <MenuItem value="8 meters">8 meters</MenuItem>
              <MenuItem value="10 meters">10 meters</MenuItem>
              <MenuItem value="12 meters">12 meters</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.wattage}>
            <InputLabel>Light Wattage *</InputLabel>
            <Select
              value={formData.wattage || ''}
              onChange={(e) => handleChange('wattage', e.target.value)}
              label="Light Wattage *"
            >
              <MenuItem value="40W">40 Watts</MenuItem>
              <MenuItem value="60W">60 Watts</MenuItem>
              <MenuItem value="100W">100 Watts</MenuItem>
              <MenuItem value="150W">150 Watts</MenuItem>
              <MenuItem value="200W">200 Watts</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Is electricity connection available at the location? *
          </Typography>
          <RadioGroup
            value={formData.electricityAvailable || ''}
            onChange={(e) => handleChange('electricityAvailable', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="partial" control={<Radio />} label="Partial" />
          </RadioGroup>
        </Grid>

        {formData.electricityAvailable === 'no' && (
          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Note:</strong> If electricity connection is not available, additional cost for electrical 
                connection and wiring will be required. This may significantly increase the project cost and timeline.
              </Typography>
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Priority Level *
          </Typography>
          <RadioGroup
            value={formData.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
            row
          >
            <FormControlLabel value="High" control={<Radio />} label="High (Safety concern)" />
            <FormControlLabel value="Medium" control={<Radio />} label="Medium (Convenience)" />
            <FormControlLabel value="Low" control={<Radio />} label="Low (Enhancement)" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Justification for Request *"
            value={formData.justification || ''}
            onChange={(e) => handleChange('justification', e.target.value)}
            error={!!errors.justification}
            helperText={errors.justification || 'Explain why street light is needed at this location'}
            inputProps={{ minLength: 20, maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Preferred Installation Date"
              value={formData.preferredDate || null}
              onChange={(date) => handleChange('preferredDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Preferred date for installation (subject to approval and availability)"
                />
              )}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
            <Typography variant="h6" color="info.main" gutterBottom>
              Estimated Cost Breakdown
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Equipment Cost:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{((estimatedCost / 1.3) || 0).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Installation Cost:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{((estimatedCost * 0.3) || 0).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="info.main">Total Estimated Cost:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="info.main" align="right">
                  ₹{estimatedCost.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              *This is an approximate estimate. Actual cost may vary based on site conditions and final specifications.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Identity proof of applicant',
    'Address proof of applicant',
    'Location photographs (current condition)',
    'Site sketch/map showing exact location',
    'Resident association approval (if applicable)',
    'Property ownership proof (if requesting near private property)',
    'Electricity bill of nearest connection point',
    'Support letters from neighbors/community',
    'Previous correspondence with authorities (if any)',
    'Safety assessment report (for high priority requests)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for street light installation request
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
const StreetLightInstallationForm = () => {
  const steps = [
    { id: 'applicant', title: 'Applicant Information', icon: 'Person' },
    { id: 'location', title: 'Location Details', icon: 'LocationOn' },
    { id: 'requirements', title: 'Installation Requirements', icon: 'Lightbulb' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
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
      serviceName="Street Light Installation Request"
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
