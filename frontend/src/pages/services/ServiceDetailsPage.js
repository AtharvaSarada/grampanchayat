import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CurrencyRupee,
  Description,
  CheckCircle,
  Login
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useLanguage } from '../../i18n/LanguageProvider';

// Import shared services data
import { getServiceById } from '../../data/servicesData';


const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { t, isMarathi } = useLanguage();
  const [tabValue, setTabValue] = useState(0);
  
  const rawService = getServiceById(parseInt(serviceId));
  
  // Translate service data if Marathi is selected
  const translateServiceData = (service) => {
    if (!service || !isMarathi) return service;
    
    // Service title translations
    const titleTranslations = {
      'Crop Insurance': 'पीक विमा',
      'Water Tax Payment': 'पाणी कर भरणा',
      'Birth Certificate': 'जन्म दाखला',
      'Death Certificate': 'मृत्यू प्रमाणपत्र',
      'Marriage Certificate': 'विवाह नोंदणी प्रमाणपत्र',
      'Water Connection': 'पाणी कनेक्शन',
      'Trade License': 'व्यापार परवाना',
      'Building Permission': 'बांधकाम परवानगी',
      'Income Certificate': 'उत्पन्न प्रमाणपत्र',
      'Caste Certificate': 'जात प्रमाणपत्र',
      'Domicile Certificate': 'अधिवास प्रमाणपत्र',
      'BPL Certificate': 'दारिद्र्यरेषेखालील प्रमाणपत्र',
      'Agricultural Subsidy': 'कृषी अनुदान',
      'School Transfer Certificate': 'शाळा हस्तांतरण प्रमाणपत्र',
      'Scholarship Application': 'शिष्यवृत्ती अर्ज',
      'Health Certificate': 'आरोग्य प्रमाणपत्र',
      'Vaccination Certificate': 'लसीकरण प्रमाणपत्र',
      'Property Tax Assessment': 'मालमत्ता कर मूल्यांकन',
      'Property Tax Payment': 'मालमत्ता कर भरणा',
      'Drainage Connection': 'सांडपाणी निचरा कनेक्शन',
      'Street Light Installation': 'रस्ता दिवा स्थापना'
    };
    
    // Service description translations
    const descTranslations = {
      'Registration for crop insurance schemes': 'पीक विमा योजनांसाठी नोंदणी',
      'Payment of water supply charges': 'पाणीपुरवठा शुल्काचे भुगतान',
      'Registration and issuance of birth certificate': 'जन्म प्रमाणपत्राची नोंदणी आणि जारी करणे',
      'Apply for a new household water connection': 'नवीन घरगुती पाणी कनेक्शनसाठी अर्ज करा',
      'Apply for trade license or renewal': 'व्यापार परवान्यासाठी किंवा नूतनीकरणासाठी अर्ज करा'
    };
    
    // Category translations
    const categoryTranslations = {
      'Civil Registration': 'नागरी नोंदणी',
      'Revenue Services': 'महसूल सेवा',
      'Business Services': 'व्यवसाय सेवा',
      'Social Welfare': 'सामाजिक कल्याण',
      'Health Services': 'आरोग्य सेवा',
      'Infrastructure': 'पायाभूत सुविधा',
      'Agriculture': 'शेती',
      'Education': 'शिक्षण',
      'Utility Services': 'उपयोगिता सेवा'
    };
    
    // Common document translations
    const docTranslations = {
      'Aadhaar Card': 'आधार कार्ड',
      'Aadhar Card': 'आधार कार्ड',
      'Address Proof': 'पत्त्याचा पुरावा',
      'Bank Account Information': 'बँक खाते माहिती',
      'Land Records and Crop Details': 'जमीन रेकॉर्ड आणि पीक तपशील',
      'Farmer ID': 'शेतकरी ओळखपत्र',
      'Sowing Certificate': 'पेरणी प्रमाणपत्र',
      'Previous Insurance Records': 'मागील विमा रेकॉर्ड',
      'Village Revenue Officer Certificate': 'गाव तहसीलदार प्रमाणपत्र',
      'Birth Certificate': 'जन्म प्रमाणपत्र',
      'Identity proof of parents': 'पालकांचा ओळखपत्र',
      'Marriage certificate of parents': 'पालकांचे विवाह प्रमाणपत्र',
      'Property Ownership Proof': 'मालमत्ता मालकीचा पुरावा',
      'Property Tax Receipt': 'मालमत्ता कर पावती',
      'Site Plan/Location Map': 'साइट योजना/स्थान नकाशा'
    };
    
    // Translate documents array
    const translateDocuments = (docs) => {
      if (!docs || !Array.isArray(docs)) return docs;
      return docs.map(doc => {
        // Try exact match first
        if (docTranslations[doc]) return docTranslations[doc];
        // Try partial matches
        for (const [eng, mar] of Object.entries(docTranslations)) {
          if (doc.includes(eng)) {
            return doc.replace(eng, mar);
          }
        }
        return doc;
      });
    };
    
    return {
      ...service,
      title: titleTranslations[service.title] || service.title,
      description: descTranslations[service.description] || service.description,
      category: categoryTranslations[service.category] || service.category,
      documentsRequired: translateDocuments(service.documentsRequired)
    };
  };
  
  const service = translateServiceData(rawService);
  
  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);
  
  if (!service) {
    return null;
  }
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleApplyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for services');
      navigate('/login');
      return;
    }
    
    // Always navigate to the dedicated application page
    navigate(`/apply/${serviceId}`);
  };
  
  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
    );
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Service Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box sx={{ fontSize: 64, color: 'primary.main' }}>
                {service.icon}
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" component="h1" gutterBottom color="primary">
                {service.title}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {service.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                <Chip label={service.category} color="primary" variant="outlined" />
                <Chip label={`${isMarathi ? 'शुल्क' : 'Fee'}: ${service.fee}`} color="secondary" />
                <Chip label={`${isMarathi ? 'प्रक्रिया' : 'Processing'}: ${service.processingTime}`} color="info" />
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleApplyNow}
                startIcon={isAuthenticated ? <Assignment /> : <Login />}
                sx={{ px: 4, py: 1.5 }}
              >
                {isAuthenticated ? (isMarathi ? 'आता अर्ज करा' : 'Apply Now') : (isMarathi ? 'अर्ज करण्यासाठी लॉगिन करा' : 'Login to Apply')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Service Details Tabs */}
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="service details tabs">
              <Tab label={isMarathi ? 'विहंगावलोकन' : 'Overview'} />
              <Tab label={isMarathi ? 'आवश्यक कागदपत्रे' : 'Required Documents'} />
              <Tab label={isMarathi ? 'अर्ज प्रक्रिया' : 'Application Process'} />
              <Tab label={isMarathi ? 'पात्रता' : 'Eligibility'} />
            </Tabs>
          </Box>
          
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {isMarathi ? 'प्रक्रिया वेळ' : 'Processing Time'}
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {service.processingTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {isMarathi ? 'अर्ज प्रक्रिया आणि प्रमाणपत्र जारी करण्यासाठी सरासरी वेळ' : 'Average time for application processing and certificate issuance'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <CurrencyRupee sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {isMarathi ? 'सेवा शुल्क' : 'Service Fee'}
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {service.fee}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {isMarathi ? 'सेवा प्रक्रियेसाठी सरकारी शुल्क' : 'Government fee for service processing'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {isMarathi ? 'सेवा वर्णन' : 'Service Description'}
                    </Typography>
                    <Typography variant="body1">
                      {service.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {isMarathi ? 'ही सेवा ग्रामपंचायतीद्वारे नागरिक सेवांचा भाग म्हणून प्रदान केली जाते. जलद प्रक्रियेसाठी ऑनलाइन अर्ज सुविधा उपलब्ध आहे.' : 'This service is provided by the Gram Panchayat as part of citizen services. Online application facility is available for faster processing.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Required Documents Tab */}
          <TabPanel value={tabValue} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {isMarathi ? 'आवश्यक कागदपत्रे' : 'Required Documents'}
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  {isMarathi ? 'कृपया सर्व कागदपत्रे स्पष्ट, सुवाच्य आणि स्वीकृत स्वरूपात (PDF, JPG, PNG) असल्याची खात्री करा. कमाल फाइल आकार: प्रति दस्तऐवज 5MB.' : 'Please ensure all documents are clear, legible, and in the accepted formats (PDF, JPG, PNG). Maximum file size: 5MB per document.'}
                </Alert>
                <List>
                  {service.documentsRequired.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={doc}
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </TabPanel>
          
          {/* Application Process Tab */}
          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {isMarathi ? 'चरण-दर-चरण अर्ज प्रक्रिया' : 'Step-by-step Application Process'}
                </Typography>
                <List>
                  {service.process.map((step, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Box
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 14,
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={step}
                        primaryTypographyProps={{ variant: 'body1' }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Alert severity="success" sx={{ mt: 3 }}>
                  <strong>{isMarathi ? 'तुमच्या अर्जाचा मागोवा घ्या:' : 'Track Your Application:'}</strong> {isMarathi ? 'सबमिशननंतर, तुम्ही SMS आणि ईमेलद्वारे प्रदान केलेल्या अर्ज आयडीचा वापर करून तुमच्या अर्जाच्या स्थितीचा मागोवा घेऊ शकता.' : 'After submission, you can track the status of your application using the application ID provided via SMS and email.'}
                </Alert>
              </CardContent>
            </Card>
          </TabPanel>
          
          {/* Eligibility Tab */}
          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  {isMarathi ? 'पात्रता निकष' : 'Eligibility Criteria'}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {service.eligibility}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom color="primary">
                  {isMarathi ? 'महत्त्वाच्या सूचना' : 'Important Notes'}
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary={isMarathi ? 'अर्ज पूर्णपणे आणि अचूकपणे भरणे आवश्यक आहे' : 'Application must be filled completely and accurately'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary={isMarathi ? 'सर्व कागदपत्रे वैध आणि चालू असणे आवश्यक आहे' : 'All documents must be valid and current'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary={isMarathi ? 'अर्ज शुल्क परत करण्यायोग्य नाही' : 'Application fee is non-refundable'} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary={isMarathi ? 'शिखर कालावधीत प्रक्रिया वेळ बदलू शकतो' : 'Processing time may vary during peak periods'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default ServiceDetailsPage;
