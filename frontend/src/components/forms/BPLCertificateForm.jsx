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
        {t('forms.bplCertificate.personalInfo')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.bplCertificate.provideHeadDetails')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.headOfFamily')}
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName || t('forms.bplCertificate.headOfFamilyHelper')}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.fatherHusbandName')}
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
            label={t('forms.common.age')}
            value={formData.age || ''}
            InputProps={{ readOnly: true }}
            helperText={t('forms.bplCertificate.autoCalculated')}
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
            <InputLabel>{t('forms.bplCertificate.caste')}</InputLabel>
            <Select
              value={formData.caste || ''}
              onChange={(e) => handleChange('caste', e.target.value)}
              label={t('forms.bplCertificate.caste')}
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.mobile')}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t('forms.casteCertificate.mobileHelper')}
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

const AddressDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.bplCertificate.addressDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.bplCertificate.provideCompleteAddress')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.bplCertificate.permanentAddressLabel')}
            value={formData.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
            error={!!errors.permanentAddress}
            helperText={errors.permanentAddress || t('forms.bplCertificate.permanentAddressHelper')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.bplCertificate.presentAddress')}
            value={formData.presentAddress || ''}
            onChange={(e) => handleChange('presentAddress', e.target.value)}
            helperText={t('forms.bplCertificate.presentAddressHelper')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.villageWard')}
            value={formData.village || ''}
            onChange={(e) => handleChange('village', e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.district')}
            value={formData.district || ''}
            onChange={(e) => handleChange('district', e.target.value)}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.state')}
            value={formData.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.common.pincode')}
            value={formData.pincode || ''}
            onChange={(e) => handleChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode || t('forms.bplCertificate.pincodeHelper')}
            inputProps={{ maxLength: 6 }}
          />
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
        {t('forms.bplCertificate.familyDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.bplCertificate.provideAllFamilyMembers')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.totalFamilyMembers')}
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
            label={t('forms.bplCertificate.earningMembers')}
            type="number"
            value={formData.earningMembers || ''}
            onChange={(e) => handleChange('earningMembers', e.target.value)}
            error={!!errors.earningMembers}
            helperText={errors.earningMembers}
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">{t('forms.bplCertificate.familyMembersDetails')}</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFamilyMember}
            >
              {t('forms.bplCertificate.addMember')}
            </Button>
          </Box>

          {formData.familyMembers && formData.familyMembers.length > 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('forms.bplCertificate.name')}</TableCell>
                    <TableCell>{t('forms.bplCertificate.relation')}</TableCell>
                    <TableCell>{t('forms.common.age')}</TableCell>
                    <TableCell>{t('forms.bplCertificate.occupation')}</TableCell>
                    <TableCell>{t('forms.bplCertificate.education')}</TableCell>
                    <TableCell>{t('forms.bplCertificate.monthlyIncome')}</TableCell>
                    <TableCell>{t('forms.bplCertificate.action')}</TableCell>
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
                          placeholder={t('forms.bplCertificate.fullName')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.relation}
                          onChange={(e) => updateFamilyMember(member.id, 'relation', e.target.value)}
                          placeholder={t('forms.bplCertificate.relation')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(member.id, 'age', e.target.value)}
                          placeholder={t('forms.common.age')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.occupation}
                          onChange={(e) => updateFamilyMember(member.id, 'occupation', e.target.value)}
                          placeholder={t('forms.bplCertificate.occupation')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={member.education}
                          onChange={(e) => updateFamilyMember(member.id, 'education', e.target.value)}
                          placeholder={t('forms.bplCertificate.education')}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="number"
                          value={member.income}
                          onChange={(e) => updateFamilyMember(member.id, 'income', e.target.value)}
                          placeholder={t('forms.incomeCertificate.income')}
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
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.bplCertificate.economicDetails')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.bplCertificate.provideIncomeAssets')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.annualFamilyIncome')}
            type="number"
            value={formData.annualIncome || ''}
            onChange={(e) => handleChange('annualIncome', e.target.value)}
            error={!!errors.annualIncome}
            helperText={errors.annualIncome || t('forms.bplCertificate.annualIncomeHelper')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.primaryOccupation}>
            <InputLabel>{t('forms.bplCertificate.primaryOccupation')}</InputLabel>
            <Select
              value={formData.primaryOccupation || ''}
              onChange={(e) => handleChange('primaryOccupation', e.target.value)}
              label={t('forms.bplCertificate.primaryOccupation')}
            >
              <MenuItem value="Agriculture">{t('forms.bplCertificate.agriculture')}</MenuItem>
              <MenuItem value="Daily Wage Labor">{t('forms.bplCertificate.dailyWageLabor')}</MenuItem>
              <MenuItem value="Small Business">{t('forms.bplCertificate.smallBusiness')}</MenuItem>
              <MenuItem value="Government Service">{t('forms.bplCertificate.governmentService')}</MenuItem>
              <MenuItem value="Private Service">{t('forms.bplCertificate.privateService')}</MenuItem>
              <MenuItem value="Unemployed">{t('forms.bplCertificate.unemployed')}</MenuItem>
              <MenuItem value="Other">{t('forms.common.other')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.bplCertificate.agriculturalLandDetails')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.agriculturalLandArea')}
            type="number"
            value={formData.agriculturalLand || ''}
            onChange={(e) => handleChange('agriculturalLand', e.target.value)}
            helperText={t('forms.bplCertificate.areaInAcres')}
            InputProps={{
              endAdornment: <InputAdornment position="end">{t('forms.bplCertificate.acres')}</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.annualAgriculturalIncome')}
            type="number"
            value={formData.agriculturalIncome || ''}
            onChange={(e) => handleChange('agriculturalIncome', e.target.value)}
            helperText={t('forms.bplCertificate.incomeFromAgriculture')}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('forms.bplCertificate.assetsPropertyDetails')}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.bplCertificate.otherAssetsProperty')}
            value={formData.otherAssets || ''}
            onChange={(e) => handleChange('otherAssets', e.target.value)}
            helperText={t('forms.bplCertificate.houseVehicleLivestock')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t('forms.bplCertificate.employmentDetails')}
            value={formData.employmentDetails || ''}
            onChange={(e) => handleChange('employmentDetails', e.target.value)}
            helperText={t('forms.bplCertificate.currentEmploymentStatus')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('forms.bplCertificate.purposeForBPL')}
            value={formData.purpose || ''}
            onChange={(e) => handleChange('purpose', e.target.value)}
            error={!!errors.purpose}
            helperText={errors.purpose || t('forms.bplCertificate.whyNeedCertificate')}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  const requiredDocuments = [
    t('forms.bplCertificate.identityProof'),
    t('forms.bplCertificate.addressProof'),
    t('forms.bplCertificate.incomeCertificate'),
    t('forms.bplCertificate.employmentCertificate'),
    t('forms.bplCertificate.agriculturalDocuments'),
    t('forms.bplCertificate.casteCertificate'),
    t('forms.bplCertificate.bankPassbook'),
    t('forms.bplCertificate.passportPhotos'),
    t('forms.bplCertificate.selfDeclarationAffidavit'),
    t('forms.bplCertificate.familyMembersIdentity')
  ];


  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.bplCertificate.documentUpload')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.bplCertificate.uploadAllDocuments')}
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
          {t('forms.bplCertificate.requiredDocuments')}
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
  const { t } = useLanguage();
  const steps = [
    { id: 'personal', title: t('forms.bplCertificate.step1'), icon: 'Person' },
    { id: 'address', title: t('forms.bplCertificate.step2'), icon: 'Home' },
    { id: 'family', title: t('forms.bplCertificate.step3'), icon: 'Group' },
    { id: 'economic', title: t('forms.bplCertificate.step4'), icon: 'MonetizationOn' },
    { id: 'documents', title: t('forms.bplCertificate.step5'), icon: 'Description' }
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
      serviceName={t('forms.bplCertificate.title')}
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
