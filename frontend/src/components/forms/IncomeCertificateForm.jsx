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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MultiStepForm from './MultiStepForm';
import DocumentUpload from '../common/DocumentUpload';
import { calculateAge } from '../../utils/formValidation';

// Step Components
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    const updates = { [field]: value };
    
    if (field === 'dateOfBirth') {
      updates.age = calculateAge(value);
    }
    
    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide your personal details as per official documents
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name *"
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName || 'Full name as per Aadhaar card'}
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

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.caste}>
            <InputLabel>Caste/Category *</InputLabel>
            <Select
              value={formData.caste || ''}
              onChange={(e) => handleChange('caste', e.target.value)}
              label="Caste/Category *"
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="SC">SC (Scheduled Caste)</MenuItem>
              <MenuItem value="ST">ST (Scheduled Tribe)</MenuItem>
              <MenuItem value="OBC">OBC (Other Backward Class)</MenuItem>
              <MenuItem value="EWS">EWS (Economically Weaker Section)</MenuItem>
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
            label="Permanent Address *"
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress || 'Complete permanent address'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Current Address"
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            helperText="Leave blank if same as permanent address"
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
            helperText={errors.email || 'Optional but recommended'}
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
      </Grid>
    </Paper>
  );
};

const IncomeDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const addIncomeSource = () => {
    const incomeSources = formData.incomeSources || [];
    const newSource = {
      id: Date.now(),
      source: '',
      monthlyIncome: '',
      annualIncome: '',
      description: ''
    };
    updateFormData({ incomeSources: [...incomeSources, newSource] });
  };

  const removeIncomeSource = (id) => {
    const incomeSources = formData.incomeSources || [];
    updateFormData({ 
      incomeSources: incomeSources.filter(source => source.id !== id) 
    });
  };

  const updateIncomeSource = (id, field, value) => {
    const incomeSources = formData.incomeSources || [];
    const updatedSources = incomeSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    );
    updateFormData({ incomeSources: updatedSources });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Income Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide complete income information from all sources
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.occupation}>
            <InputLabel>Applicant's Occupation *</InputLabel>
            <Select
              value={formData.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              label="Applicant's Occupation *"
            >
              <MenuItem value="Agriculture">Agriculture</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Government Service">Government Service</MenuItem>
              <MenuItem value="Private Service">Private Service</MenuItem>
              <MenuItem value="Daily Wage Labor">Daily Wage Labor</MenuItem>
              <MenuItem value="Self Employed">Self Employed</MenuItem>
              <MenuItem value="Unemployed">Unemployed</MenuItem>
              <MenuItem value="Retired">Retired</MenuItem>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Monthly Income *"
            type="number"
            value={formData.monthlyIncome || ''}
            onChange={(e) => handleChange('monthlyIncome', e.target.value)}
            error={!!errors.monthlyIncome}
            helperText={errors.monthlyIncome || 'Personal monthly income'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Income *"
            type="number"
            value={formData.annualIncome || ''}
            onChange={(e) => handleChange('annualIncome', e.target.value)}
            error={!!errors.annualIncome}
            helperText={errors.annualIncome || 'Personal annual income'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Family Income *"
            type="number"
            value={formData.totalFamilyIncome || ''}
            onChange={(e) => handleChange('totalFamilyIncome', e.target.value)}
            error={!!errors.totalFamilyIncome}
            helperText={errors.totalFamilyIncome || 'Combined family income'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Agricultural Income (if applicable)
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agricultural Land Area"
            type="number"
            value={formData.agriculturalLandArea || ''}
            onChange={(e) => handleChange('agriculturalLandArea', e.target.value)}
            helperText="Area in acres"
            InputProps={{
              endAdornment: <InputAdornment position="end">Acres</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Agricultural Income"
            type="number"
            value={formData.agriculturalIncome || ''}
            onChange={(e) => handleChange('agriculturalIncome', e.target.value)}
            helperText="Income from agriculture"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Business Income (if applicable)
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Type"
            value={formData.businessType || ''}
            onChange={(e) => handleChange('businessType', e.target.value)}
            helperText="Type of business"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Business Income"
            type="number"
            value={formData.businessIncome || ''}
            onChange={(e) => handleChange('businessIncome', e.target.value)}
            helperText="Income from business"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Additional Income Sources</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addIncomeSource}
            >
              Add Source
            </Button>
          </Box>

          {formData.incomeSources && formData.incomeSources.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Income Source</TableCell>
                    <TableCell>Monthly Income (₹)</TableCell>
                    <TableCell>Annual Income (₹)</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.incomeSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={source.source}
                          onChange={(e) => updateIncomeSource(source.id, 'source', e.target.value)}
                          placeholder="e.g., Rent, Pension"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={source.monthlyIncome}
                          onChange={(e) => updateIncomeSource(source.id, 'monthlyIncome', e.target.value)}
                          placeholder="Monthly"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={source.annualIncome}
                          onChange={(e) => updateIncomeSource(source.id, 'annualIncome', e.target.value)}
                          placeholder="Annual"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={source.description}
                          onChange={(e) => updateIncomeSource(source.id, 'description', e.target.value)}
                          placeholder="Details"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeIncomeSource(source.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

const FamilyDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const addFamilyMember = () => {
    const familyMembers = formData.familyMembers || [];
    const newMember = {
      id: Date.now(),
      name: '',
      relation: '',
      age: '',
      occupation: '',
      education: '',
      monthlyIncome: ''
    };
    updateFormData({ familyMembers: [...familyMembers, newMember] });
  };

  const removeFamilyMember = (id) => {
    const familyMembers = formData.familyMembers || [];
    updateFormData({ 
      familyMembers: familyMembers.filter(member => member.id !== id) 
    });
  };

  const updateFamilyMember = (id, field, value) => {
    const familyMembers = formData.familyMembers || [];
    const updatedMembers = familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    );
    updateFormData({ familyMembers: updatedMembers });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Family Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide details of all family members and their income
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Family Members *"
            type="number"
            value={formData.totalFamilyMembers || ''}
            onChange={(e) => handleChange('totalFamilyMembers', e.target.value)}
            error={!!errors.totalFamilyMembers}
            helperText={errors.totalFamilyMembers}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Number of Earning Members *"
            type="number"
            value={formData.earningMembers || ''}
            onChange={(e) => handleChange('earningMembers', e.target.value)}
            error={!!errors.earningMembers}
            helperText={errors.earningMembers}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Family Members Details</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFamilyMember}
            >
              Add Member
            </Button>
          </Box>

          {formData.familyMembers && formData.familyMembers.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Relation</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell>Occupation</TableCell>
                    <TableCell>Education</TableCell>
                    <TableCell>Monthly Income (₹)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.familyMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                          placeholder="Full Name"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.relation}
                          onChange={(e) => updateFamilyMember(member.id, 'relation', e.target.value)}
                          placeholder="Relation"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(member.id, 'age', e.target.value)}
                          placeholder="Age"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.occupation}
                          onChange={(e) => updateFamilyMember(member.id, 'occupation', e.target.value)}
                          placeholder="Occupation"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.education}
                          onChange={(e) => updateFamilyMember(member.id, 'education', e.target.value)}
                          placeholder="Education"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={member.monthlyIncome}
                          onChange={(e) => updateFamilyMember(member.id, 'monthlyIncome', e.target.value)}
                          placeholder="Income"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeFamilyMember(member.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Purpose for Income Certificate *"
            value={formData.purpose || ''}
            onChange={(e) => handleChange('purpose', e.target.value)}
            error={!!errors.purpose}
            helperText={errors.purpose || 'Why do you need this certificate?'}
            placeholder="e.g., Educational scholarship, Government scheme, Loan application"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Identity proof (Aadhaar/PAN/Voter ID)',
    'Address proof (Ration card/Electricity bill)',
    'Income proof (Salary slip/ITR/Bank statement)',
    'Employment certificate',
    'Agricultural documents (if farmer)',
    'Business registration documents (if applicable)',
    'Bank passbook/statements (last 6 months)',
    'Affidavit declaring income details',
    'Passport size photographs',
    'Family members\' income proofs'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload all required documents for income certificate verification
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={15}
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
const IncomeCertificateForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Information', icon: 'Person' },
    { id: 'income', title: 'Income Details', icon: 'MonetizationOn' },
    { id: 'family', title: 'Family Details', icon: 'Group' },
    { id: 'documents', title: 'Documents', icon: 'Description' }
  ];

  const validationRules = {
    // Personal Information
    fullName: { type: 'text', required: true },
    fatherName: { type: 'text', required: true },
    dateOfBirth: { type: 'date', required: true },
    gender: { type: 'text', required: true },
    caste: { type: 'text', required: true },
    religion: { type: 'text', required: true },
    permanentAddress: { type: 'text', required: true },
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    aadhaar: { type: 'aadhaar', required: true },
    
    // Income Details
    occupation: { type: 'text', required: true },
    monthlyIncome: { type: 'amount', required: true },
    annualIncome: { type: 'amount', required: true },
    totalFamilyIncome: { type: 'amount', required: true },
    
    // Family Details
    totalFamilyMembers: { type: 'amount', required: true },
    earningMembers: { type: 'amount', required: true },
    purpose: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="Income Certificate Application"
      serviceType="income_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <IncomeDetailsStep />
      <FamilyDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default IncomeCertificateForm;
