import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility,
  Search,
  FilterList,
  Download,
  History,
  AttachFile
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getUserApplications, APPLICATION_STATUS } from '../../services/realWorldApplicationService';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import toast from 'react-hot-toast';
import { useLanguage } from '../../i18n/LanguageProvider';

const translations = {
  en: {
    myApplications: "My Applications",
    trackStatus: "Track the status of all your submitted applications",
    searchPlaceholder: "Search applications...",
    showing: "Showing",
    of: "of",
    applications: "applications",
    all: "All",
    submitted: "Submitted",
    underReview: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Completed",
    applicant: "Applicant:",
    applicationId: "Application ID:",
    submittedOn: "Submitted:",
    lastUpdated: "Last Updated:",
    statusChanged: "Status changed",
    times: "times",
    viewDetails: "View Details",
    download: "Download",
    applicationDetails: "Application Details",
    basicInfo: "Basic Information",
    serviceType: "Service Type",
    currentStatus: "Current Status",
    uploadedDocs: "Uploaded Documents",
    viewDoc: "View Document",
    statusHistory: "Status History",
    statusUpdated: "Status updated",
    close: "Close",
    downloadCertificate: "Download Certificate",
    noAppsFound: "No applications found",
    noAppsYet: "No applications yet",
    noAppsAdjust: "Try adjusting your search or filter criteria",
    noAppsSubmit: "You haven't submitted any applications yet. Start by applying for a service.",
    browseServices: "Browse Services",
    serviceNames: {
      "birth-certificate": "Birth Certificate",
      "death-certificate": "Death Certificate",
      "marriage-certificate": "Marriage Certificate",
      "income-certificate": "Income Certificate",
      "caste-certificate": "Caste Certificate",
      "domicile-certificate": "Domicile Certificate",
      "bpl-certificate": "BPL Certificate",
      "agricultural-subsidy": "Agricultural Subsidy",
      "crop-insurance": "Crop Insurance",
      "building-permission": "Building Permission",
      "trade-license": "Trade License",
      "water-connection": "Water Connection",
      "drainage-connection": "Drainage Connection",
      "property-tax-payment": "Property Tax Payment",
      "property-tax-assessment": "Property Tax Assessment",
      "vaccination-certificate": "Vaccination Certificate",
      "health-certificate": "Health Certificate",
      "school-transfer-certificate": "School Transfer Certificate",
      "scholarship": "Scholarship Application",
      "water-tax-payment": "Water Tax Payment",
      "street-light-installation": "Street Light Installation"
    }
  },
  mr: {
    myApplications: "माझे अर्ज",
    trackStatus: "तुमच्या सर्व सबमिट केलेल्या अर्जांची स्थिती ट्रॅक करा",
    searchPlaceholder: "अर्ज शोधा...",
    showing: "दाखवत आहे",
    of: "पैकी",
    applications: "अर्ज",
    all: "सर्व",
    submitted: "सबमिट केले",
    underReview: "पुनरावलोकनाखाली",
    approved: "मंजूर",
    rejected: "नाकारले",
    completed: "पूर्ण झाले",
    applicant: "अर्जदार:",
    applicationId: "अर्ज आयडी:",
    submittedOn: "सबमिट केले:",
    lastUpdated: "शेवटचे अपडेट केले:",
    statusChanged: "स्थिती बदलली",
    times: "वेळा",
    viewDetails: "तपशील पहा",
    download: "डाउनलोड करा",
    applicationDetails: "अर्जाचे तपशील",
    basicInfo: "मूलभूत माहिती",
    serviceType: "सेवेचा प्रकार",
    currentStatus: "सद्यस्थिती",
    uploadedDocs: "अपलोड केलेली कागदपत्रे",
    viewDoc: "कागदपत्र पहा",
    statusHistory: " स्थिती इतिहास",
    statusUpdated: "स्थिती अपडेट केली",
    close: "बंद करा",
    downloadCertificate: "प्रमाणपत्र डाउनलोड करा",
    noAppsFound: "कोणतेही अर्ज आढळले नाहीत",
    noAppsYet: "अद्याप कोणतेही अर्ज नाहीत",
    noAppsAdjust: "तुमचा शोध किंवा फिल्टर निकष समायोजित करण्याचा प्रयत्न करा",
    noAppsSubmit: "तुम्ही अद्याप कोणतेही अर्ज सबमिट केलेले नाहीत. सेवेसाठी अर्ज करून प्रारंभ करा.",
    browseServices: "सेवा ब्राउझ करा",
    serviceNames: {
      "birth-certificate": "जन्म प्रमाणपत्र",
      "death-certificate": "मृत्यू प्रमाणपत्र",
      "marriage-certificate": "विवाह प्रमाणपत्र",
      "income-certificate": "उत्पन्न प्रमाणपत्र",
      "caste-certificate": "जातीचे प्रमाणपत्र",
      "domicile-certificate": "अधिवास प्रमाणपत्र",
      "bpl-certificate": "BPL प्रमाणपत्र",
      "agricultural-subsidy": "कृषी अनुदान",
      "crop-insurance": "पीक विमा",
      "building-permission": "इमारत परवानगी",
      "trade-license": "व्यापार परवाना",
      "water-connection": "पाणी कनेक्शन",
      "drainage-connection": "निचरा कनेक्शन",
      "property-tax-payment": "मालमत्ता कर भरणे",
      "property-tax-assessment": "मालमत्ता कर मूल्यांकन",
      "vaccination-certificate": "लसीकरण प्रमाणपत्र",
      "health-certificate": "आरोग्य प्रमाणपत्र",
      "school-transfer-certificate": "शाळा हस्तांतरण प्रमाणपत्र",
      "scholarship": "शिष्यवृत्ती अर्ज",
      "water-tax-payment": "पाणी कर भरणे",
      "street-light-installation": "पथदिवे बसवणे"
    }
  },
};

const MyApplications = () => {
  const { currentUser } = useAuth();
  const { language, t: translate } = useLanguage();
  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = result[k];
      } else {
        return key;
      }
    }
    return result || key;
  };
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const statusTabs = [
    { label: t('all'), value: 'all' },
    { label: t('submitted'), value: APPLICATION_STATUS.SUBMITTED },
    { label: t('underReview'), value: APPLICATION_STATUS.UNDER_REVIEW },
    { label: t('approved'), value: APPLICATION_STATUS.APPROVED },
    { label: t('rejected'), value: APPLICATION_STATUS.REJECTED },
    { label: t('completed'), value: APPLICATION_STATUS.COMPLETED }
  ];

  const getServiceDisplayName = (serviceType) => {
    const key = `serviceNames.${serviceType}`;
    const translatedName = t(key);
    if (translatedName !== key) {
      return translatedName;
    }
    return serviceType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    if (currentUser) {
      loadApplications();
    }
  }, [currentUser]);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedTab, searchTerm]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      console.log('🔍 MyApplications: Loading applications for user:', currentUser.uid);
      const userApps = await getUserApplications(currentUser.uid);
      console.log('📊 MyApplications: Applications loaded:', userApps.length, userApps);
      
      // Debug: Log each application's structure
      userApps.forEach((app, index) => {
        console.log(`📄 Application ${index + 1}:`, {
          id: app.id,
          serviceType: app.serviceType,
          status: app.status,
          userId: app.userId,
          applicationData: app.applicationData,
          formData: app.formData,
          hasApplicationData: !!app.applicationData,
          hasFormData: !!app.formData
        });
      });
      
      setApplications(userApps);
    } catch (error) {
      console.error('❌ MyApplications: Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status
    if (selectedTab > 0) {
      const statusValue = statusTabs[selectedTab].value;
      filtered = filtered.filter(app => app.status === statusValue);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(app => {
        const appData = app.applicationData || app.formData || {};
        const applicantName = appData.childName || appData.applicantName || appData.informantName || appData.fatherName || appData.motherName || app.applicantName || '';
        
        return getServiceDisplayName(app.serviceType).toLowerCase().includes(searchTerm.toLowerCase()) ||
               app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
               applicantName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return 'warning';
      case APPLICATION_STATUS.UNDER_REVIEW:
        return 'info';
      case APPLICATION_STATUS.APPROVED:
        return 'success';
      case APPLICATION_STATUS.REJECTED:
        return 'error';
      case APPLICATION_STATUS.COMPLETED:
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return <Schedule />;
      case APPLICATION_STATUS.UNDER_REVIEW:
        return <Assignment />;
      case APPLICATION_STATUS.APPROVED:
      case APPLICATION_STATUS.COMPLETED:
        return <CheckCircle />;
      case APPLICATION_STATUS.REJECTED:
        return <Cancel />;
      default:
        return <Assignment />;
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsDialogOpen(true);
  };

  const formatDate = (timestamp) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString('en-IN');
    }
    return new Date(timestamp).toLocaleDateString('en-IN');
  };

  const renderApplicationCard = (application) => {
    const serviceDisplayName = getServiceDisplayName(application.serviceType);
    
    // Handle both applicationData and formData fields
    const appData = application.applicationData || application.formData || {};
    const applicantName = appData.childName || 
                         appData.applicantName || 
                         appData.informantName ||
                         appData.fatherName ||
                         appData.motherName ||
                         application.applicantName ||
                         'N/A';

    return (
      <Grid item xs={12} md={6} lg={4} key={application.id}>
        <Card 
          elevation={2} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            '&:hover': {
              elevation: 4,
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h3" noWrap>
                {serviceDisplayName}
              </Typography>
              <Chip 
                icon={getStatusIcon(application.status)}
                label={application.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(application.status)}
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>{t('applicant')}</strong> {applicantName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>{t('applicationId')}</strong> {application.id.substring(0, 20)}...
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>{t('submittedOn')}</strong> {formatDate(application.createdAt)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              <strong>{t('lastUpdated')}</strong> {formatDate(application.updatedAt)}
            </Typography>

            {application.statusHistory && application.statusHistory.length > 1 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('statusChanged')} {application.statusHistory.length} {t('times')}
                </Typography>
              </Box>
            )}
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Button 
              size="small" 
              onClick={() => handleViewDetails(application)}
              startIcon={<Visibility />}
            >
              {t('viewDetails')}
            </Button>
            
            {application.status === APPLICATION_STATUS.COMPLETED && (
              <Button 
                size="small" 
                color="primary"
                startIcon={<Download />}
              >
                {t('download')}
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const renderDetailsDialog = () => {
    if (!selectedApplication) return null;

    const serviceDisplayName = getServiceDisplayName(selectedApplication.serviceType);
    
    return (
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assignment />
            {serviceDisplayName} - {t('applicationDetails')}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                {t('basicInfo')}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary={t('applicationId')} 
                    secondary={selectedApplication.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={t('serviceType')} 
                    secondary={serviceDisplayName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={t('currentStatus')} 
                    secondary={
                      <Chip 
                        icon={getStatusIcon(selectedApplication.status)}
                        label={selectedApplication.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(selectedApplication.status)}
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={t('submittedOn')} 
                    secondary={formatDate(selectedApplication.createdAt)}
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Application Data Preview */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                {t('applicationDetails')}
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                {(() => {
                  // Handle both applicationData and formData fields
                  const appData = selectedApplication.applicationData || selectedApplication.formData || {};
                  return Object.entries(appData).map(([key, value]) => {
                    // Skip objects and arrays that shouldn't be displayed
                    if (key === 'supportingDocuments' || key === 'documentUrls' || key === 'applicantInfo' || key === 'submissionDetails' || key === 'documents') return null;
                    
                    // Skip if value is an object or array
                    if (typeof value === 'object' && value !== null) return null;
                    
                    return (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </Typography>
                        <Typography variant="body2">
                          {value || 'N/A'}
                        </Typography>
                      </Box>
                    );
                  });
                })()}
              </Paper>
            </Grid>

            {/* Documents */}
            {(() => {
              // Handle both applicationData and formData fields, and check for documents or documentUrls
              const appData = selectedApplication.applicationData || selectedApplication.formData || {};
              const docs = appData.documentUrls || appData.documents || selectedApplication.documents;
              
              if (!docs || (Array.isArray(docs) && docs.length === 0) || (typeof docs === 'object' && Object.keys(docs).length === 0)) {
                return null;
              }
              
              return (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    <AttachFile sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {t('uploadedDocs')}
                  </Typography>
                  
                  <List dense>
                    {(() => {
                      // Convert object to array if needed
                      const docsArray = Array.isArray(docs) 
                        ? docs 
                        : Object.entries(docs).map(([type, doc]) => ({
                            type,
                            name: doc.name || type,
                            url: doc.url || doc
                          }));
                      
                      return docsArray.map((doc, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <AttachFile />
                          </ListItemIcon>
                          <ListItemText 
                            primary={doc.name || doc.type || `Document ${index + 1}`}
                            secondary={
                              <Button 
                                size="small" 
                                onClick={() => window.open(doc.url || doc, '_blank')}
                              >
                                {t('viewDoc')}
                              </Button>
                            }
                          />
                        </ListItem>
                      ));
                    })()}
                  </List>
                </Grid>
              );
            })()}

            {/* Status History */}
            {selectedApplication.statusHistory && selectedApplication.statusHistory.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {t('statusHistory')}
                </Typography>
                
                <List dense>
                  {selectedApplication.statusHistory.map((entry, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(entry.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={entry.status.replace('_', ' ').toUpperCase()}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {entry.remarks || t('statusUpdated')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(entry.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < selectedApplication.statusHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            {t('close')}
          </Button>
          {selectedApplication.status === APPLICATION_STATUS.COMPLETED && (
            <Button variant="contained" startIcon={<Download />}>
              {t('downloadCertificate')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
            {t('myApplications')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('trackStatus')}
          </Typography>
        </Paper>

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterList />
                <Typography variant="body2">
                  {t('showing')} {filteredApplications.length} {t('of')} {applications.length} {t('applications')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs 
            value={selectedTab} 
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {statusTabs.map((tab, index) => (
              <Tab 
                key={tab.value} 
                label={`${tab.label} (${
                  tab.value === 'all' 
                    ? applications.length 
                    : applications.filter(app => app.status === tab.value).length
                })`}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Applications Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <ChakraSpinner size="40px" />
          </Box>
        ) : filteredApplications.length > 0 ? (
          <Grid container spacing={3}>
            {filteredApplications.map(renderApplicationCard)}
          </Grid>
        ) : (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {searchTerm || selectedTab > 0 ? t('noAppsFound') : t('noAppsYet')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {searchTerm || selectedTab > 0 
                ? t('noAppsAdjust')
                : t('noAppsSubmit')
              }
            </Typography>
            {!searchTerm && selectedTab === 0 && (
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                href="/services"
              >
                {t('browseServices')}
              </Button>
            )}
          </Paper>
        )}

        {/* Details Dialog */}
        {renderDetailsDialog()}
      </Box>
    </Container>
  );
};

export default MyApplications;
