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
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup
} from '@mui/material';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';

// Step Components
const ApplicantInformationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Applicant Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide property owner's details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property Owner Name *"
            value={formData.ownerName || ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName || 'Full name as per property documents'}
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
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email ID"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || 'For communication purposes'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Correspondence Address *"
            value={formData.correspondenceAddress || ''}
            onChange={(e) => handleChange('correspondenceAddress', e.target.value)}
            error={!!errors.correspondenceAddress}
            helperText={errors.correspondenceAddress || 'Address for all communications'}
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
            inputProps={{ maxLength: 12 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="PAN Number"
            value={formData.panNumber || ''}
            onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
            error={!!errors.panNumber}
            helperText={errors.panNumber || 'PAN card number (if available)'}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const PropertyDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Property Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details about the construction site and property
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plot/Survey Number *"
            value={formData.plotNumber || ''}
            onChange={(e) => handleChange('plotNumber', e.target.value)}
            error={!!errors.plotNumber}
            helperText={errors.plotNumber || 'Survey number from revenue records'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Area of Plot *"
            type="number"
            value={formData.plotArea || ''}
            onChange={(e) => handleChange('plotArea', e.target.value)}
            error={!!errors.plotArea}
            helperText={errors.plotArea}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Location/Address of Construction Site *"
            value={formData.constructionSiteAddress || ''}
            onChange={(e) => handleChange('constructionSiteAddress', e.target.value)}
            error={!!errors.constructionSiteAddress}
            helperText={errors.constructionSiteAddress || 'Complete address with landmarks'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.constructionType}>
            <InputLabel>Type of Construction *</InputLabel>
            <Select
              value={formData.constructionType || ''}
              onChange={(e) => handleChange('constructionType', e.target.value)}
              label="Type of Construction *"
            >
              <MenuItem value="Residential">Residential</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Industrial">Industrial</MenuItem>
              <MenuItem value="Institutional">Institutional</MenuItem>
              <MenuItem value="Mixed Use">Mixed Use</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Proposed Building Area *"
            type="number"
            value={formData.proposedBuildingArea || ''}
            onChange={(e) => handleChange('proposedBuildingArea', e.target.value)}
            error={!!errors.proposedBuildingArea}
            helperText={errors.proposedBuildingArea}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Number of Floors *"
            type="number"
            value={formData.numberOfFloors || ''}
            onChange={(e) => handleChange('numberOfFloors', e.target.value)}
            error={!!errors.numberOfFloors}
            helperText={errors.numberOfFloors}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Height of Building *"
            type="number"
            value={formData.buildingHeight || ''}
            onChange={(e) => handleChange('buildingHeight', e.target.value)}
            error={!!errors.buildingHeight}
            helperText={errors.buildingHeight}
            InputProps={{
              endAdornment: <InputAdornment position="end">Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Parking Area"
            type="number"
            value={formData.parkingArea || ''}
            onChange={(e) => handleChange('parkingArea', e.target.value)}
            helperText="Parking area in sq. meters"
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Setback Details (Distance from boundaries)
          </Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Front Setback"
            type="number"
            value={formData.frontSetback || ''}
            onChange={(e) => handleChange('frontSetback', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Rear Setback"
            type="number"
            value={formData.rearSetback || ''}
            onChange={(e) => handleChange('rearSetback', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Left Side Setback"
            type="number"
            value={formData.leftSetback || ''}
            onChange={(e) => handleChange('leftSetback', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Right Side Setback"
            type="number"
            value={formData.rightSetback || ''}
            onChange={(e) => handleChange('rightSetback', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Meters</InputAdornment>
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const ConstructionDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Construction Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide technical details about the proposed construction
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.structureType}>
            <InputLabel>Type of Construction *</InputLabel>
            <Select
              value={formData.structureType || ''}
              onChange={(e) => handleChange('structureType', e.target.value)}
              label="Type of Construction *"
            >
              <MenuItem value="RCC">RCC (Reinforced Cement Concrete)</MenuItem>
              <MenuItem value="Load Bearing">Load Bearing</MenuItem>
              <MenuItem value="Steel Frame">Steel Frame</MenuItem>
              <MenuItem value="Composite">Composite</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Built-up Area *"
            type="number"
            value={formData.totalBuiltupArea || ''}
            onChange={(e) => handleChange('totalBuiltupArea', e.target.value)}
            error={!!errors.totalBuiltupArea}
            helperText={errors.totalBuiltupArea}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Floor-wise Plinth Area Details
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Ground Floor Area"
            type="number"
            value={formData.groundFloorArea || ''}
            onChange={(e) => handleChange('groundFloorArea', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="First Floor Area"
            type="number"
            value={formData.firstFloorArea || ''}
            onChange={(e) => handleChange('firstFloorArea', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Other Floors Area"
            type="number"
            value={formData.otherFloorsArea || ''}
            onChange={(e) => handleChange('otherFloorsArea', e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">Sq. Meters</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Drainage and Utilities
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Drainage Connection</InputLabel>
            <Select
              value={formData.drainageConnection || ''}
              onChange={(e) => handleChange('drainageConnection', e.target.value)}
              label="Drainage Connection"
            >
              <MenuItem value="Municipal Sewer">Municipal Sewer</MenuItem>
              <MenuItem value="Septic Tank">Septic Tank</MenuItem>
              <MenuItem value="Individual Treatment">Individual Treatment Plant</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Water Supply Source</InputLabel>
            <Select
              value={formData.waterSupplySource || ''}
              onChange={(e) => handleChange('waterSupplySource', e.target.value)}
              label="Water Supply Source"
            >
              <MenuItem value="Municipal Supply">Municipal Supply</MenuItem>
              <MenuItem value="Borewell">Borewell</MenuItem>
              <MenuItem value="Well">Well</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Features/Amenities"
            value={formData.specialFeatures || ''}
            onChange={(e) => handleChange('specialFeatures', e.target.value)}
            helperText="Swimming pool, basement, solar panels, etc."
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const TechnicalDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Technical & Safety Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide technical specifications and safety measures
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Structural Stability
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Structural Engineer Name"
            value={formData.structuralEngineerName || ''}
            onChange={(e) => handleChange('structuralEngineerName', e.target.value)}
            helperText="Name of consulting structural engineer"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Engineer License Number"
            value={formData.engineerLicenseNumber || ''}
            onChange={(e) => handleChange('engineerLicenseNumber', e.target.value)}
            helperText="Professional license number"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Fire Safety Measures
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.fireExitProvided || false}
                onChange={(e) => handleChange('fireExitProvided', e.target.checked)}
              />
            }
            label="Fire exit routes provided"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.fireExtinguisherProvided || false}
                onChange={(e) => handleChange('fireExtinguisherProvided', e.target.checked)}
              />
            }
            label="Fire extinguisher arrangements made"
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.smokeDetectorProvided || false}
                onChange={(e) => handleChange('smokeDetectorProvided', e.target.checked)}
              />
            }
            label="Smoke detection system provided"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Environmental Clearances
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Is environmental clearance required for this construction? *
          </Typography>
          <RadioGroup
            value={formData.environmentalClearanceRequired || ''}
            onChange={(e) => handleChange('environmentalClearanceRequired', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {formData.environmentalClearanceRequired === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Environmental Clearance Details"
              multiline
              rows={2}
              value={formData.environmentalClearanceDetails || ''}
              onChange={(e) => handleChange('environmentalClearanceDetails', e.target.value)}
              helperText="Provide details about environmental clearance requirements"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Technical Details"
            value={formData.additionalTechnicalDetails || ''}
            onChange={(e) => handleChange('additionalTechnicalDetails', e.target.value)}
            helperText="Any other technical specifications or special requirements"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Ownership proof (Sale deed/Title documents)',
    'Survey settlement records',
    'Site plan and building plan (approved by architect)',
    'Structural stability certificate',
    'Environmental clearance (if required)',
    'Fire NOC (if required)',
    'Drainage connection plan',
    'Identity proof (Aadhaar/PAN)',
    'Address proof',
    'Property tax receipts',
    'Architect license copy',
    'Structural engineer certificate'
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
        Please upload all required documents for building permission approval
      </Typography>

      <DocumentUpload
        requiredDocuments={requiredDocuments}
        uploadedDocuments={formData.documents || []}
        onDocumentsChange={handleDocumentsChange}
        maxFiles={20}
        serviceType="building_permission"
      />
    </Box>
  );
};

// Main Form Component
const BuildingPermissionForm = () => {
  const steps = [
    { id: 'applicant', title: 'Applicant Information', icon: 'Person' },
    { id: 'property', title: 'Property Details', icon: 'Home' },
    { id: 'construction', title: 'Construction Details', icon: 'Construction' },
    { id: 'technical', title: 'Technical Details', icon: 'Engineering' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Applicant Information
    ownerName: { type: 'text', required: true },
    fatherName: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    correspondenceAddress: { type: 'text', required: true },
    aadhaar: { type: 'aadhaar', required: true },
    
    // Property Details
    plotNumber: { type: 'text', required: true },
    plotArea: { type: 'amount', required: true },
    constructionSiteAddress: { type: 'text', required: true },
    constructionType: { type: 'text', required: true },
    proposedBuildingArea: { type: 'amount', required: true },
    numberOfFloors: { type: 'amount', required: true },
    buildingHeight: { type: 'amount', required: true },
    
    // Construction Details
    structureType: { type: 'text', required: true },
    totalBuiltupArea: { type: 'amount', required: true },
    
    // Technical Details
    environmentalClearanceRequired: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Building Permission (NOC) Application"
      serviceType="building_permission"
      steps={steps}
      validationRules={validationRules}
    >
      <ApplicantInformationStep />
      <PropertyDetailsStep />
      <ConstructionDetailsStep />
      <TechnicalDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default BuildingPermissionForm;
