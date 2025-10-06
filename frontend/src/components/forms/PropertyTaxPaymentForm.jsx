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

// Property Details Step
const PropertyDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'propertyId') {
      correctedValue = value.toUpperCase();
    } else if (field === 'ownerName') {
      correctedValue = autoCorrect.name(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Property Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your property details for tax payment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Property ID/Assessment Number *"
            value={formData.propertyId || ''}
            onChange={(e) => handleChange('propertyId', e.target.value)}
            error={!!errors.propertyId}
            helperText={errors.propertyId || 'Property assessment number from tax records'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

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
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Built-up Area (sq ft) *"
            type="number"
            value={formData.builtUpArea || ''}
            onChange={(e) => handleChange('builtUpArea', e.target.value)}
            error={!!errors.builtUpArea}
            helperText={errors.builtUpArea || 'Total built-up area in square feet'}
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
            helperText="Total plot area in square feet"
            inputProps={{ min: 1, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Floors"
            type="number"
            value={formData.numberOfFloors || ''}
            onChange={(e) => handleChange('numberOfFloors', e.target.value)}
            helperText="Total number of floors"
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Tax Calculation Step
const TaxCalculationStep = ({ formData, updateFormData, errors }) => {
  const [taxDetails, setTaxDetails] = React.useState({
    basicTax: 0,
    waterTax: 0,
    sewerageTax: 0,
    lightingTax: 0,
    educationCess: 0,
    penalty: 0,
    total: 0
  });

  React.useEffect(() => {
    // Calculate tax based on property details
    if (formData.builtUpArea && formData.propertyType) {
      const area = parseFloat(formData.builtUpArea) || 0;
      let ratePerSqFt = 0;

      switch (formData.propertyType) {
        case 'Residential':
          ratePerSqFt = 2;
          break;
        case 'Commercial':
          ratePerSqFt = 5;
          break;
        case 'Industrial':
          ratePerSqFt = 8;
          break;
        case 'Agricultural':
          ratePerSqFt = 1;
          break;
        default:
          ratePerSqFt = 2;
      }

      const basicTax = area * ratePerSqFt;
      const waterTax = basicTax * 0.1;
      const sewerageTax = basicTax * 0.05;
      const lightingTax = basicTax * 0.03;
      const educationCess = basicTax * 0.02;
      const penalty = formData.isDelayed ? basicTax * 0.1 : 0;
      const total = basicTax + waterTax + sewerageTax + lightingTax + educationCess + penalty;

      const calculated = {
        basicTax: Math.round(basicTax),
        waterTax: Math.round(waterTax),
        sewerageTax: Math.round(sewerageTax),
        lightingTax: Math.round(lightingTax),
        educationCess: Math.round(educationCess),
        penalty: Math.round(penalty),
        total: Math.round(total)
      };

      setTaxDetails(calculated);
      updateFormData({ taxDetails: calculated, totalAmount: calculated.total });
    }
  }, [formData.builtUpArea, formData.propertyType, formData.isDelayed]);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Tax Calculation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review your property tax calculation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.financialYear}>
            <InputLabel>Financial Year *</InputLabel>
            <Select
              value={formData.financialYear || ''}
              onChange={(e) => handleChange('financialYear', e.target.value)}
              label="Financial Year *"
            >
              <MenuItem value="2023-24">2023-24</MenuItem>
              <MenuItem value="2024-25">2024-25</MenuItem>
              <MenuItem value="2025-26">2025-26</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Is this a delayed payment? *
          </Typography>
          <RadioGroup
            value={formData.isDelayed || 'no'}
            onChange={(e) => handleChange('isDelayed', e.target.value === 'yes')}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="yes" control={<Radio />} label="Yes (Penalty applicable)" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tax Breakdown
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Basic Property Tax:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxDetails.basicTax.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Water Tax (10%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxDetails.waterTax.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Sewerage Tax (5%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxDetails.sewerageTax.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Street Lighting Tax (3%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxDetails.lightingTax.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Education Cess (2%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxDetails.educationCess.toLocaleString()}</Typography>
              </Grid>

              {formData.isDelayed && (
                <>
                  <Grid item xs={6}>
                    <Typography color="error">Penalty (10%):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" color="error">₹{taxDetails.penalty.toLocaleString()}</Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="primary">Total Amount:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="primary" align="right">
                  ₹{taxDetails.total.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {formData.isDelayed && (
          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Late Payment Penalty:</strong> A penalty of 10% has been added to your tax amount due to delayed payment.
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

// Payment Details Step
const PaymentDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'payerName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Payment Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide payment details and contact information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Payer Name *"
            value={formData.payerName || ''}
            onChange={(e) => handleChange('payerName', e.target.value)}
            error={!!errors.payerName}
            helperText={errors.payerName || 'Name of person making payment'}
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

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.paymentMethod}>
            <InputLabel>Payment Method *</InputLabel>
            <Select
              value={formData.paymentMethod || ''}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              label="Payment Method *"
            >
              <MenuItem value="Online">Online Payment</MenuItem>
              <MenuItem value="Cash">Cash Payment</MenuItem>
              <MenuItem value="Cheque">Cheque Payment</MenuItem>
              <MenuItem value="DD">Demand Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Payment Summary
            </Typography>
            <Typography variant="body1">
              Property ID: <strong>{formData.propertyId}</strong>
            </Typography>
            <Typography variant="body1">
              Financial Year: <strong>{formData.financialYear}</strong>
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
              Total Amount: ₹{(formData.totalAmount || 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> After successful payment, you will receive a payment receipt. 
              Please keep this receipt for your records and future reference.
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
    'Previous year tax receipt',
    'Property assessment certificate',
    'Identity proof of payer',
    'Address proof',
    'Power of attorney (if applicable)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for property tax payment
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={10}
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
const PropertyTaxPaymentForm = () => {
  const steps = [
    { id: 'property', title: 'Property Details', icon: 'Home' },
    { id: 'calculation', title: 'Tax Calculation', icon: 'Calculate' },
    { id: 'payment', title: 'Payment Details', icon: 'Payment' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Property Details
    propertyId: { type: 'propertyId', required: true },
    ownerName: { type: 'name', required: true },
    propertyAddress: { type: 'address', required: true },
    propertyType: { type: 'text', required: true },
    builtUpArea: { type: 'builtUpArea', required: true },
    
    // Tax Calculation
    financialYear: { type: 'text', required: true },
    
    // Payment Details
    payerName: { type: 'name', required: true },
    mobile: { type: 'mobile', required: true },
    paymentMethod: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Property Tax Payment"
      serviceType="property_tax_payment"
      steps={steps}
      validationRules={validationRules}
    >
      <PropertyDetailsStep />
      <TaxCalculationStep />
      <PaymentDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default PropertyTaxPaymentForm;
