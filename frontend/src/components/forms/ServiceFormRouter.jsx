import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import ChakraSpinner from '../common/ChakraSpinner';
import { useAuth } from '../../context/AuthContext';

// Import all service forms
import AgriculturalSubsidyForm from './AgriculturalSubsidyForm';
import BPLCertificateForm from './BPLCertificateForm';
import BuildingPermissionForm from './BuildingPermissionForm';
import IncomeCertificateForm from './IncomeCertificateForm';
import CasteCertificateForm from './CasteCertificateForm';
import DeathCertificateForm from './DeathCertificateForm';
import MarriageCertificateForm from './MarriageCertificateForm';
import ScholarshipForm from './ScholarshipForm';
import PropertyTaxPaymentForm from './PropertyTaxPaymentForm';
import CropInsuranceForm from './CropInsuranceForm';
import DomicileCertificateForm from './DomicileCertificateForm';
import DrainageConnectionForm from './DrainageConnectionForm';
import PropertyTaxAssessmentForm from './PropertyTaxAssessmentForm';
import SchoolTransferCertificateForm from './SchoolTransferCertificateForm';
import StreetLightInstallationForm from './StreetLightInstallationForm';
import VaccinationCertificateForm from './VaccinationCertificateForm';
import WaterTaxPaymentForm from './WaterTaxPaymentForm';
import BirthCertificateForm from './BirthCertificateForm';
import TradeLicenseForm from './TradeLicenseForm';
import HealthCertificateForm from './HealthCertificateForm';
import WaterConnectionForm from './WaterConnectionForm';

// Mapping from numeric IDs to string keys
const ID_TO_KEY_MAPPING = {
  1: 'birth-certificate',
  2: 'death-certificate', 
  3: 'marriage-certificate',
  4: 'property-tax-payment',
  5: 'property-tax-assessment',
  6: 'water-tax-payment', 
  7: 'trade-license',
  8: 'building-permission',
  9: 'income-certificate',
  10: 'caste-certificate',
  11: 'domicile-certificate',
  12: 'bpl-certificate',
  13: 'health-certificate',
  14: 'vaccination-certificate',
  15: 'water-connection',
  16: 'drainage-connection',
  17: 'street-light-installation',
  18: 'agricultural-subsidy',
  19: 'crop-insurance',
  20: 'school-transfer-certificate',
  21: 'scholarship'
};

// COMPLETE Service form mapping - ALL 21 services
const SERVICE_FORMS = {
  // ID 1
  'birth-certificate': {
    component: BirthCertificateForm,
    title: 'Birth Certificate Application',
    description: 'Apply for official birth certificate'
  },
  // ID 2
  'death-certificate': {
    component: DeathCertificateForm,
    title: 'Death Certificate Application',
    description: 'Apply for official death certificate from government'
  },
  // ID 3
  'marriage-certificate': {
    component: MarriageCertificateForm,
    title: 'Marriage Certificate Application',
    description: 'Apply for official marriage certificate registration'
  },
  // ID 4
  'property-tax-payment': {
    component: PropertyTaxPaymentForm,
    title: 'Property Tax Payment',
    description: 'Pay property tax online with automatic calculation'
  },
  // ID 5
  'property-tax-assessment': {
    component: PropertyTaxAssessmentForm,
    title: 'Property Tax Assessment Application',
    description: 'Apply for property tax assessment with automatic valuation'
  },
  // ID 6
  'water-tax-payment': {
    component: WaterTaxPaymentForm,
    title: 'Water Tax Payment',
    description: 'Pay water tax online with usage calculation'
  },
  // ID 7
  'trade-license': {
    component: TradeLicenseForm,
    title: 'Trade License Application',
    description: 'Apply for business trade license'
  },
  // ID 8
  'building-permission': {
    component: BuildingPermissionForm,
    title: 'Building Permission (NOC) Application',
    description: 'Apply for building construction permission and NOC'
  },
  // ID 9
  'income-certificate': {
    component: IncomeCertificateForm,
    title: 'Income Certificate Application',
    description: 'Apply for official income certificate from government'
  },
  // ID 10
  'caste-certificate': {
    component: CasteCertificateForm,
    title: 'Caste Certificate Application',
    description: 'Apply for official caste certificate from government'
  },
  // ID 11
  'domicile-certificate': {
    component: DomicileCertificateForm,
    title: 'Domicile Certificate Application',
    description: 'Apply for domicile certificate with residence verification'
  },
  // ID 12
  'bpl-certificate': {
    component: BPLCertificateForm,
    title: 'BPL Certificate Application',
    description: 'Apply for Below Poverty Line certificate'
  },
  // ID 13
  'health-certificate': {
    component: HealthCertificateForm,
    title: 'Health Certificate Application',
    description: 'Medical fitness certificate for various purposes'
  },
  // ID 14
  'vaccination-certificate': {
    component: VaccinationCertificateForm,
    title: 'Vaccination Certificate Application',
    description: 'Apply for vaccination certificate with medical history'
  },
  // ID 15
  'water-connection': {
    component: WaterConnectionForm,
    title: 'Water Connection Application',
    description: 'Apply for new water connection'
  },
  // ID 16
  'drainage-connection': {
    component: DrainageConnectionForm,
    title: 'Drainage Connection Application',
    description: 'Apply for new drainage connection with fee calculation'
  },
  // ID 17
  'street-light-installation': {
    component: StreetLightInstallationForm,
    title: 'Street Light Installation Request',
    description: 'Request for street light installation with cost estimation'
  },
  // ID 18
  'agricultural-subsidy': {
    component: AgriculturalSubsidyForm,
    title: 'Agricultural Subsidy Application',
    description: 'Apply for government agricultural subsidies and support schemes'
  },
  // ID 19
  'crop-insurance': {
    component: CropInsuranceForm,
    title: 'Crop Insurance Application',
    description: 'Apply for crop insurance coverage with comprehensive protection'
  },
  // ID 20
  'school-transfer-certificate': {
    component: SchoolTransferCertificateForm,
    title: 'School Transfer Certificate Application',
    description: 'Apply for school transfer certificate with academic records'
  },
  // ID 21
  'scholarship': {
    component: ScholarshipForm,
    title: 'Scholarship Application',
    description: 'Apply for educational scholarships and financial aid'
  }
};

const ServiceFormRouter = () => {
  const { serviceId } = useParams();
  const { currentUser, loading } = useAuth();

  console.log('ServiceFormRouter - serviceId from URL:', serviceId);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <ChakraSpinner size="40px" />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Convert numeric ID to string key if needed
  const numericId = parseInt(serviceId);
  const serviceKey = ID_TO_KEY_MAPPING[numericId] || serviceId;
  
  console.log('ServiceFormRouter - numericId:', numericId);
  console.log('ServiceFormRouter - serviceKey:', serviceKey);
  console.log('ServiceFormRouter - available keys:', Object.keys(SERVICE_FORMS));
  
  // Check if service exists
  const serviceConfig = SERVICE_FORMS[serviceKey];
  console.log('ServiceFormRouter - serviceConfig found:', !!serviceConfig);
  
  if (!serviceConfig) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, textAlign: 'center' }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Service Not Found
          </Typography>
          <Typography variant="body1">
            The requested service "{serviceId}" (key: "{serviceKey}") was not found. Please check the URL or go back to services page.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Available services: {Object.keys(SERVICE_FORMS).join(', ')}
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Render the appropriate form component
  const FormComponent = serviceConfig.component;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <FormComponent />
    </Box>
  );
};

export default ServiceFormRouter;
