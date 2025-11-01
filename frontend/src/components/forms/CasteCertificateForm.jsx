import React from "react";
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MultiStepForm from "./MultiStepForm";
import DocumentUpload from "../common/DocumentUpload";
import {
  calculateAge,
  validateField,
  autoCorrect,
} from "../../utils/formValidation";
import { getStates, getDistrictsByState } from "../../data/stateDistrictData";
import { useLanguage } from "../../i18n/LanguageProvider";

// Step Components
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    let correctedValue = value;

    // Apply auto-corrections
    if (
      field === "fullName" ||
      field === "fatherName" ||
      field === "motherName"
    ) {
      correctedValue = autoCorrect.name(value);
    } else if (field === "email") {
      correctedValue = autoCorrect.email(value);
    } else if (field === "mobile") {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === "aadhaar") {
      correctedValue = autoCorrect.aadhaar(value);
    }

    const updates = { [field]: correctedValue };

    // Auto-calculate age when date of birth changes
    if (field === "dateOfBirth") {
      updates.age = calculateAge(value);
    }

    updateFormData(updates);
  };

  const handleBlur = (field, value) => {
    // Validate on blur
    const validationRules = {
      fullName: { type: "name", required: true },
      fatherName: { type: "name", required: true },
      motherName: { type: "name", required: true },
      mobile: { type: "mobile", required: true },
      email: { type: "email", required: false },
      aadhaar: { type: "aadhaar", required: true },
    };

    if (validationRules[field]) {
      const error = validateField(
        value,
        validationRules[field].type,
        validationRules[field].required,
      );
      if (error) {
        updateFormData({ [`${field}Error`]: error });
      } else {
        updateFormData({ [`${field}Error`]: null });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.casteCertificate.personalInfo")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.casteCertificate.providePersonalDetails")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.fullName")}
            value={formData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={(e) => handleBlur("fullName", e.target.value)}
            error={!!errors.fullName || !!formData.fullNameError}
            helperText={
              errors.fullName ||
              formData.fullNameError ||
              t("forms.casteCertificate.fullNameHelper")
            }
            inputProps={{
              maxLength: 50,
              pattern: "[A-Za-z\\s']{2,50}",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.fatherName")}
            value={formData.fatherName || ""}
            onChange={(e) => handleChange("fatherName", e.target.value)}
            onBlur={(e) => handleBlur("fatherName", e.target.value)}
            error={!!errors.fatherName || !!formData.fatherNameError}
            helperText={errors.fatherName || formData.fatherNameError}
            inputProps={{
              maxLength: 50,
              pattern: "[A-Za-z\\s']{2,50}",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.motherName")}
            value={formData.motherName || ""}
            onChange={(e) => handleChange("motherName", e.target.value)}
            onBlur={(e) => handleBlur("motherName", e.target.value)}
            error={!!errors.motherName || !!formData.motherNameError}
            helperText={errors.motherName || formData.motherNameError}
            inputProps={{
              maxLength: 50,
              pattern: "[A-Za-z\\s']{2,50}",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("forms.common.dateOfBirth")}
              value={formData.dateOfBirth || null}
              onChange={(value) => handleChange("dateOfBirth", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
              )}
              maxDate={new Date()}
              minDate={new Date(new Date().getFullYear() - 120, 0, 1)}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.common.age")}
            value={formData.age || ""}
            InputProps={{ readOnly: true }}
            helperText={t("forms.incomeCertificate.ageHelper")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("forms.common.gender")}</InputLabel>
            <Select
              value={formData.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
              label={t("forms.common.gender")}
            >
              <MenuItem value="Male">{t("forms.common.male")}</MenuItem>
              <MenuItem value="Female">{t("forms.common.female")}</MenuItem>
              <MenuItem value="Other">{t("forms.common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.maritalStatus}>
            <InputLabel>{t("forms.casteCertificate.maritalStatus")}</InputLabel>
            <Select
              value={formData.maritalStatus || ""}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              label={t("forms.casteCertificate.maritalStatus")}
            >
              <MenuItem value="Single">
                {t("forms.casteCertificate.single")}
              </MenuItem>
              <MenuItem value="Married">
                {t("forms.casteCertificate.married")}
              </MenuItem>
              <MenuItem value="Divorced">
                {t("forms.casteCertificate.divorced")}
              </MenuItem>
              <MenuItem value="Widowed">
                {t("forms.casteCertificate.widowed")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.mobile")}
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            onBlur={(e) => handleBlur("mobile", e.target.value)}
            error={!!errors.mobile || !!formData.mobileError}
            helperText={
              errors.mobile ||
              formData.mobileError ||
              t("forms.casteCertificate.mobileHelper")
            }
            inputProps={{
              maxLength: 10,
              pattern: "[6-9][0-9]{9}",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.email")}
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={(e) => handleBlur("email", e.target.value)}
            error={!!errors.email || !!formData.emailError}
            helperText={
              errors.email ||
              formData.emailError ||
              t("forms.incomeCertificate.emailHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.aadhaar")}
            value={formData.aadhaar || ""}
            onChange={(e) => handleChange("aadhaar", e.target.value)}
            onBlur={(e) => handleBlur("aadhaar", e.target.value)}
            error={!!errors.aadhaar || !!formData.aadhaarError}
            helperText={
              errors.aadhaar ||
              formData.aadhaarError ||
              t("forms.incomeCertificate.aadhaarHelper")
            }
            inputProps={{
              maxLength: 12,
              pattern: "[0-9]{12}",
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const CasteDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    let correctedValue = value;

    if (
      field === "casteClaimed" ||
      field === "subCaste" ||
      field === "religion"
    ) {
      correctedValue = autoCorrect.name(value);
    }

    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.casteCertificate.casteDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.casteCertificate.provideCasteInfo")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.casteClaimed}>
            <InputLabel>{t("forms.casteCertificate.casteClaimed")}</InputLabel>
            <Select
              value={formData.casteClaimed || ""}
              onChange={(e) => handleChange("casteClaimed", e.target.value)}
              label={t("forms.casteCertificate.casteClaimed")}
            >
              <MenuItem value="SC">{t("forms.common.sc")}</MenuItem>
              <MenuItem value="ST">{t("forms.common.st")}</MenuItem>
              <MenuItem value="OBC">{t("forms.common.obc")}</MenuItem>
              <MenuItem value="EWS">{t("forms.common.ews")}</MenuItem>
              <MenuItem value="General">{t("forms.common.general")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.subCaste")}
            value={formData.subCaste || ""}
            onChange={(e) => handleChange("subCaste", e.target.value)}
            error={!!errors.subCaste}
            helperText={
              errors.subCaste || t("forms.casteCertificate.subCasteHelper")
            }
            inputProps={{
              maxLength: 30,
              pattern: "[A-Za-z\\s]{2,30}",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.religion}>
            <InputLabel>
              {t("forms.casteCertificate.religionDeclared")}
            </InputLabel>
            <Select
              value={formData.religion || ""}
              onChange={(e) => handleChange("religion", e.target.value)}
              label={t("forms.casteCertificate.religionDeclared")}
            >
              <MenuItem value="Hindu">{t("forms.common.hindu")}</MenuItem>
              <MenuItem value="Muslim">{t("forms.common.muslim")}</MenuItem>
              <MenuItem value="Christian">
                {t("forms.common.christian")}
              </MenuItem>
              <MenuItem value="Sikh">{t("forms.common.sikh")}</MenuItem>
              <MenuItem value="Buddhist">{t("forms.common.buddhist")}</MenuItem>
              <MenuItem value="Jain">{t("forms.common.jain")}</MenuItem>
              <MenuItem value="Other">{t("forms.common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.fatherCaste")}
            value={formData.fatherCaste || ""}
            onChange={(e) => handleChange("fatherCaste", e.target.value)}
            error={!!errors.fatherCaste}
            helperText={
              errors.fatherCaste ||
              t("forms.casteCertificate.fatherCasteHelper")
            }
            inputProps={{
              maxLength: 30,
              pattern: "[A-Za-z\\s]{2,30}",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.motherCaste")}
            value={formData.motherCaste || ""}
            onChange={(e) => handleChange("motherCaste", e.target.value)}
            error={!!errors.motherCaste}
            helperText={
              errors.motherCaste ||
              t("forms.casteCertificate.motherCasteHelper")
            }
            inputProps={{
              maxLength: 30,
              pattern: "[A-Za-z\\s]{2,30}",
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.casteCertificate.childStatus")}
          </Typography>
          <RadioGroup
            value={formData.childStatus || ""}
            onChange={(e) => handleChange("childStatus", e.target.value)}
            row
          >
            <FormControlLabel
              value="natural"
              control={<Radio />}
              label={t("forms.casteCertificate.naturalBornChild")}
            />
            <FormControlLabel
              value="adopted"
              control={<Radio />}
              label={t("forms.casteCertificate.adoptedChild")}
            />
          </RadioGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

const AddressEducationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const states = getStates();
  const districts = formData.state ? getDistrictsByState(formData.state) : [];

  const handleChange = (field, value) => {
    let updates = { [field]: value };

    // Clear district when state changes
    if (field === "state") {
      updates.district = "";
    }

    // Apply auto-corrections for location fields
    if (field === "village" || field === "district" || field === "state") {
      updates[field] = autoCorrect.name(value);
    }

    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.casteCertificate.addressEducation")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.casteCertificate.provideAddressEducation")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.casteCertificate.currentAddress")}
            value={formData.currentAddress || ""}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
            error={!!errors.currentAddress}
            helperText={
              errors.currentAddress ||
              t("forms.casteCertificate.currentAddressHelper")
            }
            inputProps={{
              minLength: 10,
              maxLength: 200,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.common.permanentAddress")}
            value={formData.permanentAddress || ""}
            onChange={(e) => handleChange("permanentAddress", e.target.value)}
            helperText={t("forms.casteCertificate.permanentAddressHelper")}
            inputProps={{
              minLength: 10,
              maxLength: 200,
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>{t("forms.common.state")}</InputLabel>
            <Select
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              label={t("forms.common.state")}
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
            <InputLabel>{t("forms.common.district")}</InputLabel>
            <Select
              value={formData.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
              label={t("forms.common.district")}
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
            label={t("forms.casteCertificate.village")}
            value={formData.village || ""}
            onChange={(e) => handleChange("village", e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
            inputProps={{
              maxLength: 50,
              pattern: "[A-Za-z\\s]{2,50}",
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.casteCertificate.educationalDetails")}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>
              {t("forms.casteCertificate.educationalQualification")}
            </InputLabel>
            <Select
              value={formData.education || ""}
              onChange={(e) => handleChange("education", e.target.value)}
              label={t("forms.casteCertificate.educationalQualification")}
            >
              <MenuItem value="Illiterate">
                {t("forms.casteCertificate.illiterate")}
              </MenuItem>
              <MenuItem value="Primary">
                {t("forms.casteCertificate.primary")}
              </MenuItem>
              <MenuItem value="Middle">
                {t("forms.casteCertificate.middle")}
              </MenuItem>
              <MenuItem value="Secondary">
                {t("forms.casteCertificate.secondary")}
              </MenuItem>
              <MenuItem value="Higher Secondary">
                {t("forms.casteCertificate.higherSecondary")}
              </MenuItem>
              <MenuItem value="Graduate">
                {t("forms.casteCertificate.graduate")}
              </MenuItem>
              <MenuItem value="Post Graduate">
                {t("forms.casteCertificate.postGraduate")}
              </MenuItem>
              <MenuItem value="Professional">
                {t("forms.casteCertificate.professional")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.institutionName")}
            value={formData.institutionName || ""}
            onChange={(e) => handleChange("institutionName", e.target.value)}
            helperText={t("forms.casteCertificate.institutionHelper")}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const FamilyCertificateStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.casteCertificate.familyCertificateDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.casteCertificate.provideFamilyCertificate")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.casteCertificate.familyMembersCertificate")}
          </Typography>
          <RadioGroup
            value={formData.familyCertificateExists || ""}
            onChange={(e) =>
              handleChange("familyCertificateExists", e.target.value)
            }
            row
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label={t("forms.casteCertificate.yes")}
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label={t("forms.casteCertificate.no")}
            />
          </RadioGroup>
        </Grid>

        {formData.familyCertificateExists === "yes" && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.casteCertificate.certificateHolderName")}
                value={formData.certificateHolderName || ""}
                onChange={(e) =>
                  handleChange("certificateHolderName", e.target.value)
                }
                error={!!errors.certificateHolderName}
                helperText={errors.certificateHolderName}
                inputProps={{
                  maxLength: 50,
                  pattern: "[A-Za-z\\s']{2,50}",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.relationWithHolder}>
                <InputLabel>
                  {t("forms.casteCertificate.relationWithHolder")}
                </InputLabel>
                <Select
                  value={formData.relationWithHolder || ""}
                  onChange={(e) =>
                    handleChange("relationWithHolder", e.target.value)
                  }
                  label={t("forms.casteCertificate.relationWithHolder")}
                >
                  <MenuItem value="Father">
                    {t("forms.casteCertificate.father")}
                  </MenuItem>
                  <MenuItem value="Mother">
                    {t("forms.casteCertificate.mother")}
                  </MenuItem>
                  <MenuItem value="Brother">
                    {t("forms.casteCertificate.brother")}
                  </MenuItem>
                  <MenuItem value="Sister">
                    {t("forms.casteCertificate.sister")}
                  </MenuItem>
                  <MenuItem value="Grandfather">
                    {t("forms.casteCertificate.grandfather")}
                  </MenuItem>
                  <MenuItem value="Grandmother">
                    {t("forms.casteCertificate.grandmother")}
                  </MenuItem>
                  <MenuItem value="Uncle">
                    {t("forms.casteCertificate.uncle")}
                  </MenuItem>
                  <MenuItem value="Aunt">
                    {t("forms.casteCertificate.aunt")}
                  </MenuItem>
                  <MenuItem value="Other">{t("forms.common.other")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.casteCertificate.certificateNumber")}
                value={formData.certificateNumber || ""}
                onChange={(e) =>
                  handleChange("certificateNumber", e.target.value)
                }
                error={!!errors.certificateNumber}
                helperText={
                  errors.certificateNumber ||
                  t("forms.casteCertificate.certificateNumberHelper")
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.casteCertificate.issuingAuthority")}
                value={formData.issuingAuthority || ""}
                onChange={(e) =>
                  handleChange("issuingAuthority", e.target.value)
                }
                error={!!errors.issuingAuthority}
                helperText={
                  errors.issuingAuthority ||
                  t("forms.casteCertificate.issuingAuthorityHelper")
                }
              />
            </Grid>
          </>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("forms.casteCertificate.purposeForCertificate")}
            value={formData.purpose || ""}
            onChange={(e) => handleChange("purpose", e.target.value)}
            error={!!errors.purpose}
            helperText={
              errors.purpose ||
              t("forms.casteCertificate.purposeCertificateHelper")
            }
            placeholder={t("forms.casteCertificate.purposePlaceholder")}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  const requiredDocuments = [
    t("forms.casteCertificate.birthCertificate"),
    t("forms.casteCertificate.schoolLeavingCertificate"),
    t("forms.casteCertificate.aadhaarCard"),
    t("forms.casteCertificate.voterID"),
    t("forms.casteCertificate.rationCard"),
    t("forms.casteCertificate.fatherCasteCertificate"),
    t("forms.casteCertificate.selfDeclaration"),
    t("forms.casteCertificate.photographs"),
    t("forms.casteCertificate.residenceProof"),
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.casteCertificate.documentUpload")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.casteCertificate.uploadAllDocs")}
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={15}
        acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t("forms.casteCertificate.requiredDocuments")}
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
const CasteCertificateForm = () => {
  const { t } = useLanguage();
  const steps = [
    {
      id: "personal",
      title: t("forms.casteCertificate.step1"),
      icon: "Person",
    },
    {
      id: "caste",
      title: t("forms.casteCertificate.step2"),
      icon: "Assignment",
    },
    { id: "address", title: t("forms.casteCertificate.step3"), icon: "Home" },
    { id: "family", title: t("forms.casteCertificate.step4"), icon: "Group" },
    {
      id: "documents",
      title: t("forms.casteCertificate.step5"),
      icon: "Description",
    },
  ];

  const validationRules = {
    // Personal Information
    fullName: { type: "name", required: true },
    fatherName: { type: "name", required: true },
    motherName: { type: "name", required: true },
    dateOfBirth: { type: "birthDate", required: true },
    gender: { type: "text", required: true },
    mobile: { type: "mobile", required: true },
    email: { type: "email", required: false },
    aadhaar: { type: "aadhaar", required: true },

    // Caste Details
    casteClaimed: { type: "caste", required: true },
    religion: { type: "religion", required: true },
    childStatus: { type: "text", required: true },

    // Address & Education
    currentAddress: { type: "address", required: true },
    state: { type: "location", required: true },
    district: { type: "location", required: true },
    village: { type: "location", required: true },

    // Family Certificate Details
    familyCertificateExists: { type: "text", required: true },
    purpose: { type: "text", required: true },
  };

  return (
    <MultiStepForm
      serviceName={t("forms.casteCertificate.title")}
      serviceType="caste_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <CasteDetailsStep />
      <AddressEducationStep />
      <FamilyCertificateStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default CasteCertificateForm;
