import React, { useState } from "react";
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
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MultiStepForm from "./MultiStepForm";
import DocumentUpload from "../common/DocumentUpload";
import { calculateAge } from "../../utils/formValidation";
import { useLanguage } from "../../i18n/LanguageProvider";

// Step Components
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    const updates = { [field]: value };

    // Auto-calculate age when date of birth changes
    if (field === "dateOfBirth") {
      updates.age = calculateAge(value);
    }

    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.agriculturalSubsidy.farmerInfo.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.agriculturalSubsidy.farmerInfo.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.farmerInfo.fullName")}
            value={formData.applicantName || ""}
            onChange={(e) => handleChange("applicantName", e.target.value)}
            error={!!errors.applicantName}
            helperText={
              errors.applicantName ||
              t("forms.agriculturalSubsidy.farmerInfo.fullNameHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.farmerInfo.fatherName")}
            value={formData.fatherName || ""}
            onChange={(e) => handleChange("fatherName", e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.mobile")}
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            error={!!errors.mobile}
            helperText={
              errors.mobile || t("forms.casteCertificate.mobileHelper")
            }
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.email")}
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={
              errors.email || t("forms.incomeCertificate.emailHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.aadhaar")}
            value={formData.aadhaar || ""}
            onChange={(e) => handleChange("aadhaar", e.target.value)}
            error={!!errors.aadhaar}
            helperText={
              errors.aadhaar || t("forms.incomeCertificate.aadhaarHelper")
            }
            inputProps={{ maxLength: 12 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.common.address")}
            value={formData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            error={!!errors.address}
            helperText={
              errors.address ||
              t("forms.incomeCertificate.currentAddressHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.landDetails.village")}
            value={formData.village || ""}
            onChange={(e) => handleChange("village", e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.common.district")}
            value={formData.district || ""}
            onChange={(e) => handleChange("district", e.target.value)}
            error={!!errors.district}
            helperText={errors.district}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.common.pincode")}
            value={formData.pincode || ""}
            onChange={(e) => handleChange("pincode", e.target.value)}
            error={!!errors.pincode}
            helperText={
              errors.pincode || t("forms.bplCertificate.pincodeHelper")
            }
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const ProjectDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.agriculturalSubsidy.subsidyDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.agriculturalSubsidy.subsidyDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.cropName")}
            value={formData.projectName || ""}
            onChange={(e) => handleChange("projectName", e.target.value)}
            error={!!errors.projectName}
            helperText={
              errors.projectName ||
              t("forms.agriculturalSubsidy.subsidyDetails.cropTypeHelper")
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("forms.common.address")}
            value={formData.projectLocation || ""}
            onChange={(e) => handleChange("projectLocation", e.target.value)}
            error={!!errors.projectLocation}
            helperText={errors.projectLocation}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.cropArea")}
            type="number"
            value={formData.cultivationArea || ""}
            onChange={(e) => handleChange("cultivationArea", e.target.value)}
            error={!!errors.cultivationArea}
            helperText={errors.cultivationArea}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {t("forms.common.acres")}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.cropName")}
            type="number"
            value={formData.numberOfPlants || ""}
            onChange={(e) => handleChange("numberOfPlants", e.target.value)}
            error={!!errors.numberOfPlants}
            helperText={errors.numberOfPlants}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.cropName")}
            value={formData.cropName || ""}
            onChange={(e) => handleChange("cropName", e.target.value)}
            error={!!errors.cropName}
            helperText={
              errors.cropName ||
              t("forms.agriculturalSubsidy.subsidyDetails.cropTypeHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t(
              "forms.agriculturalSubsidy.subsidyDetails.equipmentRequired",
            )}
            value={formData.plantingMaterialSource || ""}
            onChange={(e) =>
              handleChange("plantingMaterialSource", e.target.value)
            }
            error={!!errors.plantingMaterialSource}
            helperText={
              errors.plantingMaterialSource ||
              t(
                "forms.agriculturalSubsidy.subsidyDetails.equipmentRequiredHelper",
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.estimatedCost")}
            type="number"
            value={formData.expectedIncome || ""}
            onChange={(e) => handleChange("expectedIncome", e.target.value)}
            error={!!errors.expectedIncome}
            helperText={
              errors.expectedIncome ||
              t("forms.agriculturalSubsidy.subsidyDetails.estimatedCostHelper")
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const LandDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.agriculturalSubsidy.landDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.agriculturalSubsidy.landDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.agriculturalSubsidy.landDetails.landOwnership")}
          </Typography>
          <RadioGroup
            value={formData.landOwnership || ""}
            onChange={(e) => handleChange("landOwnership", e.target.value)}
            row
          >
            <FormControlLabel
              value="own"
              control={<Radio />}
              label={t("forms.agriculturalSubsidy.landDetails.ownedLand")}
            />
            <FormControlLabel
              value="leased"
              control={<Radio />}
              label={t("forms.agriculturalSubsidy.landDetails.leasedLand")}
            />
          </RadioGroup>
        </Grid>

        {formData.landOwnership === "leased" && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.agriculturalSubsidy.landDetails.cultivableLand")}
              value={formData.leasePeriod || ""}
              onChange={(e) => handleChange("leasePeriod", e.target.value)}
              error={!!errors.leasePeriod}
              helperText={errors.leasePeriod}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.landDetails.surveyNumber")}
            value={formData.surveyNumbers || ""}
            onChange={(e) => handleChange("surveyNumbers", e.target.value)}
            error={!!errors.surveyNumbers}
            helperText={
              errors.surveyNumbers ||
              t("forms.agriculturalSubsidy.landDetails.surveyNumberHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.landDetails.totalLandArea")}
            type="number"
            value={formData.totalLandArea || ""}
            onChange={(e) => handleChange("totalLandArea", e.target.value)}
            error={!!errors.totalLandArea}
            helperText={errors.totalLandArea}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {t("forms.common.acres")}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.irrigationSource}>
            <InputLabel>
              {t("forms.agriculturalSubsidy.landDetails.waterSource")}
            </InputLabel>
            <Select
              value={formData.irrigationSource || ""}
              onChange={(e) => handleChange("irrigationSource", e.target.value)}
              label={t("forms.agriculturalSubsidy.landDetails.waterSource")}
            >
              <MenuItem value="Borewell">
                {t("forms.agriculturalSubsidy.landDetails.borewellTubewell")}
              </MenuItem>
              <MenuItem value="Well">
                {t("forms.agriculturalSubsidy.landDetails.well")}
              </MenuItem>
              <MenuItem value="Canal">
                {t("forms.agriculturalSubsidy.landDetails.canal")}
              </MenuItem>
              <MenuItem value="River">
                {t("forms.agriculturalSubsidy.landDetails.rainwater")}
              </MenuItem>
              <MenuItem value="Pond">
                {t("forms.agriculturalSubsidy.landDetails.reservoir")}
              </MenuItem>
              <MenuItem value="Rainwater">
                {t("forms.agriculturalSubsidy.landDetails.rainwater")}
              </MenuItem>
              <MenuItem value="Other">{t("forms.common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.common.description")}
            value={formData.landDescription || ""}
            onChange={(e) => handleChange("landDescription", e.target.value)}
            helperText=""
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const FinancialDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.agriculturalSubsidy.subsidyDetails.bankDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.agriculturalSubsidy.subsidyDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.estimatedCost")}
            type="number"
            value={formData.projectCost || ""}
            onChange={(e) => handleChange("projectCost", e.target.value)}
            error={!!errors.projectCost}
            helperText={
              errors.projectCost ||
              t("forms.agriculturalSubsidy.subsidyDetails.estimatedCostHelper")
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.agriculturalSubsidy.subsidyDetails.subsidyAmount")}
            type="number"
            value={formData.subsidyAmount || ""}
            onChange={(e) => handleChange("subsidyAmount", e.target.value)}
            error={!!errors.subsidyAmount}
            helperText={errors.subsidyAmount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t(
              "forms.agriculturalSubsidy.subsidyDetails.bankDetails.bankName",
            )}
            value={formData.bankName || ""}
            onChange={(e) => handleChange("bankName", e.target.value)}
            error={!!errors.bankName}
            helperText={errors.bankName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t(
              "forms.agriculturalSubsidy.subsidyDetails.bankDetails.branchName",
            )}
            value={formData.branchName || ""}
            onChange={(e) => handleChange("branchName", e.target.value)}
            error={!!errors.branchName}
            helperText={errors.branchName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t(
              "forms.agriculturalSubsidy.subsidyDetails.bankDetails.accountNumber",
            )}
            value={formData.accountNumber || ""}
            onChange={(e) => handleChange("accountNumber", e.target.value)}
            error={!!errors.accountNumber}
            helperText={errors.accountNumber}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t(
              "forms.agriculturalSubsidy.subsidyDetails.bankDetails.ifscCode",
            )}
            value={formData.ifscCode || ""}
            onChange={(e) =>
              handleChange("ifscCode", e.target.value.toUpperCase())
            }
            error={!!errors.ifscCode}
            helperText={errors.ifscCode}
            inputProps={{ maxLength: 11 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.agriculturalSubsidy.subsidyDetails.loanDetails")}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.common.description")}
            type="number"
            value={formData.loanAmount || ""}
            onChange={(e) => handleChange("loanAmount", e.target.value)}
            helperText=""
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t(
              "forms.agriculturalSubsidy.subsidyDetails.bankDetails.bankName",
            )}
            value={formData.lendingInstitution || ""}
            onChange={(e) => handleChange("lendingInstitution", e.target.value)}
            helperText=""
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();

  const requiredDocuments = [
    t("forms.agriculturalSubsidy.documents.landDocuments"),
    t("forms.agriculturalSubsidy.documents.aadhaarCard"),
    t("forms.agriculturalSubsidy.documents.casteCertificate"),
    t("forms.agriculturalSubsidy.documents.incomeCertificate"),
    t("forms.agriculturalSubsidy.documents.bankPassbook"),
    t("forms.agriculturalSubsidy.documents.farmerIdCard"),
    t("forms.agriculturalSubsidy.documents.soilTestReport"),
    t("forms.agriculturalSubsidy.documents.quotations"),
    t("forms.agriculturalSubsidy.documents.previousSubsidyDocs"),
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.agriculturalSubsidy.documents.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.agriculturalSubsidy.documents.uploadInfo")}
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
          {t("forms.common.requiredDocuments")}:
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
const AgriculturalSubsidyForm = () => {
  const { t } = useLanguage();

  const steps = [
    {
      id: "personal",
      title: t("forms.agriculturalSubsidy.farmerInfo.title"),
      icon: "Person",
    },
    {
      id: "project",
      title: t("forms.agriculturalSubsidy.subsidyDetails.title"),
      icon: "Agriculture",
    },
    {
      id: "land",
      title: t("forms.agriculturalSubsidy.landDetails.title"),
      icon: "Landscape",
    },
    {
      id: "financial",
      title: t("forms.agriculturalSubsidy.subsidyDetails.bankDetails.title"),
      icon: "AccountBalance",
    },
    {
      id: "documents",
      title: t("forms.agriculturalSubsidy.documents.title"),
      icon: "Description",
    },
  ];

  const validationRules = {
    // Personal Information
    applicantName: { type: "text", required: true },
    fatherName: { type: "text", required: true },
    dateOfBirth: { type: "date", required: true },
    gender: { type: "text", required: true },
    mobile: { type: "mobile", required: true },
    email: { type: "email", required: false },
    aadhaar: { type: "aadhaar", required: true },
    address: { type: "text", required: true },
    village: { type: "text", required: true },
    district: { type: "text", required: true },
    pincode: { type: "pincode", required: true },

    // Project Details
    projectName: { type: "text", required: true },
    projectLocation: { type: "text", required: true },
    cultivationArea: { type: "amount", required: true },
    cropName: { type: "text", required: true },
    expectedIncome: { type: "amount", required: true },

    // Land Details
    landOwnership: { type: "text", required: true },
    surveyNumbers: { type: "text", required: true },
    totalLandArea: { type: "amount", required: true },

    // Financial Details
    projectCost: { type: "amount", required: true },
    subsidyAmount: { type: "amount", required: true },
    bankName: { type: "text", required: true },
    branchName: { type: "text", required: true },
    accountNumber: { type: "bankAccount", required: true },
    ifscCode: { type: "ifsc", required: true },
  };

  return (
    <MultiStepForm
      serviceName={t("forms.agriculturalSubsidy.title")}
      serviceType="agricultural_subsidy"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <ProjectDetailsStep />
      <LandDetailsStep />
      <FinancialDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default AgriculturalSubsidyForm;
