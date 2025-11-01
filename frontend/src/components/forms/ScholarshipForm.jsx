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
import { useLanguage } from '../../i18n/LanguageProvider';

// Student Information Step
const StudentInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  
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
        {t("forms.scholarshipApplication.studentInfo.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.scholarshipApplication.studentInfo.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.studentInfo.fullName")}
            value={formData.studentName || ''}
            onChange={(e) => handleChange('studentName', e.target.value)}
            error={!!errors.studentName}
            helperText={errors.studentName || t("forms.scholarshipApplication.studentInfo.fullNameHelper")}
            inputProps={{ maxLength: 50, pattern: '[A-Za-z\\s\']{2,50}' }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.studentInfo.fatherName")}
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
            label={t("forms.scholarshipApplication.studentInfo.motherName")}
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
              label={t("forms.scholarshipApplication.studentInfo.dateOfBirth")}
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
            label={t("forms.scholarshipApplication.studentInfo.age")}
            value={formData.age || ''}
            InputProps={{ readOnly: true }}
            helperText={t("forms.scholarshipApplication.studentInfo.ageHelper")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("common.gender")} *</InputLabel>
            <Select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value)}
              label={t("common.gender") + " *"}
            >
              <MenuItem value="Male">{t("common.male")}</MenuItem>
              <MenuItem value="Female">{t("common.female")}</MenuItem>
              <MenuItem value="Other">{t("common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel>{t("common.category")} *</InputLabel>
            <Select
              value={formData.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              label={t("common.category") + " *"}
            >
              <MenuItem value="General">{t("common.general")}</MenuItem>
              <MenuItem value="OBC">{t("common.obc")}</MenuItem>
              <MenuItem value="SC">{t("common.sc")}</MenuItem>
              <MenuItem value="ST">{t("common.st")}</MenuItem>
              <MenuItem value="NT">{t("common.nt")}</MenuItem>
              <MenuItem value="SBC">{t("common.sbc")}</MenuItem>
              <MenuItem value="Other">{t("common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.mobile")}
            value={formData.mobile || ''}
            onChange={(e) => handleChange('mobile', e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("common.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.email")}
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t("common.emailHelper")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.aadhaar")}
            value={formData.aadhaar || ''}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || t("common.aadhaarHelper")}
            inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t("forms.scholarshipApplication.studentInfo.currentAddress")}
            value={formData.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
            error={!!errors.currentAddress}
            helperText={errors.currentAddress || t("forms.scholarshipApplication.studentInfo.currentAddressHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Academic Details Step
const AcademicDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  
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
        {t("forms.scholarshipApplication.academicDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.scholarshipApplication.academicDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.currentClass}>
            <InputLabel>{t("forms.scholarshipApplication.academicDetails.currentClass")}</InputLabel>
            <Select
              value={formData.currentClass || ''}
              onChange={(e) => handleChange('currentClass', e.target.value)}
              label={t("forms.scholarshipApplication.academicDetails.currentClass")}
            >
              <MenuItem value="1st">{t("forms.scholarshipApplication.academicDetails.classes.class1")}</MenuItem>
              <MenuItem value="2nd">{t("forms.scholarshipApplication.academicDetails.classes.class2")}</MenuItem>
              <MenuItem value="3rd">{t("forms.scholarshipApplication.academicDetails.classes.class3")}</MenuItem>
              <MenuItem value="4th">{t("forms.scholarshipApplication.academicDetails.classes.class4")}</MenuItem>
              <MenuItem value="5th">{t("forms.scholarshipApplication.academicDetails.classes.class5")}</MenuItem>
              <MenuItem value="6th">{t("forms.scholarshipApplication.academicDetails.classes.class6")}</MenuItem>
              <MenuItem value="7th">{t("forms.scholarshipApplication.academicDetails.classes.class7")}</MenuItem>
              <MenuItem value="8th">{t("forms.scholarshipApplication.academicDetails.classes.class8")}</MenuItem>
              <MenuItem value="9th">{t("forms.scholarshipApplication.academicDetails.classes.class9")}</MenuItem>
              <MenuItem value="10th">{t("forms.scholarshipApplication.academicDetails.classes.class10")}</MenuItem>
              <MenuItem value="11th">{t("forms.scholarshipApplication.academicDetails.classes.class11")}</MenuItem>
              <MenuItem value="12th">{t("forms.scholarshipApplication.academicDetails.classes.class12")}</MenuItem>
              <MenuItem value="Graduation">{t("forms.scholarshipApplication.academicDetails.classes.graduation")}</MenuItem>
              <MenuItem value="Post Graduation">{t("forms.scholarshipApplication.academicDetails.classes.postGraduation")}</MenuItem>
              <MenuItem value="Diploma">{t("forms.scholarshipApplication.academicDetails.classes.diploma")}</MenuItem>
              <MenuItem value="ITI">{t("forms.scholarshipApplication.academicDetails.classes.vocational")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.academicDetails.rollNumber")}
            value={formData.rollNumber || ''}
            onChange={(e) => handleChange('rollNumber', e.target.value)}
            error={!!errors.rollNumber}
            helperText={errors.rollNumber || t("forms.scholarshipApplication.academicDetails.rollNumberHelper")}
            inputProps={{ maxLength: 15, pattern: '[A-Za-z0-9]{5,15}' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.academicDetails.institutionName")}
            value={formData.institutionName || ''}
            onChange={(e) => handleChange('institutionName', e.target.value)}
            error={!!errors.institutionName}
            helperText={errors.institutionName || t("forms.scholarshipApplication.academicDetails.institutionNameHelper")}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={t("forms.scholarshipApplication.academicDetails.institutionAddress")}
            value={formData.institutionAddress || ''}
            onChange={(e) => handleChange('institutionAddress', e.target.value)}
            error={!!errors.institutionAddress}
            helperText={errors.institutionAddress || t("forms.scholarshipApplication.academicDetails.institutionAddressHelper")}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.academicDetails.previousPercentage")}
            value={formData.previousPercentage || ''}
            onChange={(e) => handleChange('previousPercentage', e.target.value)}
            error={!!errors.previousPercentage}
            helperText={errors.previousPercentage || t("forms.scholarshipApplication.academicDetails.previousPercentageHelper")}
            inputProps={{ pattern: '^(100(\\.0{1,2})?|[1-9]?\\d(\\.\\d{1,2})?)$' }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t("forms.scholarshipApplication.academicDetails.boardUniversity")}</InputLabel>
            <Select
              value={formData.board || ''}
              onChange={(e) => handleChange('board', e.target.value)}
              label={t("forms.scholarshipApplication.academicDetails.boardUniversity")}
            >
              <MenuItem value="CBSE">{t("forms.scholarshipApplication.academicDetails.boards.cbse")}</MenuItem>
              <MenuItem value="ICSE">{t("forms.scholarshipApplication.academicDetails.boards.icse")}</MenuItem>
              <MenuItem value="State Board">{t("forms.scholarshipApplication.academicDetails.boards.stateBoard")}</MenuItem>
              <MenuItem value="University">{t("forms.scholarshipApplication.academicDetails.boards.university")}</MenuItem>
              <MenuItem value="Other">{t("common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.scholarshipApplication.academicDetails.scholarshipType")}
          </Typography>
          <RadioGroup
            value={formData.scholarshipType || ''}
            onChange={(e) => handleChange('scholarshipType', e.target.value)}
            row
          >
            <FormControlLabel value="merit" control={<Radio />} label={t("forms.scholarshipApplication.academicDetails.meritBased")} />
            <FormControlLabel value="need" control={<Radio />} label={t("forms.scholarshipApplication.academicDetails.needBased")} />
            <FormControlLabel value="minority" control={<Radio />} label={t("forms.scholarshipApplication.academicDetails.minority")} />
            <FormControlLabel value="sports" control={<Radio />} label={t("forms.scholarshipApplication.academicDetails.sports")} />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Family Income Step
const FamilyIncomeStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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
        {t("forms.scholarshipApplication.familyIncome.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.scholarshipApplication.familyIncome.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.familyIncome.totalMembers")}
            type="number"
            value={formData.totalFamilyMembers || ''}
            onChange={(e) => updateFormData({ totalFamilyMembers: e.target.value })}
            error={!!errors.totalFamilyMembers}
            helperText={errors.totalFamilyMembers || t("forms.scholarshipApplication.familyIncome.totalMembersHelper")}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.scholarshipApplication.familyIncome.annualIncome")}
            value={formData.annualIncome || ''}
            onChange={(e) => updateFormData({ annualIncome: e.target.value })}
            error={!!errors.annualIncome}
            helperText={errors.annualIncome || t("forms.scholarshipApplication.familyIncome.annualIncomeHelper")}
            inputProps={{ pattern: '^\\d+(\\.\\d{1,2})?$' }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.scholarshipApplication.familyIncome.familyMembersTable.title")}
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("forms.scholarshipApplication.familyIncome.familyMembersTable.name")}</TableCell>
                  <TableCell>{t("forms.scholarshipApplication.familyIncome.familyMembersTable.relation")}</TableCell>
                  <TableCell>{t("forms.scholarshipApplication.familyIncome.familyMembersTable.occupation")}</TableCell>
                  <TableCell>{t("forms.scholarshipApplication.familyIncome.familyMembersTable.monthlyIncome")}</TableCell>
                  <TableCell>{t("forms.scholarshipApplication.familyIncome.familyMembersTable.actions")}</TableCell>
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
                        placeholder={t("common.fullName")}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={member.relation}
                          onChange={(e) => handleIncomeChange(index, 'relation', e.target.value)}
                        >
                          <MenuItem value="Father">{t("common.father")}</MenuItem>
                          <MenuItem value="Mother">{t("common.mother")}</MenuItem>
                          <MenuItem value="Brother">{t("common.brother")}</MenuItem>
                          <MenuItem value="Sister">{t("common.sister")}</MenuItem>
                          <MenuItem value="Self">{t("common.self")}</MenuItem>
                          <MenuItem value="Other">{t("common.other")}</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={member.occupation}
                        onChange={(e) => handleIncomeChange(index, 'occupation', e.target.value)}
                        placeholder={t("common.occupation")}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={member.monthlyIncome}
                        onChange={(e) => handleIncomeChange(index, 'monthlyIncome', e.target.value)}
                        placeholder={t("common.amount")}
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
            {t("forms.scholarshipApplication.familyIncome.familyMembersTable.addMember")}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" color="primary">
            {t("common.totalMonthlyIncome")}: ₹{totalIncome.toLocaleString()}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  
  const requiredDocuments = [
    t("forms.scholarshipApplication.documents.aadhaarCard"),
    t("forms.scholarshipApplication.documents.schoolIdCard"),
    t("forms.scholarshipApplication.documents.previousMarksheet"),
    t("forms.scholarshipApplication.documents.incomeCertificate"),
    t("forms.scholarshipApplication.documents.casteCertificate"),
    t("forms.scholarshipApplication.documents.bankPassbook"),
    t("forms.scholarshipApplication.documents.studentPhoto"),
    t("forms.scholarshipApplication.documents.feePaidReceipt"),
    t("forms.scholarshipApplication.documents.bonafideCertificate"),
    t("forms.scholarshipApplication.documents.domicileCertificate")
  ];

  const handleDocumentsChange = (documents) => {
    updateFormData({ documents });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.scholarshipApplication.documents.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.scholarshipApplication.documents.uploadInfo")}
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
  const { t } = useLanguage();
  
  const steps = [
    { id: 'student', title: t("forms.scholarshipApplication.step1"), icon: 'Person' },
    { id: 'academic', title: t("forms.scholarshipApplication.step2"), icon: 'School' },
    { id: 'income', title: t("forms.scholarshipApplication.step3"), icon: 'AttachMoney' },
    { id: 'documents', title: t("forms.scholarshipApplication.step4"), icon: 'Description' }
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
      serviceName={t("forms.scholarshipApplication.title")}
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
