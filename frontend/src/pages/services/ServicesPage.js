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
  Divider
} from '@mui/material';
import {
  Search
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import shared services data
import { getAllServices, getServicesByCategory, serviceCategories } from '../../data/servicesData';

const ServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  // Get services from shared data
  const allServices = getAllServices();
  const categories = serviceCategories.map(cat => cat.name);

  // Filter services based on search and category
  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Government Services
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Browse and apply for various Gram Panchayat services online
        </Typography>

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search services..."
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
            <Grid item xs={12} md={4}>
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
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Typography variant="h6" sx={{ mb: 3 }}>
          {sortedServices.length} services found
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
                    <Box sx={{ ml: 'auto' }}>
                      <Chip
                        label={service.category}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" component="h3" gutterBottom>
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
                  >
                    View Details
                  </Button>
                  {isAuthenticated ? (
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
