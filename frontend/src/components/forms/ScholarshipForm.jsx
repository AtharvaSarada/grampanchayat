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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge, validateField, autoCorrect } from '../../utils/formValidation';
import { getStates, getDistrictsByState } from '../../data/stateDistrictData';

// Student Information Step
const StudentInformationStep = ({ formData, updateFormData, errors }) => {
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
    
    const updates = { [field]: correctedValue };
    
    if (field === 'dateOfBirth') {
      updates.age = calculateAge(value);
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Student Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide complete details of the student
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Student's Full Name *"
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
              onChange={(value) => handleChange('dateOfBirth', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
              )}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 30, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Age"
            value={formData.age || ''}
            InputProps={{ readOnly: true }}
            helperText="Auto-calculated from date of birth"
          />
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              label="Category *"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="SC">SC</MenuItem>
              <MenuItem value="ST">ST</MenuItem>
              <MenuItem value="OBC">OBC</MenuItem>
              <MenuItem value="EWS">EWS</MenuItem>
            </Select>
          </FormControl>
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
            label="Email ID *"
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || 'Valid email address required'}
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
            inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Current Address *"
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            error={!!errors.currentAddress}
            helperText={errors.currentAddress || 'Complete current address'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Academic Details Step
const AcademicDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    let correctedValue = value;
    
    if (field === 'rollNumber') {
      correctedValue = value.toUpperCase();
    }
    
    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Academic Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide current academic information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.currentClass}>
            <InputLabel>Current Class/Course *</InputLabel>
            <Select
              value={formData.currentClass || ''}
              onChange={(e) => handleChange('currentClass', e.target.value)}
              label="Current Class/Course *"
            >
              <MenuItem value="1st">1st Standard</MenuItem>
              <MenuItem value="2nd">2nd Standard</MenuItem>
              <MenuItem value="3rd">3rd Standard</MenuItem>
              <MenuItem value="4th">4th Standard</MenuItem>
              <MenuItem value="5th">5th Standard</MenuItem>
              <MenuItem value="6th">6th Standard</MenuItem>
              <MenuItem value="7th">7th Standard</MenuItem>
              <MenuItem value="8th">8th Standard</MenuItem>
              <MenuItem value="9th">9th Standard</MenuItem>
              <MenuItem value="10th">10th Standard</MenuItem>
              <MenuItem value="11th">11th Standard</MenuItem>
              <MenuItem value="12th">12th Standard</MenuItem>
              <MenuItem value="Graduation">Graduation</MenuItem>
              <MenuItem value="Post Graduation">Post Graduation</MenuItem>
              <MenuItem value="Diploma">Diploma</MenuItem>
              <MenuItem value="ITI">ITI</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Roll Number/Registration Number *"
            value={formData.rollNumber || ''}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
            error={!!errors.rollNumber}
            helperText={errors.rollNumber || 'Student roll/registration number'}
            inputProps={{ maxLength: 15, pattern: '[A-Za-z0-9]{5,15}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="School/College Name *"
            value={formData.institutionName || ''}
            onChange={(e) => handleChange('institutionName', e.target.value)}
            error={!!errors.institutionName}
            helperText={errors.institutionName || 'Full name of educational institution'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Institution Address *"
            value={formData.institutionAddress || ''}
            onChange={(e) => handleChange('institutionAddress', e.target.value)}
            error={!!errors.institutionAddress}
            helperText={errors.institutionAddress || 'Complete address of institution'}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Previous Year Percentage/CGPA *"
            value={formData.previousPercentage || ''}
            onChange={(e) => handleChange('previousPercentage', e.target.value)}
            error={!!errors.previousPercentage}
            helperText={errors.previousPercentage || 'Marks in previous class/semester'}
            inputProps={{ pattern: '^(100(\\.0{1,2})?|[1-9]?\\d(\\.\\d{1,2})?)$' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Board/University</InputLabel>
            <Select
              value={formData.board || ''}
              onChange={(e) => handleChange('board', e.target.value)}
              label="Board/University"
            >
              <MenuItem value="CBSE">CBSE</MenuItem>
              <MenuItem value="ICSE">ICSE</MenuItem>
              <MenuItem value="State Board">State Board</MenuItem>
              <MenuItem value="University">University</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Type of Scholarship Applied For *
          </Typography>
          <RadioGroup
            value={formData.scholarshipType || ''}
            onChange={(e) => handleChange('scholarshipType', e.target.value)}
            row
          >
            <FormControlLabel value="merit" control={<Radio />} label="Merit Based" />
            <FormControlLabel value="need" control={<Radio />} label="Need Based" />
            <FormControlLabel value="minority" control={<Radio />} label="Minority" />
            <FormControlLabel value="sports" control={<Radio />} label="Sports" />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Family Income Step
const FamilyIncomeStep = ({ formData, updateFormData, errors }) => {
  const [incomeMembers, setIncomeMembers] = React.useState(formData.incomeMembers || [
    { name: '', relation: '', occupation: '', monthlyIncome: '' }
  ]);

  const handleIncomeChange = (index, field, value) => {
    const updated = [...incomeMembers];
    updated[index][field] = value;
    setIncomeMembers(updated);
    updateFormData({ incomeMembers: updated });
  };

  const addIncomeMember = () => {
    setIncomeMembers([...incomeMembers, { name: '', relation: '', occupation: '', monthlyIncome: '' }]);
  };

  const removeIncomeMember = (index) => {
    if (incomeMembers.length > 1) {
      const updated = incomeMembers.filter((_, i) => i !== index);
      setIncomeMembers(updated);
      updateFormData({ incomeMembers: updated });
    }
  };

  const totalIncome = incomeMembers.reduce((sum, member) => sum + (parseFloat(member.monthlyIncome) || 0), 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Family Income Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide income details of all earning family members
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Family Members *"
            type="number"
            value={formData.totalFamilyMembers || ''}
            onChange={(e) => updateFormData({ totalFamilyMembers: e.target.value })}
            error={!!errors.totalFamilyMembers}
            helperText={errors.totalFamilyMembers}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Family Income *"
            value={formData.annualIncome || ''}
            onChange={(e) => updateFormData({ annualIncome: e.target.value })}
            error={!!errors.annualIncome}
            helperText={errors.annualIncome || 'Total annual family income'}
            inputProps={{ pattern: '^\\d+(\\.\\d{1,2})?$' }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Income Details of Earning Members
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Relation</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Monthly Income</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomeMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <TextField
                        size="small"
                        value={member.name}
                        onChange={(e) => handleIncomeChange(index, 'name', e.target.value)}
                        placeholder="Full Name"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={member.relation}
                          onChange={(e) => handleIncomeChange(index, 'relation', e.target.value)}
                        >
                          <MenuItem value="Father">Father</MenuItem>
                          <MenuItem value="Mother">Mother</MenuItem>
                          <MenuItem value="Brother">Brother</MenuItem>
                          <MenuItem value="Sister">Sister</MenuItem>
                          <MenuItem value="Self">Self</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={member.occupation}
                        onChange={(e) => handleIncomeChange(index, 'occupation', e.target.value)}
                        placeholder="Occupation"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={member.monthlyIncome}
                        onChange={(e) => handleIncomeChange(index, 'monthlyIncome', e.target.value)}
                        placeholder="Amount"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => removeIncomeMember(index)}
                        disabled={incomeMembers.length === 1}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            startIcon={<AddIcon />}
            onClick={addIncomeMember}
            sx={{ mt: 2 }}
          >
            Add Income Member
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" color="primary">
            Total Monthly Income: ₹{totalIncome.toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Student\'s Aadhaar card',
    'School/College ID card',
    'Previous year mark sheet',
    'Income certificate',
    'Caste certificate (if applicable)',
    'Bank account passbook',
    'Passport size photographs',
    'Fee receipt/admission letter',
    'Parent\'s income proof',
    'Domicile certificate'
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
        Please upload all required documents for scholarship application
      </Typography>

      <DocumentUpload
        requiredDocuments={requiredDocuments}
        uploadedDocuments={formData.documents || []}
        onDocumentsChange={handleDocumentsChange}
        maxFiles={15}
        serviceType="scholarship"
      />
    </Box>
  );
};

// Main Form Component
const ScholarshipForm = () => {
  const steps = [
    { id: 'student', title: 'Student Information', icon: 'Person' },
    { id: 'academic', title: 'Academic Details', icon: 'School' },
    { id: 'income', title: 'Family Income', icon: 'AttachMoney' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Student Information
    studentName: { type: 'name', required: true },
    fatherName: { type: 'name', required: true },
    motherName: { type: 'name', required: true },
    dateOfBirth: { type: 'birthDate', required: true },
    gender: { type: 'text', required: true },
    category: { type: 'category', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: true },
    aadhaar: { type: 'aadhaar', required: true },
    currentAddress: { type: 'address', required: true },
    
    // Academic Details
    currentClass: { type: 'text', required: true },
    rollNumber: { type: 'rollNumber', required: true },
    institutionName: { type: 'text', required: true },
    institutionAddress: { type: 'address', required: true },
    previousPercentage: { type: 'percentage', required: true },
    scholarshipType: { type: 'text', required: true },
    
    // Family Income
    totalFamilyMembers: { type: 'familyMembers', required: true },
    annualIncome: { type: 'amount', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Scholarship Application"
      serviceType="scholarship"
      steps={steps}
      validationRules={validationRules}
    >
      <StudentInformationStep />
      <AcademicDetailsStep />
      <FamilyIncomeStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default ScholarshipForm;
