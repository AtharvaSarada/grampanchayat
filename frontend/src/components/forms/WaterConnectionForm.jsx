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
  Divider,
  FormHelperText,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import MultiStepForm from "./MultiStepForm";
import DocumentUpload from "../common/DocumentUpload";
import { useLanguage } from "../../i18n/LanguageProvider";

const WaterConnectionForm = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    // Applicant Information
    applicantName: "",
    fatherName: "",
    mobile: "",
    email: "",
    aadhaar: "",

    // Property Information
    propertyType: "",
    propertyAddress: "",
    village: "",
    district: "",
    state: "Your State",
    pincode: "",
    plotNumber: "",
    plotArea: "",

    // Connection Details
    connectionType: "",
    connectionPurpose: "",
    estimatedUsage: "",
    numberOfMembers: "",
    existingConnection: false,
    existingConnectionNumber: "",

    // Technical Details
    pipeSize: "",
    meterType: "",
    connectionLocation: "",
    roadType: "",
    distanceFromMainLine: "",

    // Financial Information
    securityDeposit: "",
    connectionFee: "",

    // Documents
    documents: [],
  });

  const steps = [
    { id: "applicant", title: t("forms.waterConnection.step1") },
    { id: "property", title: t("forms.waterConnection.step2") },
    { id: "connection", title: t("forms.waterConnection.step3") },
    { id: "documents", title: t("forms.waterConnection.step4") },
  ];

  const validationRules = {
    applicantName: {
      required: true,
      pattern: /^[A-Za-z\s']{2,50}$/,
      message: "Enter valid applicant name",
    },
    fatherName: {
      required: true,
      pattern: /^[A-Za-z\s']{2,50}$/,
      message: "Enter valid father name",
    },
    mobile: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: "Enter valid 10-digit mobile number",
    },
    aadhaar: {
      required: true,
      pattern: /^\d{12}$/,
      message: "Enter valid 12-digit Aadhaar number",
    },
    propertyType: { required: true, message: "Property type is required" },
    propertyAddress: {
      required: true,
      message: "Property address is required",
    },
    village: { required: true, message: "Village is required" },
    district: { required: true, message: "District is required" },
    pincode: {
      required: true,
      pattern: /^\d{6}$/,
      message: "Enter valid 6-digit PIN code",
    },
    plotNumber: { required: true, message: "Plot number is required" },
    connectionType: { required: true, message: "Connection type is required" },
    connectionPurpose: {
      required: true,
      message: "Connection purpose is required",
    },
    numberOfMembers: {
      required: true,
      message: "Number of members is required",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter valid email address",
    },
  };

  const propertyTypes = [
    { value: "Residential", label: t("forms.waterConnection.residential") },
    { value: "Commercial", label: t("forms.waterConnection.commercial") },
    { value: "Industrial", label: t("forms.waterConnection.industrial") },
    { value: "Institutional", label: t("forms.waterConnection.institutional") },
    { value: "Agricultural", label: t("forms.waterConnection.agricultural") },
  ];

  const connectionTypes = [
    {
      value: "New Connection",
      label: t("forms.waterConnection.newConnection"),
    },
    {
      value: "Additional Connection",
      label: t("forms.waterConnection.additionalConnection"),
    },
    {
      value: "Temporary Connection",
      label: t("forms.waterConnection.temporaryConnection"),
    },
    {
      value: "Bulk Connection",
      label: t("forms.waterConnection.bulkConnection"),
    },
  ];

  const connectionPurposes = [
    { value: "Domestic Use", label: t("forms.waterConnection.domesticUse") },
    {
      value: "Commercial Use",
      label: t("forms.waterConnection.commercialUse"),
    },
    {
      value: "Industrial Use",
      label: t("forms.waterConnection.industrialUse"),
    },
    {
      value: "Institutional Use",
      label: t("forms.waterConnection.institutionalUse"),
    },
    {
      value: "Agricultural Use",
      label: t("forms.waterConnection.agriculturalUse"),
    },
    {
      value: "Construction Use",
      label: t("forms.waterConnection.constructionUse"),
    },
  ];

  const pipeSizes = [
    "15mm (1/2 inch)",
    "20mm (3/4 inch)",
    "25mm (1 inch)",
    "32mm (1.25 inch)",
    "40mm (1.5 inch)",
    "50mm (2 inch)",
  ];

  const meterTypes = [
    {
      value: "Mechanical Meter",
      label: t("forms.waterConnection.mechanicalMeter"),
    },
    { value: "Digital Meter", label: t("forms.waterConnection.digitalMeter") },
    { value: "Smart Meter", label: t("forms.waterConnection.smartMeter") },
  ];

  const roadTypes = [
    { value: "Paved Road", label: t("forms.waterConnection.pavedRoad") },
    { value: "Unpaved Road", label: t("forms.waterConnection.unpavedRoad") },
    { value: "Concrete Road", label: t("forms.waterConnection.concreteRoad") },
    { value: "Gravel Road", label: t("forms.waterConnection.gravelRoad") },
  ];

  // Calculate estimated fees based on connection type and usage
  const calculateFees = (connectionType, usage, members) => {
    let baseFee = 0;
    let securityDeposit = 0;

    switch (connectionType) {
      case "New Connection":
        baseFee = 2000;
        securityDeposit = 1500;
        break;
      case "Additional Connection":
        baseFee = 1500;
        securityDeposit = 1000;
        break;
      case "Temporary Connection":
        baseFee = 1000;
        securityDeposit = 500;
        break;
      case "Bulk Connection":
        baseFee = 5000;
        securityDeposit = 3000;
        break;
      default:
        baseFee = 2000;
        securityDeposit = 1500;
    }

    // Adjust based on number of members
    if (members > 5) {
      baseFee += 500;
      securityDeposit += 300;
    }

    return { connectionFee: baseFee, securityDeposit };
  };

  const ApplicantDetailsStep = ({ formData, updateFormData, errors }) => {
    const { t } = useLanguage();
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          {t("forms.waterConnection.applicantInfo")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.applicantFullName")}
              value={formData.applicantName || ""}
              onChange={(e) =>
                updateFormData({ applicantName: e.target.value })
              }
              error={!!errors.applicantName}
              helperText={errors.applicantName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.fatherName")}
              value={formData.fatherName || ""}
              onChange={(e) => updateFormData({ fatherName: e.target.value })}
              error={!!errors.fatherName}
              helperText={errors.fatherName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.common.mobile")}
              value={formData.mobile || ""}
              onChange={(e) => updateFormData({ mobile: e.target.value })}
              error={!!errors.mobile}
              helperText={errors.mobile}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.common.email")}
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                updateFormData({ email: e.target.value.toLowerCase() })
              }
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.common.aadhaar")}
              value={formData.aadhaar || ""}
              onChange={(e) => updateFormData({ aadhaar: e.target.value })}
              error={!!errors.aadhaar}
              helperText={errors.aadhaar}
              inputProps={{ maxLength: 12 }}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const PropertyInformationStep = ({ formData, updateFormData, errors }) => {
    const { t } = useLanguage();
    const propertyTypes = [
      { value: "Residential", label: t("forms.waterConnection.residential") },
      { value: "Commercial", label: t("forms.waterConnection.commercial") },
      { value: "Industrial", label: t("forms.waterConnection.industrial") },
      {
        value: "Institutional",
        label: t("forms.waterConnection.institutional"),
      },
      { value: "Agricultural", label: t("forms.waterConnection.agricultural") },
    ];
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          {t("forms.waterConnection.propertyInfo")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.propertyType}>
              <InputLabel>{t("forms.waterConnection.propertyType")}</InputLabel>
              <Select
                value={formData.propertyType || ""}
                onChange={(e) =>
                  updateFormData({ propertyType: e.target.value })
                }
                label={t("forms.waterConnection.propertyType")}
              >
                {propertyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.propertyType && (
                <FormHelperText>{errors.propertyType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.plotNumber")}
              value={formData.plotNumber || ""}
              onChange={(e) => updateFormData({ plotNumber: e.target.value })}
              error={!!errors.plotNumber}
              helperText={errors.plotNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.propertyAddress")}
              multiline
              rows={3}
              value={formData.propertyAddress || ""}
              onChange={(e) =>
                updateFormData({ propertyAddress: e.target.value })
              }
              error={!!errors.propertyAddress}
              helperText={errors.propertyAddress}
              placeholder={t(
                "forms.waterConnection.propertyAddressPlaceholder",
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.villageTown")}
              value={formData.village || ""}
              onChange={(e) => updateFormData({ village: e.target.value })}
              error={!!errors.village}
              helperText={errors.village}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("forms.common.district")}
              value={formData.district || ""}
              onChange={(e) => updateFormData({ district: e.target.value })}
              error={!!errors.district}
              helperText={errors.district}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={t("forms.common.pincode")}
              value={formData.pincode || ""}
              onChange={(e) => updateFormData({ pincode: e.target.value })}
              error={!!errors.pincode}
              helperText={errors.pincode}
              inputProps={{ maxLength: 6 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.plotArea")}
              type="number"
              value={formData.plotArea || ""}
              onChange={(e) => updateFormData({ plotArea: e.target.value })}
              inputProps={{ min: 0 }}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const ConnectionDetailsStep = ({ formData, updateFormData, errors }) => {
    const { t } = useLanguage();
    const connectionTypes = [
      {
        value: "New Connection",
        label: t("forms.waterConnection.newConnection"),
      },
      {
        value: "Additional Connection",
        label: t("forms.waterConnection.additionalConnection"),
      },
      {
        value: "Temporary Connection",
        label: t("forms.waterConnection.temporaryConnection"),
      },
      {
        value: "Bulk Connection",
        label: t("forms.waterConnection.bulkConnection"),
      },
    ];
    const connectionPurposes = [
      { value: "Domestic Use", label: t("forms.waterConnection.domesticUse") },
      {
        value: "Commercial Use",
        label: t("forms.waterConnection.commercialUse"),
      },
      {
        value: "Industrial Use",
        label: t("forms.waterConnection.industrialUse"),
      },
      {
        value: "Institutional Use",
        label: t("forms.waterConnection.institutionalUse"),
      },
      {
        value: "Agricultural Use",
        label: t("forms.waterConnection.agriculturalUse"),
      },
      {
        value: "Construction Use",
        label: t("forms.waterConnection.constructionUse"),
      },
    ];
    const meterTypes = [
      {
        value: "Mechanical Meter",
        label: t("forms.waterConnection.mechanicalMeter"),
      },
      {
        value: "Digital Meter",
        label: t("forms.waterConnection.digitalMeter"),
      },
      { value: "Smart Meter", label: t("forms.waterConnection.smartMeter") },
    ];
    const roadTypes = [
      { value: "Paved Road", label: t("forms.waterConnection.pavedRoad") },
      { value: "Unpaved Road", label: t("forms.waterConnection.unpavedRoad") },
      {
        value: "Concrete Road",
        label: t("forms.waterConnection.concreteRoad"),
      },
      { value: "Gravel Road", label: t("forms.waterConnection.gravelRoad") },
    ];
    // Auto-calculate fees when connection details change
    React.useEffect(() => {
      if (formData.connectionType && formData.numberOfMembers) {
        const fees = calculateFees(
          formData.connectionType,
          formData.estimatedUsage,
          parseInt(formData.numberOfMembers),
        );
        updateFormData(fees);
      }
    }, [
      formData.connectionType,
      formData.numberOfMembers,
      formData.estimatedUsage,
    ]);

    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          {t("forms.waterConnection.connectionDetails")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.connectionType}>
              <InputLabel>
                {t("forms.waterConnection.connectionType")}
              </InputLabel>
              <Select
                value={formData.connectionType || ""}
                onChange={(e) =>
                  updateFormData({ connectionType: e.target.value })
                }
                label={t("forms.waterConnection.connectionType")}
              >
                {connectionTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.connectionType && (
                <FormHelperText>{errors.connectionType}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.connectionPurpose}>
              <InputLabel>
                {t("forms.waterConnection.connectionPurpose")}
              </InputLabel>
              <Select
                value={formData.connectionPurpose || ""}
                onChange={(e) =>
                  updateFormData({ connectionPurpose: e.target.value })
                }
                label={t("forms.waterConnection.connectionPurpose")}
              >
                {connectionPurposes.map((purpose) => (
                  <MenuItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.connectionPurpose && (
                <FormHelperText>{errors.connectionPurpose}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.numberOfMembers")}
              type="number"
              value={formData.numberOfMembers || ""}
              onChange={(e) =>
                updateFormData({ numberOfMembers: e.target.value })
              }
              error={!!errors.numberOfMembers}
              helperText={errors.numberOfMembers}
              inputProps={{ min: 1, max: 20 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.estimatedDailyUsage")}
              type="number"
              value={formData.estimatedUsage || ""}
              onChange={(e) =>
                updateFormData({ estimatedUsage: e.target.value })
              }
              inputProps={{ min: 0 }}
              placeholder={t("forms.waterConnection.usagePlaceholder")}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.existingConnection || false}
                  onChange={(e) =>
                    updateFormData({ existingConnection: e.target.checked })
                  }
                />
              }
              label={t("forms.waterConnection.existingConnectionQuestion")}
            />
          </Grid>

          {formData.existingConnection && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("forms.waterConnection.existingConnectionNumber")}
                value={formData.existingConnectionNumber || ""}
                onChange={(e) =>
                  updateFormData({ existingConnectionNumber: e.target.value })
                }
              />
            </Grid>
          )}

          <Divider sx={{ width: "100%", my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              {t("forms.waterConnection.technicalSpecifications")}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t("forms.waterConnection.pipeSize")}</InputLabel>
              <Select
                value={formData.pipeSize || ""}
                onChange={(e) => updateFormData({ pipeSize: e.target.value })}
                label={t("forms.waterConnection.pipeSize")}
              >
                {pipeSizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t("forms.waterConnection.meterType")}</InputLabel>
              <Select
                value={formData.meterType || ""}
                onChange={(e) => updateFormData({ meterType: e.target.value })}
                label={t("forms.waterConnection.meterType")}
              >
                {meterTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.connectionLocation")}
              value={formData.connectionLocation || ""}
              onChange={(e) =>
                updateFormData({ connectionLocation: e.target.value })
              }
              placeholder={t(
                "forms.waterConnection.connectionLocationPlaceholder",
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t("forms.waterConnection.roadType")}</InputLabel>
              <Select
                value={formData.roadType || ""}
                onChange={(e) => updateFormData({ roadType: e.target.value })}
                label={t("forms.waterConnection.roadType")}
              >
                {roadTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.distanceFromMainLine")}
              type="number"
              value={formData.distanceFromMainLine || ""}
              onChange={(e) =>
                updateFormData({ distanceFromMainLine: e.target.value })
              }
              inputProps={{ min: 0 }}
            />
          </Grid>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              {t("forms.waterConnection.feeCalculation")}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.connectionFee")}
              type="number"
              value={formData.connectionFee || ""}
              InputProps={{ readOnly: true }}
              helperText={t("forms.waterConnection.connectionFeeHelper")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("forms.waterConnection.securityDeposit")}
              type="number"
              value={formData.securityDeposit || ""}
              InputProps={{ readOnly: true }}
              helperText={t("forms.waterConnection.securityDepositHelper")}
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const DocumentsStep = ({ formData, updateFormData, tempApplicationId }) => {
    const { t } = useLanguage();
    return (
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          {t("forms.waterConnection.requiredDocuments")}
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          {t("forms.waterConnection.uploadInfo")}
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t("forms.waterConnection.requiredDocsList")}
          </Typography>
          <ul>
            <li>{t("forms.waterConnection.aadhaarCard")}</li>
            <li>{t("forms.waterConnection.propertyOwnershipDocs")}</li>
            <li>{t("forms.waterConnection.propertyTaxReceipt")}</li>
            <li>{t("forms.waterConnection.sitePlan")}</li>
            <li>{t("forms.waterConnection.nocFromSociety")}</li>
            <li>{t("forms.waterConnection.existingConnectionBill")}</li>
            <li>{t("forms.waterConnection.passportPhoto")}</li>
          </ul>
        </Box>

        <DocumentUpload
          documents={formData.documents || []}
          onDocumentsChange={(docs) => updateFormData({ documents: docs })}
          maxFiles={8}
          acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
          maxSize={5 * 1024 * 1024} // 5MB
          applicationId={tempApplicationId}
        />
      </Paper>
    );
  };

  return (
    <MultiStepForm
      serviceName={t("forms.waterConnection.title")}
      serviceType="water-connection"
      steps={steps}
      validationRules={validationRules}
      initialData={formData}
    >
      <ApplicantDetailsStep />
      <PropertyInformationStep />
      <ConnectionDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default WaterConnectionForm;
