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
        Please provide personal details of the head of family
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name of Head of Family *"
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName || 'As per Aadhaar card'}
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
            helperText="Auto-calculated"
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
            <InputLabel>Caste *</InputLabel>
            <Select
              value={formData.caste || ''}
              onChange={(e) => handleChange('caste', e.target.value)}
              label="Caste *"
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
            helperText={errors.email || 'Optional'}
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

const AddressDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Address Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide complete address information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Permanent Address *"
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress || 'House No., Street, Area, Landmark'}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Present Address"
            value={formData.presentAddress || ''}
            onChange={(e) => handleChange('presentAddress', e.target.value)}
            helperText="Leave blank if same as permanent address"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Village/Ward *"
            value={formData.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="District *"
            value={formData.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="State *"
            value={formData.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="PIN Code *"
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode || '6-digit PIN code'}
            inputProps={{ maxLength: 6 }}
          />
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
      income: ''
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
        Provide details of all family members
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Number of Family Members *"
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
                          value={member.income}
                          onChange={(e) => updateFamilyMember(member.id, 'income', e.target.value)}
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
      </Grid>
    </Paper>
  );
};

const EconomicDetailsStep = ({ formData, updateFormData, errors }) => {
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Economic Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Provide complete income and asset information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Annual Family Income from All Sources *"
            type="number"
            value={formData.annualIncome || ''}
            onChange={(e) => handleChange('annualIncome', e.target.value)}
            error={!!errors.annualIncome}
            helperText={errors.annualIncome || 'Total annual income in rupees'}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.primaryOccupation}>
            <InputLabel>Primary Occupation *</InputLabel>
            <Select
              value={formData.primaryOccupation || ''}
              onChange={(e) => handleChange('primaryOccupation', e.target.value)}
              label="Primary Occupation *"
            >
              <MenuItem value="Agriculture">Agriculture</MenuItem>
              <MenuItem value="Daily Wage Labor">Daily Wage Labor</MenuItem>
              <MenuItem value="Small Business">Small Business</MenuItem>
              <MenuItem value="Government Service">Government Service</MenuItem>
              <MenuItem value="Private Service">Private Service</MenuItem>
              <MenuItem value="Unemployed">Unemployed</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Agricultural Land Details (if applicable)
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Agricultural Land Area"
            type="number"
            value={formData.agriculturalLand || ''}
            onChange={(e) => handleChange('agriculturalLand', e.target.value)}
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
            Assets and Property Details
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Details of Other Assets/Property"
            value={formData.otherAssets || ''}
            onChange={(e) => handleChange('otherAssets', e.target.value)}
            helperText="House, vehicle, livestock, etc."
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Employment Details"
            value={formData.employmentDetails || ''}
            onChange={(e) => handleChange('employmentDetails', e.target.value)}
            helperText="Current employment status and details"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Purpose for BPL Certificate *"
            value={formData.purpose || ''}
            onChange={(e) => handleChange('purpose', e.target.value)}
            error={!!errors.purpose}
            helperText={errors.purpose || 'Why do you need this certificate?'}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const requiredDocuments = [
    'Identity proof (Aadhaar/Voter ID/PAN)',
    'Address proof (Ration card/Electricity bill)',
    'Income certificate/salary slip',
    'Employment certificate',
    'Agricultural documents (if farmer)',
    'Caste certificate (if applicable)',
    'Bank passbook copy',
    'Passport size photographs',
    'Self-declaration affidavit',
    'Family members\' identity proofs'
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        Document Upload
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please upload all required documents for BPL certificate verification
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
const BPLCertificateForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Information', icon: 'Person' },
    { id: 'address', title: 'Address Details', icon: 'Home' },
    { id: 'family', title: 'Family Details', icon: 'Group' },
    { id: 'economic', title: 'Economic Details', icon: 'MonetizationOn' },
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
    mobile: { type: 'mobile', required: true },
    email: { type: 'email', required: false },
    aadhaar: { type: 'aadhaar', required: true },
    
    // Address Details
    permanentAddress: { type: 'text', required: true },
    village: { type: 'text', required: true },
    district: { type: 'text', required: true },
    state: { type: 'text', required: true },
    pincode: { type: 'pincode', required: true },
    
    // Family Details
    totalFamilyMembers: { type: 'amount', required: true },
    earningMembers: { type: 'amount', required: true },
    
    // Economic Details
    annualIncome: { type: 'amount', required: true },
    primaryOccupation: { type: 'text', required: true },
    purpose: { type: 'text', required: true }
  };

  return (
    <MultiStepForm
      serviceName="BPL (Below Poverty Line) Certificate Application"
      serviceType="bpl_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <AddressDetailsStep />
      <FamilyDetailsStep />
      <EconomicDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default BPLCertificateForm;
