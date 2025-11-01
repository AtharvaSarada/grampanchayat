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
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import MultiStepForm from "./MultiStepForm";
import DocumentUpload from "../common/DocumentUpload";
import { useLanguage } from "../../i18n/LanguageProvider";

// Step Components
const ApplicantInformationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t('forms.buildingPermission.ownerInfo.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t('forms.buildingPermission.ownerInfo.subtitle')}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.buildingPermission.ownerInfo.ownerName')}
            value={formData.ownerName || ""}
            onChange={(e) => handleChange("ownerName", e.target.value)}
            error={!!errors.ownerName}
            helperText={
              errors.ownerName || t('forms.buildingPermission.ownerInfo.ownerNameHelper')
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.buildingPermission.ownerInfo.fatherName')}
            value={formData.fatherName || ""}
            onChange={(e) => handleChange("fatherName", e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.buildingPermission.ownerInfo.mobile')}
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t('forms.buildingPermission.ownerInfo.mobileHelper')}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.buildingPermission.ownerInfo.email')}
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email || t('forms.buildingPermission.ownerInfo.emailHelper')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('forms.buildingPermission.ownerInfo.correspondenceAddress')}
            value={formData.correspondenceAddress || ""}
            onChange={(e) =>
              handleChange("correspondenceAddress", e.target.value)
            }
            error={!!errors.correspondenceAddress}
            helperText={
              errors.correspondenceAddress || t('forms.buildingPermission.ownerInfo.correspondenceAddressHelper')
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
            helperText={errors.aadhaar || t('forms.incomeCertificate.aadhaarHelper')}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t('forms.buildingPermission.ownerInfo.panNumber')}
            value={formData.panNumber || ""}
            onChange={(e) =>
              handleChange("panNumber", e.target.value.toUpperCase())
            }
            error={!!errors.panNumber}
            helperText={errors.panNumber || t('forms.buildingPermission.ownerInfo.panNumberHelper')}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const PropertyDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.buildingPermission.propertyDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.buildingPermission.propertyDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.surveyNumber")}
            value={formData.plotNumber || ""}
            onChange={(e) => handleChange("plotNumber", e.target.value)}
            error={!!errors.plotNumber}
            helperText={
              errors.plotNumber || t("forms.buildingPermission.propertyDetails.surveyNumberHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.plotArea")}
            type="number"
            value={formData.plotArea || ""}
            onChange={(e) => handleChange("plotArea", e.target.value)}
            error={!!errors.plotArea}
            helperText={errors.plotArea || t("forms.buildingPermission.propertyDetails.plotAreaHelper")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.buildingPermission.propertyDetails.constructionSiteAddress")}
            value={formData.constructionSiteAddress || ""}
            onChange={(e) =>
              handleChange("constructionSiteAddress", e.target.value)
            }
            error={!!errors.constructionSiteAddress}
            helperText={
              errors.constructionSiteAddress ||
              t("forms.buildingPermission.propertyDetails.constructionSiteAddressHelper")
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.constructionType}>
            <InputLabel>{t("forms.buildingPermission.propertyDetails.constructionType")}</InputLabel>
            <Select
              value={formData.constructionType || ""}
              onChange={(e) => handleChange("constructionType", e.target.value)}
              label={t("forms.buildingPermission.propertyDetails.constructionType")}
            >
              <MenuItem value="Residential">{t("forms.buildingPermission.propertyDetails.residential")}</MenuItem>
              <MenuItem value="Commercial">{t("forms.buildingPermission.propertyDetails.commercial")}</MenuItem>
              <MenuItem value="Industrial">{t("forms.buildingPermission.propertyDetails.industrial")}</MenuItem>
              <MenuItem value="Institutional">{t("forms.buildingPermission.propertyDetails.institutional")}</MenuItem>
              <MenuItem value="Mixed Use">{t("forms.buildingPermission.propertyDetails.mixedUse")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.proposedBuildingArea")}
            type="number"
            value={formData.proposedBuildingArea || ""}
            onChange={(e) =>
              handleChange("proposedBuildingArea", e.target.value)
            }
            error={!!errors.proposedBuildingArea}
            helperText={errors.proposedBuildingArea}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t(
              "forms.buildingPermission.constructionPlan.numberOfFloors",
            )}
            type="number"
            value={formData.numberOfFloors || ""}
            onChange={(e) => handleChange("numberOfFloors", e.target.value)}
            error={!!errors.numberOfFloors}
            helperText={errors.numberOfFloors}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.buildingHeight")}
            type="number"
            value={formData.buildingHeight || ""}
            onChange={(e) => handleChange("buildingHeight", e.target.value)}
            error={!!errors.buildingHeight}
            helperText={errors.buildingHeight}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.meters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.parkingArea")}
            type="number"
            value={formData.parkingArea || ""}
            onChange={(e) => handleChange("parkingArea", e.target.value)}
            helperText={t("forms.buildingPermission.propertyDetails.parkingAreaHelper")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.buildingPermission.propertyDetails.setbackDetails")}
          </Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.frontSetback")}
            type="number"
            value={formData.frontSetback || ""}
            onChange={(e) => handleChange("frontSetback", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.meters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.rearSetback")}
            type="number"
            value={formData.rearSetback || ""}
            onChange={(e) => handleChange("rearSetback", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.meters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.leftSetback")}
            type="number"
            value={formData.leftSetback || ""}
            onChange={(e) => handleChange("leftSetback", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.meters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.propertyDetails.rightSetback")}
            type="number"
            value={formData.rightSetback || ""}
            onChange={(e) => handleChange("rightSetback", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.meters")}</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const ConstructionPlanStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.buildingPermission.constructionPlan.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.buildingPermission.constructionPlan.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.structureType}>
            <InputLabel>{t("forms.buildingPermission.constructionPlan.structureType")}</InputLabel>
            <Select
              value={formData.structureType || ""}
              onChange={(e) => handleChange("structureType", e.target.value)}
              label={t("forms.buildingPermission.constructionPlan.structureType")}
            >
              <MenuItem value="RCC">{t("forms.buildingPermission.constructionPlan.rcc")}</MenuItem>
              <MenuItem value="Load Bearing">{t("forms.buildingPermission.constructionPlan.loadBearing")}</MenuItem>
              <MenuItem value="Steel Frame">{t("forms.buildingPermission.constructionPlan.steelFrame")}</MenuItem>
              <MenuItem value="Composite">{t("forms.buildingPermission.constructionPlan.composite")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.constructionPlan.totalBuiltupArea")}
            type="number"
            value={formData.totalBuiltupArea || ""}
            onChange={(e) => handleChange("totalBuiltupArea", e.target.value)}
            error={!!errors.totalBuiltupArea}
            helperText={errors.totalBuiltupArea}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.buildingPermission.constructionPlan.floorwisePlinthArea")}
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.constructionPlan.groundFloorArea")}
            type="number"
            value={formData.groundFloorArea || ""}
            onChange={(e) => handleChange("groundFloorArea", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.constructionPlan.firstFloorArea")}
            type="number"
            value={formData.firstFloorArea || ""}
            onChange={(e) => handleChange("firstFloorArea", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.constructionPlan.otherFloorsArea")}
            type="number"
            value={formData.otherFloorsArea || ""}
            onChange={(e) => handleChange("otherFloorsArea", e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{t("forms.common.sqMeters")}</InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.buildingPermission.constructionPlan.drainageUtilities")}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t("forms.buildingPermission.constructionPlan.drainageConnection")}</InputLabel>
            <Select
              value={formData.drainageConnection || ""}
              onChange={(e) =>
                handleChange("drainageConnection", e.target.value)
              }
              label={t("forms.buildingPermission.constructionPlan.drainageConnection")}
            >
              <MenuItem value="Municipal Sewer">{t("forms.buildingPermission.constructionPlan.municipalSewer")}</MenuItem>
              <MenuItem value="Septic Tank">{t("forms.buildingPermission.constructionPlan.septicTank")}</MenuItem>
              <MenuItem value="Individual Treatment">
                {t("forms.buildingPermission.constructionPlan.individualTreatment")}
              </MenuItem>
              <MenuItem value="Other">{t("forms.common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t("forms.buildingPermission.constructionPlan.waterSupplySource")}</InputLabel>
            <Select
              value={formData.waterSupplySource || ""}
              onChange={(e) =>
                handleChange("waterSupplySource", e.target.value)
              }
              label={t("forms.buildingPermission.constructionPlan.waterSupplySource")}
            >
              <MenuItem value="Municipal Supply">{t("forms.buildingPermission.constructionPlan.municipalSupply")}</MenuItem>
              <MenuItem value="Borewell">{t("forms.buildingPermission.constructionPlan.borewell")}</MenuItem>
              <MenuItem value="Well">{t("forms.buildingPermission.constructionPlan.well")}</MenuItem>
              <MenuItem value="Other">{t("forms.common.other")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.buildingPermission.constructionPlan.specialFeatures")}
            value={formData.specialFeatures || ""}
            onChange={(e) => handleChange("specialFeatures", e.target.value)}
            helperText={t("forms.buildingPermission.constructionPlan.specialFeaturesHelper")}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const TechnicalDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();
  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.buildingPermission.technicalDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.buildingPermission.technicalDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.buildingPermission.technicalDetails.structuralStability")}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.technicalDetails.structuralEngineerName")}
            value={formData.structuralEngineerName || ""}
            onChange={(e) =>
              handleChange("structuralEngineerName", e.target.value)
            }
            helperText={t("forms.buildingPermission.technicalDetails.structuralEngineerHelper")}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.buildingPermission.technicalDetails.engineerLicenseNumber")}
            value={formData.engineerLicenseNumber || ""}
            onChange={(e) =>
              handleChange("engineerLicenseNumber", e.target.value)
            }
            helperText={t("forms.buildingPermission.technicalDetails.engineerLicenseHelper")}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.buildingPermission.technicalDetails.fireSafetyMeasures")}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.fireExitProvided || false}
                onChange={(e) =>
                  handleChange("fireExitProvided", e.target.checked)
                }
              />
            }
            label={t("forms.buildingPermission.technicalDetails.fireExitProvided")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.fireExtinguisherProvided || false}
                onChange={(e) =>
                  handleChange("fireExtinguisherProvided", e.target.checked)
                }
              />
            }
            label={t("forms.buildingPermission.technicalDetails.fireExtinguisherProvided")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.smokeDetectorProvided || false}
                onChange={(e) =>
                  handleChange("smokeDetectorProvided", e.target.checked)
                }
              />
            }
            label={t("forms.buildingPermission.technicalDetails.smokeDetectorProvided")}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.buildingPermission.technicalDetails.environmentalClearance")}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            {t("forms.buildingPermission.technicalDetails.environmentalClearanceRequired")}
          </Typography>
          <RadioGroup
            value={formData.environmentalClearanceRequired || ""}
            onChange={(e) =>
              handleChange("environmentalClearanceRequired", e.target.value)
            }
            row
          >
            <FormControlLabel value="yes" control={<Radio />} label={t("forms.buildingPermission.technicalDetails.yes")} />
            <FormControlLabel value="no" control={<Radio />} label={t("forms.buildingPermission.technicalDetails.no")} />
          </RadioGroup>
        </Grid>

        {formData.environmentalClearanceRequired === "yes" && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("forms.buildingPermission.technicalDetails.environmentalClearanceDetails")}
              multiline
              rows={2}
              value={formData.environmentalClearanceDetails || ""}
              onChange={(e) =>
                handleChange("environmentalClearanceDetails", e.target.value)
              }
              helperText={t("forms.buildingPermission.technicalDetails.environmentalClearanceDetailsHelper")}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.buildingPermission.technicalDetails.additionalTechnicalDetails")}
            value={formData.additionalTechnicalDetails || ""}
            onChange={(e) =>
              handleChange("additionalTechnicalDetails", e.target.value)
            }
            helperText={t("forms.buildingPermission.technicalDetails.additionalTechnicalDetailsHelper")}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
  const { t } = useLanguage();
  
  const requiredDocuments = [
    t("forms.buildingPermission.documents.ownershipProof"),
    t("forms.buildingPermission.documents.surveyRecord"),
    t("forms.buildingPermission.documents.sitePlan"),
    t("forms.buildingPermission.documents.structuralStability"),
    t("forms.buildingPermission.documents.environmentalClearance"),
    t("forms.buildingPermission.documents.fireClearance"),
    t("forms.buildingPermission.documents.drainagePlan"),
    t("forms.buildingPermission.documents.identityProof"),
    t("forms.buildingPermission.documents.addressProof"),
    t("forms.buildingPermission.documents.propertyTaxReceipts"),
    t("forms.buildingPermission.documents.architectLicense"),
    t("forms.buildingPermission.documents.engineerCertificate"),
  ];

  const handleDocumentsChange = (documents) => {
    updateFormData({ documents });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.buildingPermission.documents.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.buildingPermission.documents.uploadInfo")}
      </Typography>

      <DocumentUpload
        requiredDocuments={requiredDocuments}
        uploadedDocuments={formData.documents || []}
        onDocumentsChange={handleDocumentsChange}
        maxFiles={20}
        serviceType="building_permission"
      />
    </Box>
  );
};

// Main Form Component
const BuildingPermissionForm = () => {
  const { t } = useLanguage();
  
  const steps = [
    { id: "applicant", title: t("forms.buildingPermission.step1"), icon: "Person" },
    { id: "construction", title: t("forms.buildingPermission.step2"), icon: "Construction" },
    { id: "technical", title: t("forms.buildingPermission.step3"), icon: "Engineering" },
    { id: "documents", title: t("forms.buildingPermission.step4"), icon: "Description" },
  ];

  const validationRules = {
    // Applicant Information
    ownerName: { type: "text", required: true },
    fatherName: { type: "text", required: true },
    mobile: { type: "mobile", required: true },
    email: { type: "email", required: false },
    correspondenceAddress: { type: "text", required: true },
    aadhaar: { type: "aadhaar", required: true },

    // Property Details
    plotNumber: { type: "text", required: true },
    plotArea: { type: "amount", required: true },
    constructionSiteAddress: { type: "text", required: true },
    constructionType: { type: "text", required: true },
    proposedBuildingArea: { type: "amount", required: true },
    numberOfFloors: { type: "amount", required: true },
    buildingHeight: { type: "amount", required: true },

    // Construction Details
    structureType: { type: "text", required: true },
    totalBuiltupArea: { type: "amount", required: true },

    // Technical Details
    environmentalClearanceRequired: { type: "text", required: true },
  };

  return (
    <MultiStepForm
      serviceName={t("forms.buildingPermission.title")}
      serviceType="building_permission"
      steps={steps}
      validationRules={validationRules}
    >
      <ApplicantInformationStep />
      <PropertyDetailsStep />
      <ConstructionPlanStep />
      <TechnicalDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default BuildingPermissionForm;
