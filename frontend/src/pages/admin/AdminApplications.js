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
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Visibility,
  Edit,
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  Download,
  Assignment,
  Person,
  Schedule,
  AttachMoney,
  Delete
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import ApplicationReviewDialog from '../../components/admin/ApplicationReviewDialog';
import { 
  getAllApplications, 
  updateApplicationStatus,
  APPLICATION_STATUS
} from '../../services/realWorldApplicationService';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');

  const statusColors = {
    [APPLICATION_STATUS.SUBMITTED]: 'info',
    [APPLICATION_STATUS.UNDER_REVIEW]: 'warning',
    [APPLICATION_STATUS.DOCUMENTS_REQUIRED]: 'warning',
    [APPLICATION_STATUS.APPROVED]: 'success',
    [APPLICATION_STATUS.REJECTED]: 'error',
    [APPLICATION_STATUS.COMPLETED]: 'success',
    [APPLICATION_STATUS.CANCELLED]: 'default'
  };

  const statusLabels = {
    [APPLICATION_STATUS.SUBMITTED]: 'Submitted',
    [APPLICATION_STATUS.UNDER_REVIEW]: 'Under Review',
    [APPLICATION_STATUS.DOCUMENTS_REQUIRED]: 'Documents Required',
    [APPLICATION_STATUS.APPROVED]: 'Approved',
    [APPLICATION_STATUS.REJECTED]: 'Rejected',
    [APPLICATION_STATUS.COMPLETED]: 'Completed',
    [APPLICATION_STATUS.CANCELLED]: 'Cancelled'
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      console.log('Loading applications...');
      const applicationsData = await getAllApplications();
      console.log('Applications loaded:', applicationsData.length, applicationsData);
      
      // Log what fields each application has
      applicationsData.forEach(app => {
        console.log('Application fields:', {
          id: app.id,
          applicationId: app.applicationId,
          applicantName: app.applicantName,
          serviceName: app.serviceName,
          serviceType: app.serviceType,
          status: app.status
        });
      });
      
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error(`Failed to load applications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateApplicationStatus(
        selectedApplication.id, 
        newStatus, 
        currentUser.uid, 
        statusComment.trim()
      );
      
      toast.success('Application status updated successfully');
      setStatusUpdateDialogOpen(false);
      setNewStatus('');
      setStatusComment('');
      setSelectedApplication(null);
      
      // Reload applications
      await loadApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../../services/firebase');
      
      await deleteDoc(doc(db, 'applications', applicationId));
      toast.success('Application deleted successfully');
      
      // Reload applications
      await loadApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application');
    }
  };

  const filteredApplications = applications.filter(app => {
    // If search term is empty, match all
    const matchesSearch = !searchTerm || 
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesService = serviceFilter === 'all' || app.serviceId === serviceFilter;

    console.log('Filtering app:', app.id, {
      matchesSearch,
      matchesStatus,
      matchesService,
      status: app.status,
      statusFilter,
      serviceId: app.serviceId,
      serviceFilter
    });

    return matchesSearch && matchesStatus && matchesService;
  });

  console.log('Filtered applications:', filteredApplications.length, 'out of', applications.length);

  const getServiceName = (serviceId) => {
    const serviceNames = {
      'birth-certificate': 'Birth Certificate',
      'death-certificate': 'Death Certificate',
      'marriage-certificate': 'Marriage Certificate',
      'income-certificate': 'Income Certificate',
      'caste-certificate': 'Caste Certificate',
      'domicile-certificate': 'Domicile Certificate',
      'bpl-certificate': 'BPL Certificate',
      'agricultural-subsidy': 'Agricultural Subsidy',
      'crop-insurance': 'Crop Insurance',
      'property-tax-payment': 'Property Tax Payment',
      'property-tax-assessment': 'Property Tax Assessment',
      'water-connection': 'Water Connection',
      'drainage-connection': 'Drainage Connection',
      'trade-license': 'Trade License',
      'building-permission': 'Building Permission',
      'school-transfer-certificate': 'School Transfer Certificate',
      'scholarship': 'Scholarship Application',
      'vaccination-certificate': 'Vaccination Certificate',
      'street-light-installation': 'Street Light Installation',
      'water-tax-payment': 'Water Tax Payment'
    };
    return serviceNames[serviceId] || serviceId;
  };

  const uniqueServices = [...new Set(applications.map(app => app.serviceId))];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <ChakraSpinner size="40px" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Application Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Monitor and manage all service applications
        </Typography>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{applications.length}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Applications
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {applications.filter(app => 
                        app.status === 'pending' || 
                        app.status === 'submitted' || 
                        app.status === APPLICATION_STATUS.SUBMITTED
                      ).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Review
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {applications.filter(app => app.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Person color="info" sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="h4">
                      {new Set(applications.map(app => app.userId)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unique Applicants
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_review">In Review</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Service</InputLabel>
                <Select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  label="Service"
                >
                  <MenuItem value="all">All Services</MenuItem>
                  {uniqueServices.map(serviceId => (
                    <MenuItem key={serviceId} value={serviceId}>
                      {getServiceName(serviceId)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setServiceFilter('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Applications Table */}
        {filteredApplications.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Applications Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {applications.length === 0 
                ? 'No applications have been submitted yet.' 
                : 'Try adjusting your search filters.'}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Application ID</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((application) => (
                    <TableRow key={application.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {application.applicationId || application.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getServiceName(application.serviceId)}
                      </TableCell>
                      <TableCell>
                        {application.applicantName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabels[application.status] || application.status}
                          color={statusColors[application.status] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {application.submittedAt ? 
                          (application.submittedAt instanceof Date ? 
                            format(application.submittedAt, 'MMM dd, yyyy') : 
                            new Date(application.submittedAt.seconds * 1000).toLocaleDateString()
                          ) : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedApplication(application);
                              setDetailsDialogOpen(true);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Review & Approve/Reject">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedApplication(application);
                              setReviewDialogOpen(true);
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedApplication(application);
                              setNewStatus(application.status);
                              setStatusUpdateDialogOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Application">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteApplication(application.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredApplications.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        )}

        {/* Application Details Dialog */}
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Application Details</DialogTitle>
          <DialogContent>
            {selectedApplication && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Application ID</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedApplication.applicationId || selectedApplication.id}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Service</Typography>
                  <Typography variant="body2" gutterBottom>
                    {getServiceName(selectedApplication.serviceId)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Applicant Name</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedApplication.applicantName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <Chip
                    label={statusLabels[selectedApplication.status] || selectedApplication.status}
                    color={statusColors[selectedApplication.status] || 'default'}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Submitted Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedApplication.submittedAt ? 
                      (selectedApplication.submittedAt instanceof Date ? 
                        format(selectedApplication.submittedAt, 'PPP') : 
                        new Date(selectedApplication.submittedAt.seconds * 1000).toLocaleDateString()
                      ) : 'N/A'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Last Updated</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedApplication.updatedAt ? 
                      (selectedApplication.updatedAt instanceof Date ? 
                        format(selectedApplication.updatedAt, 'PPP') : 
                        new Date(selectedApplication.updatedAt.seconds * 1000).toLocaleDateString()
                      ) : 'N/A'
                    }
                  </Typography>
                </Grid>
                {selectedApplication.statusComment && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Status Comment</Typography>
                    <Typography variant="body2" gutterBottom>
                      {selectedApplication.statusComment}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog
          open={statusUpdateDialogOpen}
          onClose={() => setStatusUpdateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 3, mt: 1 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="New Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Status Comment (Optional)"
              value={statusComment}
              onChange={(e) => setStatusComment(e.target.value)}
              placeholder="Add a comment about this status change..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusUpdateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Application Review Dialog */}
        <ApplicationReviewDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          application={selectedApplication}
          onStatusUpdate={loadApplications}
        />
      </Box>
    </Container>
  );
};

export default AdminApplications;
