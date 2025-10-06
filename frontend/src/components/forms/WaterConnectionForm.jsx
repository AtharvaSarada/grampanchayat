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
  Divider,
  FormHelperText,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';

const WaterConnectionForm = () => {
  const [formData, setFormData] = useState({
    // Applicant Information
    applicantName: '',
    fatherName: '',
    mobile: '',
    email: '',
    aadhaar: '',
    
    // Property Information
    propertyType: '',
    propertyAddress: '',
    village: '',
    district: '',
    state: 'Your State',
    pincode: '',
    plotNumber: '',
    plotArea: '',
    
    // Connection Details
    connectionType: '',
    connectionPurpose: '',
    estimatedUsage: '',
    numberOfMembers: '',
    existingConnection: false,
    existingConnectionNumber: '',
    
    // Technical Details
    pipeSize: '',
    meterType: '',
    connectionLocation: '',
    roadType: '',
    distanceFromMainLine: '',
    
    // Financial Information
    securityDeposit: '',
    connectionFee: '',
    
    // Documents
    documents: []
  });

  const steps = [
    { id: 'applicant', title: 'Applicant Details' },
    { id: 'property', title: 'Property Information' },
    { id: 'connection', title: 'Connection Details' },
    { id: 'documents', title: 'Documents' }
  ];

  const validationRules = {
    applicantName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid applicant name' },
    fatherName: { required: true, pattern: /^[A-Za-z\s']{2,50}$/, message: 'Enter valid father name' },
    mobile: { required: true, pattern: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit mobile number' },
    aadhaar: { required: true, pattern: /^\d{12}$/, message: 'Enter valid 12-digit Aadhaar number' },
    propertyType: { required: true, message: 'Property type is required' },
    propertyAddress: { required: true, message: 'Property address is required' },
    village: { required: true, message: 'Village is required' },
    district: { required: true, message: 'District is required' },
    pincode: { required: true, pattern: /^\d{6}$/, message: 'Enter valid 6-digit PIN code' },
    plotNumber: { required: true, message: 'Plot number is required' },
    connectionType: { required: true, message: 'Connection type is required' },
    connectionPurpose: { required: true, message: 'Connection purpose is required' },
    numberOfMembers: { required: true, message: 'Number of members is required' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email address' }
  };

  const propertyTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Institutional',
    'Agricultural'
  ];

  const connectionTypes = [
    'New Connection',
    'Additional Connection',
    'Temporary Connection',
    'Bulk Connection'
  ];

  const connectionPurposes = [
    'Domestic Use',
    'Commercial Use',
    'Industrial Use',
    'Institutional Use',
    'Agricultural Use',
    'Construction Use'
  ];

  const pipeSizes = [
    '15mm (1/2 inch)',
    '20mm (3/4 inch)',
    '25mm (1 inch)',
    '32mm (1.25 inch)',
    '40mm (1.5 inch)',
    '50mm (2 inch)'
  ];

  const meterTypes = [
    'Mechanical Meter',
    'Digital Meter',
    'Smart Meter'
  ];

  const roadTypes = [
    'Paved Road',
    'Unpaved Road',
    'Concrete Road',
    'Gravel Road'
  ];

  // Calculate estimated fees based on connection type and usage
  const calculateFees = (connectionType, usage, members) => {
    let baseFee = 0;
    let securityDeposit = 0;

    switch (connectionType) {
      case 'New Connection':
        baseFee = 2000;
        securityDeposit = 1500;
        break;
      case 'Additional Connection':
        baseFee = 1500;
        securityDeposit = 1000;
        break;
      case 'Temporary Connection':
        baseFee = 1000;
        securityDeposit = 500;
        break;
      case 'Bulk Connection':
        baseFee = 5000;
        securityDeposit = 3000;
        break;
      default:
        baseFee = 2000;
        securityDeposit = 1500;
    }

    // Adjust based on number of members
    if (members > 5) {
      baseFee += 500;
      securityDeposit += 300;
    }

    return { connectionFee: baseFee, securityDeposit };
  };

  const ApplicantDetailsStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Applicant Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Applicant's Full Name *"
            value={formData.applicantName || ''}
            onChange={(e) => updateFormData({ applicantName: e.target.value })}
            error={!!errors.applicantName}
            helperText={errors.applicantName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Name *"
            value={formData.fatherName || ''}
            onChange={(e) => updateFormData({ fatherName: e.target.value })}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile Number *"
            value={formData.mobile || ''}
            onChange={(e) => updateFormData({ mobile: e.target.value })}
            error={!!errors.mobile}
            helperText={errors.mobile}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value.toLowerCase() })}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aadhaar Number *"
            value={formData.aadhaar || ''}
            onChange={(e) => updateFormData({ aadhaar: e.target.value })}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const PropertyInformationStep = ({ formData, updateFormData, errors }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Property Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.propertyType}>
            <InputLabel>Property Type *</InputLabel>
            <Select
              value={formData.propertyType || ''}
              onChange={(e) => updateFormData({ propertyType: e.target.value })}
              label="Property Type *"
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
            {errors.propertyType && <FormHelperText>{errors.propertyType}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plot Number *"
            value={formData.plotNumber || ''}
            onChange={(e) => updateFormData({ plotNumber: e.target.value })}
            error={!!errors.plotNumber}
            helperText={errors.plotNumber}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Property Address *"
            multiline
            rows={3}
            value={formData.propertyAddress || ''}
            onChange={(e) => updateFormData({ propertyAddress: e.target.value })}
            error={!!errors.propertyAddress}
            helperText={errors.propertyAddress}
            placeholder="Enter complete property address"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Village/Town *"
            value={formData.village || ''}
            onChange={(e) => updateFormData({ village: e.target.value })}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="District *"
            value={formData.district || ''}
            onChange={(e) => updateFormData({ district: e.target.value })}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="PIN Code *"
            value={formData.pincode || ''}
            onChange={(e) => updateFormData({ pincode: e.target.value })}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Plot Area (sq ft)"
            type="number"
            value={formData.plotArea || ''}
            onChange={(e) => updateFormData({ plotArea: e.target.value })}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  const ConnectionDetailsStep = ({ formData, updateFormData, errors }) => {
    // Auto-calculate fees when connection details change
    React.useEffect(() => {
      if (formData.connectionType && formData.numberOfMembers) {
        const fees = calculateFees(formData.connectionType, formData.estimatedUsage, parseInt(formData.numberOfMembers));
        updateFormData(fees);
      }
    }, [formData.connectionType, formData.numberOfMembers, formData.estimatedUsage]);

    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Connection Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.connectionType}>
              <InputLabel>Connection Type *</InputLabel>
              <Select
                value={formData.connectionType || ''}
                onChange={(e) => updateFormData({ connectionType: e.target.value })}
                label="Connection Type *"
              >
                {connectionTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.connectionType && <FormHelperText>{errors.connectionType}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.connectionPurpose}>
              <InputLabel>Connection Purpose *</InputLabel>
              <Select
                value={formData.connectionPurpose || ''}
                onChange={(e) => updateFormData({ connectionPurpose: e.target.value })}
                label="Connection Purpose *"
              >
                {connectionPurposes.map((purpose) => (
                  <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
                ))}
              </Select>
              {errors.connectionPurpose && <FormHelperText>{errors.connectionPurpose}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Number of Family Members *"
              type="number"
              value={formData.numberOfMembers || ''}
              onChange={(e) => updateFormData({ numberOfMembers: e.target.value })}
              error={!!errors.numberOfMembers}
              helperText={errors.numberOfMembers}
              inputProps={{ min: 1, max: 20 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Daily Usage (Liters)"
              type="number"
              value={formData.estimatedUsage || ''}
              onChange={(e) => updateFormData({ estimatedUsage: e.target.value })}
              inputProps={{ min: 0 }}
              placeholder="e.g., 500"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.existingConnection || false}
                  onChange={(e) => updateFormData({ existingConnection: e.target.checked })}
                />
              }
              label="Do you have an existing water connection?"
            />
          </Grid>
          
          {formData.existingConnection && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Existing Connection Number"
                value={formData.existingConnectionNumber || ''}
                onChange={(e) => updateFormData({ existingConnectionNumber: e.target.value })}
              />
            </Grid>
          )}

          <Divider sx={{ width: '100%', my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Technical Specifications
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pipe Size</InputLabel>
              <Select
                value={formData.pipeSize || ''}
                onChange={(e) => updateFormData({ pipeSize: e.target.value })}
                label="Pipe Size"
              >
                {pipeSizes.map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Meter Type</InputLabel>
              <Select
                value={formData.meterType || ''}
                onChange={(e) => updateFormData({ meterType: e.target.value })}
                label="Meter Type"
              >
                {meterTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Connection Location"
              value={formData.connectionLocation || ''}
              onChange={(e) => updateFormData({ connectionLocation: e.target.value })}
              placeholder="e.g., Front of house, Side wall"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Road Type</InputLabel>
              <Select
                value={formData.roadType || ''}
                onChange={(e) => updateFormData({ roadType: e.target.value })}
                label="Road Type"
              >
                {roadTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Distance from Main Line (meters)"
              type="number"
              value={formData.distanceFromMainLine || ''}
              onChange={(e) => updateFormData({ distanceFromMainLine: e.target.value })}
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Fee Calculation
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Connection Fee (₹)"
              type="number"
              value={formData.connectionFee || ''}
              InputProps={{ readOnly: true }}
              helperText="Auto-calculated based on connection type"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Security Deposit (₹)"
              type="number"
              value={formData.securityDeposit || ''}
              InputProps={{ readOnly: true }}
              helperText="Refundable security deposit"
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Required Documents
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload the following documents (PDF, JPG, PNG format, max 5MB each):
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Required Documents:
        </Typography>
        <ul>
          <li>Aadhaar Card of Applicant</li>
          <li>Property Ownership Documents (Sale Deed/Patta/Lease Deed)</li>
          <li>Property Tax Receipt</li>
          <li>Site Plan/Layout Plan</li>
          <li>NOC from Society/Landlord (if applicable)</li>
          <li>Existing Connection Bill (if applicable)</li>
          <li>Passport Size Photograph</li>
        </ul>
      </Box>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={8}
        acceptedTypes={['application/pdf', 'image/jpeg', 'image/png']}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />
    </Paper>
  );

  return (
    <MultiStepForm
      serviceName="Water Connection Application"
      serviceType="water-connection"
      steps={steps}
      validationRules={validationRules}
      initialData={formData}
    >
      <ApplicantDetailsStep />
      <PropertyInformationStep />
      <ConnectionDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default WaterConnectionForm;
