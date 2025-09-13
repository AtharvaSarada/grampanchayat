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

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

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
      title: 'Birth Certificate',
      description: 'Apply for birth certificate registration and issuance',
      category: 'Civil Registration',
      icon: <Assignment color="primary" />,
      processingTime: '7-10 days',
      fee: '₹50'
    },
    {
      id: 2,
      title: 'Property Tax Payment',
      description: 'Pay property tax online and get instant receipt',
      category: 'Revenue',
      icon: <AccountBalance color="primary" />,
      processingTime: 'Instant',
      fee: 'As per assessment'
    },
    {
      id: 3,
      title: 'Trade License',
      description: 'Apply for new trade license or renewal',
      category: 'Business',
      icon: <Business color="primary" />,
      processingTime: '15-30 days',
      fee: '₹500-2000'
    },
    {
      id: 4,
      title: 'Water Connection',
      description: 'New water connection or transfer of connection',
      category: 'Infrastructure',
      icon: <Home color="primary" />,
      processingTime: '10-15 days',
      fee: '₹1000'
    },
    {
      id: 5,
      title: 'Health Certificate',
      description: 'Medical fitness certificate for various purposes',
      category: 'Health',
      icon: <LocalHospital color="primary" />,
      processingTime: '3-5 days',
      fee: '₹100'
    },
    {
      id: 6,
      title: 'Income Certificate',
      description: 'Income certificate for education and other benefits',
      category: 'Social Welfare',
      icon: <Receipt color="primary" />,
      processingTime: '7-15 days',
      fee: '₹30'
    }
  ];

  // Service categories with accurate counts from servicesData.js
  const serviceCategories = [
    { name: 'Civil Registration', count: 3, icon: <Assignment /> }, // Birth, Death, Marriage Certificate
    { name: 'Revenue Services', count: 3, icon: <AccountBalance /> }, // Property Tax Payment, Assessment, Water Tax
    { name: 'Business Services', count: 2, icon: <Business /> }, // Trade License, Building Permission
    { name: 'Social Welfare', count: 4, icon: <People /> }, // Income, Caste, Domicile, BPL Certificate
    { name: 'Health Services', count: 2, icon: <LocalHospital /> }, // Health Certificate, Vaccination Certificate
    { name: 'Infrastructure', count: 3, icon: <Home /> }, // Water Connection, Drainage Connection, Street Light
    { name: 'Agriculture', count: 2, icon: <Receipt /> }, // Agricultural Subsidy, Crop Insurance
    { name: 'Education', count: 2, icon: <School /> } // School Transfer Certificate, Scholarship Application
  ];

  const quickLinks = [
    'Track Application Status',
    'Download Forms',
    'Pay Fees Online',
    'Contact Information',
    'Grievance Portal',
    'RTI Applications'
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
                E-Services for Gram Panchayath
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Digital governance at your fingertips. Access government services online, 
                track applications, and connect with your local administration.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/services')}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Browse Services
                </Button>
                {!isAuthenticated && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{ px: 4, py: 1.5, borderColor: 'white', color: 'white' }}
                  >
                    Get Started
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
                  Quick Statistics
                  <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>
                    Real-time from Firestore
                  </Typography>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Services</Typography>
                  <Typography variant="body2" fontWeight="bold">{stats.totalServices}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Applications Processed</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.applicationsProcessed} {stats.applicationsProcessed === 1 ? 'Application' : 'Applications'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Processing Time</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stats.averageProcessingTime} {stats.averageProcessingTime === 1 ? 'day' : 'days'}
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
            Service Categories
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
                      label={`${category.count} Services`} 
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
            Popular Services
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Most requested services by citizens
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
                        Processing Time:
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">
                        {service.processingTime}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">
                        Fee:
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
                      View Details
                    </Button>
                    {isAuthenticated && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/apply/${service.id}`)}
                      >
                        Apply Now
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
                How It Works
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Register Your Account"
                    secondary="Create your citizen account with valid documents"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Choose a Service"
                    secondary="Browse and select the government service you need"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fill Application"
                    secondary="Complete the online form with required information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Track & Receive"
                    secondary="Monitor your application status and receive updates"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                Quick Links
              </Typography>
              <List>
                {quickLinks.map((link, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      button 
                      onClick={() => {
                        // Navigate based on link
                        if (link === 'Track Application Status') navigate('/my-applications');
                        // Add more navigation logic as needed
                      }}
                    >
                      <ListItemText primary={link} />
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
