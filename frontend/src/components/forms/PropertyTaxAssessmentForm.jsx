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

// Property Owner Information Step
const PropertyOwnerStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  
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
        मालकाचे तपशील
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        कर मूल्यांकनासाठी मालमत्ता मालकाचे तपशील प्रविष्ट करा
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="मालमत्ता मालकाचे नाव *"
            value={formData.ownerName || ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName || 'मालमत्ता कागदपत्रांनुसार नाव'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="अर्जदाराचे नाव"
            value={formData.applicantName || ''}
            onChange={(e) => handleChange('applicantName', e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || 'मालकापेक्षा वेगळे असल्यास'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="मोबाइल नंबर *"
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || '10-अंकी मोबाइल नंबर'}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ईमेल पत्ता"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || 'पर्यायी ईमेल पत्ता'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="मालकाचा पत्ता *"
            value={formData.ownerAddress || ''}
            onChange={(e) => handleChange('ownerAddress', e.target.value)}
            error={!!errors.ownerAddress}
            helperText={errors.ownerAddress || 'मालमत्ता मालकाचा संपूर्ण पत्ता'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            मालमत्तेशी नाते *
          </Typography>
          <RadioGroup
            value={formData.relationship || ''}
            onChange={(e) => handleChange('relationship', e.target.value)}
            row
          >
            <FormControlLabel value="Owner" control={<Radio />} label="मालक" />
            <FormControlLabel value="Legal Heir" control={<Radio />} label="कायदेशीर वारस" />
            <FormControlLabel value="Power of Attorney" control={<Radio />} label="मुख्तारनामा" />
            <FormControlLabel value="Authorized Representative" control={<Radio />} label="अधिकृत प्रतिनिधी" />
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
        मालमत्ता तपशील
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        मूल्यांकनासाठी संपूर्ण मालमत्ता माहिती प्रदान करा
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="मालमत्ता आयडी *"
            value={formData.propertyId || ''}
            onChange={(e) => handleChange('propertyId', e.target.value)}
            error={!!errors.propertyId}
            helperText={errors.propertyId || 'अद्वितीय मालमत्ता ओळख क्रमांक'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\-]{5,20}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="सर्वे नंबर *"
            value={formData.surveyNumber || ''}
            onChange={(e) => handleChange('surveyNumber', e.target.value)}
            error={!!errors.surveyNumber}
            helperText={errors.surveyNumber || 'सरकारी सर्वे नंबर'}
            inputProps={{ maxLength: 20, pattern: '[A-Za-z0-9\\/\\-]{1,20}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="मालमत्तेचा पत्ता *"
            value={formData.propertyAddress || ''}
            onChange={(e) => handleChange('propertyAddress', e.target.value)}
            error={!!errors.propertyAddress}
            helperText={errors.propertyAddress || 'संपूर्ण मालमत्ता पत्ता'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>राज्य *</InputLabel>
            <Select
              value={formData.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              label="राज्य *"
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
            <InputLabel>जिल्हा *</InputLabel>
            <Select
              value={formData.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              label="जिल्हा *"
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
            <InputLabel>मालमत्ता प्रकार *</InputLabel>
            <Select
              value={formData.propertyType || ''}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              label="मालमत्ता प्रकार *"
            >
              <MenuItem value="Residential">निवासी</MenuItem>
              <MenuItem value="Commercial">व्यावसायिक</MenuItem>
              <MenuItem value="Industrial">औद्योगिक</MenuItem>
              <MenuItem value="Agricultural">शेती</MenuItem>
              <MenuItem value="Vacant Land">रिकामी जमीन</MenuItem>
              <MenuItem value="Mixed Use">मिश्र वापर</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.propertyUsage}>
            <InputLabel>सध्याचा वापर *</InputLabel>
            <Select
              value={formData.propertyUsage || ''}
              onChange={(e) => handleChange('propertyUsage', e.target.value)}
              label="सध्याचा वापर *"
            >
              <MenuItem value="Self Occupied">स्वतःचा वापर</MenuItem>
              <MenuItem value="Rented">भाड्याने दिलेले</MenuItem>
              <MenuItem value="Vacant">रिकामे</MenuItem>
              <MenuItem value="Under Construction">बांधकामाधीन</MenuItem>
              <MenuItem value="Commercial Use">व्यावसायिक वापर</MenuItem>
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
        मालमत्ता वैशिष्ट्ये
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        अचूक मूल्यांकनासाठी तपशीलवार मालमत्ता वैशिष्ट्ये प्रदान करा
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="बांधकाम क्षेत्र (चौ फूट) *"
            type="number"
            value={formData.builtUpArea || ''}
            onChange={(e) => handleChange('builtUpArea', e.target.value)}
            error={!!errors.builtUpArea}
            helperText={errors.builtUpArea || 'एकूण बांधकाम क्षेत्र'}
            inputProps={{ min: 1, max: 999999, pattern: '^\\d{1,6}(\\.\\d{1,2})?$' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="प्लॉट क्षेत्र (चौ फूट) *"
            type="number"
            value={formData.plotArea || ''}
            onChange={(e) => handleChange('plotArea', e.target.value)}
            error={!!errors.plotArea}
            helperText={errors.plotArea || 'एकूण प्लॉट क्षेत्र'}
            inputProps={{ min: 1, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="मजल्यांची संख्या *"
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
            label="मालमत्तेचे वय (वर्षे)"
            type="number"
            value={formData.propertyAge || ''}
            onChange={(e) => handleChange('propertyAge', e.target.value)}
            helperText="घसारा गणनेसाठी मालमत्तेचे वय"
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="बांधकाम तारीख"
              value={formData.constructionDate || null}
              onChange={(date) => handleChange('constructionDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="बांधकाम पूर्ण झाल्याची तारीख"
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>बांधकाम गुणवत्ता</InputLabel>
            <Select
              value={formData.constructionQuality || ''}
              onChange={(e) => handleChange('constructionQuality', e.target.value)}
              label="बांधकाम गुणवत्ता"
            >
              <MenuItem value="Excellent">उत्कृष्ट</MenuItem>
              <MenuItem value="Good">चांगली</MenuItem>
              <MenuItem value="Average">सरासरी</MenuItem>
              <MenuItem value="Below Average">सरासरीपेक्षा कमी</MenuItem>
              <MenuItem value="Poor">खराब</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="खोल्यांची संख्या"
            type="number"
            value={formData.numberOfRooms || ''}
            onChange={(e) => handleChange('numberOfRooms', e.target.value)}
            helperText="एकूण खोल्यांची संख्या"
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="स्नानगृहांची संख्या"
            type="number"
            value={formData.numberOfBathrooms || ''}
            onChange={(e) => handleChange('numberOfBathrooms', e.target.value)}
            helperText="एकूण स्नानगृहांची संख्या"
            inputProps={{ min: 1, max: 20 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            उपलब्ध सुविधा
          </Typography>
          <Grid container spacing={1}>
            {[
              { en: 'Parking', mr: 'पार्किंग' },
              { en: 'Garden', mr: 'बाग' },
              { en: 'Swimming Pool', mr: 'जलतरण तलाव' },
              { en: 'Elevator', mr: 'लिफ्ट' },
              { en: 'Generator', mr: 'जनरेटर' },
              { en: 'Security', mr: 'सुरक्षा' }
            ].map((amenity) => (
              <Grid item key={amenity.en}>
                <FormControlLabel
                  control={
                    <input
                      type="checkbox"
                      checked={formData.amenities?.includes(amenity.en) || false}
                      onChange={(e) => {
                        const currentAmenities = formData.amenities || [];
                        const updatedAmenities = e.target.checked
                          ? [...currentAmenities, amenity.en]
                          : currentAmenities.filter(a => a !== amenity.en);
                        handleChange('amenities', updatedAmenities);
                      }}
                    />
                  }
                  label={amenity.mr}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'success.50' }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              मूल्यांकित मालमत्ता मूल्य
            </Typography>
            <Typography variant="h4" color="success.main">
              ₹{assessedValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              *हे प्राथमिक मूल्यांकन आहे. अंतिम मूल्यांकन महसूल विभागाकडून केले जाईल.
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
    'मालमत्ता मालकी कागदपत्रे (विक्री खत/पट्टा)',
    'सर्वे सेटलमेंट रेकॉर्ड',
    'इमारत योजना मंजुरी',
    'पूर्णता प्रमाणपत्र',
    'मागील कर मूल्यांकन रेकॉर्ड',
    'मालकाचा ओळख पुरावा',
    'पत्ता पुरावा',
    'मालमत्तेचे फोटो (बाहेरील आणि आतील)',
    'युटिलिटी बिले (वीज/पाणी)',
    'सोसायटी/संघटनेकडून अनापत्ती प्रमाणपत्र (लागू असल्यास)'
  ];

  const handleDocumentsChange = (documents) => {
    updateFormData({ documents });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        कागदपत्र अपलोड
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        कृपया मालमत्ता कर मूल्यांकनासाठी सहायक कागदपत्रे अपलोड करा
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
  const { t } = useLanguage();
  
  const steps = [
    { id: 'owner', title: 'मालक तपशील', icon: 'Person' },
    { id: 'property', title: 'मालमत्ता माहिती', icon: 'Home' },
    { id: 'specifications', title: 'मूल्यांकन तपशील', icon: 'Architecture' },
    { id: 'documents', title: 'कागदपत्रे', icon: 'Description' }
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
      serviceName="मालमत्ता कर मूल्यांकन अर्ज"
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
