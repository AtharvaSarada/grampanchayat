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

// Import shared services data
import { getServiceById } from '../../data/servicesData';


const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [tabValue, setTabValue] = useState(0);
  
  const service = getServiceById(parseInt(serviceId));
  
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
                <Chip label={`Fee: ${service.fee}`} color="secondary" />
                <Chip label={`Processing: ${service.processingTime}`} color="info" />
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
                {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Service Details Tabs */}
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="service details tabs">
              <Tab label="Overview" />
              <Tab label="Required Documents" />
              <Tab label="Application Process" />
              <Tab label="Eligibility" />
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
                      Processing Time
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {service.processingTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Average time for application processing and certificate issuance
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <CurrencyRupee sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Service Fee
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {service.fee}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Government fee for service processing
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Service Description
                    </Typography>
                    <Typography variant="body1">
                      {service.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      This service is provided by the Gram Panchayat as part of citizen services. 
                      Online application facility is available for faster processing.
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
                  Required Documents
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Please ensure all documents are clear, legible, and in the accepted formats (PDF, JPG, PNG). 
                  Maximum file size: 5MB per document.
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
                  Step-by-step Application Process
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
                  <strong>Track Your Application:</strong> After submission, you can track the status of your 
                  application using the application ID provided via SMS and email.
                </Alert>
              </CardContent>
            </Card>
          </TabPanel>
          
          {/* Eligibility Tab */}
          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Eligibility Criteria
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  {service.eligibility}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom color="primary">
                  Important Notes
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary="Application must be filled completely and accurately" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary="All documents must be valid and current" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary="Application fee is non-refundable" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="info" />
                    </ListItemIcon>
                    <ListItemText primary="Processing time may vary during peak periods" />
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
