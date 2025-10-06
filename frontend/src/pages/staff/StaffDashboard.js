import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Visibility,
  Edit,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { getAllApplications } from '../../services/realWorldApplicationService';
import ApplicationReviewDialog from '../../components/admin/ApplicationReviewDialog';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    completed: 0
  });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const applicationsData = await getAllApplications();
      setApplications(applicationsData);
      
      // Calculate stats
      setStats({
        total: applicationsData.length,
        pending: applicationsData.filter(app => app.status === 'pending').length,
        underReview: applicationsData.filter(app => app.status === 'under_review').length,
        completed: applicationsData.filter(app => app.status === 'completed' || app.status === 'approved').length
      });
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'under_review': return 'info';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const statusLabels = {
    'pending': 'Pending',
    'under_review': 'Under Review',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'completed': 'Completed'
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
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
            Staff Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review and process service applications
          </Typography>
        </Paper>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment color="primary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.total}</Typography>
                    <Typography color="text.secondary">Total Applications</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment color="warning" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.pending}</Typography>
                    <Typography color="text.secondary">Pending Review</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Assignment color="info" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.underReview}</Typography>
                    <Typography color="text.secondary">Under Review</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4">{stats.completed}</Typography>
                    <Typography color="text.secondary">Completed</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Applications Table */}
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab icon={<Assignment />} label="All Applications" />
              <Tab icon={<DashboardIcon />} label="Overview" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <TableContainer>
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
                    {applications.slice(0, 20).map((application) => (
                      <TableRow key={application.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {application.applicationId || application.id.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{application.serviceName || application.serviceType}</TableCell>
                        <TableCell>{application.applicantName || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={statusLabels[application.status] || application.status}
                            color={getStatusColor(application.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {application.submittedAt ? 
                            new Date(application.submittedAt.seconds * 1000).toLocaleDateString() : 
                            'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Review Application">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome to the Staff Dashboard. Use the "All Applications" tab to review and process applications.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Application Review Dialog */}
        {selectedApplication && (
          <ApplicationReviewDialog
            open={reviewDialogOpen}
            onClose={() => {
              setReviewDialogOpen(false);
              setSelectedApplication(null);
            }}
            application={selectedApplication}
            onStatusUpdate={loadApplications}
          />
        )}
      </Box>
    </Container>
  );
};

export default StaffDashboard;
