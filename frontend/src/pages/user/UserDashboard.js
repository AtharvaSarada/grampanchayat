import React, { useState, useEffect, useMemo } from 'react';
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
  Tabs,
  Tab
} from '@mui/material';
import {
  Assignment,
  AccountCircle,
  Notifications,
  Schedule,
  CheckCircle,
  Info,
  Warning,
  AttachMoney,
  Description,
  Dashboard,
  Build,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { subscribeToUserStatistics, getRecentApplications, getTotalServices } from '../../services/statisticsService';


import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageProvider';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { currentUser } = useAuth();
  const { language, t: translate } = useLanguage();
  
  // Use the global translation system with dashboard.user prefix
  const t = (key, fallback = '') => {
    try {
      const translation = translate(`dashboard.user.${key}`);
      // Ensure we always return a non-empty string to prevent MUI capitalize errors
      if (typeof translation === 'string' && translation.trim() !== '') {
        return translation;
      }
      // Return fallback or key as string
      return fallback || String(key);
    } catch (error) {
      console.warn(`Translation error for key: dashboard.user.${key}`, error);
      return fallback || String(key);
    }
  };
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // State for real-time user data
  const [userStats, setUserStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    totalAmountPaid: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  // Use useMemo to ensure notifications are properly initialized with translations
  const notifications = useMemo(() => [
    {
      id: 1,
      type: 'info',
      title: t('welcomeNotification', 'Welcome to Gram Panchayat Services'),
      message: t('welcomeNotificationMsg', 'Your digital gateway to government services is ready!'),
      date: new Date().toISOString()
    },
    {
      id: 2,
      type: 'success',
      title: t('serviceUpdates', 'Service Updates Available'),
      message: t('serviceUpdatesMsg', 'New online services have been added to the portal.'),
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ], [language, translate]);

  // Subscribe to user statistics and recent applications
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    console.log('🔍 UserDashboard: Setting up statistics for user:', currentUser.uid);

    // Subscribe to real-time user statistics
    const unsubscribeStats = subscribeToUserStatistics(currentUser.uid, (stats) => {
      console.log('📊 UserDashboard: Received stats update:', stats);
      setUserStats(stats);
      setLoading(false); // Set loading to false once user stats are loaded
    });

    // Load recent applications
    const loadRecentApplications = async () => {
      try {
        console.log('🔍 UserDashboard: Loading recent applications for user:', currentUser.uid);
        const applications = await getRecentApplications(currentUser.uid, 3);
        console.log('📊 UserDashboard: Recent applications loaded:', applications.length, applications);
        setRecentApplications(applications);
      } catch (error) {
        console.error('❌ UserDashboard: Error loading recent applications:', error);
      }
    };
    
    // Load total services count
    const loadTotalServices = async () => {
      try {
        const count = await getTotalServices();
        setTotalServices(count);
      } catch (error) {
        console.error('Error loading total services:', error);
      }
    };

    loadRecentApplications();
    loadTotalServices(); // ADDED FUNCTION CALL

    return () => {
      if (unsubscribeStats) unsubscribeStats();
    };
  }, [currentUser?.uid]);

  // Use useMemo to ensure quickActions are properly initialized with translations
  const quickActions = useMemo(() => [
    {
      title: t('browseServices', 'Browse Services'),
      description: t('browseServicesMsg', 'Explore all available government services'),
      icon: <Assignment color="primary" />,
      action: () => navigate('/services')
    },
    {
      title: t('trackApplications', 'Track Applications'),
      description: t('trackApplicationsMsg', 'Monitor your application status'),
      icon: <Schedule color="primary" />,
      action: () => navigate('/my-applications')
    },
    {
      title: t('payFees', 'Pay Fees'),
      description: t('payFeesMsg', 'Make online payments for services'),
      icon: <AttachMoney color="primary" />,
      action: () => navigate('/payments')
    },
    {
      title: t('downloadForms', 'Download Forms'),
      description: t('downloadFormsMsg', 'Access and download required forms'),
      icon: <Description color="primary" />,
      action: () => navigate('/downloads')
    }
  ], [language, navigate, translate]);

  // Add safety check for translation system
  if (!translate) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

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
                {t('welcome') || 'Welcome'}, {currentUser?.displayName || user?.displayName || 'Citizen'}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('welcomeMsg') || 'Access government services online and track your applications easily.'}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => navigate('/profile')}
              >
                {t('viewProfile') || 'View Profile'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* ADDED THIS NEW CARD */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Info color="primary" sx={{ fontSize: 40, mb: 1 }} />
                {loading ? (
                  <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto' }} />
                ) : (
                  <Typography variant="h4" component="div" gutterBottom>
                    {totalServices}
                  </Typography>
                )}
                <Typography color="text.secondary">
                  {t('servicesAvailable') || 'Services Available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
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
                  {t('totalApplications') || 'Total Applications'}
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
                  {t('pendingApplications') || 'Pending Applications'}
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
                  {t('completedApplications') || 'Completed Applications'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* This card was removed to make space for the Services Available card. 
              If you want 5 cards, you'd need to adjust the Grid layout (e.g., to use lg={2.4}) */}
        </Grid>

        <Grid container spacing={4}>
          {/* Recent Applications */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {t('recentApplications') || 'Recent Applications'}
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/my-applications')}
                  >
                    {t('viewAll') || 'View All'}
                  </Button>
                </Box>
                <List>
                  {loading && recentApplications.length === 0 ? (
                    // Loading state
                    Array.from({ length: 3 }).map((_, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Skeleton variant="circular" width={24} height={24} />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Skeleton variant="text" width="60%" />}
                            secondary={<Skeleton variant="text" width="40%" />}
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
                            secondary={`${t('appliedOn') || 'Applied on:'} ${new Date(app.applicationDate).toLocaleDateString()}`}
                          />
                          <Chip
                            label={app.status || 'Pending'}
                            color={
                              app.statusColor && ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'].includes(app.statusColor) 
                                ? app.statusColor 
                                : 'default'
                            }
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
                        primary={t('noAppsYet') || 'No applications yet'}
                        secondary={t('noAppsYetMsg') || 'Start by browsing available services and submitting your first application.'}
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
                  {t('quickActions') || 'Quick Actions'}
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
                    {t('notifications') || 'Notifications'}
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
                  {t('viewAllNotifications') || 'View All Notifications'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced User Features Tabs */}
        <Paper elevation={3} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': { opacity: 0.3 }
                }
              }}
            >
              <Tab icon={<Dashboard />} label={t('overview') || 'Overview'} />
              <Tab icon={<Assignment />} label={t('myApplications') || 'My Applications'} />
              <Tab icon={<Build />} label={t('services') || 'Services'} />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>{t('dashboardOverview') || 'Dashboard Overview'}</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{t('recentActivity') || 'Recent Activity'}</Typography>
                        <List>
                          {recentApplications.slice(0, 3).map((app, index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                <Assignment />
                              </ListItemIcon>
                              <ListItemText
                                primary={`${t('application') || 'Application'} #${app.id?.substring(0, 8)}`}
                                secondary={`${t('status') || 'Status'}: ${app.status || 'Pending'} - ${new Date(app.submittedAt).toLocaleDateString()}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{t('quickActions') || 'Quick Actions'}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Button variant="outlined" onClick={() => navigate('/services')}>
                            {t('browseServices') || 'Browse Services'}
                          </Button>
                          <Button variant="outlined" onClick={() => navigate('/my-applications')}>
                            {t('viewApplications') || 'View Applications'}
                          </Button>
                          <Button variant="outlined" onClick={() => navigate('/profile')}>
                            {t('updateProfile') || 'Update Profile'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>{t('myApplications') || 'My Applications'}</Typography>
                {recentApplications.length === 0 ? (
                  <Alert severity="info">
                    {t('noAppsFound') || 'No applications found.'} <Button onClick={() => navigate('/services')}>{t('applyForServices') || 'Apply for Services'}</Button>
                  </Alert>
                ) : (
                  <Grid container spacing={2}>
                    {recentApplications.map((app, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1">
                                {t('application') || 'Application'} #{app.id?.substring(0, 8)}
                              </Typography>
                              <Chip 
                                label={app.status || 'Pending'} 
                                color={app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'error' : 'warning'}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {t('service') || 'Service'}: {app.serviceName || app.serviceId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {t('submitted') || 'Submitted'}: {new Date(app.applicationDate || app.submittedAt).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>{t('availableServices') || 'Available Services'}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('availableServicesMsg') || 'Browse and apply for government services online.'}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/services')}
                  sx={{ mt: 2 }}
                >
                  {t('viewAllServices') || 'View All Services'}
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserDashboard;