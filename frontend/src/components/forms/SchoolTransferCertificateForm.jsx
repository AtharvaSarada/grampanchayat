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
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge, validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';

// Student Information Step
const StudentInformationStep = ({ formData, updateFormData, errors }) => {
  const [age, setAge] = React.useState(0);

  React.useEffect(() => {
    if (formData.dateOfBirth) {
      const calculatedAge = calculateAge(formData.dateOfBirth);
      setAge(calculatedAge);
      updateFormData({ age: calculatedAge });
    }
  }, [formData.dateOfBirth]);

  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'studentName' || field === 'fatherName' || field === 'motherName') {
      correctedValue = autoCorrect.name(value);
    } else if (field === 'mobile') {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === 'aadhaar') {
      correctedValue = autoCorrect.aadhaar(value);
    } else if (field === 'email') {
      correctedValue = autoCorrect.email(value);
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Student Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter student's personal details for transfer certificate
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Student Name *"
            value={formData.studentName || ''}
            onChange={(e) => handleChange('studentName', e.target.value)}
            error={!!errors.studentName}
            helperText={errors.studentName || 'Full name as per school records'}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Father's Name *"
            value={formData.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mother's Name *"
            value={formData.motherName || ''}
            onChange={(e) => handleChange('motherName', e.target.value)}
            error={!!errors.motherName}
            helperText={errors.motherName}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth *"
              value={formData.dateOfBirth || null}
              onChange={(date) => handleChange('dateOfBirth', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        {age > 0 && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Age"
              value={`${age} years`}
              disabled
              helperText="Calculated from date of birth"
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender *</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label="Gender *"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || '12-digit Aadhaar number (optional)'}
            inputProps={{ maxLength: 12, pattern: '\\d{12}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              label="Category *"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="OBC">OBC</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="ST">ST</MenuItem>
              <MenuItem value="EWS">EWS</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.religion}>
            <InputLabel>Religion *</InputLabel>
            <Select
              value={formData.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
              label="Religion *"
            >
              <MenuItem value="Hindu">Hindu</MenuItem>
              <MenuItem value="Muslim">Muslim</MenuItem>
              <MenuItem value="Christian">Christian</MenuItem>
              <MenuItem value="Sikh">Sikh</MenuItem>
              <MenuItem value="Buddhist">Buddhist</MenuItem>
              <MenuItem value="Jain">Jain</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Student Address *"
            value={formData.studentAddress || ''}
            onChange={(e) => handleChange('studentAddress', e.target.value)}
            error={!!errors.studentAddress}
            helperText={errors.studentAddress || 'Complete residential address'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Parent/Guardian Mobile *"
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
      </Grid>
    </Paper>
  );
};

// Current School Details Step
const CurrentSchoolStep = ({ formData, updateFormData, errors }) => {
  const [states] = React.useState(getStates());
  const [districts, setDistricts] = React.useState([]);

  React.useEffect(() => {
    if (formData.currentSchoolState) {
      setDistricts(getDistrictsByState(formData.currentSchoolState));
    }
  }, [formData.currentSchoolState]);

  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'rollNumber' || field === 'admissionNumber') {
      correctedValue = value.toUpperCase();
    }
    
    const updates = { [field]: correctedValue };
    
    if (field === 'currentSchoolState') {
      updates.currentSchoolDistrict = '';
      setDistricts(getDistrictsByState(value));
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Current School Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter details of the school from which transfer is requested
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Current School Name *"
            value={formData.currentSchoolName || ''}
            onChange={(e) => handleChange('currentSchoolName', e.target.value)}
            error={!!errors.currentSchoolName}
            helperText={errors.currentSchoolName || 'Full name of current school'}
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="School Address *"
            value={formData.currentSchoolAddress || ''}
            onChange={(e) => handleChange('currentSchoolAddress', e.target.value)}
            error={!!errors.currentSchoolAddress}
            helperText={errors.currentSchoolAddress || 'Complete school address'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.currentSchoolState}>
            <InputLabel>School State *</InputLabel>
            <Select
              value={formData.currentSchoolState || ''}
              onChange={(e) => handleChange('currentSchoolState', e.target.value)}
              label="School State *"
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
          <FormControl fullWidth error={!!errors.currentSchoolDistrict}>
            <InputLabel>School District *</InputLabel>
            <Select
              value={formData.currentSchoolDistrict || ''}
              onChange={(e) => handleChange('currentSchoolDistrict', e.target.value)}
              label="School District *"
              disabled={!formData.currentSchoolState}
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
            label="School PIN Code *"
            value={formData.currentSchoolPincode || ''}
            onChange={(e) => handleChange('currentSchoolPincode', e.target.value)}
            error={!!errors.currentSchoolPincode}
            helperText={errors.currentSchoolPincode}
            inputProps={{ maxLength: 6, pattern: '\\d{6}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Roll Number *"
            value={formData.rollNumber || ''}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
            error={!!errors.rollNumber}
            helperText={errors.rollNumber || 'Student roll number'}
            inputProps={{ maxLength: 15, pattern: '[A-Za-z0-9]{5,15}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Admission Number *"
            value={formData.admissionNumber || ''}
            onChange={(e) => handleChange('admissionNumber', e.target.value)}
            error={!!errors.admissionNumber}
            helperText={errors.admissionNumber || 'School admission number'}
            inputProps={{ maxLength: 15, pattern: '[A-Za-z0-9]{5,15}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.currentClass}>
            <InputLabel>Current Class *</InputLabel>
            <Select
              value={formData.currentClass || ''}
              onChange={(e) => handleChange('currentClass', e.target.value)}
              label="Current Class *"
            >
              {['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((cls) => (
                <MenuItem key={cls} value={cls}>
                  Class {cls}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Section"
            value={formData.section || ''}
            onChange={(e) => handleChange('section', e.target.value)}
            helperText="Class section (A, B, C, etc.)"
            inputProps={{ maxLength: 5 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Admission *"
              value={formData.admissionDate || null}
              onChange={(date) => handleChange('admissionDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.admissionDate}
                  helperText={errors.admissionDate || 'Date of admission to current school'}
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Last Attendance Date"
              value={formData.lastAttendanceDate || null}
              onChange={(date) => handleChange('lastAttendanceDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Last date of attendance"
                />
              )}
              maxDate={new Date()}
              minDate={formData.admissionDate}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.medium}>
            <InputLabel>Medium of Instruction *</InputLabel>
            <Select
              value={formData.medium || ''}
              onChange={(e) => handleChange('medium', e.target.value)}
              label="Medium of Instruction *"
            >
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Hindi">Hindi</MenuItem>
              <MenuItem value="Regional Language">Regional Language</MenuItem>
              <MenuItem value="Bilingual">Bilingual</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Board/Affiliation</InputLabel>
            <Select
              value={formData.board || ''}
              onChange={(e) => handleChange('board', e.target.value)}
              label="Board/Affiliation"
            >
              <MenuItem value="CBSE">CBSE</MenuItem>
              <MenuItem value="ICSE">ICSE</MenuItem>
              <MenuItem value="State Board">State Board</MenuItem>
              <MenuItem value="IB">International Baccalaureate</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Transfer Details Step
const TransferDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Transfer Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide reason and details for school transfer
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.transferReason}>
            <InputLabel>Reason for Transfer *</InputLabel>
            <Select
              value={formData.transferReason || ''}
              onChange={(e) => handleChange('transferReason', e.target.value)}
              label="Reason for Transfer *"
            >
              <MenuItem value="Parent Job Transfer">Parent Job Transfer</MenuItem>
              <MenuItem value="Change of Residence">Change of Residence</MenuItem>
              <MenuItem value="Better Educational Opportunity">Better Educational Opportunity</MenuItem>
              <MenuItem value="Financial Reasons">Financial Reasons</MenuItem>
              <MenuItem value="Family Reasons">Family Reasons</MenuItem>
              <MenuItem value="Medical Reasons">Medical Reasons</MenuItem>
              <MenuItem value="Disciplinary Issues">Disciplinary Issues</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {formData.transferReason === 'Other' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Specify Reason *"
              value={formData.otherReason || ''}
              onChange={(e) => handleChange('otherReason', e.target.value)}
              error={!!errors.otherReason}
              helperText={errors.otherReason || 'Please specify the reason for transfer'}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Detailed Reason for Transfer *"
            value={formData.detailedReason || ''}
            onChange={(e) => handleChange('detailedReason', e.target.value)}
            error={!!errors.detailedReason}
            helperText={errors.detailedReason || 'Provide detailed explanation for transfer request'}
            inputProps={{ minLength: 20, maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="New School Name"
            value={formData.newSchoolName || ''}
            onChange={(e) => handleChange('newSchoolName', e.target.value)}
            helperText="Name of the school where admission is sought (if known)"
            inputProps={{ maxLength: 100 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="New School Address"
            value={formData.newSchoolAddress || ''}
            onChange={(e) => handleChange('newSchoolAddress', e.target.value)}
            helperText="Address of the new school (if known)"
            inputProps={{ maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Requested Transfer Date"
              value={formData.requestedTransferDate || null}
              onChange={(date) => handleChange('requestedTransferDate', date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="Preferred date for transfer certificate issuance"
                />
              )}
              minDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            Is this an urgent transfer? *
          </Typography>
          <RadioGroup
            value={formData.isUrgent || 'no'}
            onChange={(e) => handleChange('isUrgent', e.target.value)}
            row
          >
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          </RadioGroup>
        </Grid>

        {formData.isUrgent === 'yes' && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Urgency Reason *"
              value={formData.urgencyReason || ''}
              onChange={(e) => handleChange('urgencyReason', e.target.value)}
              error={!!errors.urgencyReason}
              helperText={errors.urgencyReason || 'Explain why this transfer is urgent'}
              inputProps={{ maxLength: 300 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Note:</strong> The transfer certificate will be issued after verification of all documents 
              and clearance of any pending dues. Processing time is typically 7-10 working days for regular requests 
              and 2-3 working days for urgent requests.
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
    'Student birth certificate',
    'Aadhaar card of student (if available)',
    'Previous school transfer certificate',
    'Mark sheets/Progress reports',
    'School fee clearance certificate',
    'Library clearance certificate',
    'Identity proof of parent/guardian',
    'Address proof',
    'Passport size photographs of student',
    'Medical certificate (if transfer due to health reasons)',
    'Job transfer letter (if applicable)'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload supporting documents for school transfer certificate
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
const SchoolTransferCertificateForm = () => {
  const steps = [
    { id: 'student', title: 'Student Information', icon: 'Person' },
    { id: 'school', title: 'Current School', icon: 'School' },
    { id: 'transfer', title: 'Transfer Details', icon: 'SwapHoriz' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Student Information
    studentName: { type: 'name', required: true },
    fatherName: { type: 'name', required: true },
    motherName: { type: 'name', required: true },
    dateOfBirth: { type: 'date', required: true },
    gender: { type: 'text', required: true },
    category: { type: 'text', required: true },
    religion: { type: 'text', required: true },
    studentAddress: { type: 'address', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    
    // Current School
    currentSchoolName: { type: 'text', required: true },
    currentSchoolAddress: { type: 'address', required: true },
    currentSchoolState: { type: 'text', required: true },
    currentSchoolDistrict: { type: 'text', required: true },
    currentSchoolPincode: { type: 'pincode', required: true },
    rollNumber: { type: 'rollNumber', required: true },
    admissionNumber: { type: 'rollNumber', required: true },
    currentClass: { type: 'text', required: true },
    admissionDate: { type: 'date', required: true },
    medium: { type: 'text', required: true },
    
    // Transfer Details
    transferReason: { type: 'text', required: true },
    detailedReason: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="School Transfer Certificate Application"
      serviceType="school_transfer_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <StudentInformationStep />
      <CurrentSchoolStep />
      <TransferDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default SchoolTransferCertificateForm;
