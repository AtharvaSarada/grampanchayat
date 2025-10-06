import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  Cancel as RejectedIcon,
  Assignment as ApplicationIcon,
  Description as DocumentIcon,
  Payment as PaymentIcon,
  Verified as ApprovedIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { formatters } from '../../utils/formValidation';
import toast from 'react-hot-toast';

const ApplicationTracker = ({ applicationId, onClose }) => {
  const { currentUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    if (applicationId) {
      loadApplicationDetails();
    }
  }, [applicationId]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      
      // Load application details
      const appDoc = await getDoc(doc(db, 'applications', applicationId));
      if (appDoc.exists()) {
        const appData = { id: appDoc.id, ...appDoc.data() };
        setApplication(appData);
        
        // Load status history
        const historyQuery = query(
          collection(db, 'application_history'),
          where('applicationId', '==', applicationId),
          orderBy('timestamp', 'asc')
        );
        
        const unsubscribe = onSnapshot(historyQuery, (snapshot) => {
          const history = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
          }));
          setStatusHistory(history);
        });

        return () => unsubscribe();
      } else {
        toast.error('Application not found');
      }
    } catch (error) {
      console.error('Error loading application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return 'info';
      case 'under review': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'success';
      case 'payment pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return <ApplicationIcon />;
      case 'under review': return <PendingIcon />;
      case 'approved': return <ApprovedIcon />;
      case 'rejected': return <RejectedIcon />;
      case 'completed': return <CheckIcon />;
      case 'payment pending': return <PaymentIcon />;
      default: return <PendingIcon />;
    }
  };

  const getProgressPercentage = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return 25;
      case 'under review': return 50;
      case 'approved': return 75;
      case 'completed': return 100;
      case 'rejected': return 100;
      case 'payment pending': return 60;
      default: return 0;
    }
  };

  const applicationSteps = [
    {
      label: 'Application Submitted',
      description: 'Your application has been received and is in the queue for processing.',
      status: 'submitted'
    },
    {
      label: 'Document Verification',
      description: 'Documents are being verified by the concerned department.',
      status: 'under review'
    },
    {
      label: 'Application Review',
      description: 'Application is under review by the authorized officer.',
      status: 'under review'
    },
    {
      label: 'Approval/Rejection',
      description: 'Final decision has been made on your application.',
      status: 'approved'
    },
    {
      label: 'Certificate/Document Ready',
      description: 'Your certificate/document is ready for collection or download.',
      status: 'completed'
    }
  ];

  const getCurrentStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return 0;
      case 'under review': return 1;
      case 'approved': return 3;
      case 'completed': return 4;
      case 'rejected': return 3;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!application) {
    return (
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Application Not Found</DialogTitle>
        <DialogContent>
          <Alert severity="error">
            The requested application could not be found. Please check the application ID and try again.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Application Tracking</Typography>
          <Chip 
            label={application.status} 
            color={getStatusColor(application.status)}
            icon={getStatusIcon(application.status)}
          />
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Application Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Application Details
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Application ID" 
                      secondary={application.applicationId}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Service Type" 
                      secondary={application.serviceName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Submitted Date" 
                      secondary={formatters.date(application.submittedAt?.toDate?.())}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={formatters.date(application.updatedAt?.toDate?.())}
                    />
                  </ListItem>
                  {application.assignedTo && (
                    <ListItem>
                      <ListItemText 
                        primary="Assigned To" 
                        secondary={application.assignedTo}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Progress Tracking */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Progress Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">
                      {getProgressPercentage(application.status)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgressPercentage(application.status)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Stepper activeStep={getCurrentStepIndex(application.status)} orientation="vertical">
                  {applicationSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Typography variant="body2" fontWeight="medium">
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" color="text.secondary">
                          {step.description}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          {/* Status History */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Status History
                </Typography>
                {statusHistory.length > 0 ? (
                  <List>
                    {statusHistory.map((history, index) => (
                      <React.Fragment key={history.id}>
                        <ListItem>
                          <ListItemIcon>
                            {getStatusIcon(history.status)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">
                                  {history.status}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={formatters.date(history.timestamp)}
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={history.remarks || 'No additional remarks'}
                          />
                        </ListItem>
                        {index < statusHistory.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Alert severity="info">
                    No status history available yet.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Documents */}
          {application.documents && application.documents.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Uploaded Documents
                  </Typography>
                  <List>
                    {application.documents.map((doc, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <DocumentIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.name}
                          secondary={`Uploaded: ${formatters.date(doc.uploadedAt)}`}
                        />
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          View
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Actions */}
          {application.status === 'completed' && (
            <Grid item xs={12}>
              <Alert severity="success">
                <Typography variant="body1" gutterBottom>
                  <strong>Congratulations!</strong> Your application has been completed successfully.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ mt: 1 }}
                >
                  Download Certificate
                </Button>
              </Alert>
            </Grid>
          )}

          {application.status === 'rejected' && (
            <Grid item xs={12}>
              <Alert severity="error">
                <Typography variant="body1">
                  <strong>Application Rejected:</strong> {application.remarks || 'Please contact the office for more details.'}
                </Typography>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => window.print()}>
          Print Details
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationTracker;
