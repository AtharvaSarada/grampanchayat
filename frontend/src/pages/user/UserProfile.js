import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Security,
  Visibility,
  VisibilityOff,
  Assignment,
  History,
  Settings,
  Verified
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { updatePassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const UserProfile = () => {
  console.log('🔄 RENDER: UserProfile component rendered at', Date.now());
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log('📊 RENDER COUNT:', renderCount.current);
  
  // Detect React StrictMode
  const strictModeRef = useRef(false);
  useLayoutEffect(() => {
    if (strictModeRef.current) {
      console.log('⚠️ REACT STRICT MODE DETECTED - Double rendering enabled');
    } else {
      strictModeRef.current = true;
    }
  });
  
  const { currentUser, logout } = useAuth();
  
  // Track Firebase auth state changes
  useLayoutEffect(() => {
    console.log('🔥 FIREBASE AUTH STATE:', {
      uid: currentUser?.uid || 'null',
      email: currentUser?.email || 'null',
      timestamp: Date.now()
    });
  }, [currentUser]);
  
  // Check for external DOM manipulation
  useLayoutEffect(() => {
    const checkExternalManipulation = () => {
      const hasJQuery = typeof window.$ !== 'undefined';
      const hasOtherLibs = {
        jquery: hasJQuery,
        lodash: typeof window._ !== 'undefined',
        moment: typeof window.moment !== 'undefined'
      };
      console.log('🔍 EXTERNAL LIBRARIES:', hasOtherLibs);
      
      // Check for MutationObserver activity
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target.tagName === 'INPUT' || mutation.target.closest('input')) {
            console.log('⚠️ DOM MUTATION ON INPUT:', mutation);
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value', 'id', 'class']
      });
      
      return () => observer.disconnect();
    };
    
    const cleanup = checkExternalManipulation();
    return cleanup;
  }, []);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    dateOfBirth: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // [REQUIRES FIREBASE INTEGRATION] - Replace with real user application data
  const [userApplications] = useState([
    // [REQUIRES REAL DATA] - Connect to Firebase applications collection
    // TODO: Query user's applications: db.collection('applications').where('userId', '==', currentUser.uid)
  ]);
  
  // Load user profile data from Firebase Firestore
  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const newProfileData = {
              firstName: userData.firstName || currentUser?.displayName?.split(' ')[0] || '',
              lastName: userData.lastName || currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
              email: currentUser.email,
              phoneNumber: userData.phoneNumber || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              pincode: userData.pincode || '',
              occupation: userData.occupation || '',
              dateOfBirth: userData.dateOfBirth || ''
            };
            setProfileData(newProfileData);
          } else {
            // If no user document exists, create one with basic info
            const initialUserData = {
              firstName: currentUser?.displayName?.split(' ')[0] || '',
              lastName: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
              email: currentUser.email,
              phoneNumber: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
              occupation: '',
              dateOfBirth: '',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            await setDoc(userDocRef, initialUserData);
            setProfileData({
              firstName: initialUserData.firstName,
              lastName: initialUserData.lastName,
              email: initialUserData.email,
              phoneNumber: initialUserData.phoneNumber,
              address: initialUserData.address,
              city: initialUserData.city,
              state: initialUserData.state,
              pincode: initialUserData.pincode,
              occupation: initialUserData.occupation,
              dateOfBirth: initialUserData.dateOfBirth
            });
          }
        } catch (error) {
          console.error('Error loading user profile from Firestore:', error);
          toast.error('Failed to load profile data');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (currentUser?.uid && isLoading) {
      loadUserProfile();
    }
  }, [currentUser?.uid, isLoading]); // Include isLoading in dependency array
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Optimized input handler with stable reference and minimal re-renders
  const handleInputChange = useCallback((field) => {
    return (event) => {
      const value = event.target.value;
      const activeElement = document.activeElement;
      const elementId = activeElement?.id;
      
      console.log('🎯 INPUT CHANGE:', {
        field,
        value,
        activeElementId: elementId || 'no-id',
        activeElementTag: activeElement?.tagName,
        timestamp: Date.now()
      });
      
      // Use functional update to prevent unnecessary re-renders
      setProfileData(prev => {
        if (prev[field] === value) {
          console.log('⚡ SKIPPING UPDATE - Same value');
          return prev; // Don't update if value hasn't changed
        }
        
        const newState = { ...prev, [field]: value };
        console.log('💾 STATE UPDATE:', { field, oldValue: prev[field], newValue: value });
        return newState;
      });
      
      // Restore focus after React's render cycle
      if (elementId) {
        requestAnimationFrame(() => {
          const element = document.getElementById(elementId);
          if (element && element !== document.activeElement) {
            element.focus();
            // Restore cursor position for text inputs
            if (element.setSelectionRange && typeof element.selectionStart === 'number') {
              const cursorPos = element.value.length;
              element.setSelectionRange(cursorPos, cursorPos);
            }
          }
        });
      }
    };
  }, []);
  
  const handleSaveProfile = async () => {
    try {
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const updateData = {
          ...profileData,
          updatedAt: new Date()
        };
        
        await updateDoc(userDocRef, updateData);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile to Firestore:', error);
      toast.error('Failed to update profile');
    }
  };
  
  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      
      await updatePassword(auth.currentUser, passwordData.newPassword);
      toast.success('Password updated successfully!');
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update password. Please try again.');
    }
  };
  
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'under review': return 'warning';
      case 'rejected': return 'error';
      default: return 'info';
    }
  };
  
  // Memoized TabPanel to prevent unnecessary re-renders and maintain DOM structure
  const TabPanel = React.memo(({ children, value, index }) => {
    console.log('📝 TAB PANEL RENDER:', { index, isActive: value === index, timestamp: Date.now() });
    return (
      <Box 
        role="tabpanel" 
        sx={{ 
          py: 3,
          display: value === index ? 'block' : 'none'
        }}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
      >
        {children}
      </Box>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    const shouldNotRerender = 
      prevProps.value === nextProps.value &&
      prevProps.index === nextProps.index;
    
    console.log('🔄 TABPANEL MEMO CHECK:', {
      index: prevProps.index,
      prevValue: prevProps.value,
      nextValue: nextProps.value,
      shouldNotRerender,
      timestamp: Date.now()
    });
    
    return shouldNotRerender;
  });
  TabPanel.displayName = 'TabPanel';
  
  // Memoized Personal Info Form to prevent re-renders
  const PersonalInfoForm = React.memo(({ profileData, isEditing, handleInputChange }) => {
    console.log('📄 PERSONAL INFO FORM RENDER:', { timestamp: Date.now(), isEditing });
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              First Name
            </Typography>
            <input
              key="firstName"
              id="input-firstName"
              type="text"
              value={profileData.firstName}
              onChange={handleInputChange('firstName')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: firstName');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: firstName');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Last Name
            </Typography>
            <input
              key="lastName"
              id="input-lastName"
              type="text"
              value={profileData.lastName}
              onChange={handleInputChange('lastName')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: lastName');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: lastName');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            value={profileData.email}
            disabled
            helperText="Email cannot be changed. Contact support if needed."
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Phone Number
            </Typography>
            <input
              key="phoneNumber"
              id="input-phoneNumber"
              type="tel"
              value={profileData.phoneNumber}
              onChange={handleInputChange('phoneNumber')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: phoneNumber');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: phoneNumber');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Address
            </Typography>
            <textarea
              key="address"
              id="input-address"
              value={profileData.address}
              onChange={handleInputChange('address')}
              disabled={!isEditing}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s',
                resize: 'vertical'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: address');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: address');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              City
            </Typography>
            <input
              key="city"
              id="input-city"
              type="text"
              value={profileData.city}
              onChange={handleInputChange('city')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: city');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: city');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              State
            </Typography>
            <input
              key="state"
              id="input-state"
              type="text"
              value={profileData.state}
              onChange={handleInputChange('state')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: state');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: state');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              PIN Code
            </Typography>
            <input
              key="pincode"
              id="input-pincode"
              type="text"
              value={profileData.pincode}
              onChange={handleInputChange('pincode')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: pincode');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: pincode');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Occupation
            </Typography>
            <input
              key="occupation"
              id="input-occupation"
              type="text"
              value={profileData.occupation}
              onChange={handleInputChange('occupation')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: occupation');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: occupation');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Date of Birth
            </Typography>
            <input
              key="dateOfBirth"
              id="input-dateOfBirth"
              type="date"
              value={profileData.dateOfBirth}
              onChange={handleInputChange('dateOfBirth')}
              disabled={!isEditing}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: isEditing ? '1px solid #c4c4c4' : '1px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '16px',
                fontFamily: 'inherit',
                backgroundColor: isEditing ? '#fff' : '#fafafa',
                color: isEditing ? '#000' : '#666',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                console.log('🎯 FOCUS: dateOfBirth');
                if (isEditing) e.target.style.borderColor = '#1976d2';
              }}
              onBlur={(e) => {
                console.log('🔲 BLUR: dateOfBirth');
                e.target.style.borderColor = '#c4c4c4';
              }}
            />
          </Box>
        </Grid>
      </Grid>
    );
  }, (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    const isEqual = 
      prevProps.isEditing === nextProps.isEditing &&
      JSON.stringify(prevProps.profileData) === JSON.stringify(nextProps.profileData);
    
    console.log('🔄 PERSONAL FORM MEMO CHECK:', {
      isEqual,
      prevEditing: prevProps.isEditing,
      nextEditing: nextProps.isEditing,
      timestamp: Date.now()
    });
    
    return isEqual;
  });
  
  PersonalInfoForm.displayName = 'PersonalInfoForm';
  
  return (
    <Container maxWidth="lg">
      
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Profile Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem'
                }}
              >
                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom color="primary">
                {profileData.firstName} {profileData.lastName}
                {currentUser?.emailVerified && (
                  <Verified color="success" sx={{ ml: 1, verticalAlign: 'middle' }} />
                )}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {profileData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant={isEditing ? "contained" : "outlined"}
                startIcon={isEditing ? <Save /> : <Edit />}
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <IconButton onClick={() => setIsEditing(false)} sx={{ ml: 1 }}>
                  <Cancel />
                </IconButton>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {/* Profile Tabs */}
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab icon={<Person />} label="Personal Info" />
              <Tab icon={<Assignment />} label="My Applications" />
              <Tab icon={<Security />} label="Account Security" />
              <Tab icon={<Settings />} label="Settings" />
            </Tabs>
          </Box>
          
          {/* Personal Information Tab */}
          <TabPanel key="personal-info-tab" value={activeTab} index={0}>
            <PersonalInfoForm 
              profileData={profileData}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
          </TabPanel>
          
          {/* Applications Tab */}
          <TabPanel key="applications-tab" value={activeTab} index={1}>
            <Typography variant="h6" gutterBottom color="primary">
              My Applications
            </Typography>
            {userApplications.length > 0 ? (
              <Grid container spacing={2}>
                {userApplications.map((app) => (
                  <Grid item xs={12} key={app.id}>
                    <Card>
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="h6">{app.serviceName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {app.id}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={2}>
                            <Box
                              sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                                bgcolor: `${getStatusColor(app.status)}.light`,
                                color: `${getStatusColor(app.status)}.dark`,
                                textAlign: 'center',
                                fontWeight: 'bold'
                              }}
                            >
                              {app.status}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body2" color="text.secondary">
                              Submitted: {app.submittedDate}
                            </Typography>
                            {app.expectedCompletion && (
                              <Typography variant="body2" color="text.secondary">
                                Expected: {app.expectedCompletion}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button size="small" variant="outlined">
                                View Details
                              </Button>
                              <Button size="small" variant="outlined">
                                Track Status
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                You haven't submitted any applications yet. 
                <Button href="/services" sx={{ ml: 1 }}>Browse Services</Button>
              </Alert>
            )}
          </TabPanel>
          
          {/* Security Tab */}
          <TabPanel key="security-tab" value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom color="primary">
              Account Security
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Password & Authentication
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Security color={currentUser?.emailVerified ? 'success' : 'warning'} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email Verification"
                          secondary={currentUser?.emailVerified ? 'Verified' : 'Not verified - please check your email'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Security color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Password"
                          secondary="Last updated: Recently"
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setShowPasswordDialog(true)}
                        >
                          Change Password
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          {/* Settings Tab */}
          <TabPanel key="settings-tab" value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom color="primary">
              Account Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="error">
                      Danger Zone
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      These actions are permanent and cannot be undone.
                    </Alert>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={logout}
                    >
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
        
        {/* Change Password Dialog */}
        <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  key="currentPassword"
                  fullWidth
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  key="newPassword"
                  fullWidth
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  helperText="Minimum 6 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  key="confirmPassword"
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">Update Password</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserProfile;
