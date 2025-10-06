import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from '@mui/material';
import {
  Person,
  LocationOn,
  CalendarToday,
  Upload,
  CheckCircle,
  Info,
  Save,
  Delete
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import MultiStepForm from './MultiStepForm';
import ChakraSpinner from '../common/ChakraSpinner';
import toast from 'react-hot-toast';
import { handleFormSubmission } from '../../services/formSubmissionService';
import { useFormDraft } from '../../hooks/useFormDraft';

const BirthCertificateForm = () => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // Use auto-save draft hook
  const {
    formData,
    setFormData,
    lastSaved,
    isSaving,
    clearDraft,
    saveDraft,
    hasDraft
  } = useFormDraft('birth-certificate', {
    // Child Details
    childFirstName: '',
    childLastName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    gender: '',
    weight: '',
    
    // Father's Details
    fatherFirstName: '',
    fatherLastName: '',
    fatherAge: '',
    fatherEducation: '',
    fatherOccupation: '',
    fatherNationality: '',
    
    // Mother's Details
    motherFirstName: '',
    motherLastName: '',
    motherAge: '',
    motherEducation: '',
    motherOccupation: '',
    motherNationality: '',
    
    // Address Details
    permanentAddress: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    
    // Hospital/Delivery Details
    hospitalName: '',
    hospitalAddress: '',
    doctorName: '',
    attendantType: '',
    
    // Additional Information
    registrationDelay: 'Within 21 days',
    reasonForDelay: '',
    informantName: '',
    informantRelation: '',
    informantAddress: ''
  }, 1000); // Auto-save after 1 second of inactivity

  const [documents, setDocuments] = useState({
    birthProofHospital: null,
    parentsIdProof: null,
    addressProof: null,
    marriageCertificate: null
  });

  const steps = ['Personal Details', 'Parent Details', 'Address & Hospital', 'Documents', 'Review & Submit'];

  const requiredDocuments = [
    'Birth proof from hospital/medical certificate',
    'Identity proof of parents (Aadhar/PAN/Passport)',
    'Address proof (Ration card/Electricity bill/Rent agreement)',
    'Marriage certificate of parents (if available)',
    'Affidavit (if birth registration is delayed)'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (documentType, file) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: file
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Personal Details
        return formData.childFirstName && formData.childLastName && formData.dateOfBirth && formData.gender;
      case 1: // Parent Details
        return formData.fatherFirstName && formData.fatherLastName && formData.motherFirstName && formData.motherLastName;
      case 2: // Address & Hospital
        return formData.permanentAddress && formData.city && formData.district && formData.hospitalName;
      case 3: // Documents
        return documents.birthProofHospital && documents.parentsIdProof;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      toast.error('Please fill all required fields in this step');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error('Please log in to submit an application.');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare documents array from uploaded files
      const documentFiles = [];
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          documentFiles.push({
            name: file.name,
            type: key,
            file: file
          });
        }
      });

      // Create submission data
      const submissionData = {
        serviceType: 'birth_certificate',
        currentUser: currentUser, // Pass the current user
        formData: {
          // Child Details
          childName: `${formData.childFirstName} ${formData.childLastName}`,
          childFirstName: formData.childFirstName,
          childLastName: formData.childLastName,
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth,
          placeOfBirth: formData.placeOfBirth,
          gender: formData.gender,
          weight: formData.weight,
          
          // Parent Details
          fatherName: `${formData.fatherFirstName} ${formData.fatherLastName}`,
          fatherFirstName: formData.fatherFirstName,
          fatherLastName: formData.fatherLastName,
          fatherAge: formData.fatherAge,
          fatherEducation: formData.fatherEducation,
          fatherOccupation: formData.fatherOccupation,
          
          motherName: `${formData.motherFirstName} ${formData.motherLastName}`,
          motherFirstName: formData.motherFirstName,
          motherLastName: formData.motherLastName,
          motherAge: formData.motherAge,
          motherEducation: formData.motherEducation,
          motherOccupation: formData.motherOccupation,
          
          // Address Details
          permanentAddress: formData.permanentAddress,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          
          // Hospital Details
          hospitalName: formData.hospitalName,
          hospitalAddress: formData.hospitalAddress,
          doctorName: formData.doctorName,
          
          // Additional Information
          registrationDelay: formData.registrationDelay,
          reasonForDelay: formData.reasonForDelay,
          informantName: formData.informantName,
          informantRelation: formData.informantRelation,
          informantAddress: formData.informantAddress
        },
        documents: documentFiles
      };

      // Submit using the form submission service
      const result = await handleFormSubmission(submissionData);
      
      if (result.success) {
        // Clear draft after successful submission
        clearDraft();
        
        // Reset form on success
        setFormData({
          childFirstName: '', childLastName: '', dateOfBirth: '', timeOfBirth: '', 
          placeOfBirth: '', gender: '', weight: '',
          fatherFirstName: '', fatherLastName: '', fatherAge: '', fatherEducation: '',
          fatherOccupation: '', fatherNationality: '',
          motherFirstName: '', motherLastName: '', motherAge: '', motherEducation: '',
          motherOccupation: '', motherNationality: '',
          permanentAddress: '', city: '', district: '', state: '', pincode: '',
          hospitalName: '', hospitalAddress: '', doctorName: '', attendantType: '',
          registrationDelay: 'Within 21 days', reasonForDelay: '', 
          informantName: '', informantRelation: '', informantAddress: ''
        });
        setDocuments({ birthProofHospital: null, parentsIdProof: null, addressProof: null, marriageCertificate: null });
        setActiveStep(0);
        
        // Show success message with reference number
        toast.success(`Application submitted successfully! Reference: ${result.referenceNumber}`, {
          duration: 6000
        });
        
        // Optional: Redirect to applications page after a delay
        setTimeout(() => {
          // window.location.href = '/user/applications';
        }, 3000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(`Failed to submit application: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderPersonalDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Child Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Child's First Name"
          name="childFirstName"
          value={formData.childFirstName}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: <Person color="action" />
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Child's Last Name"
          name="childLastName"
          value={formData.childLastName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Time of Birth"
          name="timeOfBirth"
          type="time"
          value={formData.timeOfBirth}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth required>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            label="Gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Weight at Birth (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleInputChange}
          inputProps={{ step: 0.1 }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Place of Birth"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={handleInputChange}
          placeholder="Hospital/Home/City, State"
        />
      </Grid>
    </Grid>
  );

  const renderParentDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Father's Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Father's First Name"
          name="fatherFirstName"
          value={formData.fatherFirstName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Father's Last Name"
          name="fatherLastName"
          value={formData.fatherLastName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Age"
          name="fatherAge"
          type="number"
          value={formData.fatherAge}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Education"
          name="fatherEducation"
          value={formData.fatherEducation}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Occupation"
          name="fatherOccupation"
          value={formData.fatherOccupation}
          onChange={handleInputChange}
        />
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Mother's Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Mother's First Name"
          name="motherFirstName"
          value={formData.motherFirstName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Mother's Last Name"
          name="motherLastName"
          value={formData.motherLastName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Age"
          name="motherAge"
          type="number"
          value={formData.motherAge}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Education"
          name="motherEducation"
          value={formData.motherEducation}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Occupation"
          name="motherOccupation"
          value={formData.motherOccupation}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );

  const renderAddressHospital = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Address Details
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Permanent Address"
          name="permanentAddress"
          multiline
          rows={3}
          value={formData.permanentAddress}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="District"
          name="district"
          value={formData.district}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="State"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="PIN Code"
          name="pincode"
          value={formData.pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            setFormData(prev => ({ ...prev, pincode: value }));
          }}
          inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Hospital/Delivery Details
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Hospital/Institution Name"
          name="hospitalName"
          value={formData.hospitalName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Doctor/Attendant Name"
          name="doctorName"
          value={formData.doctorName}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Hospital Address"
          name="hospitalAddress"
          multiline
          rows={2}
          value={formData.hospitalAddress}
          onChange={handleInputChange}
        />
      </Grid>
    </Grid>
  );

  const renderDocuments = () => (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Required Documents
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload clear, readable copies of all required documents. Maximum file size: 5MB per document.
      </Alert>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <List>
            {requiredDocuments.map((doc, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary={doc} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            fullWidth
            component="label"
            startIcon={<Upload />}
            sx={{ p: 2 }}
          >
            Upload Birth Proof from Hospital *
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('birthProofHospital', e.target.files[0])}
            />
          </Button>
          {documents.birthProofHospital && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ✓ {documents.birthProofHospital.name}
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            fullWidth
            component="label"
            startIcon={<Upload />}
            sx={{ p: 2 }}
          >
            Upload Parents' ID Proof *
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('parentsIdProof', e.target.files[0])}
            />
          </Button>
          {documents.parentsIdProof && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ✓ {documents.parentsIdProof.name}
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            fullWidth
            component="label"
            startIcon={<Upload />}
            sx={{ p: 2 }}
          >
            Upload Address Proof
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('addressProof', e.target.files[0])}
            />
          </Button>
          {documents.addressProof && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ✓ {documents.addressProof.name}
            </Typography>
          )}
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            fullWidth
            component="label"
            startIcon={<Upload />}
            sx={{ p: 2 }}
          >
            Upload Marriage Certificate
            <input
              type="file"
              hidden
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload('marriageCertificate', e.target.files[0])}
            />
          </Button>
          {documents.marriageCertificate && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ✓ {documents.marriageCertificate.name}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Review Your Application
      </Typography>
      <Alert severity="warning" sx={{ mb: 3 }}>
        Please review all information carefully before submitting. You will not be able to edit the application after submission.
      </Alert>
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Child Details
            </Typography>
            <Typography>Name: {formData.childFirstName} {formData.childLastName}</Typography>
            <Typography>Date of Birth: {formData.dateOfBirth}</Typography>
            <Typography>Gender: {formData.gender}</Typography>
            <Typography>Place of Birth: {formData.placeOfBirth}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Parents Details
            </Typography>
            <Typography>Father: {formData.fatherFirstName} {formData.fatherLastName}</Typography>
            <Typography>Mother: {formData.motherFirstName} {formData.motherLastName}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Documents Uploaded
            </Typography>
            <Box>
              {Object.entries(documents).map(([key, file]) => 
                file && (
                  <Typography key={key}>
                    ✓ {file.name}
                  </Typography>
                )
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderPersonalDetails();
      case 1:
        return renderParentDetails();
      case 2:
        return renderAddressHospital();
      case 3:
        return renderDocuments();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Birth Certificate Application
        </Typography>
        
        {/* Draft Status Indicator */}
        {lastSaved && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              icon={<Save />}
              label={`Auto-saved ${new Date(lastSaved).toLocaleTimeString()}`}
              color="success"
              size="small"
              variant="outlined"
            />
            <Button
              size="small"
              startIcon={<Delete />}
              onClick={clearDraft}
              color="error"
              variant="text"
            >
              Clear Draft
            </Button>
          </Box>
        )}
        
        {isSaving && (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<ChakraSpinner size="16px" />}
              label="Saving draft..."
              color="info"
              size="small"
              variant="outlined"
            />
          </Box>
        )}
        
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mb: 4 }}>
          {getStepContent()}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
              startIcon={submitting ? <ChakraSpinner size="20px" /> : null}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BirthCertificateForm;
