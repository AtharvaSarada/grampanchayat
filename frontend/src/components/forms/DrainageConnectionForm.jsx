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
        Applicant Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your personal details for drainage connection application
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name *"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || 'Full name as per documents'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property Owner Name"
            value={formData.ownerName || ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName || 'If different from applicant'}
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
            Relationship to Property *
          </Typography>
          <RadioGroup
            value={formData.relationship || ''}
            onChange={(e) => handleChange('relationship', e.target.value)}
            row
          >
            <FormControlLabel value="Owner" control={<Radio />} label="Owner" />
            <FormControlLabel value="Tenant" control={<Radio />} label="Tenant" />
            <FormControlLabel value="Authorized Representative" control={<Radio />} label="Authorized Representative" />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Property Details Step
const PropertyDetailsStep = ({ formData, updateFormData, errors }) => {
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
        Property Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details of the property for drainage connection
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property ID/Survey Number *"
            value={formData.propertyId || ''}
            onChange={(e) => handleChange('propertyId', e.target.value)}
            error={!!errors.propertyId}
            helperText={errors.propertyId || 'Property identification number'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.propertyType}>
            <InputLabel>Property Type *</InputLabel>
            <Select
              value={formData.propertyType || ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              label="Property Type *"
            >
              <MenuItem value="Residential">Residential</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Industrial">Industrial</MenuItem>
              <MenuItem value="Mixed Use">Mixed Use</MenuItem>
              <MenuItem value="Institutional">Institutional</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Property Address *"
            value={formData.propertyAddress || ''}
            onChange={(e) => handleChange('propertyAddress', e.target.value)}
            error={!!errors.propertyAddress}
            helperText={errors.propertyAddress || 'Complete property address'}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Built-up Area (sq ft) *"
            type="number"
            value={formData.builtUpArea || ''}
            onChange={(e) => handleChange('builtUpArea', e.target.value)}
            error={!!errors.builtUpArea}
            helperText={errors.builtUpArea || 'Total built-up area'}
            inputProps={{ min: 1, max: 999999, pattern: '^\\d{1,6}(\\.\\d{1,2})?$' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plot Area (sq ft)"
            type="number"
            value={formData.plotArea || ''}
            onChange={(e) => handleChange('plotArea', e.target.value)}
            helperText="Total plot area"
            inputProps={{ min: 1, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Floors *"
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
            label="Number of Units *"
            type="number"
            value={formData.numberOfUnits || ''}
            onChange={(e) => handleChange('numberOfUnits', e.target.value)}
            error={!!errors.numberOfUnits}
            helperText={errors.numberOfUnits || 'Residential/commercial units'}
            inputProps={{ min: 1, max: 100 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Connection Details Step
const ConnectionDetailsStep = ({ formData, updateFormData, errors }) => {
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
        Connection Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Specify drainage connection requirements and preferences
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.connectionType}>
            <InputLabel>Connection Type *</InputLabel>
            <Select
              value={formData.connectionType || ''}
              onChange={(e) => handleChange('connectionType', e.target.value)}
              label="Connection Type *"
            >
              <MenuItem value="New Connection">New Connection</MenuItem>
              <MenuItem value="Additional Connection">Additional Connection</MenuItem>
              <MenuItem value="Reconnection">Reconnection</MenuItem>
              <MenuItem value="Modification">Modification</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.drainageType}>
            <InputLabel>Drainage Type *</InputLabel>
            <Select
              value={formData.drainageType || ''}
              onChange={(e) => handleChange('drainageType', e.target.value)}
              label="Drainage Type *"
            >
              <MenuItem value="Storm Water">Storm Water Drainage</MenuItem>
              <MenuItem value="Sewage">Sewage Drainage</MenuItem>
              <MenuItem value="Combined">Combined Drainage</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pipe Diameter Required (inches) *"
            type="number"
            value={formData.pipeDiameter || ''}
            onChange={(e) => handleChange('pipeDiameter', e.target.value)}
            error={!!errors.pipeDiameter}
            helperText={errors.pipeDiameter || 'Recommended pipe diameter'}
            inputProps={{ min: 4, max: 24, step: 2 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Connection Point Distance (meters)"
            type="number"
            value={formData.connectionDistance || ''}
            onChange={(e) => handleChange('connectionDistance', e.target.value)}
            helperText="Distance from main drainage line"
            inputProps={{ min: 1, max: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Existing Drainage Connection *
          </Typography>
          <RadioGroup
            value={formData.existingConnection || ''}
            onChange={(e) => handleChange('existingConnection', e.target.value)}
            row
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {formData.existingConnection === 'Yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Existing Connection Details *"
              value={formData.existingConnectionDetails || ''}
              onChange={(e) => handleChange('existingConnectionDetails', e.target.value)}
              error={!!errors.existingConnectionDetails}
              helperText={errors.existingConnectionDetails || 'Details of existing drainage connection'}
              inputProps={{ maxLength: 300 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Preferred Connection Date"
              value={formData.preferredDate || null}
              onChange={(date) => handleChange('preferredDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Preferred date for connection work"
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
            label="Special Requirements"
            value={formData.specialRequirements || ''}
            onChange={(e) => handleChange('specialRequirements', e.target.value)}
            helperText="Any special requirements or site conditions"
            inputProps={{ maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Fee Calculation
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Connection Fee:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{(connectionFee - 500).toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Processing Fee:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹500</Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="primary">Total Fee:</Typography>
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
              <strong>Note:</strong> The connection fee is calculated based on property type and built-up area. 
              Additional charges may apply for special requirements or site conditions.
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
    'Property ownership documents',
    'Building plan approval',
    'Site plan/layout',
    'Identity proof of applicant',
    'Address proof',
    'Property tax receipt',
    'NOC from society/association (if applicable)',
    'Existing drainage connection certificate (if any)',
    'Soil test report (if required)',
    'Environmental clearance (for industrial properties)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for drainage connection application
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
const DrainageConnectionForm = () => {
  const steps = [
    { id: 'applicant', title: 'Applicant Information', icon: 'Person' },
    { id: 'property', title: 'Property Details', icon: 'Home' },
    { id: 'connection', title: 'Connection Details', icon: 'Plumbing' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
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
      serviceName="Drainage Connection Application"
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
