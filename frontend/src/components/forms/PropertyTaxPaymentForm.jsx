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
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MultiStepForm from "./MultiStepForm";
import DocumentUpload from "../common/DocumentUpload";
import { validateField, autoCorrect } from "../../utils/formValidation";
import { getStates, getDistrictsByState } from "../../data/stateDistrictData";
import { useLanguage } from "../../i18n/LanguageProvider";

// Property Details Step
const PropertyDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    let correctedValue = value;

    if (field === "propertyId") {
      correctedValue = value.toUpperCase();
    } else if (field === "ownerName") {
      correctedValue = autoCorrect.name(value);
    }

    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.propertyTaxPayment.propertyInfo.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.propertyTaxPayment.propertyInfo.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.propertyTaxPayment.propertyInfo.propertyNumber")}
            value={formData.propertyId || ""}
            onChange={(e) => handleChange("propertyId", e.target.value)}
            error={!!errors.propertyId}
            helperText={
              errors.propertyId ||
              t("forms.propertyTaxPayment.propertyInfo.propertyNumberHelper")
            }
            inputProps={{ maxLength: 20, pattern: "[A-Za-z0-9\\-]{5,20}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.propertyTaxPayment.propertyInfo.ownerName")}
            value={formData.ownerName || ""}
            onChange={(e) => handleChange("ownerName", e.target.value)}
            error={!!errors.ownerName}
            helperText={errors.ownerName}
            inputProps={{ maxLength: 50, pattern: "[A-Za-z\\s']{2,50}" }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t("forms.propertyTaxPayment.propertyInfo.propertyAddress")}
            value={formData.propertyAddress || ""}
            onChange={(e) => handleChange("propertyAddress", e.target.value)}
            error={!!errors.propertyAddress}
            helperText={errors.propertyAddress}
            inputProps={{ minLength: 10, maxLength: 200 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.propertyType}>
            <InputLabel>{t("forms.waterConnection.propertyType")}</InputLabel>
            <Select
              value={formData.propertyType || ""}
              onChange={(e) => handleChange("propertyType", e.target.value)}
              label={t("forms.waterConnection.propertyType")}
            >
              <MenuItem value="Residential">
                {t("forms.waterConnection.residential")}
              </MenuItem>
              <MenuItem value="Commercial">
                {t("forms.waterConnection.commercial")}
              </MenuItem>
              <MenuItem value="Industrial">
                {t("forms.waterConnection.industrial")}
              </MenuItem>
              <MenuItem value="Agricultural">
                {t("forms.waterConnection.agricultural")}
              </MenuItem>
              <MenuItem value="Vacant Land">
                {t("forms.waterConnection.vacantLand")}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.propertyTaxPayment.propertyInfo.builtUpArea")}
            type="number"
            value={formData.builtUpArea || ""}
            onChange={(e) => handleChange("builtUpArea", e.target.value)}
            error={!!errors.builtUpArea}
            helperText={
              errors.builtUpArea || t("forms.propertyTaxPayment.propertyInfo.builtUpAreaHelper")
            }
            inputProps={{
              min: 1,
              max: 999999,
              pattern: "^\\d{1,6}(\\.\\d{1,2})?$",
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.propertyTaxPayment.propertyInfo.plotArea")}
            type="number"
            value={formData.plotArea || ""}
            onChange={(e) => handleChange("plotArea", e.target.value)}
            helperText={t("forms.propertyTaxPayment.propertyInfo.plotAreaHelper")}
            inputProps={{ min: 1, max: 999999 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.propertyTaxPayment.propertyInfo.numberOfFloors")}
            type="number"
            value={formData.numberOfFloors || ""}
            onChange={(e) => handleChange("numberOfFloors", e.target.value)}
            helperText={t("forms.propertyTaxPayment.propertyInfo.numberOfFloorsHelper")}
            inputProps={{ min: 1, max: 50 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Tax Calculation Step
const TaxCalculationStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const [taxDetails, setTaxDetails] = React.useState({
    basicTax: 0,
    waterTax: 0,
    sewerageTax: 0,
    lightingTax: 0,
    educationCess: 0,
    penalty: 0,
    total: 0,
  });

  React.useEffect(() => {
    // Calculate tax based on property details
    if (formData.builtUpArea && formData.propertyType) {
      const area = parseFloat(formData.builtUpArea) || 0;
      let ratePerSqFt = 0;

      switch (formData.propertyType) {
        case "Residential":
          ratePerSqFt = 2;
          break;
        case "Commercial":
          ratePerSqFt = 5;
          break;
        case "Industrial":
          ratePerSqFt = 8;
          break;
        case "Agricultural":
          ratePerSqFt = 1;
          break;
        default:
          ratePerSqFt = 2;
      }

      const basicTax = area * ratePerSqFt;
      const waterTax = basicTax * 0.1;
      const sewerageTax = basicTax * 0.05;
      const lightingTax = basicTax * 0.03;
      const educationCess = basicTax * 0.02;
      const penalty = formData.isDelayed ? basicTax * 0.1 : 0;
      const total =
        basicTax +
        waterTax +
        sewerageTax +
        lightingTax +
        educationCess +
        penalty;

      const calculated = {
        basicTax: Math.round(basicTax),
        waterTax: Math.round(waterTax),
        sewerageTax: Math.round(sewerageTax),
        lightingTax: Math.round(lightingTax),
        educationCess: Math.round(educationCess),
        penalty: Math.round(penalty),
        total: Math.round(total),
      };

      setTaxDetails(calculated);
      updateFormData({ taxDetails: calculated, totalAmount: calculated.total });
    }
  }, [formData.builtUpArea, formData.propertyType, formData.isDelayed]);

  const handleChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.propertyTaxPayment.taxDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.propertyTaxPayment.taxDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.financialYear}>
            <InputLabel>{t("forms.propertyTaxPayment.taxDetails.financialYear")}</InputLabel>
            <Select
              value={formData.financialYear || ""}
              onChange={(e) => handleChange("financialYear", e.target.value)}
              label={t("forms.propertyTaxPayment.taxDetails.financialYear")}
            >
              <MenuItem value="2023-24">2023-24</MenuItem>
              <MenuItem value="2024-25">2024-25</MenuItem>
              <MenuItem value="2025-26">2025-26</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            {t("forms.propertyTaxPayment.taxDetails.isDelayedPayment")}
          </Typography>
          <RadioGroup
            value={formData.isDelayed || "no"}
            onChange={(e) =>
              handleChange("isDelayed", e.target.value === "yes")
            }
            row
          >
            <FormControlLabel value="no" control={<Radio />} label={t("common.no")} />
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label={t("forms.propertyTaxPayment.taxDetails.yesWithPenalty")}
            />
          </RadioGroup>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("forms.propertyTaxPayment.taxDetails.taxBreakdown")}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>{t("forms.propertyTaxPayment.taxDetails.basicPropertyTax")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  ₹{taxDetails.basicTax.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.propertyTaxPayment.taxDetails.waterTax")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  ₹{taxDetails.waterTax.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.propertyTaxPayment.taxDetails.sewerageTax")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  ₹{taxDetails.sewerageTax.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.propertyTaxPayment.taxDetails.lightingTax")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  ₹{taxDetails.lightingTax.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography>{t("forms.propertyTaxPayment.taxDetails.educationCess")}:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  ₹{taxDetails.educationCess.toLocaleString()}
                </Typography>
              </Grid>

              {formData.isDelayed && (
                <>
                  <Grid item xs={6}>
                    <Typography color="error">{t("forms.propertyTaxPayment.taxDetails.penalty")}:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right" color="error">
                      ₹{taxDetails.penalty.toLocaleString()}
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h6" color="primary">
                  {t("forms.propertyTaxPayment.taxDetails.totalAmount")}:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" color="primary" align="right">
                  ₹{taxDetails.total.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {formData.isDelayed && (
          <Grid item xs={12}>
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>{t("forms.propertyTaxPayment.taxDetails.delayedPaymentPenalty")}:</strong> {t("forms.propertyTaxPayment.taxDetails.penaltyMessage")}
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

// Payment Details Step
const PaymentDetailsStep = ({ formData, updateFormData, errors }) => {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    let correctedValue = value;

    if (field === "payerName") {
      correctedValue = autoCorrect.name(value);
    } else if (field === "mobile") {
      correctedValue = autoCorrect.mobile(value);
    }

    updateFormData({ [field]: correctedValue });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.propertyTaxPayment.paymentDetails.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.propertyTaxPayment.paymentDetails.subtitle")}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("forms.propertyTaxPayment.paymentDetails.payerName")}
            value={formData.payerName || ""}
            onChange={(e) => handleChange("payerName", e.target.value)}
            error={!!errors.payerName}
            helperText={errors.payerName || t("forms.propertyTaxPayment.paymentDetails.payerNameHelper")}
            inputProps={{ maxLength: 50, pattern: "[A-Za-z\\s']{2,50}" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={t("common.mobile")}
            value={formData.mobile || ""}
            onChange={(e) => handleChange("mobile", e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile || t("common.mobileHelper")}
            inputProps={{ maxLength: 10, pattern: "[6-9][0-9]{9}" }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.paymentMethod}>
            <InputLabel>{t("forms.propertyTaxPayment.paymentDetails.paymentMethod")}</InputLabel>
            <Select
              value={formData.paymentMethod || ""}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              label={t("forms.propertyTaxPayment.paymentDetails.paymentMethod")}
            >
              <MenuItem value="Online">{t("forms.propertyTaxPayment.paymentDetails.onlinePayment")}</MenuItem>
              <MenuItem value="Cash">{t("forms.propertyTaxPayment.paymentDetails.cashPayment")}</MenuItem>
              <MenuItem value="Cheque">{t("forms.propertyTaxPayment.paymentDetails.chequePayment")}</MenuItem>
              <MenuItem value="DD">{t("forms.propertyTaxPayment.paymentDetails.demandDraft")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: "primary.50" }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {t("forms.propertyTaxPayment.paymentDetails.paymentSummary")}
            </Typography>
            <Typography variant="body1">
              {t("forms.propertyTaxPayment.paymentDetails.propertyId")}: <strong>{formData.propertyId}</strong>
            </Typography>
            <Typography variant="body1">
              {t("forms.propertyTaxPayment.taxDetails.financialYear")}: <strong>{formData.financialYear}</strong>
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
              {t("forms.propertyTaxPayment.taxDetails.totalAmount")}: ₹{(formData.totalAmount || 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>{t("forms.propertyTaxPayment.paymentDetails.note")}:</strong> {t("forms.propertyTaxPayment.paymentDetails.receiptMessage")}
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
    t("forms.propertyTaxPayment.documents.propertyOwnershipDocs"),
    t("forms.propertyTaxPayment.documents.previousYearReceipt"),
    t("forms.propertyTaxPayment.documents.propertyAssessmentCert"),
    t("forms.propertyTaxPayment.documents.payerIdProof"),
    t("forms.propertyTaxPayment.documents.addressProof"),
    t("forms.propertyTaxPayment.documents.powerOfAttorney"),
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom color="primary">
        {t("forms.propertyTaxPayment.documents.title")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t("forms.propertyTaxPayment.documents.subtitle")}
      </Typography>

      <DocumentUpload
        documents={formData.documents || []}
        onDocumentsChange={(docs) => updateFormData({ documents: docs })}
        maxFiles={10}
        acceptedTypes={["application/pdf", "image/jpeg", "image/png"]}
        maxSize={5 * 1024 * 1024} // 5MB
        applicationId={tempApplicationId}
      />

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          {t("common.requiredDocuments")}:
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
const PropertyTaxPaymentForm = () => {
  const { t } = useLanguage();

  const steps = [
    {
      id: "property",
      title: t("forms.propertyTaxPayment.step1"),
      icon: "Home",
    },
    {
      id: "calculation",
      title: t("forms.propertyTaxPayment.step2"),
      icon: "Calculate",
    },
    {
      id: "payment",
      title: t("forms.propertyTaxPayment.step3"),
      icon: "Payment",
    },
    {
      id: "documents",
      title: t("forms.propertyTaxPayment.step4"),
      icon: "Description",
    },
  ];

  const validationRules = {
    // Property Details
    propertyId: { type: "propertyId", required: true },
    ownerName: { type: "name", required: true },
    propertyAddress: { type: "address", required: true },
    propertyType: { type: "text", required: true },
    builtUpArea: { type: "builtUpArea", required: true },

    // Tax Calculation
    financialYear: { type: "text", required: true },

    // Payment Details
    payerName: { type: "name", required: true },
    mobile: { type: "mobile", required: true },
    paymentMethod: { type: "text", required: true },
  };

  return (
    <MultiStepForm
      serviceName={t("forms.propertyTaxPayment.title")}
      serviceType="property_tax_payment"
      steps={steps}
      validationRules={validationRules}
    >
      <PropertyDetailsStep />
      <TaxCalculationStep />
      <PaymentDetailsStep />
      <DocumentsStep />
    </MultiStepForm>
  );
};

export default PropertyTaxPaymentForm;
