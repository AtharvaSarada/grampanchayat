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

// Connection Details Step
const ConnectionDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'connectionId') {
      correctedValue = value.toUpperCase();
    } else if (field === 'consumerName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Water Connection Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your water connection details for tax payment
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Water Connection ID *"
            value={formData.connectionId || ''}
            onChange={(e) => handleChange('connectionId', e.target.value)}
            error={!!errors.connectionId}
            helperText={errors.connectionId || 'Water connection identification number'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Consumer Name *"
            value={formData.consumerName || ''}
            onChange={(e) => handleChange('consumerName', e.target.value)}
            error={!!errors.consumerName}
            helperText={errors.consumerName || 'Name as per water connection'}
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
          <FormControl fullWidth error={!!errors.connectionType}>
            <InputLabel>Connection Type *</InputLabel>
            <Select
              value={formData.connectionType || ''}
              onChange={(e) => handleChange('connectionType', e.target.value)}
              label="Connection Type *"
            >
              <MenuItem value="Domestic">Domestic</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
              <MenuItem value="Industrial">Industrial</MenuItem>
              <MenuItem value="Institutional">Institutional</MenuItem>
              <MenuItem value="Bulk Supply">Bulk Supply</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Service Address *"
            value={formData.serviceAddress || ''}
            onChange={(e) => handleChange('serviceAddress', e.target.value)}
            error={!!errors.serviceAddress}
            helperText={errors.serviceAddress || 'Address where water connection is provided'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Meter Number"
            value={formData.meterNumber || ''}
            onChange={(e) => handleChange('meterNumber', e.target.value)}
            helperText="Water meter number (if applicable)"
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.meterType}>
            <InputLabel>Meter Type *</InputLabel>
            <Select
              value={formData.meterType || ''}
              onChange={(e) => handleChange('meterType', e.target.value)}
              label="Meter Type *"
            >
              <MenuItem value="Digital">Digital Meter</MenuItem>
              <MenuItem value="Analog">Analog Meter</MenuItem>
              <MenuItem value="Smart">Smart Meter</MenuItem>
              <MenuItem value="No Meter">No Meter (Fixed Rate)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Usage and Billing Step
const UsageBillingStep = ({ formData, updateFormData, errors }) => {
  const [taxCalculation, setTaxCalculation] = React.useState({
    waterCharges: 0,
    sewerageCharges: 0,
    developmentCharges: 0,
    penalty: 0,
    total: 0
  });

  React.useEffect(() => {
    // Calculate water tax based on usage and connection type
    const usage = parseFloat(formData.waterUsage) || 0;
    const connectionType = formData.connectionType;
    const isDelayed = formData.isDelayed === 'yes';

    let ratePerUnit = 0;
    let fixedCharge = 0;

    switch (connectionType) {
      case 'Domestic':
        ratePerUnit = usage <= 10000 ? 8 : usage <= 20000 ? 12 : 18;
        fixedCharge = 200;
        break;
      case 'Commercial':
        ratePerUnit = 25;
        fixedCharge = 500;
        break;
      case 'Industrial':
        ratePerUnit = 35;
        fixedCharge = 1000;
        break;
      case 'Institutional':
        ratePerUnit = 15;
        fixedCharge = 300;
        break;
      case 'Bulk Supply':
        ratePerUnit = 20;
        fixedCharge = 2000;
        break;
      default:
        ratePerUnit = 12;
        fixedCharge = 200;
    }

    const waterCharges = fixedCharge + (usage * ratePerUnit / 1000);
    const sewerageCharges = waterCharges * 0.3; // 30% of water charges
    const developmentCharges = waterCharges * 0.1; // 10% of water charges
    const penalty = isDelayed ? waterCharges * 0.15 : 0; // 15% penalty if delayed
    const total = waterCharges + sewerageCharges + developmentCharges + penalty;

    const calculated = {
      waterCharges: Math.round(waterCharges),
      sewerageCharges: Math.round(sewerageCharges),
      developmentCharges: Math.round(developmentCharges),
      penalty: Math.round(penalty),
      total: Math.round(total)
    };

    setTaxCalculation(calculated);
    updateFormData({ taxCalculation: calculated, totalAmount: calculated.total });
  }, [formData.waterUsage, formData.connectionType, formData.isDelayed]);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Usage and Billing Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter water usage details and billing period
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.billingPeriod}>
            <InputLabel>Billing Period *</InputLabel>
            <Select
              value={formData.billingPeriod || ''}
              onChange={(e) => handleChange('billingPeriod', e.target.value)}
              label="Billing Period *"
            >
              <MenuItem value="January 2024">January 2024</MenuItem>
              <MenuItem value="February 2024">February 2024</MenuItem>
              <MenuItem value="March 2024">March 2024</MenuItem>
              <MenuItem value="April 2024">April 2024</MenuItem>
              <MenuItem value="May 2024">May 2024</MenuItem>
              <MenuItem value="June 2024">June 2024</MenuItem>
              <MenuItem value="July 2024">July 2024</MenuItem>
              <MenuItem value="August 2024">August 2024</MenuItem>
              <MenuItem value="September 2024">September 2024</MenuItem>
              <MenuItem value="October 2024">October 2024</MenuItem>
              <MenuItem value="November 2024">November 2024</MenuItem>
              <MenuItem value="December 2024">December 2024</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Water Usage (Liters) *"
            type="number"
            value={formData.waterUsage || ''}
            onChange={(e) => handleChange('waterUsage', e.target.value)}
            error={!!errors.waterUsage}
            helperText={errors.waterUsage || 'Water consumption in liters'}
            inputProps={{ min: 0, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Previous Reading Date"
              value={formData.previousReadingDate || null}
              onChange={(date) => handleChange('previousReadingDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Date of previous meter reading"
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Current Reading Date"
              value={formData.currentReadingDate || null}
              onChange={(date) => handleChange('currentReadingDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Date of current meter reading"
                />
              )}
              maxDate={new Date()}
              minDate={formData.previousReadingDate}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Previous Meter Reading"
            type="number"
            value={formData.previousReading || ''}
            onChange={(e) => handleChange('previousReading', e.target.value)}
            helperText="Previous meter reading (if applicable)"
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Current Meter Reading"
            type="number"
            value={formData.currentReading || ''}
            onChange={(e) => handleChange('currentReading', e.target.value)}
            helperText="Current meter reading (if applicable)"
            inputProps={{ min: formData.previousReading || 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Is this a delayed payment? *
          </Typography>
          <RadioGroup
            value={formData.isDelayed || 'no'}
            onChange={(e) => handleChange('isDelayed', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="yes" control={<Radio />} label="Yes (Penalty applicable)" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tax Calculation
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Water Charges:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxCalculation.waterCharges.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Sewerage Charges (30%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxCalculation.sewerageCharges.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>Development Charges (10%):</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxCalculation.developmentCharges.toLocaleString()}</Typography>
              </Grid>

              {formData.isDelayed === 'yes' && (
                <>
                  <Grid item xs={6}>
                    <Typography color="error">Penalty (15%):</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" color="error">₹{taxCalculation.penalty.toLocaleString()}</Typography>
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
                  ₹{taxCalculation.total.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {formData.isDelayed === 'yes' && (
          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>Late Payment Penalty:</strong> A penalty of 15% has been added to your water tax amount due to delayed payment.
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
    } else if (field === 'payerMobile') {
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
        Provide payment details and payer information
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
            label="Payer Mobile Number *"
            value={formData.payerMobile || ''}
            onChange={(e) => handleChange('payerMobile', e.target.value)}
            error={!!errors.payerMobile}
            helperText={errors.payerMobile || '10-digit mobile number'}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Is the payer same as consumer? *
          </Typography>
          <RadioGroup
            value={formData.sameAsPayer || ''}
            onChange={(e) => handleChange('sameAsPayer', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {formData.sameAsPayer === 'no' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Relationship to Consumer *"
              value={formData.relationshipToConsumer || ''}
              onChange={(e) => handleChange('relationshipToConsumer', e.target.value)}
              error={!!errors.relationshipToConsumer}
              helperText={errors.relationshipToConsumer || 'Explain relationship to water consumer'}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
        )}

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
              <MenuItem value="NEFT/RTGS">NEFT/RTGS</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Payment Summary
            </Typography>
            <Typography variant="body1">
              Connection ID: <strong>{formData.connectionId}</strong>
            </Typography>
            <Typography variant="body1">
              Consumer Name: <strong>{formData.consumerName}</strong>
            </Typography>
            <Typography variant="body1">
              Billing Period: <strong>{formData.billingPeriod}</strong>
            </Typography>
            <Typography variant="body1">
              Water Usage: <strong>{formData.waterUsage} Liters</strong>
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
              Please keep this receipt for your records and future reference. Water supply will continue 
              uninterrupted after payment confirmation.
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
    'Water connection agreement',
    'Previous water tax receipts',
    'Identity proof of payer',
    'Address proof of service location',
    'Meter reading photographs',
    'Bank account details (for online payment)',
    'Power of attorney (if paying on behalf)',
    'Property ownership documents',
    'Previous correspondence with water department'
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
        Please upload supporting documents for water tax payment
      </Typography>

      <DocumentUpload
        requiredDocuments={requiredDocuments}
        uploadedDocuments={formData.documents || []}
        onDocumentsChange={handleDocumentsChange}
        maxFiles={10}
        serviceType="water_tax_payment"
      />
    </Box>
  );
};

// Main Form Component
const WaterTaxPaymentForm = () => {
  const steps = [
    { id: 'connection', title: 'Connection Details', icon: 'Water' },
    { id: 'usage', title: 'Usage & Billing', icon: 'Receipt' },
    { id: 'payment', title: 'Payment Details', icon: 'Payment' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Connection Details
    connectionId: { type: 'text', required: true },
    consumerName: { type: 'name', required: true },
    mobile: { type: 'mobile', required: true },
    connectionType: { type: 'text', required: true },
    serviceAddress: { type: 'address', required: true },
    meterType: { type: 'text', required: true },
    
    // Usage & Billing
    billingPeriod: { type: 'text', required: true },
    waterUsage: { type: 'number', required: true },
    
    // Payment Details
    payerName: { type: 'name', required: true },
    payerMobile: { type: 'mobile', required: true },
    sameAsPayer: { type: 'text', required: true },
    paymentMethod: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Water Tax Payment"
      serviceType="water_tax_payment"
      steps={steps}
      validationRules={validationRules}
    >
      <ConnectionDetailsStep />
      <UsageBillingStep />
      <PaymentDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default WaterTaxPaymentForm;
