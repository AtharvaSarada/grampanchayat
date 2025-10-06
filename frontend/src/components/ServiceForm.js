import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';

const ServiceForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  service = null, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || '',
    requiredDocuments: service?.requiredDocuments || '',
    processingTime: service?.processingTime || '',
    fee: service?.fee || 'Free'
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Birth Certificate',
    'Death Certificate',
    'Marriage Certificate',
    'Income Certificate',
    'Caste Certificate',
    'Residence Certificate',
    'Property Tax',
    'Water Connection',
    'Building Permit',
    'Business License',
    'Other'
  ];

  const processingTimes = [
    '1-2 days',
    '3-5 days',
    '1 week',
    '2 weeks',
    '1 month',
    'Custom'
  ];

  React.useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        category: service.category || '',
        requiredDocuments: service.requiredDocuments || '',
        processingTime: service.processingTime || '',
        fee: service.fee || 'Free'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        requiredDocuments: '',
        processingTime: '',
        fee: 'Free'
      });
    }
    setErrors({});
  }, [service, open]);

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.processingTime) {
      newErrors.processingTime = 'Processing time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      requiredDocuments: '',
      processingTime: '',
      fee: 'Free'
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {service ? <Edit sx={{ mr: 1 }} /> : <Add sx={{ mr: 1 }} />}
          {service ? 'Edit Service' : 'Create New Service'}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="e.g., Birth Certificate Application"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe what this service provides and who can apply..."
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={handleChange('category')}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, mx: 1.75 }}>
                  {errors.category}
                </Box>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.processingTime}>
              <InputLabel>Processing Time</InputLabel>
              <Select
                value={formData.processingTime}
                onChange={handleChange('processingTime')}
                label="Processing Time"
              >
                {processingTimes.map(time => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
              {errors.processingTime && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, mx: 1.75 }}>
                  {errors.processingTime}
                </Box>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fee"
              value={formData.fee}
              onChange={handleChange('fee')}
              placeholder="e.g., Free, ₹50, ₹100"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Required Documents"
              value={formData.requiredDocuments}
              onChange={handleChange('requiredDocuments')}
              placeholder="List the documents required for this service (one per line)"
              helperText="Enter each required document on a new line"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceForm;
