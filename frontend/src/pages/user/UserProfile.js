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
  Verified,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { updatePassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import MyApplications from './MyApplications';
import { useLanguage } from '../../i18n/LanguageProvider';

const translations = {
  en: {
    role: "Role:",
    memberSince: "Member since",
    recentlyJoined: "Recently joined",
    saveChanges: "Save Changes",
    editProfile: "Edit Profile",
    refreshRole: "Refresh Role",
    personalInfo: "Personal Info",
    myApplications: "My Applications",
    accountSecurity: "Account Security",
    settings: "Settings",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    emailNotChangeable: "Email cannot be changed. Contact support if needed.",
    phoneNumber: "Phone Number",
    address: "Address",
    city: "City",
    state: "State",
    pinCode: "PIN Code",
    occupation: "Occupation",
    dateOfBirth: "Date of Birth",
    passwordAndAuth: "Password & Authentication",
    emailVerification: "Email Verification",
    verified: "Verified",
    notVerified: "Not verified - please check your email",
    password: "Password",
    lastUpdated: "Last updated: Recently",
    changePassword: "Change Password",
    accountSettings: "Account Settings",
    dangerZone: "Danger Zone",
    dangerZoneMsg: "These actions are permanent and cannot be undone.",
    signOut: "Sign Out",
    currentPassword: "Current Password",
    newPassword: "New Password",
    min6Chars: "Minimum 6 characters",
    confirmNewPassword: "Confirm New Password",
    cancel: "Cancel",
    updatePassword: "Update Password",
    profileUpdateSuccess: "Profile updated successfully!",
    profileUpdateFailed: "Failed to update profile",
    passwordsNoMatch: "New passwords do not match",
    passwordTooShort: "Password must be at least 6 characters long",
    passwordUpdateSuccess: "Password updated successfully!",
    passwordUpdateFailed: "Failed to update password. Please try again.",
    loadProfileFailed: "Failed to load profile data"
  },
  mr: {
    role: "भूमिका:",
    memberSince: "सदस्य झाल्याची तारीख",
    recentlyJoined: "अलीकडेच सामील झाले",
    saveChanges: "बदल जतन करा",
    editProfile: "प्रोफाइल संपादित करा",
    refreshRole: "भूमिका रिफ्रेश करा",
    personalInfo: "वैयक्तिक माहिती",
    myApplications: "माझे अर्ज",
    accountSecurity: "खाते सुरक्षा",
    settings: "सेटिंग्ज",
    firstName: "पहिले नाव",
    lastName: "आडनाव",
    emailAddress: "ईमेल पत्ता",
    emailNotChangeable: "ईमेल बदलता येणार नाही. गरज भासल्यास सपोर्टशी संपर्क साधा.",
    phoneNumber: "फोन नंबर",
    address: "पत्ता",
    city: "शहर",
    state: "राज्य",
    pinCode: "पिन कोड",
    occupation: "व्यवसाय",
    dateOfBirth: "जन्मतारीख",
    passwordAndAuth: "पासवर्ड आणि प्रमाणीकरण",
    emailVerification: "ईमेल पडताळणी",
    verified: "पडताळले",
    notVerified: "पडताळलेले नाही - कृपया तुमचा ईमेल तपासा",
    password: "पासवर्ड",
    lastUpdated: "शेवटचे अपडेट: अलीकडेच",
    changePassword: "पासवर्ड बदला",
    accountSettings: "खाते सेटिंग्ज",
    dangerZone: "धोकादायक क्षेत्र",
    dangerZoneMsg: "या क्रिया कायमस्वरूपी आहेत आणि पूर्ववत केल्या जाऊ शकत नाहीत.",
    signOut: "साइन आउट करा",
    currentPassword: "सध्याचा पासवर्ड",
    newPassword: "नवीन पासवर्ड",
    min6Chars: "किमान ६ अक्षरे",
    confirmNewPassword: "नवीन पासवर्डची पुष्टी करा",
    cancel: "रद्द करा",
    updatePassword: "पासवर्ड अपडेट करा",
    profileUpdateSuccess: "प्रोफाइल यशस्वीरित्या अपडेट केले!",
    profileUpdateFailed: "प्रोफाइल अपडेट करण्यात अयशस्वी",
    passwordsNoMatch: "नवीन पासवर्ड जुळत नाहीत",
    passwordTooShort: "पासवर्ड किमान ६ अक्षरे लांब असणे आवश्यक आहे",
    passwordUpdateSuccess: "पासवर्ड यशस्वीरित्या अपडेट केला!",
    passwordUpdateFailed: "पासवर्ड अपडेट करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
    loadProfileFailed: "प्रोफाइल डेटा लोड करण्यात अयशस्वी"
  }
};

// Move PersonalInfoForm outside to prevent recreation on every render
const PersonalInfoForm = React.memo(({ profileData, isEditing, handleInputChange, t }) => {
  return (
    <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('firstName', 'First Name')}
          </Typography>
          <input
            key="firstName"
            id="input-firstName"
            type="text"
            value={profileData.firstName || ''}
            onChange={handleInputChange('firstName')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('lastName', 'Last Name')}
          </Typography>
          <input
            key="lastName"
            id="input-lastName"
            type="text"
            value={profileData.lastName || ''}
            onChange={handleInputChange('lastName')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <TextField
            fullWidth
            label={t('emailAddress', 'Email Address')}
            value={profileData.email || ''}
            disabled
            helperText={t('emailNotChangeable', 'Email cannot be changed. Contact support if needed.')}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                }
              }
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('phoneNumber', 'Phone Number')}
          </Typography>
          <input
            key="phoneNumber"
            id="input-phoneNumber"
            type="tel"
            value={profileData.phoneNumber || ''}
            onChange={handleInputChange('phoneNumber')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('address', 'Address')}
          </Typography>
          <textarea
            key="address"
            id="input-address"
            value={profileData.address || ''}
            onChange={handleInputChange('address')}
            disabled={!isEditing}
            rows={4}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              resize: 'vertical',
              minHeight: '100px',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('city', 'City')}
          </Typography>
          <input
            key="city"
            id="input-city"
            type="text"
            value={profileData.city || ''}
            onChange={handleInputChange('city')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('state', 'State')}
          </Typography>
          <input
            key="state"
            id="input-state"
            type="text"
            value={profileData.state || ''}
            onChange={handleInputChange('state')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('pinCode', 'PIN Code')}
          </Typography>
          <input
            key="pincode"
            id="input-pincode"
            type="text"
            value={profileData.pincode || ''}
            onChange={handleInputChange('pincode')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('occupation', 'Occupation')}
          </Typography>
          <input
            key="occupation"
            id="input-occupation"
            type="text"
            value={profileData.occupation || ''}
            onChange={handleInputChange('occupation')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '0.875rem' }
            }}
          >
            {t('dateOfBirth', 'Date of Birth')}
          </Typography>
          <input
            key="dateOfBirth"
            id="input-dateOfBirth"
            type="date"
            value={profileData.dateOfBirth || ''}
            onChange={handleInputChange('dateOfBirth')}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: isEditing ? '2px solid #1976d2' : '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: isEditing ? '#fff' : '#fafafa',
              color: isEditing ? '#000' : '#666',
              outline: 'none',
              transition: 'all 0.2s ease-in-out',
              boxShadow: isEditing ? '0 2px 4px rgba(25, 118, 210, 0.1)' : 'none'
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
});

PersonalInfoForm.displayName = 'PersonalInfoForm';

// Move TabPanel outside to prevent recreation on every render
const TabPanel = React.memo(({ children, value, index }) => {
  return (
    <Box 
      role="tabpanel" 
      sx={{ 
        p: { xs: 2, sm: 3, md: 4 },
        display: value === index ? 'block' : 'none',
        minHeight: '400px'
      }}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {children}
    </Box>
  );
});
TabPanel.displayName = 'TabPanel';

// Move getStatusColor outside to prevent recreation on every render
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'under review': return 'warning';
    case 'rejected': return 'error';
    default: return 'info';
  }
};

const UserProfile = () => {
  const { currentUser, logout, refreshUserData } = useAuth();
  const { language, t: translate } = useLanguage();
  const t = (key, fallback = '') => {
    try {
      // First try to get from local translations
      const localTranslation = translations[language] && translations[language][key];
      if (localTranslation && typeof localTranslation === 'string' && localTranslation.trim() !== '') {
        return localTranslation;
      }
      
      // If fallback is provided, use it directly
      if (fallback && typeof fallback === 'string' && fallback.trim() !== '') {
        return fallback;
      }
      
      // Last resort: try global translation or return key
      const globalTranslation = translate(key);
      if (globalTranslation && typeof globalTranslation === 'string' && globalTranslation.trim() !== '' && globalTranslation !== key) {
        return globalTranslation;
      }
      
      return String(key);
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return fallback || String(key);
    }
  };
  
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
  
  const [userApplications] = useState([]);
  
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
          toast.error(t('loadProfileFailed'));
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    if (currentUser?.uid && isLoading) {
      loadUserProfile();
    }
  }, [currentUser?.uid, isLoading, t]);
  
  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);
  
  const handleInputChange = useCallback((field) => {
    return (event) => {
      const value = event.target.value;
      setProfileData(prev => {
        if (prev[field] === value) {
          return prev;
        }
        return { ...prev, [field]: value };
      });
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
        toast.success(t('profileUpdateSuccess'));
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(t('profileUpdateFailed'));
    }
  };
  
  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error(t('passwordsNoMatch'));
        return;
      }
      
      if (passwordData.newPassword.length < 6) {
        toast.error(t('passwordTooShort'));
        return;
      }
      
      await updatePassword(auth.currentUser, passwordData.newPassword);
      toast.success(t('passwordUpdateSuccess'));
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(t('passwordUpdateFailed'));
    }
  };
  

  

  

  
  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 }
      }}
    >
      <Box sx={{ 
        mt: { xs: 2, sm: 3, md: 4 }, 
        mb: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh'
      }}>
        {/* Profile Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 }, 
            mb: { xs: 3, sm: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid #e0e0e0'
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid item xs={12} sm="auto">
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                <Avatar
                  sx={{ 
                    width: { xs: 80, sm: 90, md: 100 }, 
                    height: { xs: 80, sm: 90, md: 100 }, 
                    bgcolor: 'primary.main',
                    fontSize: { xs: '1.8rem', sm: '2.2rem' },
                    boxShadow: 4,
                    border: '3px solid white',
                    fontWeight: 600
                  }}
                >
                  {profileData.firstName.charAt(0)?.toUpperCase()}{profileData.lastName.charAt(0)?.toUpperCase()}
                </Avatar>
              </Box>
            </Grid>
            <Grid item xs={12} sm>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography 
                  variant={{ xs: 'h5', sm: 'h4' }} 
                  color="primary"
                  sx={{ 
                    fontWeight: 700,
                    mb: { xs: 1.5, sm: 2 },
                    lineHeight: 1.2
                  }}
                >
                  {profileData.firstName} {profileData.lastName}
                  {currentUser?.emailVerified && (
                    <Verified 
                      color="success" 
                      sx={{ 
                        ml: 1.5, 
                        verticalAlign: 'middle',
                        fontSize: { xs: '1.3rem', sm: '1.6rem' }
                      }} 
                    />
                  )}
                </Typography>
                <Typography 
                  variant={{ xs: 'body1', sm: 'h6' }} 
                  color="text.secondary"
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    fontWeight: 500,
                    display: 'block'
                  }}
                >
                  {profileData.email}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 2,
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {t('role', 'Role')}:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        bgcolor: currentUser?.role === 'admin' ? '#d32f2f' : 
                               currentUser?.role === 'staff' ? '#ed6c02' : 
                               currentUser?.role === 'officer' ? '#0288d1' : '#757575',
                        color: 'white',
                        px: 2,
                        py: 0.75,
                        borderRadius: 3,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        fontSize: '0.8rem',
                        boxShadow: 1
                      }}
                    >
                      {currentUser?.role || 'User'}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  {t('memberSince', 'Member since')} {currentUser?.metadata?.creationTime ? 
                    new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Box sx={{ 
                display: 'flex', 
                gap: { xs: 1, sm: 1.5 },
                justifyContent: { xs: 'center', sm: 'flex-end' },
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center'
              }}>
                <Button
                  variant={isEditing ? "contained" : "outlined"}
                  startIcon={isEditing ? <Save /> : <Edit />}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  size="medium"
                  sx={{ minWidth: { xs: '140px', sm: 'auto' } }}
                >
                  {String(isEditing ? t('saveChanges', 'Save Changes') : t('editProfile', 'Edit Profile'))}
                </Button>
                {isEditing && (
                  <IconButton 
                    onClick={() => setIsEditing(false)}
                    sx={{ 
                      bgcolor: 'grey.100',
                      '&:hover': { bgcolor: 'grey.200' }
                    }}
                  >
                    <Cancel />
                  </IconButton>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={refreshUserData}
                  color="secondary"
                  size="small"
                  sx={{ minWidth: { xs: '140px', sm: 'auto' } }}
                >
                  {String(t('refreshRole', 'Refresh Role'))}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Profile Tabs */}
        <Paper 
          elevation={3}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            bgcolor: 'grey.50'
          }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              textColor="primary"
              indicatorColor="primary"
              orientation="horizontal"
              sx={{
                '& .MuiTab-root': {
                  minHeight: { xs: 60, sm: 72 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 500,
                  textTransform: 'none',
                  px: { xs: 1, sm: 2 }
                }
              }}
            >
              <Tab 
                icon={<Person />} 
                label={String(t('personalInfo', 'Personal Info'))}
                iconPosition="start"
                sx={{ 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 0.5, sm: 1 }
                }}
              />
              <Tab 
                icon={<Assignment />} 
                label={String(t('myApplications', 'My Applications'))}
                iconPosition="start"
                sx={{ 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 0.5, sm: 1 }
                }}
              />
              <Tab 
                icon={<Security />} 
                label={String(t('accountSecurity', 'Account Security'))}
                iconPosition="start"
                sx={{ 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 0.5, sm: 1 }
                }}
              />
              <Tab 
                icon={<Settings />} 
                label={String(t('settings', 'Settings'))}
                iconPosition="start"
                sx={{ 
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 0.5, sm: 1 }
                }}
              />
            </Tabs>
          </Box>
          
          {/* Personal Information Tab */}
          <TabPanel key="personal-info-tab" value={activeTab} index={0}>
            <PersonalInfoForm 
              profileData={profileData}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              t={t}
            />
          </TabPanel>
          
          {/* Applications Tab */}
          <TabPanel key="applications-tab" value={activeTab} index={1}>
            {activeTab === 1 && <MyApplications />}
          </TabPanel>
          
          {/* Security Tab */}
          <TabPanel key="security-tab" value={activeTab} index={2}>
            <Typography 
              variant="h5" 
              gutterBottom 
              color="primary"
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontWeight: 600
              }}
            >
              {t('accountSecurity')}
            </Typography>
            
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 2,
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        mb: { xs: 2, sm: 3 },
                        fontWeight: 500
                      }}
                    >
                      {t('passwordAndAuth')}
                    </Typography>
                    <List sx={{ p: 0 }}>
                      <ListItem 
                        sx={{ 
                          px: 0,
                          py: { xs: 1.5, sm: 2 },
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: 'grey.50'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                          <Security 
                            color={currentUser?.emailVerified ? 'success' : 'warning'} 
                            sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('emailVerification')}
                          secondary={currentUser?.emailVerified ? t('verified') : t('notVerified')}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 500
                            },
                            '& .MuiListItemText-secondary': {
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }
                          }}
                        />
                      </ListItem>
                      <ListItem 
                        sx={{ 
                          px: 0,
                          py: { xs: 1.5, sm: 2 },
                          borderRadius: 1,
                          bgcolor: 'grey.50'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: { xs: 40, sm: 56 } }}>
                          <Security 
                            color="primary" 
                            sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={t('password')}
                          secondary={t('lastUpdated')}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 500
                            },
                            '& .MuiListItemText-secondary': {
                              fontSize: { xs: '0.8rem', sm: '0.875rem' }
                            }
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="medium"
                          onClick={() => setShowPasswordDialog(true)}
                          sx={{ 
                            ml: { xs: 1, sm: 2 },
                            borderRadius: 2,
                            textTransform: 'none'
                          }}
                        >
                          {String(t('changePassword', 'Change Password'))}
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
            <Typography 
              variant="h5" 
              gutterBottom 
              color="primary"
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontWeight: 600
              }}
            >
              {t('accountSettings')}
            </Typography>
            
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 2,
                    border: '1px solid #ffebee'
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      color="error"
                      sx={{ 
                        mb: { xs: 2, sm: 3 },
                        fontWeight: 500
                      }}
                    >
                      {t('dangerZone')}
                    </Typography>
                    <Alert 
                      severity="warning" 
                      sx={{ 
                        mb: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    >
                      {t('dangerZoneMsg')}
                    </Alert>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={logout}
                      size="large"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.5 }
                      }}
                    >
                      {String(t('signOut', 'Sign Out'))}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
        
        {/* Change Password Dialog */}
        <Dialog 
          open={showPasswordDialog} 
          onClose={() => setShowPasswordDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              m: { xs: 1, sm: 2 },
              maxHeight: { xs: '90vh', sm: 'auto' }
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              pb: { xs: 1, sm: 2 },
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 600
            }}
          >
            {t('changePassword')}
          </DialogTitle>
          <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  key="currentPassword"
                  fullWidth
                  label={t('currentPassword')}
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)}
                        size={{ xs: 'small', sm: 'medium' }}
                      >
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
                  label={t('newPassword')}
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  helperText={t('min6Chars')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  key="confirmPassword"
                  fullWidth
                  label={t('confirmNewPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        size={{ xs: 'small', sm: 'medium' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions 
            sx={{ 
              px: { xs: 2, sm: 3 },
              pb: { xs: 2, sm: 3 },
              gap: { xs: 1, sm: 1.5 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Button 
              onClick={() => setShowPasswordDialog(false)}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                order: { xs: 2, sm: 1 },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {String(t('cancel', 'Cancel'))}
            </Button>
            <Button 
              onClick={handlePasswordChange} 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                order: { xs: 1, sm: 2 },
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {String(t('updatePassword', 'Update Password'))}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserProfile;
