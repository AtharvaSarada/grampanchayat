import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Search,
  Home,
  Payment,
  Receipt,
  Info
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PropertyTaxForm = () => {
  const { currentUser } = useAuth();
  const [searchMode, setSearchMode] = useState('propertyId');
  const [searchData, setSearchData] = useState({
    propertyId: '',
    ownerName: '',
    surveyNumber: ''
  });
  
  const [propertyFound, setPropertyFound] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [paymentData, setPaymentData] = useState({
    paymentMode: 'online',
    contactNumber: '',
    email: currentUser?.email || ''
  });

  // Mock property data - in real app, this would come from API
  const mockPropertyData = {
    'PROP001': {
      propertyId: 'PROP001',
      ownerName: 'John Doe',
      address: '123 Main Street, Village Center',
      surveyNumber: 'SY/123',
      propertyType: 'Residential',
      builtUpArea: '1500 sq ft',
      assessmentYear: '2024-25',
      taxDetails: {
        annualTax: 12000,
        waterCharge: 2400,
        streetLightTax: 600,
        garbageCollection: 1200,
        total: 16200,
        paid: 8100,
        due: 8100,
        dueDate: '2024-12-31',
        penalty: 810
      }
    }
  };

  const handleSearch = () => {
    // Mock search functionality
    if (searchData.propertyId === 'PROP001' || 
        searchData.ownerName.toLowerCase() === 'john doe' ||
        searchData.surveyNumber === 'SY/123') {
      setPropertyDetails(mockPropertyData['PROP001']);
      setPropertyFound(true);
      toast.success('Property found successfully!');
    } else if (searchData.propertyId || searchData.ownerName || searchData.surveyNumber) {
      toast.error('Property not found. Please check your search criteria.');
      setPropertyFound(false);
      setPropertyDetails(null);
    } else {
      toast.error('Please enter search criteria');
    }
  };

  const handlePayment = async () => {
    try {
      if (!propertyDetails) {
        toast.error('Please search and select a property first');
        return;
      }

      // Mock payment processing
      toast.loading('Processing payment...', { duration: 2000 });
      
      setTimeout(() => {
        toast.success('Payment successful! Receipt will be sent to your email.');
        // In real app, redirect to receipt page or reset form
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" textAlign="center">
          Property Tax Payment
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>Payment Options:</strong> Online payment, Bank transfer, or visit Gram Panchayat office. 
            Instant receipt available for online payments.
          </Typography>
        </Alert>

        {/* Property Search Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              <Search sx={{ mr: 1, verticalAlign: 'middle' }} />
              Search Your Property
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Property ID"
                  value={searchData.propertyId}
                  onChange={(e) => handleInputChange('propertyId', e.target.value)}
                  placeholder="e.g., PROP001"
                  helperText="Enter your property ID"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Owner Name"
                  value={searchData.ownerName}
                  onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  placeholder="e.g., John Doe"
                  helperText="Enter property owner name"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Survey Number"
                  value={searchData.surveyNumber}
                  onChange={(e) => handleInputChange('surveyNumber', e.target.value)}
                  placeholder="e.g., SY/123"
                  helperText="Enter survey number"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<Search />}
                  size="large"
                  sx={{ px: 4 }}
                >
                  Search Property
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Property Details Section */}
        {propertyFound && propertyDetails && (
          <>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <Home sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Property Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Property ID</Typography>
                    <Typography variant="body1" fontWeight="bold">{propertyDetails.propertyId}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Owner Name</Typography>
                    <Typography variant="body1" fontWeight="bold">{propertyDetails.ownerName}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1" fontWeight="bold">{propertyDetails.address}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Survey Number</Typography>
                    <Typography variant="body1" fontWeight="bold">{propertyDetails.surveyNumber}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Property Type</Typography>
                    <Typography variant="body1" fontWeight="bold">{propertyDetails.propertyType}</Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">Built-up Area</Typography>
                    <Typography variant="body1" fontWeight="bold">{propertyDetails.builtUpArea}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Tax Details Section */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Tax Assessment Details - {propertyDetails.assessmentYear}
                </Typography>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Tax Component</strong></TableCell>
                        <TableCell align="right"><strong>Annual Amount</strong></TableCell>
                        <TableCell align="right"><strong>Paid</strong></TableCell>
                        <TableCell align="right"><strong>Due</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Property Tax</TableCell>
                        <TableCell align="right">₹{propertyDetails.taxDetails.annualTax.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.annualTax * 0.5).toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.annualTax * 0.5).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Water Charge</TableCell>
                        <TableCell align="right">₹{propertyDetails.taxDetails.waterCharge.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.waterCharge * 0.5).toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.waterCharge * 0.5).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Street Light Tax</TableCell>
                        <TableCell align="right">₹{propertyDetails.taxDetails.streetLightTax.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.streetLightTax * 0.5).toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.streetLightTax * 0.5).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Garbage Collection</TableCell>
                        <TableCell align="right">₹{propertyDetails.taxDetails.garbageCollection.toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.garbageCollection * 0.5).toLocaleString()}</TableCell>
                        <TableCell align="right">₹{(propertyDetails.taxDetails.garbageCollection * 0.5).toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell><strong>Total</strong></TableCell>
                        <TableCell align="right"><strong>₹{propertyDetails.taxDetails.total.toLocaleString()}</strong></TableCell>
                        <TableCell align="right"><strong>₹{propertyDetails.taxDetails.paid.toLocaleString()}</strong></TableCell>
                        <TableCell align="right"><strong>₹{propertyDetails.taxDetails.due.toLocaleString()}</strong></TableCell>
                      </TableRow>
                      {propertyDetails.taxDetails.penalty > 0 && (
                        <TableRow>
                          <TableCell colSpan={3}>Late Payment Penalty (10%)</TableCell>
                          <TableCell align="right" sx={{ color: 'error.main' }}>
                            <strong>₹{propertyDetails.taxDetails.penalty.toLocaleString()}</strong>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>Due Date:</strong> {propertyDetails.taxDetails.dueDate}
                  </Typography>
                  {propertyDetails.taxDetails.penalty > 0 && (
                    <Typography variant="body2" color="error">
                      <strong>Note:</strong> Late payment penalty of 10% has been added to the due amount.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Make Payment
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      value={paymentData.contactNumber}
                      onChange={(e) => handlePaymentDataChange('contactNumber', e.target.value)}
                      placeholder="Enter mobile number for SMS receipt"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={paymentData.email}
                      onChange={(e) => handlePaymentDataChange('email', e.target.value)}
                      placeholder="Enter email for receipt"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ p: 3, bgcolor: 'success.light', borderRadius: 1, mb: 2 }}>
                      <Typography variant="h5" textAlign="center">
                        Total Amount to Pay: <strong>₹{(propertyDetails.taxDetails.due + propertyDetails.taxDetails.penalty).toLocaleString()}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handlePayment}
                      startIcon={<Payment />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Pay ₹{(propertyDetails.taxDetails.due + propertyDetails.taxDetails.penalty).toLocaleString()} Online
                    </Button>
                  </Grid>
                </Grid>
                
                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Secure Payment:</strong> Your payment is processed through secure payment gateway. 
                    You will receive instant receipt via email and SMS.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PropertyTaxForm;
