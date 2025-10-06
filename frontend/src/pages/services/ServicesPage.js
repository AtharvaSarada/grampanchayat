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
  Tabs,
  Tab,
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
  Block
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../i18n/LanguageProvider';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { servicesData } from '../../data/servicesData';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import toast from 'react-hot-toast';

// Import shared services data for fallback
import { getAllServices, getServicesByCategory, serviceCategories } from '../../data/servicesData';

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get categories from static data
  const categories = serviceCategories.map(cat => cat.name);

  // Fetch services from Firestore with availability status
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const servicesQuery = query(
        collection(db, 'services'),
        orderBy('name')
      );
      
      const servicesSnapshot = await getDocs(servicesQuery);
      
      if (servicesSnapshot.empty) {
        // Fallback to static data if no services in Firestore
        console.log('No services in Firestore, using static data');
        const staticServices = getAllServices().map(service => ({
          ...service,
          id: service.id,
          name: service.title,
          title: service.title,
          isAvailable: true,
          status: 'active'
        }));
        setServices(staticServices);
      } else {
        // Use Firestore data with availability status
        const firestoreServices = servicesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: data.serviceId || doc.id,
            firestoreId: doc.id,
            name: data.name,
            title: data.name,
            description: data.description,
            category: data.category,
            processingTime: data.processingTime,
            fee: data.fee === 0 ? 'Free' : `₹${data.fee}`,
            isAvailable: data.isAvailable !== false,
            status: data.status || 'active',
            requiredDocuments: data.requiredDocuments ? data.requiredDocuments.split(', ') : [],
            // Add icon from static data if available
            icon: getAllServices().find(s => s.title === data.name)?.icon || null,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          };
        });
        setServices(firestoreServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
      toast.error('Failed to load services');
      
      // Fallback to static data on error
      const staticServices = getAllServices().map(service => ({
        ...service,
        id: service.id,
        name: service.title,
        title: service.title,
        isAvailable: true,
        status: 'active'
      }));
      setServices(staticServices);
    } finally {
      setLoading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort services - Available services first, then unavailable
  const sortedServices = [...filteredServices].sort((a, b) => {
    // First sort by availability (available services first)
    if (a.isAvailable !== b.isAvailable) {
      return b.isAvailable - a.isAvailable;
    }
    
    // Then sort by selected criteria
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'processingTime':
        return a.processingTime.localeCompare(b.processingTime);
      default:
        return 0;
    }
  });

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <ChakraSpinner size="60px" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {t('services.title')}
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          {t('services.subtitle')}
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder={t('services.searchPlaceholder')}
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t('common.filter')}</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label={t('common.filter')}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>{t('common.search')}</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label={t('common.search')}
                >
                  <MenuItem value="name">Service Name</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="processingTime">Processing Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          {sortedServices.length} {t('services.title')}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` for "${searchTerm}"`}
        </Typography>

        {/* Services Grid */}
        <Grid container spacing={3}>
          {sortedServices.map((service) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: service.isAvailable ? 1 : 0.6,
                  backgroundColor: service.isAvailable ? 'background.paper' : 'grey.50',
                  '&:hover': {
                    boxShadow: service.isAvailable ? 6 : 2,
                    transform: service.isAvailable ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {service.icon}
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                      <Chip
                        label={service.category}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      {!service.isAvailable && (
                        <Chip
                          label="Unavailable"
                          size="small"
                          color="error"
                          variant="filled"
                          icon={<Block />}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      color: service.isAvailable ? 'text.primary' : 'text.secondary',
                      textDecoration: service.isAvailable ? 'none' : 'line-through'
                    }}
                  >
                    {service.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {service.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
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
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/services/${service.id}`)}
                    disabled={!service.isAvailable}
                  >
                    View Details
                  </Button>
                  {!service.isAvailable ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      disabled
                      startIcon={<Block />}
                    >
                      Currently Unavailable
                    </Button>
                  ) : isAuthenticated ? (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/apply/${service.id}`)}
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

        {/* No Results */}
        {sortedServices.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No services found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
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
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ServicesPage;
