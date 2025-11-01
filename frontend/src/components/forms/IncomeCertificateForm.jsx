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
import { useLanguage } from '../../i18n/LanguageProvider';

// Step Components
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t('forms.incomeCertificate.personalInfo')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.incomeCertificate.providePersonalDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.fullName')}
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName || t('forms.incomeCertificate.fullNameHelper')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.fatherHusbandName')}
            value={formData.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t('forms.common.dateOfBirth')}
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
            label={t('forms.incomeCertificate.age')}
            value={formData.age || ''}
            InputProps={{ readOnly: true }}
            helperText={t('forms.incomeCertificate.ageHelper')}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t('forms.common.gender')}</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label={t('forms.common.gender')}
            >
              <MenuItem value="Male">{t('forms.common.male')}</MenuItem>
              <MenuItem value="Female">{t('forms.common.female')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.caste}>
            <InputLabel>{t('forms.incomeCertificate.casteCategory')}</InputLabel>
            <Select
              value={formData.caste || ''}
              onChange={(e) => handleChange('caste', e.target.value)}
              label={t('forms.incomeCertificate.casteCategory')}
            >
              <MenuItem value="General">{t('forms.common.general')}</MenuItem>
              <MenuItem value="SC">{t('forms.common.sc')}</MenuItem>
              <MenuItem value="ST">{t('forms.common.st')}</MenuItem>
              <MenuItem value="OBC">{t('forms.common.obc')}</MenuItem>
              <MenuItem value="EWS">{t('forms.common.ews')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.religion}>
            <InputLabel>{t('forms.incomeCertificate.religion')}</InputLabel>
            <Select
              value={formData.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
              label={t('forms.incomeCertificate.religion')}
            >
              <MenuItem value="Hindu">{t('forms.common.hindu')}</MenuItem>
              <MenuItem value="Muslim">{t('forms.common.muslim')}</MenuItem>
              <MenuItem value="Christian">{t('forms.common.christian')}</MenuItem>
              <MenuItem value="Sikh">{t('forms.common.sikh')}</MenuItem>
              <MenuItem value="Buddhist">{t('forms.common.buddhist')}</MenuItem>
              <MenuItem value="Jain">{t('forms.common.jain')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.common.permanentAddress')}
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress || t('forms.common.permanentAddressHelper')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.incomeCertificate.currentAddress')}
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            helperText={t('forms.incomeCertificate.currentAddressHelper')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.mobile')}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t('forms.common.mobileHelper')}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.email')}
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t('forms.incomeCertificate.emailHelper')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.aadhaar')}
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || t('forms.incomeCertificate.aadhaarHelper')}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const IncomeDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t('forms.incomeCertificate.incomeDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.incomeCertificate.provideIncomeInfo')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.occupation}>
            <InputLabel>{t('forms.incomeCertificate.applicantOccupation')}</InputLabel>
            <Select
              value={formData.occupation || ''}
              onChange={(e) => handleChange('occupation', e.target.value)}
              label={t('forms.incomeCertificate.applicantOccupation')}
            >
              <MenuItem value="Agriculture">{t('forms.common.agriculture')}</MenuItem>
              <MenuItem value="Business">{t('forms.common.business')}</MenuItem>
              <MenuItem value="Government Service">{t('forms.common.governmentService')}</MenuItem>
              <MenuItem value="Private Service">{t('forms.common.privateService')}</MenuItem>
              <MenuItem value="Daily Wage Labor">{t('forms.common.dailyWageLabor')}</MenuItem>
              <MenuItem value="Self Employed">{t('forms.common.selfEmployed')}</MenuItem>
              <MenuItem value="Unemployed">{t('forms.common.unemployed')}</MenuItem>
              <MenuItem value="Retired">{t('forms.common.retired')}</MenuItem>
              <MenuItem value="Student">{t('forms.common.student')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.monthlyIncome')}
            type="number"
            value={formData.monthlyIncome || ''}
            onChange={(e) => handleChange('monthlyIncome', e.target.value)}
            error={!!errors.monthlyIncome}
            helperText={errors.monthlyIncome || t('forms.incomeCertificate.monthlyIncomeHelper')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.annualIncome')}
            type="number"
            value={formData.annualIncome || ''}
            onChange={(e) => handleChange('annualIncome', e.target.value)}
            error={!!errors.annualIncome}
            helperText={errors.annualIncome || t('forms.incomeCertificate.annualIncomeHelper')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.totalFamilyIncome')}
            type="number"
            value={formData.totalFamilyIncome || ''}
            onChange={(e) => handleChange('totalFamilyIncome', e.target.value)}
            error={!!errors.totalFamilyIncome}
            helperText={errors.totalFamilyIncome || t('forms.incomeCertificate.totalFamilyIncomeHelper')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.incomeCertificate.agriculturalIncome')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.agriculturalLandArea')}
            type="number"
            value={formData.agriculturalLandArea || ''}
            onChange={(e) => handleChange('agriculturalLandArea', e.target.value)}
            helperText={t('forms.incomeCertificate.landAreaHelper')}
            InputProps={{
              endAdornment: <InputAdornment position="end">{t('forms.common.acres')}</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.annualAgriculturalIncome')}
            type="number"
            value={formData.agriculturalIncome || ''}
            onChange={(e) => handleChange('agriculturalIncome', e.target.value)}
            helperText={t('forms.incomeCertificate.agricultureIncomeHelper')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.incomeCertificate.businessIncome')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.businessType')}
            value={formData.businessType || ''}
            onChange={(e) => handleChange('businessType', e.target.value)}
            helperText={t('forms.incomeCertificate.businessTypeHelper')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.annualBusinessIncome')}
            type="number"
            value={formData.businessIncome || ''}
            onChange={(e) => handleChange('businessIncome', e.target.value)}
            helperText={t('forms.incomeCertificate.businessIncomeHelper')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">{t('forms.incomeCertificate.additionalIncomeSources')}</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addIncomeSource}
            >
              {t('forms.incomeCertificate.addSource')}
            </Button>
          </Box>

          {formData.incomeSources && formData.incomeSources.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('forms.incomeCertificate.incomeSource')}</TableCell>
                    <TableCell>{t('forms.incomeCertificate.monthlyIncome')}</TableCell>
                    <TableCell>{t('forms.incomeCertificate.annualIncome')}</TableCell>
                    <TableCell>{t('forms.common.description')}</TableCell>
                    <TableCell>{t('forms.common.action')}</TableCell>
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
  const { t } = useLanguage();
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
        {t('forms.incomeCertificate.familyDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.incomeCertificate.provideFamilyDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.incomeCertificate.totalFamilyMembers')}
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
            label={t('forms.incomeCertificate.earningMembers')}
            type="number"
            value={formData.earningMembers || ''}
            onChange={(e) => handleChange('earningMembers', e.target.value)}
            error={!!errors.earningMembers}
            helperText={errors.earningMembers}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">{t('forms.incomeCertificate.familyMembersDetails')}</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFamilyMember}
            >
              {t('forms.incomeCertificate.addMember')}
            </Button>
          </Box>

          {formData.familyMembers && formData.familyMembers.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('forms.common.name')}</TableCell>
                    <TableCell>{t('forms.common.relation')}</TableCell>
                    <TableCell>{t('forms.common.age')}</TableCell>
                    <TableCell>{t('forms.common.occupation')}</TableCell>
                    <TableCell>{t('forms.common.education')}</TableCell>
                    <TableCell>{t('forms.incomeCertificate.monthlyIncome')}</TableCell>
                    <TableCell>{t('forms.common.action')}</TableCell>
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
            label={t('forms.incomeCertificate.purposeForCertificate')}
            value={formData.purpose || ''}
            onChange={(e) => handleChange('purpose', e.target.value)}
            error={!!errors.purpose}
            helperText={errors.purpose || t('forms.incomeCertificate.purposeHelper')}
            placeholder={t('forms.incomeCertificate.purposePlaceholder')}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  const requiredDocuments = [
    t('forms.incomeCertificate.identityProof'),
    t('forms.incomeCertificate.addressProof'),
    t('forms.incomeCertificate.incomeProof'),
    t('forms.incomeCertificate.employmentCertificate'),
    t('forms.incomeCertificate.agriculturalDocs'),
    t('forms.incomeCertificate.businessRegistration'),
    t('forms.incomeCertificate.bankPassbook'),
    t('forms.incomeCertificate.affidavit'),
    t('forms.incomeCertificate.photographs'),
    t('forms.incomeCertificate.familyIncomeProofs')
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.incomeCertificate.documentUpload')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.incomeCertificate.uploadAllDocs')}
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
          {t('forms.incomeCertificate.requiredDocuments')}
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
  const { t } = useLanguage();
  const steps = [
    { id: 'personal', title: t('forms.incomeCertificate.step1'), icon: 'Person' },
    { id: 'income', title: t('forms.incomeCertificate.step2'), icon: 'MonetizationOn' },
    { id: 'family', title: t('forms.incomeCertificate.step3'), icon: 'Group' },
    { id: 'documents', title: t('forms.incomeCertificate.step4'), icon: 'Description' }
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
      serviceName={t('forms.incomeCertificate.title')}
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
