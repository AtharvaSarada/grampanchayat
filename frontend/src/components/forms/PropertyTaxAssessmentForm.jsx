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

// Property Owner Information Step
const PropertyOwnerStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'ownerName' || field === 'applicantName') {
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
        Property Owner Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter property owner details for tax assessment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property Owner Name *"
            value={formData.ownerName || ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName || 'Name as per property documents'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant Name"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || 'If different from owner'}
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
            label="Owner Address *"
            value={formData.ownerAddress || ''}
            onChange={(e) => handleChange('ownerAddress', e.target.value)}
            error={!!errors.ownerAddress}
            helperText={errors.ownerAddress || 'Complete address of property owner'}
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
            <FormControlLabel value="Legal Heir" control={<Radio />} label="Legal Heir" />
            <FormControlLabel value="Power of Attorney" control={<Radio />} label="Power of Attorney" />
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
    
    if (field === 'propertyId' || field === 'surveyNumber') {
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
        Provide complete property information for assessment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property ID *"
            value={formData.propertyId || ''}
            onChange={(e) => handleChange('propertyId', e.target.value)}
            error={!!errors.propertyId}
            helperText={errors.propertyId || 'Unique property identification number'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Survey Number *"
            value={formData.surveyNumber || ''}
            onChange={(e) => handleChange('surveyNumber', e.target.value)}
            error={!!errors.surveyNumber}
            helperText={errors.surveyNumber || 'Government survey number'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\/\\-]{1,20}' }}
          />
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
              <MenuItem value="Agricultural">Agricultural</MenuItem>
              <MenuItem value="Vacant Land">Vacant Land</MenuItem>
              <MenuItem value="Mixed Use">Mixed Use</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.propertyUsage}>
            <InputLabel>Current Usage *</InputLabel>
            <Select
              value={formData.propertyUsage || ''}
              onChange={(e) => handleChange('propertyUsage', e.target.value)}
              label="Current Usage *"
            >
              <MenuItem value="Self Occupied">Self Occupied</MenuItem>
              <MenuItem value="Rented">Rented</MenuItem>
              <MenuItem value="Vacant">Vacant</MenuItem>
              <MenuItem value="Under Construction">Under Construction</MenuItem>
              <MenuItem value="Commercial Use">Commercial Use</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Property Specifications Step
const PropertySpecificationsStep = ({ formData, updateFormData, errors }) => {
  const [assessedValue, setAssessedValue] = React.useState(0);

  React.useEffect(() => {
    // Calculate assessed value based on property details
    if (formData.builtUpArea && formData.propertyType) {
      const area = parseFloat(formData.builtUpArea) || 0;
      let ratePerSqFt = 0;

      switch (formData.propertyType) {
        case 'Residential':
          ratePerSqFt = 1500;
          break;
        case 'Commercial':
          ratePerSqFt = 3000;
          break;
        case 'Industrial':
          ratePerSqFt = 2500;
          break;
        case 'Agricultural':
          ratePerSqFt = 500;
          break;
        case 'Vacant Land':
          ratePerSqFt = 800;
          break;
        case 'Mixed Use':
          ratePerSqFt = 2000;
          break;
        default:
          ratePerSqFt = 1500;
      }

      const baseValue = area * ratePerSqFt;
      const ageDepreciation = formData.propertyAge ? (parseFloat(formData.propertyAge) * 0.02) : 0;
      const depreciatedValue = baseValue * (1 - Math.min(ageDepreciation, 0.5));
      
      setAssessedValue(Math.round(depreciatedValue));
      updateFormData({ assessedValue: Math.round(depreciatedValue) });
    }
  }, [formData.builtUpArea, formData.propertyType, formData.propertyAge]);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Property Specifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide detailed property specifications for accurate assessment
      </Typography>

      <Grid container spacing={3}>
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
            label="Plot Area (sq ft) *"
            type="number"
            value={formData.plotArea || ''}
            onChange={(e) => handleChange('plotArea', e.target.value)}
            error={!!errors.plotArea}
            helperText={errors.plotArea || 'Total plot area'}
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
            label="Property Age (years)"
            type="number"
            value={formData.propertyAge || ''}
            onChange={(e) => handleChange('propertyAge', e.target.value)}
            helperText="Age of the property for depreciation calculation"
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Construction Date"
              value={formData.constructionDate || null}
              onChange={(date) => handleChange('constructionDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Date of construction completion"
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Construction Quality</InputLabel>
            <Select
              value={formData.constructionQuality || ''}
              onChange={(e) => handleChange('constructionQuality', e.target.value)}
              label="Construction Quality"
            >
              <MenuItem value="Excellent">Excellent</MenuItem>
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Average">Average</MenuItem>
              <MenuItem value="Below Average">Below Average</MenuItem>
              <MenuItem value="Poor">Poor</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Rooms"
            type="number"
            value={formData.numberOfRooms || ''}
            onChange={(e) => handleChange('numberOfRooms', e.target.value)}
            helperText="Total number of rooms"
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Bathrooms"
            type="number"
            value={formData.numberOfBathrooms || ''}
            onChange={(e) => handleChange('numberOfBathrooms', e.target.value)}
            helperText="Total number of bathrooms"
            inputProps={{ min: 1, max: 20 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Amenities Available
          </Typography>
          <Grid container spacing={1}>
            {['Parking', 'Garden', 'Swimming Pool', 'Elevator', 'Generator', 'Security'].map((amenity) => (
              <Grid item key={amenity}>
                <FormControlLabel
                  control={
                    <input
                      type="checkbox"
                      checked={formData.amenities?.includes(amenity) || false}
                      onChange={(e) => {
                        const currentAmenities = formData.amenities || [];
                        const updatedAmenities = e.target.checked
                          ? [...currentAmenities, amenity]
                          : currentAmenities.filter(a => a !== amenity);
                        handleChange('amenities', updatedAmenities);
                      }}
                    />
                  }
                  label={amenity}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Assessed Property Value
            </Typography>
            <Typography variant="h4" color="success.main">
              ₹{assessedValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              *This is a preliminary assessment. Final assessment will be done by the revenue department.
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
    'Property ownership documents (Sale deed/Patta)',
    'Survey settlement records',
    'Building plan approval',
    'Completion certificate',
    'Previous tax assessment records',
    'Identity proof of owner',
    'Address proof',
    'Property photographs (exterior and interior)',
    'Utility bills (electricity/water)',
    'NOC from society/association (if applicable)'
  ];

  const handleDocumentsChange = (documents) => {
    updateFormData({ documents });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for property tax assessment
      </Typography>

      <DocumentUpload
        requiredDocuments={requiredDocuments}
        uploadedDocuments={formData.documents || []}
        onDocumentsChange={handleDocumentsChange}
        maxFiles={15}
        serviceType="property_tax_assessment"
      />
    </Box>
  );
};

// Main Form Component
const PropertyTaxAssessmentForm = () => {
  const steps = [
    { id: 'owner', title: 'Property Owner', icon: 'Person' },
    { id: 'property', title: 'Property Details', icon: 'Home' },
    { id: 'specifications', title: 'Specifications', icon: 'Architecture' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Property Owner
    ownerName: { type: 'name', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    ownerAddress: { type: 'address', required: true },
    relationship: { type: 'text', required: true },
    
    // Property Details
    propertyId: { type: 'propertyId', required: true },
    surveyNumber: { type: 'surveyNumber', required: true },
    propertyAddress: { type: 'address', required: true },
    state: { type: 'text', required: true },
    district: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true },
    propertyType: { type: 'text', required: true },
    propertyUsage: { type: 'text', required: true },
    
    // Specifications
    builtUpArea: { type: 'builtUpArea', required: true },
    plotArea: { type: 'number', required: true },
    numberOfFloors: { type: 'number', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Property Tax Assessment Application"
      serviceType="property_tax_assessment"
      steps={steps}
      validationRules={validationRules}
    >
      <PropertyOwnerStep />
      <PropertyDetailsStep />
      <PropertySpecificationsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default PropertyTaxAssessmentForm;
