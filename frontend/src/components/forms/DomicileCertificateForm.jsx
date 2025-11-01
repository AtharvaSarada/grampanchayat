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
  Alert,
  Chip,
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

// Personal Information Step
const PersonalInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
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

    if (
      field === "applicantName" ||
      field === "fatherName" ||
      field === "motherName"
    ) {
      correctedValue = autoCorrect.name(value);
    } else if (field === "mobile") {
      correctedValue = autoCorrect.mobile(value);
    } else if (field === "aadhaar") {
      correctedValue = autoCorrect.aadhaar(value);
    } else if (field === "email") {
      correctedValue = autoCorrect.email(value);
    }

    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.domicileCertificate.personalInfo")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.domicileCertificate.enterPersonalDetails")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.applicantName")}
            value={formData.applicantName || ""}
            onChange={(e) => handleChange("applicantName", e.target.value)}
            error={!!errors.applicantName}
            helperText={errors.applicantName || t("forms.domicileCertificate.applicantNameHelper")}
            inputProps={{ maxLength: 50, pattern: "[A-Za-z\\s']{2,50}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.fatherName")}
            value={formData.fatherName || ""}
            onChange={(e) => handleChange("fatherName", e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            inputProps={{ maxLength: 50, pattern: "[A-Za-z\\s']{2,50}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.motherName")}
            value={formData.motherName || ""}
            onChange={(e) => handleChange("motherName", e.target.value)}
            error={!!errors.motherName}
            helperText={errors.motherName}
            inputProps={{ maxLength: 50, pattern: "[A-Za-z\\s']{2,50}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("forms.domicileCertificate.dateOfBirth")}
              value={formData.dateOfBirth || null}
              onChange={(date) => handleChange("dateOfBirth", date)}
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
              label={t("forms.domicileCertificate.age")}
              value={`${age} ${t("forms.domicileCertificate.ageYears")}`}
              disabled
              helperText={t("forms.domicileCertificate.ageCalculated")}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>{t("forms.domicileCertificate.gender")}</InputLabel>
            <Select
              value={formData.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
              label={t("forms.domicileCertificate.gender")}
            >
              <MenuItem value="Male">{t("forms.domicileCertificate.male")}</MenuItem>
              <MenuItem value="Female">{t("forms.domicileCertificate.female")}</MenuItem>
              <MenuItem value="Other">{t("forms.domicileCertificate.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.mobile")}
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("forms.domicileCertificate.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: "[6-9][0-9]{9}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.email")}
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t("forms.domicileCertificate.emailHelper")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.aadhaar")}
            value={formData.aadhaar || ""}
            onChange={(e) => handleChange("aadhaar", e.target.value)}
            error={!!errors.aadhaar}
            helperText={errors.aadhaar || t("forms.domicileCertificate.aadhaarHelper")}
            inputProps={{ maxLength: 12, pattern: "\\d{12}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.maritalStatus}>
            <InputLabel>{t("forms.domicileCertificate.maritalStatus")}</InputLabel>
            <Select
              value={formData.maritalStatus || ""}
              onChange={(e) => handleChange("maritalStatus", e.target.value)}
              label={t("forms.domicileCertificate.maritalStatus")}
            >
              <MenuItem value="Single">
                {t("forms.domicileCertificate.single")}
              </MenuItem>
              <MenuItem value="Married">
                {t("forms.domicileCertificate.married")}
              </MenuItem>
              <MenuItem value="Divorced">
                {t("forms.domicileCertificate.divorced")}
              </MenuItem>
              <MenuItem value="Widowed">
                {t("forms.domicileCertificate.widowed")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.occupation")}
            value={formData.occupation || ""}
            onChange={(e) => handleChange("occupation", e.target.value)}
            error={!!errors.occupation}
            helperText={
              errors.occupation ||
              t("forms.domicileCertificate.occupationHelper")
            }
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.religion}>
            <InputLabel>{t("forms.domicileCertificate.religion")}</InputLabel>
            <Select
              value={formData.religion || ""}
              onChange={(e) => handleChange("religion", e.target.value)}
              label={t("forms.domicileCertificate.religion")}
            >
              <MenuItem value="Hindu">{t("common.hindu")}</MenuItem>
              <MenuItem value="Muslim">{t("common.muslim")}</MenuItem>
              <MenuItem value="Christian">{t("common.christian")}</MenuItem>
              <MenuItem value="Sikh">{t("common.sikh")}</MenuItem>
              <MenuItem value="Buddhist">{t("common.buddhist")}</MenuItem>
              <MenuItem value="Jain">{t("common.jain")}</MenuItem>
              <MenuItem value="Other">{t("common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Address Details Step
const AddressDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const [states] = React.useState(getStates());
  const [districts, setDistricts] = React.useState([]);

  React.useEffect(() => {
    if (formData.state) {
      setDistricts(getDistrictsByState(formData.state));
    }
  }, [formData.state]);

  const handleChange = (field, value) => {
    const updates = { [field]: value };

    if (field === "state") {
      updates.district = "";
      setDistricts(getDistrictsByState(value));
    }

    updateFormData(updates);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.domicileCertificate.addressInfo")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.domicileCertificate.provideAddressDetails")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.domicileCertificate.currentAddressSection")}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.domicileCertificate.currentAddress")}
            value={formData.currentAddress || ""}
            onChange={(e) => handleChange("currentAddress", e.target.value)}
            error={!!errors.currentAddress}
            helperText={
              errors.currentAddress ||
              t("forms.domicileCertificate.currentAddressHelper")
            }
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>{t("common.state")}</InputLabel>
            <Select
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              label={t("common.state")}
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
            <InputLabel>{t("common.district")}</InputLabel>
            <Select
              value={formData.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
              label={t("common.district")}
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
            label={t("common.pincode")}
            value={formData.pincode || ""}
            onChange={(e) => handleChange("pincode", e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            inputProps={{ maxLength: 6, pattern: "\\d{6}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.tehsil")}
            value={formData.tehsil || ""}
            onChange={(e) => handleChange("tehsil", e.target.value)}
            error={!!errors.tehsil}
            helperText={errors.tehsil}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.villageCity")}
            value={formData.village || ""}
            onChange={(e) => handleChange("village", e.target.value)}
            error={!!errors.village}
            helperText={errors.village}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            gutterBottom
            color="primary"
            sx={{ mt: 2 }}
          >
            {t("forms.domicileCertificate.permanentAddressSection")}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("forms.domicileCertificate.sameAddressQuestion")}
          </Typography>
          <RadioGroup
            value={formData.sameAddress || "no"}
            onChange={(e) => handleChange("sameAddress", e.target.value)}
            row
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label={t("common.yes")}
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label={t("common.no")}
            />
          </RadioGroup>
        </Grid>

        {formData.sameAddress === "no" && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t("forms.domicileCertificate.permanentAddressLabel")}
                value={formData.permanentAddress || ""}
                onChange={(e) =>
                  handleChange("permanentAddress", e.target.value)
                }
                error={!!errors.permanentAddress}
                helperText={
                  errors.permanentAddress ||
                  t("forms.domicileCertificate.permanentAddressHelper")
                }
                inputProps={{ minLength: 10, maxLength: 200 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.domicileCertificate.permanentState")}
                value={formData.permanentState || ""}
                onChange={(e) => handleChange("permanentState", e.target.value)}
                error={!!errors.permanentState}
                helperText={errors.permanentState}
                inputProps={{ maxLength: 50 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.domicileCertificate.permanentPincode")}
                value={formData.permanentPincode || ""}
                onChange={(e) =>
                  handleChange("permanentPincode", e.target.value)
                }
                error={!!errors.permanentPincode}
                helperText={errors.permanentPincode}
                inputProps={{ maxLength: 6, pattern: "\\d{6}" }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

// Residence Details Step
const ResidenceDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.domicileCertificate.residenceDetails")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.domicileCertificate.provideResidenceInfo")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={t("forms.domicileCertificate.residenceSince")}
              value={formData.residenceSince || null}
              onChange={(date) => handleChange("residenceSince", date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.residenceSince}
                  helperText={
                    errors.residenceSince ||
                    t("forms.domicileCertificate.residenceSinceHelper")
                  }
                />
              )}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.residenceDuration")}
            value={formData.residenceDuration || ""}
            onChange={(e) => handleChange("residenceDuration", e.target.value)}
            helperText={t("forms.domicileCertificate.residenceDurationHelper")}
            inputProps={{ maxLength: 50 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.residenceType}>
            <InputLabel>
              {t("forms.domicileCertificate.residenceType")}
            </InputLabel>
            <Select
              value={formData.residenceType || ""}
              onChange={(e) => handleChange("residenceType", e.target.value)}
              label={t("forms.domicileCertificate.residenceType")}
            >
              <MenuItem value="Own House">
                {t("forms.domicileCertificate.ownHouse")}
              </MenuItem>
              <MenuItem value="Rented House">
                {t("forms.domicileCertificate.rentedHouse")}
              </MenuItem>
              <MenuItem value="Family House">
                {t("forms.domicileCertificate.familyHouse")}
              </MenuItem>
              <MenuItem value="Government Quarters">
                {t("forms.domicileCertificate.governmentQuarters")}
              </MenuItem>
              <MenuItem value="Company Accommodation">
                {t("forms.domicileCertificate.companyAccommodation")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.domicileCertificate.houseNumber")}
            value={formData.houseNumber || ""}
            onChange={(e) => handleChange("houseNumber", e.target.value)}
            helperText={t("forms.domicileCertificate.houseNumberHelper")}
            inputProps={{ maxLength: 20 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom color="primary">
            {t("forms.domicileCertificate.purposeOfCertificate")}
          </Typography>
          <FormControl fullWidth error={!!errors.purpose}>
            <InputLabel>{t("forms.domicileCertificate.purpose")}</InputLabel>
            <Select
              value={formData.purpose || ""}
              onChange={(e) => handleChange("purpose", e.target.value)}
              label={t("forms.domicileCertificate.purpose")}
            >
              <MenuItem value="Education">
                {t("forms.domicileCertificate.education")}
              </MenuItem>
              <MenuItem value="Employment">
                {t("forms.domicileCertificate.employment")}
              </MenuItem>
              <MenuItem value="Government Job">
                {t("forms.domicileCertificate.governmentJob")}
              </MenuItem>
              <MenuItem value="Admission">
                {t("forms.domicileCertificate.admission")}
              </MenuItem>
              <MenuItem value="Scholarship">
                {t("forms.domicileCertificate.scholarship")}
              </MenuItem>
              <MenuItem value="Legal Proceedings">
                {t("forms.domicileCertificate.legalProceedings")}
              </MenuItem>
              <MenuItem value="Other">{t("common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {formData.purpose === "Other" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("forms.domicileCertificate.specifyPurpose")}
              value={formData.otherPurpose || ""}
              onChange={(e) => handleChange("otherPurpose", e.target.value)}
              error={!!errors.otherPurpose}
              helperText={
                errors.otherPurpose ||
                t("forms.domicileCertificate.specifyPurposeHelper")
              }
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.domicileCertificate.additionalInfo")}
            value={formData.additionalInfo || ""}
            onChange={(e) => handleChange("additionalInfo", e.target.value)}
            helperText={t("forms.domicileCertificate.additionalInfoHelper")}
            inputProps={{ maxLength: 500 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{t("forms.domicileCertificate.noteTitle")}</strong>{" "}
              {t("forms.domicileCertificate.noteText")}
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Documents Step
const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  const requiredDocuments = [
    t("forms.domicileCertificate.aadhaarCard"),
    t("forms.domicileCertificate.birthCertificate"),
    t("forms.domicileCertificate.schoolCollegeCertificates"),
    t("forms.domicileCertificate.residenceProofDocs"),
    t("forms.domicileCertificate.propertyDocuments"),
    t("forms.domicileCertificate.employmentCertificate"),
    t("forms.domicileCertificate.affidavitOfResidence"),
    t("forms.domicileCertificate.passportPhotos"),
    t("forms.domicileCertificate.previousDomicile"),
    t("forms.domicileCertificate.characterCertificate"),
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.domicileCertificate.documentUpload")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.domicileCertificate.uploadSupportingDocs")}
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={12}
        acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t("forms.domicileCertificate.requiredDocuments")}
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
const DomicileCertificateForm = () => {
  const { t } = useLanguage();
  const steps = [
    {
      id: "personal",
      title: t("forms.domicileCertificate.step1"),
      icon: "Person",
    },
    {
      id: "address",
      title: t("forms.domicileCertificate.step2"),
      icon: "Home",
    },
    {
      id: "residence",
      title: t("forms.domicileCertificate.step3"),
      icon: "LocationCity",
    },
    {
      id: "documents",
      title: t("forms.domicileCertificate.step4"),
      icon: "Description",
    },
  ];

  const validationRules = {
    // Personal Information
    applicantName: { type: "name", required: true },
    fatherName: { type: "name", required: true },
    motherName: { type: "name", required: true },
    dateOfBirth: { type: "date", required: true },
    gender: { type: "text", required: true },
    mobile: { type: "mobile", required: true },
    email: { type: "email", required: false },
    aadhaar: { type: "aadhaar", required: true },
    maritalStatus: { type: "text", required: true },
    occupation: { type: "text", required: true },
    religion: { type: "text", required: true },

    // Address Details
    currentAddress: { type: "address", required: true },
    state: { type: "text", required: true },
    district: { type: "text", required: true },
    pincode: { type: "pincode", required: true },
    tehsil: { type: "text", required: true },
    village: { type: "text", required: true },

    // Residence Details
    residenceSince: { type: "date", required: true },
    residenceType: { type: "text", required: true },
    purpose: { type: "text", required: true },
  };

  return (
    <MultiStepForm
      serviceName={t("forms.domicileCertificate.title")}
      serviceType="domicile_certificate"
      steps={steps}
      validationRules={validationRules}
    >
      <PersonalInformationStep />
      <AddressDetailsStep />
      <ResidenceDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default DomicileCertificateForm;
