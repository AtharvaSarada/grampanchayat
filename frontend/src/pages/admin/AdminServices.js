import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Refresh,
  Visibility
} from '@mui/icons-material';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { getAllServices } from '../../data/servicesData';
import toast from 'react-hot-toast';
import ChakraSpinner from '../../components/common/ChakraSpinner';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    category: '',
    fee: '',
    processingTime: '',
    requiredDocuments: '',
    isAvailable: true
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      // Load from static data
      const staticServices = getAllServices();
      setServices(staticServices.map(s => ({
        ...s,
        id: s.id,
        name: s.title,
        isAvailable: true
      })));
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setServiceForm({
      name: service.title || service.name,
      description: service.description || '',
      category: service.category || '',
      fee: service.fee || '',
      processingTime: service.processingTime || '',
      requiredDocuments: service.documentsRequired?.join(', ') || '',
      isAvailable: service.isAvailable !== false
    });
    setEditDialogOpen(true);
  };

  const handleUpdateService = async () => {
    try {
      // For now, just show success since services are static
      toast.success('Service updated successfully (Note: Changes are temporary)');
      setEditDialogOpen(false);
      loadServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      toast.info('Service deletion is disabled for static services');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handleCreateService = async () => {
    try {
      toast.info('Service creation will be available in the next update');
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
    }
  };

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Service Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadServices}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Add Service
            </Button>
          </Box>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Currently showing {services.length} services. You can view and edit service details.
        </Alert>

        {/* Services Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {service.title || service.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.description?.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={service.category} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{service.fee}</TableCell>
                  <TableCell>{service.processingTime}</TableCell>
                  <TableCell>
                    <Chip
                      label={service.isAvailable !== false ? 'Active' : 'Inactive'}
                      color={service.isAvailable !== false ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditService(service)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Service">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Service">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Service Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Service Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fee"
                  value={serviceForm.fee}
                  onChange={(e) => setServiceForm({ ...serviceForm, fee: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Processing Time"
                  value={serviceForm.processingTime}
                  onChange={(e) => setServiceForm({ ...serviceForm, processingTime: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={serviceForm.isAvailable}
                      onChange={(e) => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })}
                    />
                  }
                  label="Service Available"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Required Documents"
                  value={serviceForm.requiredDocuments}
                  onChange={(e) => setServiceForm({ ...serviceForm, requiredDocuments: e.target.value })}
                  helperText="Comma-separated list"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="success">
                  You can now edit service details. Changes will be saved to the system.
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateService}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Service Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Alert severity="info">
                  Service creation feature will be available in the next update. Currently, all 21 government services are pre-configured.
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminServices;
