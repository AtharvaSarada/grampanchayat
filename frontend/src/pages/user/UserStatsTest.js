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
  ListItemText,
  Chip,
  Divider,
  Alert,
  TextField,
  Skeleton,
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  AttachMoney,
  Person,
  Refresh,
  TrendingUp
} from '@mui/icons-material';
import { subscribeToUserStatistics, getRecentApplications } from '../../services/statisticsService';
import ChakraSpinner from '../../components/common/ChakraSpinner';

const UserStatsTest = () => {
  const [testUserId, setTestUserId] = useState('test-user-123');
  const [userStats, setUserStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    completedApplications: 0,
    totalAmountPaid: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadUserData = () => {
    if (!testUserId.trim()) {
      setError('Please enter a user ID');
      return;
    }

    setLoading(true);
    setError('');

    // Subscribe to real-time user statistics
    const unsubscribeStats = subscribeToUserStatistics(testUserId, (stats) => {
      setUserStats(stats);
      setLoading(false);
    });

    // Load recent applications
    const loadRecentApplications = async () => {
      try {
        const applications = await getRecentApplications(testUserId, 5);
        setRecentApplications(applications);
      } catch (error) {
        console.error('Error loading recent applications:', error);
        setError('Failed to load recent applications');
      }
    };

    loadRecentApplications();

    // Return cleanup function
    return () => {
      if (unsubscribeStats) unsubscribeStats();
    };
  };

  const handleTestUser1 = () => {
    setTestUserId('test-user-123');
  };

  const handleTestUser2 = () => {
    setTestUserId('test-user-456');
  };

  const handleNewUser = () => {
    setTestUserId('nonexistent-user');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 50%)' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Statistics Test Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test the user-specific statistics functionality with real Firebase data.
          </Typography>
        </Paper>

        {/* Test Controls */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test User Selection
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={handleTestUser1}
                startIcon={<Person />}
              >
                Test User 1 (has data)
              </Button>
              <Button
                variant="outlined"
                onClick={handleTestUser2}
                startIcon={<Person />}
              >
                Test User 2 (limited data)
              </Button>
              <Button
                variant="outlined"
                onClick={handleNewUser}
                startIcon={<Person />}
              >
                New User (no data)
              </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <TextField
                label="User ID"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                size="small"
                fullWidth
                sx={{ maxWidth: 300 }}
              />
              <Button
                variant="contained"
                onClick={loadUserData}
                startIcon={loading ? <ChakraSpinner size="20px" /> : <Refresh />}
                disabled={loading}
              >
                Load Data
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
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

        {/* Recent Applications */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="h2">
                Recent Applications
              </Typography>
            </Box>
            <List>
              {loading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={<Skeleton variant="text" width="60%" />}
                        secondary={
                          <Box>
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="text" width="45%" />
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < 2 && <Divider />}
                  </React.Fragment>
                ))
              ) : recentApplications.length > 0 ? (
                // Real applications data
                recentApplications.map((app, index) => (
                  <React.Fragment key={app.id}>
                    <ListItem>
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
                    primary="No applications found"
                    secondary={`User '${testUserId}' has no applications in the system.`}
                    sx={{ textAlign: 'center', py: 4 }}
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Test Instructions:
          </Typography>
          <Typography variant="body2">
            • <strong>test-user-123</strong>: Has 4 applications (2 completed, 2 pending, ₹850 total)
            <br />
            • <strong>test-user-456</strong>: Has 1 application (1 pending, ₹25 total)
            <br />
            • <strong>nonexistent-user</strong>: Has no applications (all zeros)
            <br />
            • The data updates in real-time when you change users or new applications are added.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default UserStatsTest;
