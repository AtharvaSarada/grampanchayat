import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Divider,
  Alert,
  Skeleton,
  CircularProgress
} from '@mui/material';
import {
  Assignment,
  AccountCircle,
  Notifications,
  TrendingUp,
  Schedule,
  CheckCircle,
  Warning,
  Info,
  AttachMoney,
  Description
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { subscribeToUserStatistics, getRecentApplications } from '../../services/statisticsService';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  // State for real-time user data
  const [userStats, setUserStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    totalAmountPaid: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Welcome to Gram Panchayat Services',
      message: 'Your digital gateway to government services is ready!',
      date: new Date().toISOString()
    },
    {
      id: 2,
      type: 'success',
      title: 'Service Updates Available',
      message: 'New online services have been added to the portal.',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Subscribe to user statistics and recent applications
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Subscribe to real-time user statistics
    const unsubscribeStats = subscribeToUserStatistics(user.uid, (stats) => {
      setUserStats(stats);
      setLoading(false);
    });

    // Load recent applications
    const loadRecentApplications = async () => {
      try {
        const applications = await getRecentApplications(user.uid, 3);
        setRecentApplications(applications);
      } catch (error) {
        console.error('Error loading recent applications:', error);
      }
    };

    loadRecentApplications();

    return () => {
      if (unsubscribeStats) unsubscribeStats();
    };
  }, [user?.uid]);

  const quickActions = [
    {
      title: 'Browse Services',
      description: 'Explore all available government services',
      icon: <Assignment color="primary" />,
      action: () => navigate('/services')
    },
    {
      title: 'Track Applications',
      description: 'Monitor your application status',
      icon: <Schedule color="primary" />,
      action: () => navigate('/my-applications')
    },
    {
      title: 'Pay Fees',
      description: 'Make online payments for services',
      icon: <AttachMoney color="primary" />,
      action: () => navigate('/payments')
    },
    {
      title: 'Download Forms',
      description: 'Access and download required forms',
      icon: <Description color="primary" />,
      action: () => navigate('/downloads')
    }
  ];

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Please login to access your dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 50%)' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                <AccountCircle sx={{ fontSize: 40 }} />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome, {user?.displayName || 'Citizen'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Access government services online and track your applications easily.
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment color="primary" sx={{ fontSize: 40, mb: 1 }} />
                {loading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography variant="h4" component="div" gutterBottom>
                    {userStats.totalApplications}
                  </Typography>
                )}
                <Typography color="text.secondary">
                  Total Applications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Schedule color="warning" sx={{ fontSize: 40, mb: 1 }} />
                {loading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography variant="h4" component="div" gutterBottom>
                    {userStats.pendingApplications}
                  </Typography>
                )}
                <Typography color="text.secondary">
                  Pending Applications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle color="success" sx={{ fontSize: 40, mb: 1 }} />
                {loading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography variant="h4" component="div" gutterBottom>
                    {userStats.completedApplications}
                  </Typography>
                )}
                <Typography color="text.secondary">
                  Completed Applications
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AttachMoney color="info" sx={{ fontSize: 40, mb: 1 }} />
                {loading ? (
                  <Skeleton variant="text" width={80} height={48} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography variant="h4" component="div" gutterBottom>
                    ₹{userStats.totalAmountPaid.toLocaleString()}
                  </Typography>
                )}
                <Typography color="text.secondary">
                  Total Amount Paid
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Recent Applications */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Recent Applications
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/my-applications')}
                  >
                    View All
                  </Button>
                </Box>
                <List>
                  {loading ? (
                    // Loading state
                    Array.from({ length: 3 }).map((_, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Skeleton variant="circular" width={24} height={24} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Skeleton variant="text" width="60%" />}
                            secondary={
                              <Box>
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="text" width="45%" />
                              </Box>
                            }
                          />
                          <Skeleton variant="rounded" width={80} height={24} />
                        </ListItem>
                        {index < 2 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : recentApplications.length > 0 ? (
                    // Real applications data
                    recentApplications.map((app, index) => (
                      <React.Fragment key={app.id}>
                        <ListItem>
                          <ListItemIcon>
                            <Assignment color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={app.serviceName}
                            secondary={
                              <Box>
                                <Typography variant="caption" display="block">
                                  Applied on: {new Date(app.applicationDate).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Expected: {new Date(app.estimatedCompletion).toLocaleDateString()}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip
                            label={app.status}
                            color={app.statusColor}
                            size="small"
                            variant="outlined"
                          />
                        </ListItem>
                        {index < recentApplications.length - 1 && <Divider />}
                      </React.Fragment>
                    ))
                  ) : (
                    // Empty state
                    <ListItem>
                      <ListItemText
                        primary="No applications yet"
                        secondary="Start by browsing available services and submitting your first application."
                        sx={{ textAlign: 'center', py: 4 }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 3,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        onClick={action.action}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {action.icon}
                          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                            {action.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Notifications color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Notifications
                  </Typography>
                </Box>
                <List>
                  {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {notification.type === 'success' && <CheckCircle color="success" />}
                          {notification.type === 'info' && <Info color="info" />}
                          {notification.type === 'warning' && <Warning color="warning" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={notification.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {notification.message}
                              </Typography>
                              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                {new Date(notification.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < notifications.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Button fullWidth size="small" sx={{ mt: 1 }}>
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserDashboard;
