import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Grid
} from '@mui/material';
import {
  Email,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
  Business
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useLanguage } from '../../i18n/LanguageProvider';

const translations = {
  en: {
    createAccount: "Create Account",
    joinPlatform: "Join the Gram Panchayat E-Services platform",
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    creatingAccount: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign In",
    validation: {
      required: "Please fill in all required fields",
      alpha: "Names should contain only alphabetic characters",
      email: "Please enter a valid email address",
      phone: "Invalid phone number - must be exactly 10 digits",
      passwordMatch: "Passwords do not match",
      passwordLength: "Password must be at least 8 characters long",
    },
    registration: {
      success: "Registration successful! Please login.",
      failed: "Registration failed. Please try again.",
      emailInUse: "An account with this email already exists.",
      invalidEmail: "Invalid email address format.",
      weakPassword: "Password is too weak. Please choose a stronger password.",
      unexpected: "An unexpected error occurred.",
    }
  },
  mr: {
    createAccount: "खाते तयार करा",
    joinPlatform: "ग्रामपंचायत ई-सेवा प्लॅटफॉर्मवर सामील व्हा",
    firstName: "पहिले नाव",
    lastName: "आडनाव",
    emailAddress: "ईमेल पत्ता",
    phoneNumber: "फोन नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्डची पुष्टी करा",
    creatingAccount: "खाते तयार करत आहे...",
    alreadyHaveAccount: "आधीपासूनच खाते आहे?",
    signIn: "साइन इन करा",
    validation: {
      required: "कृपया सर्व आवश्यक फील्ड भरा",
      alpha: "नावांमध्ये फक्त अक्षरे असावीत",
      email: "कृपया वैध ईमेल पत्ता प्रविष्ट करा",
      phone: "अवैध फोन नंबर - नक्की १० अंक असणे आवश्यक आहे",
      passwordMatch: "पासवर्ड जुळत नाहीत",
      passwordLength: "पासवर्ड किमान ८ अक्षरे लांब असणे आवश्यक आहे",
    },
    registration: {
      success: "नोंदणी यशस्वी! कृपया लॉगिन करा.",
      failed: "नोंदणी अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
      emailInUse: "या ईमेलसह एक खाते आधीपासूनच अस्तित्वात आहे.",
      invalidEmail: "अवैध ईमेल पत्ता स्वरूप.",
      weakPassword: "पासवर्ड खूप कमकुवत आहे. कृपया एक मजबूत पासवर्ड निवडा.",
      unexpected: "एक अनपेक्षित त्रुटी आली.",
    }
  }
};

const RegisterPage = () => {
  const { language, t: translate } = useLanguage();
  const t = (key) => translate(key, translations[language][key] || key);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For phoneNumber field, only allow numeric input
    if (name === 'phoneNumber' && value !== '') {
      // Replace any non-numeric characters and limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError(t('validation.required'));
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.firstName) || !/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      setError(t('validation.alpha'));
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t('validation.email'));
      return false;
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      setError(t('validation.phone'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('validation.passwordMatch'));
      return false;
    }
    if (formData.password.length < 8) {
      setError(t('validation.passwordLength'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      try {
        const response = await api.auth.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber
        });
        
        if (response.data.success) {
          toast.success(t('registration.success'));
          navigate('/login');
          return;
        }
      } catch (apiError) {
        console.log('API registration failed, trying Firebase directly');
      }
      
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      const profileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        phoneNumber: formData.phoneNumber.trim(),
        phone: formData.phoneNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        address: '',
        city: '',
        state: '',
        pincode: '',
        occupation: '',
        dateOfBirth: '',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, profileData);
      
      toast.success(t('registration.success'));
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = t('registration.emailInUse');
          break;
        case 'auth/invalid-email':
          errorMessage = t('registration.invalidEmail');
          break;
        case 'auth/weak-password':
          errorMessage = t('registration.weakPassword');
          break;
        default:
          errorMessage = error.message || t('registration.unexpected');
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Business color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              {t('createAccount')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('joinPlatform')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  label={t('firstName')}
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="lastName"
                  label={t('lastName')}
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="email"
                  label={t('emailAddress')}
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label={t('phoneNumber')}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                  inputProps={{
                    maxLength: 10,
                    pattern: "[0-9]*",
                    inputMode: "numeric"
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label={t('password')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label={t('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ChakraSpinner size="20px" />
                  {t('creatingAccount')}
                </>
              ) : (
                t('createAccount')
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('alreadyHaveAccount')}{' '}
              <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
                {t('signIn')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
