import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility,
  Search,
  FilterList,
  Download,
  History,
  AttachFile
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { 
  getUserApplications, 
  getServiceDisplayName, 
  APPLICATION_STATUS 
} from '../../services/applicationService';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: APPLICATION_STATUS.PENDING },
    { label: 'Under Review', value: APPLICATION_STATUS.UNDER_REVIEW },
    { label: 'Approved', value: APPLICATION_STATUS.APPROVED },
    { label: 'Rejected', value: APPLICATION_STATUS.REJECTED },
    { label: 'Completed', value: APPLICATION_STATUS.COMPLETED }
  ];

  useEffect(() => {
    if (currentUser) {
      loadApplications();
    }
  }, [currentUser]);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedTab, searchTerm]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const userApps = await getUserApplications(currentUser.uid);
      setApplications(userApps);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status
    if (selectedTab > 0) {
      const statusValue = statusTabs[selectedTab].value;
      filtered = filtered.filter(app => app.status === statusValue);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(app => 
        getServiceDisplayName(app.serviceType).toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.applicationData?.childName || app.applicationData?.applicantName || '')
          .toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case APPLICATION_STATUS.PENDING:
        return <Schedule />;
      case APPLICATION_STATUS.UNDER_REVIEW:
        return <Assignment />;
      case APPLICATION_STATUS.APPROVED:
      case APPLICATION_STATUS.COMPLETED:
        return <CheckCircle />;
      case APPLICATION_STATUS.REJECTED:
        return <Cancel />;
      default:
        return <Assignment />;
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailsDialogOpen(true);
  };

  const formatDate = (timestamp) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString('en-IN');
    }
    return new Date(timestamp).toLocaleDateString('en-IN');
  };

  const renderApplicationCard = (application) => {
    const serviceDisplayName = getServiceDisplayName(application.serviceType);
    const applicantName = application.applicationData?.childName || 
                         application.applicationData?.applicantName || 
                         application.applicationData?.informantName || 
                         'N/A';

    return (
      <Grid item xs={12} md={6} lg={4} key={application.id}>
        <Card 
          elevation={2} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            transition: 'all 0.3s ease',
            '&:hover': {
              elevation: 4,
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h3" noWrap>
                {serviceDisplayName}
              </Typography>
              <Chip 
                icon={getStatusIcon(application.status)}
                label={application.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(application.status)}
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Applicant:</strong> {applicantName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Application ID:</strong> {application.id.substring(0, 20)}...
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Submitted:</strong> {formatDate(application.createdAt)}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> {formatDate(application.updatedAt)}
            </Typography>

            {application.statusHistory && application.statusHistory.length > 1 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Status changed {application.statusHistory.length} times
                </Typography>
              </Box>
            )}
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Button 
              size="small" 
              onClick={() => handleViewDetails(application)}
              startIcon={<Visibility />}
            >
              View Details
            </Button>
            
            {application.status === APPLICATION_STATUS.COMPLETED && (
              <Button 
                size="small" 
                color="primary"
                startIcon={<Download />}
              >
                Download
              </Button>
            )}
          </CardActions>
        </Card>
      </Grid>
    );
  };

  const renderDetailsDialog = () => {
    if (!selectedApplication) return null;

    const serviceDisplayName = getServiceDisplayName(selectedApplication.serviceType);
    
    return (
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assignment />
            {serviceDisplayName} - Application Details
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Basic Information
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Application ID" 
                    secondary={selectedApplication.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Service Type" 
                    secondary={serviceDisplayName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Current Status" 
                    secondary={
                      <Chip 
                        icon={getStatusIcon(selectedApplication.status)}
                        label={selectedApplication.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(selectedApplication.status)}
                        size="small"
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Submitted On" 
                    secondary={formatDate(selectedApplication.createdAt)}
                  />
                </ListItem>
              </List>
            </Grid>

            {/* Application Data Preview */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Application Details
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                {Object.entries(selectedApplication.applicationData || {}).map(([key, value]) => {
                  if (key === 'supportingDocuments' || key === 'documentUrls') return null;
                  
                  return (
                    <Box key={key} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </Typography>
                      <Typography variant="body2">
                        {value || 'N/A'}
                      </Typography>
                    </Box>
                  );
                })}
              </Paper>
            </Grid>

            {/* Documents */}
            {selectedApplication.applicationData?.documentUrls && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  <AttachFile sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Uploaded Documents
                </Typography>
                
                <List dense>
                  {selectedApplication.applicationData.documentUrls.map((url, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <AttachFile />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Document ${index + 1}`}
                        secondary={
                          <Button 
                            size="small" 
                            onClick={() => window.open(url, '_blank')}
                          >
                            View Document
                          </Button>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            )}

            {/* Status History */}
            {selectedApplication.statusHistory && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  <History sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Status History
                </Typography>
                
                <List dense>
                  {selectedApplication.statusHistory.map((entry, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {getStatusIcon(entry.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={entry.status.replace('_', ' ').toUpperCase()}
                          secondary={
                            <Box>
                              <Typography variant="caption" display="block">
                                {entry.remarks || 'Status updated'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(entry.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < selectedApplication.statusHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>
            Close
          </Button>
          {selectedApplication.status === APPLICATION_STATUS.COMPLETED && (
            <Button variant="contained" startIcon={<Download />}>
              Download Certificate
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track the status of all your submitted applications
          </Typography>
        </Paper>

        {/* Search and Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterList />
                <Typography variant="body2">
                  Showing {filteredApplications.length} of {applications.length} applications
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Status Tabs */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs 
            value={selectedTab} 
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {statusTabs.map((tab, index) => (
              <Tab 
                key={tab.value} 
                label={`${tab.label} (${
                  tab.value === 'all' 
                    ? applications.length 
                    : applications.filter(app => app.status === tab.value).length
                })`}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Applications Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredApplications.length > 0 ? (
          <Grid container spacing={3}>
            {filteredApplications.map(renderApplicationCard)}
          </Grid>
        ) : (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {searchTerm || selectedTab > 0 ? 'No applications found' : 'No applications yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {searchTerm || selectedTab > 0 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t submitted any applications yet. Start by applying for a service.'
              }
            </Typography>
            {!searchTerm && selectedTab === 0 && (
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                href="/services"
              >
                Browse Services
              </Button>
            )}
          </Paper>
        )}

        {/* Details Dialog */}
        {renderDetailsDialog()}
      </Box>
    </Container>
  );
};

export default MyApplications;
