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

// Connection Details Step
const ConnectionDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t("forms.waterTaxPayment.connectionDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.waterTaxPayment.connectionDetailsSubtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.waterTaxPayment.connectionId") + " *"}
            value={formData.connectionId || ''}
            onChange={(e) => handleChange('connectionId', e.target.value)}
            error={!!errors.connectionId}
            helperText={errors.connectionId || t("forms.waterTaxPayment.connectionIdHelper")}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.waterTaxPayment.consumerName") + " *"}
            value={formData.consumerName || ''}
            onChange={(e) => handleChange('consumerName', e.target.value)}
            error={!!errors.consumerName}
            helperText={errors.consumerName || t("forms.waterTaxPayment.consumerNameHelper")}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.mobile") + " *"}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("common.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.connectionType}>
            <InputLabel>{t("forms.waterTaxPayment.connectionType")} *</InputLabel>
            <Select
              value={formData.connectionType || ''}
              onChange={(e) => handleChange('connectionType', e.target.value)}
              label={t("forms.waterTaxPayment.connectionType") + " *"}
            >
              <MenuItem value="Domestic">{t("forms.waterTaxPayment.domestic")}</MenuItem>
              <MenuItem value="Commercial">{t("forms.waterTaxPayment.commercial")}</MenuItem>
              <MenuItem value="Industrial">औद्योगिक</MenuItem>
              <MenuItem value="Institutional">संस्थात्मक</MenuItem>
              <MenuItem value="Bulk Supply">मोठ्या प्रमाणात पुरवठा</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="सेवा पत्ता *"
            value={formData.serviceAddress || ''}
            onChange={(e) => handleChange('serviceAddress', e.target.value)}
            error={!!errors.serviceAddress}
            helperText={errors.serviceAddress || 'पाणी कनेक्शन दिलेला पत्ता'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="मीटर नंबर"
            value={formData.meterNumber || ''}
            onChange={(e) => handleChange('meterNumber', e.target.value)}
            helperText="पाणी मीटर नंबर (लागू असल्यास)"
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.meterType}>
            <InputLabel>मीटर प्रकार *</InputLabel>
            <Select
              value={formData.meterType || ''}
              onChange={(e) => handleChange('meterType', e.target.value)}
              label="मीटर प्रकार *"
            >
              <MenuItem value="Digital">डिजिटल मीटर</MenuItem>
              <MenuItem value="Analog">अॅनालॉग मीटर</MenuItem>
              <MenuItem value="Smart">स्मार्ट मीटर</MenuItem>
              <MenuItem value="No Meter">मीटर नाही (निश्चित दर)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Usage and Billing Step
const UsageBillingStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        वापर आणि बिलिंग माहिती
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        पाणी वापर तपशील आणि बिलिंग कालावधी प्रविष्ट करा
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.billingPeriod}>
            <InputLabel>बिलिंग कालावधी *</InputLabel>
            <Select
              value={formData.billingPeriod || ''}
              onChange={(e) => handleChange('billingPeriod', e.target.value)}
              label="बिलिंग कालावधी *"
            >
              <MenuItem value="January 2024">जानेवारी 2024</MenuItem>
              <MenuItem value="February 2024">फेब्रुवारी 2024</MenuItem>
              <MenuItem value="March 2024">मार्च 2024</MenuItem>
              <MenuItem value="April 2024">एप्रिल 2024</MenuItem>
              <MenuItem value="May 2024">मे 2024</MenuItem>
              <MenuItem value="June 2024">जून 2024</MenuItem>
              <MenuItem value="July 2024">जुलै 2024</MenuItem>
              <MenuItem value="August 2024">ऑगस्ट 2024</MenuItem>
              <MenuItem value="September 2024">सप्टेंबर 2024</MenuItem>
              <MenuItem value="October 2024">ऑक्टोबर 2024</MenuItem>
              <MenuItem value="November 2024">नोव्हेंबर 2024</MenuItem>
              <MenuItem value="December 2024">डिसेंबर 2024</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="पाणी वापर (लिटर) *"
            type="number"
            value={formData.waterUsage || ''}
            onChange={(e) => handleChange('waterUsage', e.target.value)}
            error={!!errors.waterUsage}
            helperText={errors.waterUsage || 'लिटरमध्ये पाणी वापर'}
            inputProps={{ min: 0, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="मागील रीडिंग तारीख"
              value={formData.previousReadingDate || null}
              onChange={(date) => handleChange('previousReadingDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="मागील मीटर रीडिंगची तारीख"
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="सध्याची रीडिंग तारीख"
              value={formData.currentReadingDate || null}
              onChange={(date) => handleChange('currentReadingDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="सध्याच्या मीटर रीडिंगची तारीख"
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
            label={t("forms.waterTaxPayment.previousMeterReading")}
            type="number"
            value={formData.previousReading || ''}
            onChange={(e) => handleChange('previousReading', e.target.value)}
            helperText={t("forms.waterTaxPayment.previousMeterReadingHelper")}
            inputProps={{ min: 0 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.waterTaxPayment.currentMeterReading")}
            type="number"
            value={formData.currentReading || ''}
            onChange={(e) => handleChange('currentReading', e.target.value)}
            helperText={t("forms.waterTaxPayment.currentMeterReadingHelper")}
            inputProps={{ min: formData.previousReading || 0 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.waterTaxPayment.isDelayedPayment")} *
          </Typography>
          <RadioGroup
            value={formData.isDelayed || 'no'}
            onChange={(e) => handleChange('isDelayed', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label={t("common.no")} />
            <FormControlLabel value="yes" control={<Radio />} label={t("forms.waterTaxPayment.yesWithPenalty")} />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("forms.waterTaxPayment.taxCalculation")}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>{t("forms.waterTaxPayment.waterCharges")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxCalculation.waterCharges.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.waterTaxPayment.sewerageCharges")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxCalculation.sewerageCharges.toLocaleString()}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.waterTaxPayment.developmentCharges")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">₹{taxCalculation.developmentCharges.toLocaleString()}</Typography>
              </Grid>

              {formData.isDelayed === 'yes' && (
                <>
                  <Grid item xs={6}>
                    <Typography color="error">{t("forms.waterTaxPayment.penalty")}:</Typography>
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
                <Typography variant="h6" color="primary">{t("forms.waterTaxPayment.totalAmount")}:</Typography>
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
                <strong>उशीरा पेमेंट दंड:</strong> उशीरा पेमेंटमुळे तुमच्या पाणी कर रकमेत 15% दंड जोडला गेला आहे.
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
  const { t } = useLanguage();
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
        पेमेंट माहिती
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        पेमेंट तपशील आणि पेमेंट करणाऱ्याची माहिती द्या
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="पेमेंट करणाऱ्याचे नाव *"
            value={formData.payerName || ''}
            onChange={(e) => handleChange('payerName', e.target.value)}
            error={!!errors.payerName}
            helperText={errors.payerName || 'पेमेंट करणाऱ्या व्यक्तीचे नाव'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="पेमेंट करणाऱ्याचा मोबाइल नंबर *"
            value={formData.payerMobile || ''}
            onChange={(e) => handleChange('payerMobile', e.target.value)}
            error={!!errors.payerMobile}
            helperText={errors.payerMobile || '10-अंकी मोबाइल नंबर'}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            पेमेंट करणारा ग्राहकासारखाच आहे का? *
          </Typography>
          <RadioGroup
            value={formData.sameAsPayer || ''}
            onChange={(e) => handleChange('sameAsPayer', e.target.value)}
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label="होय" />
            <FormControlLabel value="no" control={<Radio />} label="नाही" />
          </RadioGroup>
        </Grid>

        {formData.sameAsPayer === 'no' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="ग्राहकाशी नाते *"
              value={formData.relationshipToConsumer || ''}
              onChange={(e) => handleChange('relationshipToConsumer', e.target.value)}
              error={!!errors.relationshipToConsumer}
              helperText={errors.relationshipToConsumer || 'पाणी ग्राहकाशी नाते स्पष्ट करा'}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.paymentMethod}>
            <InputLabel>पेमेंट पद्धत *</InputLabel>
            <Select
              value={formData.paymentMethod || ''}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              label="पेमेंट पद्धत *"
            >
              <MenuItem value="Online">ऑनलाइन पेमेंट</MenuItem>
              <MenuItem value="Cash">रोख पेमेंट</MenuItem>
              <MenuItem value="Cheque">चेक पेमेंट</MenuItem>
              <MenuItem value="DD">डिमांड ड्राफ्ट</MenuItem>
              <MenuItem value="NEFT/RTGS">NEFT/RTGS</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              पेमेंट सारांश
            </Typography>
            <Typography variant="body1">
              कनेक्शन आयडी: <strong>{formData.connectionId}</strong>
            </Typography>
            <Typography variant="body1">
              ग्राहक नाव: <strong>{formData.consumerName}</strong>
            </Typography>
            <Typography variant="body1">
              बिलिंग कालावधी: <strong>{formData.billingPeriod}</strong>
            </Typography>
            <Typography variant="body1">
              पाणी वापर: <strong>{formData.waterUsage} लिटर</strong>
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
              एकूण रक्कम: ₹{(formData.totalAmount || 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>टीप:</strong> यशस्वी पेमेंटनंतर, तुम्हाला पेमेंट पावती मिळेल. 
              कृपया ही पावती तुमच्या नोंदी आणि भविष्यातील संदर्भासाठी ठेवा. पेमेंट पुष्टीनंतर पाणी पुरवठा 
              अखंडित चालू राहील.
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
    'पाणी कनेक्शन करार',
    'मागील पाणी कर पावत्या',
    'पेमेंट करणाऱ्याचा ओळख पुरावा',
    'सेवा स्थानाचा पत्ता पुरावा',
    'मीटर रीडिंग फोटो',
    'बँक खाते तपशील (ऑनलाइन पेमेंटसाठी)',
    'मुख्तारनामा (वतीने पेमेंट करत असल्यास)',
    'मालमत्ता मालकी कागदपत्रे',
    'पाणी विभागाशी मागील पत्रव्यवहार'
  ];

  const handleDocumentsChange = (documents) => {
    updateFormData({ documents });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        कागदपत्रे अपलोड
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        कृपया पाणी कर भरणेसाठी सहायक कागदपत्रे अपलोड करा
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
  const { t } = useLanguage();
  
  const steps = [
    { id: 'connection', title: 'कनेक्शन तपशील', icon: 'Water' },
    { id: 'usage', title: 'वापर आणि बिलिंग', icon: 'Receipt' },
    { id: 'payment', title: 'पेमेंट तपशील', icon: 'Payment' },
    { id: 'documents', title: 'कागदपत्रे', icon: 'Description' }
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
      serviceName="पाणी कर भरणा"
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
