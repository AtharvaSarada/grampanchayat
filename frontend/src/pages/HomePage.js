import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  Assignment,
  AccountBalance,
  Business,
  School,
  LocalHospital,
  Home,
  Receipt,
  People,
  Security,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { subscribeToStatistics } from '../services/statisticsService';
import { useLanguage } from '../i18n/LanguageProvider';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { t } = useLanguage();

  // Stats state with safe defaults
  const [stats, setStats] = useState({
    totalServices: 0,
    applicationsProcessed: 0,
    averageProcessingTime: 0,
  });

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToStatistics((data) => {
      setStats({
        totalServices: Number(data?.totalServices) || 0,
        applicationsProcessed: Number(data?.applicationsProcessed) || 0,
        averageProcessingTime: Number(data?.averageProcessingTime) || 0,
      });
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Featured Government Services
  const featuredServices = [
    {
      id: 1,
      title: t('services.birthCertificate'),
      description: t('services.birthCertificateDesc'),
      category: t('services.civilRegistration'),
      icon: <Assignment color="primary" />,
      processingTime: '7-10 ' + t('home.days'),
      fee: '₹50'
    },
    {
      id: 2,
      title: t('services.propertyTaxPayment'),
      description: t('services.propertyTaxPaymentDesc'),
      category: t('services.revenueServices'),
      icon: <AccountBalance color="primary" />,
      processingTime: t('services.instant'),
      fee: t('services.asPerAssessment')
    },
    {
      id: 3,
      title: t('services.tradeLicense'),
      description: t('services.tradeLicenseDesc'),
      category: t('services.businessServices'),
      icon: <Business color="primary" />,
      processingTime: '15-30 ' + t('home.days'),
      fee: '₹500-2000'
    },
    {
      id: 4,
      title: t('services.waterConnection'),
      description: t('services.waterConnectionDesc'),
      category: t('services.infrastructure'),
      icon: <Home color="primary" />,
      processingTime: '10-15 ' + t('home.days'),
      fee: '₹1000'
    },
    {
      id: 5,
      title: t('services.healthCertificate'),
      description: t('services.healthCertificateDesc'),
      category: t('services.healthServices'),
      icon: <LocalHospital color="primary" />,
      processingTime: '3-5 ' + t('home.days'),
      fee: '₹100'
    },
    {
      id: 6,
      title: t('services.incomeCertificate'),
      description: t('services.incomeCertificateDesc'),
      category: t('services.socialWelfare'),
      icon: <Receipt color="primary" />,
      processingTime: '7-15 ' + t('home.days'),
      fee: '₹30'
    }
  ];

  // Service categories with accurate counts from servicesData.js
  const serviceCategories = [
    { name: t('services.civilRegistration'), count: 3, icon: <Assignment /> }, // Birth, Death, Marriage Certificate
    { name: t('services.revenueServices'), count: 3, icon: <AccountBalance /> }, // Property Tax Payment, Assessment, Water Tax
    { name: t('services.businessServices'), count: 2, icon: <Business /> }, // Trade License, Building Permission
    { name: t('services.socialWelfare'), count: 4, icon: <People /> }, // Income, Caste, Domicile, BPL Certificate
    { name: t('services.healthServices'), count: 2, icon: <LocalHospital /> }, // Health Certificate, Vaccination Certificate
    { name: t('services.infrastructure'), count: 3, icon: <Home /> }, // Water Connection, Drainage Connection, Street Light
    { name: t('services.welfare'), count: 2, icon: <Receipt /> }, // Agricultural Subsidy, Crop Insurance
    { name: t('services.certificates'), count: 2, icon: <School /> } // School Transfer Certificate, Scholarship Application
  ];

  const quickLinks = [
    { key: 'trackApplicationStatus', label: t('home.trackApplicationStatus') },
    { key: 'downloadForms', label: t('home.downloadForms') },
    { key: 'payFeesOnline', label: t('home.payFeesOnline') },
    { key: 'contactInformation', label: t('home.contactInformation') },
    { key: 'grievancePortal', label: t('home.grievancePortal') },
    { key: 'rtiApplications', label: t('home.rtiApplications') }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
          color: 'white',
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                {t('home.title')}
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                {t('home.subtitle')}. {t('home.description')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/services')}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {t('home.getStarted')}
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ px: 4, py: 1.5, borderColor: 'white', color: 'white' }}
                  >
                    {t('common.submit')}
                  </Button>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Typography variant="h6" gutterBottom color="inherit">
                  {t('home.quickStatistics')}
                  <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>
                    {t('home.realTimeFromFirestore')}
                  </Typography>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('home.totalServices')}</Typography>
                  <Typography variant="body2" fontWeight="bold">{stats.totalServices}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{t('home.applicationsProcessed')}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.applicationsProcessed} {t('home.applications')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('services.processingTime')}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.averageProcessingTime} {t('home.days')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Service Categories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            {t('services.serviceCategories')}
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {serviceCategories.map((category, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { 
                      boxShadow: 4, 
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    } 
                  }}
                  onClick={() => navigate(`/services?category=${encodeURIComponent(category.name)}`)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                      {React.cloneElement(category.icon, { sx: { fontSize: 48 } })}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {category.name}
                    </Typography>
                    <Chip 
                      label={`${category.count} ${t('services.servicesCount')}`} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Services */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            {t('home.popularServices')}
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            {t('home.mostRequested')}
          </Typography>
          <Grid container spacing={3}>
            {featuredServices.map((service) => (
              <Grid item xs={12} md={6} lg={4} key={service.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {service.icon}
                      <Chip 
                        label={service.category} 
                        size="small" 
                        color="secondary"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('home.processingTimeLabel')}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {service.processingTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('home.feeLabel')}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {service.fee}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      {t('services.viewDetails')}
                    </Button>
                    {isAuthenticated && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/apply/${service.id}`)}
                      >
                        {t('services.applyNow')}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Information Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                {t('home.howItWorks')}
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('home.step1Title')}
                    secondary={t('home.step1Desc')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('home.step2Title')}
                    secondary={t('home.step2Desc')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('home.step3Title')}
                    secondary={t('home.step3Desc')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={t('home.step4Title')}
                    secondary={t('home.step4Desc')}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                {t('home.quickLinks')}
              </Typography>
              <List>
                {quickLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button 
                      onClick={() => {
                        // Navigate based on link
                        switch (link.key) {
                          case 'trackApplicationStatus':
                            if (isAuthenticated) {
                              navigate('/my-applications');
                            } else {
                              navigate('/login');
                            }
                            break;
                          case 'downloadForms':
                            navigate('/services');
                            break;
                          case 'payFeesOnline':
                            if (isAuthenticated) {
                              navigate('/dashboard');
                            } else {
                              navigate('/login');
                            }
                            break;
                          case 'contactInformation':
                            // Scroll to footer or show contact modal
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            break;
                          case 'grievancePortal':
                            if (isAuthenticated) {
                              navigate('/dashboard');
                            } else {
                              navigate('/login');
                            }
                            break;
                          case 'rtiApplications':
                            if (isAuthenticated) {
                              navigate('/services');
                            } else {
                              navigate('/login');
                            }
                            break;
                          default:
                            navigate('/services');
                        }
                      }}
                    >
                      <ListItemText primary={link.label} />
                    </ListItem>
                    {index < quickLinks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Notice/Alert Section */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Digital India Initiative
          </Typography>
          <Typography variant="body2">
            This digital platform is part of the Digital India initiative to make government services 
            accessible to all citizens. For any assistance, please contact your local Gram Panchayat office 
            or use our online support system.
          </Typography>
        </Alert>
      </Container>
    </Box>
  );
};

export default HomePage;
