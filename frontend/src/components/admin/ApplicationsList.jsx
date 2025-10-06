import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Visibility,
  Edit,
  CheckCircle,
  Cancel,
  Schedule,
  Assignment,
  Person,
  Phone,
  Email,
  LocationOn,
  AttachFile
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAllApplications, updateApplicationStatus, APPLICATION_STATUS } from '../../services/realWorldApplicationService';
import ChakraSpinner from '../common/ChakraSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ApplicationsList = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await getAllApplications();
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsDialogOpen(true);
  };

  const handleStatusUpdate = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setStatusUpdateDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication || !newStatus) return;

    try {
      await updateApplicationStatus(selectedApplication.id, newStatus, remarks, currentUser.uid);
      toast.success('Application status updated successfully');
      setStatusUpdateDialogOpen(false);
      setRemarks('');
      loadApplications(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return 'warning';
      case APPLICATION_STATUS.UNDER_REVIEW:
        return 'info';
      case APPLICATION_STATUS.APPROVED:
        return 'success';
      case APPLICATION_STATUS.REJECTED:
        return 'error';
      case APPLICATION_STATUS.COMPLETED:
        return 'success';
      default:
        return 'default';
    }
  };

  const getServiceDisplayName = (serviceType) => {
    const names = {
      'birth_certificate': 'Birth Certificate',
      'death_certificate': 'Death Certificate',
      'marriage_certificate': 'Marriage Certificate',
      'business_license': 'Business License',
      'income_certificate': 'Income Certificate',
      'caste_certificate': 'Caste Certificate',
      'water_connection': 'Water Connection'
    };
    return names[serviceType] || serviceType.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <ChakraSpinner size="40px" />
      </Box>
    );
  }

  if (!currentUser || !['staff', 'officer', 'admin'].includes(currentUser.role)) {
    return (
      <Alert severity="error">
        Access denied. Staff privileges required to view applications.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
        Applications Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application ID</TableCell>
              <TableCell>Service Type</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {application.id.substring(0, 12)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  {getServiceDisplayName(application.serviceType)}
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {application.applicationData?.applicantInfo?.name || 
                       application.applicationData?.childName || 
                       'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {application.applicationData?.applicantInfo?.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {application.createdAt ? 
                    format(application.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : 
                    'N/A'
                  }
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetails(application)}
                    size="small"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleStatusUpdate(application)}
                    size="small"
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Application Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Application Details
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Application ID
                        </Typography>
                        <Typography variant="body1" fontFamily="monospace">
                          {selectedApplication.id}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Service Type
                        </Typography>
                        <Typography variant="body1">
                          {getServiceDisplayName(selectedApplication.serviceType)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedApplication.status}
                          color={getStatusColor(selectedApplication.status)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Submitted Date
                        </Typography>
                        <Typography variant="body1">
                          {selectedApplication.createdAt ? 
                            format(selectedApplication.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : 
                            'N/A'
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Application Data
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(selectedApplication.applicationData, null, 2)}
                      </pre>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {selectedApplication.applicationData?.documentUrls && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <AttachFile sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Documents
                      </Typography>
                      {Object.entries(selectedApplication.applicationData.documentUrls).map(([type, doc]) => (
                        <Box key={type} sx={{ mb: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </Button>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={statusUpdateDialogOpen}
        onClose={() => setStatusUpdateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Application Status
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value={APPLICATION_STATUS.PENDING}>Pending</MenuItem>
                  <MenuItem value={APPLICATION_STATUS.UNDER_REVIEW}>Under Review</MenuItem>
                  <MenuItem value={APPLICATION_STATUS.APPROVED}>Approved</MenuItem>
                  <MenuItem value={APPLICATION_STATUS.REJECTED}>Rejected</MenuItem>
                  <MenuItem value={APPLICATION_STATUS.COMPLETED}>Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any remarks or comments..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={!newStatus}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationsList;
