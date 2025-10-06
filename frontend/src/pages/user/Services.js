import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import {
  Search,
  Block,
  Build,
  Schedule,
  AttachMoney,
  Description,
  FilterList,
  Clear,
  AccessTime,
  MonetizationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

const Services = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [feeFilter, setFeeFilter] = useState('All');
  const [processingTimeFilter, setProcessingTimeFilter] = useState('All');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const servicesQuery = query(collection(db, 'services'), orderBy('name'));
      const servicesSnapshot = await getDocs(servicesQuery);
      const servicesData = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories, fees, and processing times from services
  const categories = ['All', ...new Set(services.map(service => service.category).filter(Boolean))];
  const feeOptions = ['All', 'Free', 'Paid'];
  const processingTimeOptions = ['All', '1-2 days', '3-5 days', '1 week', '2 weeks', '1 month'];

  // Enhanced filter services based on all criteria
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.requiredDocuments?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    
    const matchesFee = feeFilter === 'All' || 
                      (feeFilter === 'Free' && (service.fee === 'Free' || service.fee === '₹0' || !service.fee)) ||
                      (feeFilter === 'Paid' && service.fee && service.fee !== 'Free' && service.fee !== '₹0');
    
    const matchesProcessingTime = processingTimeFilter === 'All' || service.processingTime === processingTimeFilter;
    
    return matchesSearch && matchesCategory && matchesFee && matchesProcessingTime;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'category':
        return (a.category || '').localeCompare(b.category || '');
      case 'processingTime':
        return (a.processingTime || '').localeCompare(b.processingTime || '');
      case 'fee':
        // Sort by fee - Free services first, then by amount
        const aFee = a.fee === 'Free' || !a.fee ? 0 : parseFloat(a.fee.replace(/[^\d.]/g, '')) || 0;
        const bFee = b.fee === 'Free' || !b.fee ? 0 : parseFloat(b.fee.replace(/[^\d.]/g, '')) || 0;
        return aFee - bFee;
      default:
        return 0;
    }
  });

  const handleApplyForService = (serviceId) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/apply/${serviceId}`);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setFeeFilter('All');
    setProcessingTimeFilter('All');
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || feeFilter !== 'All' || processingTimeFilter !== 'All';

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <ChakraSpinner size="40px" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            <Build sx={{ mr: 2, verticalAlign: 'middle' }} />
            Available Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and apply for various Gram Panchayat services online
          </Typography>
        </Paper>

        {/* Enhanced Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          {/* Main Search and Basic Filters */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search services, descriptions, or required documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  size="small"
                >
                  Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="outlined"
                    startIcon={<Clear />}
                    onClick={clearAllFilters}
                    size="small"
                    color="secondary"
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Advanced Filters - Collapsible */}
          {showAdvancedFilters && (
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterList sx={{ mr: 1 }} />
                Advanced Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Fee Type</InputLabel>
                    <Select
                      value={feeFilter}
                      onChange={(e) => setFeeFilter(e.target.value)}
                      label="Fee Type"
                      startAdornment={<MonetizationOn sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      {feeOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Processing Time</InputLabel>
                    <Select
                      value={processingTimeFilter}
                      onChange={(e) => setProcessingTimeFilter(e.target.value)}
                      label="Processing Time"
                      startAdornment={<AccessTime sx={{ mr: 1, color: 'action.active' }} />}
                    >
                      {processingTimeOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sort By"
                    >
                      <MenuItem value="name">Service Name</MenuItem>
                      <MenuItem value="category">Category</MenuItem>
                      <MenuItem value="processingTime">Processing Time</MenuItem>
                      <MenuItem value="fee">Fee Amount</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Button
                      variant="contained"
                      onClick={() => setShowAdvancedFilters(false)}
                      size="small"
                    >
                      Apply Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Results Count and Active Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {sortedServices.length} services found
            {searchTerm && ` for "${searchTerm}"`}
          </Typography>
          {hasActiveFilters && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Active filters:
              </Typography>
              {selectedCategory !== 'All' && (
                <Chip 
                  label={`Category: ${selectedCategory}`} 
                  size="small" 
                  onDelete={() => setSelectedCategory('All')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {feeFilter !== 'All' && (
                <Chip 
                  label={`Fee: ${feeFilter}`} 
                  size="small" 
                  onDelete={() => setFeeFilter('All')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {processingTimeFilter !== 'All' && (
                <Chip 
                  label={`Time: ${processingTimeFilter}`} 
                  size="small" 
                  onDelete={() => setProcessingTimeFilter('All')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>

        {/* Services Grid */}
        {sortedServices.length > 0 ? (
          <Grid container spacing={3}>
            {sortedServices.map((service) => (
              <Grid item xs={12} md={6} lg={4} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Build color="primary" sx={{ mr: 1 }} />
                      <Box sx={{ ml: 'auto' }}>
                        {service.category && (
                          <Chip
                            label={service.category}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom>
                      {service.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {service.processingTime && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Processing Time:
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" sx={{ ml: 'auto' }}>
                          {service.processingTime}
                        </Typography>
                      </Box>
                    )}
                    
                    {service.requiredDocuments && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Description sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Documents Required
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/services/${service.id}`)}
                    >
                      View Details
                    </Button>
                    {currentUser ? (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleApplyForService(service.id)}
                      >
                        Apply Now
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate('/login')}
                      >
                        Login to Apply
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Build sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'No services are currently available.'
              }
            </Typography>
            {(searchTerm || selectedCategory !== 'All') && (
              <Button
                variant="contained"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            )}
          </Paper>
        )}

        {!currentUser && (
          <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body2">
              Please <Button onClick={() => navigate('/login')} sx={{ textTransform: 'none' }}>login</Button> to apply for services.
            </Typography>
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Services;
