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

const RegisterPage = () => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    // Validate names (alphabetic only)
    if (!/^[a-zA-Z\s]+$/.test(formData.firstName) || !/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      setError('Names should contain only alphabetic characters');
      return false;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate phone number (exactly 10 digits)
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Invalid phone number - must be exactly 10 digits');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
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
      // Try to register via backend API first
      try {
        const response = await api.auth.register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber
        });
        
        if (response.data.success) {
          // If API registration is successful, the backend should handle Firestore storage
          toast.success('Registration successful! Please login.');
          navigate('/login');
          return;
        }
      } catch (apiError) {
        console.log('API registration failed, trying Firebase directly');
      }
      
      // Fallback to direct Firebase registration
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Update user display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });
      
      // Store user profile data in Firebase Firestore
      const profileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`, // For backward compatibility
        phoneNumber: formData.phoneNumber.trim(),
        phone: formData.phoneNumber.trim(), // For consistency with admin form
        email: formData.email.trim().toLowerCase(),
        address: '',
        city: '',
        state: '',
        pincode: '',
        occupation: '',
        dateOfBirth: '',
        role: 'user', // Changed from 'citizen' to 'user' for consistency
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, profileData);
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message || 'An unexpected error occurred.';
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
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Business color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join the Gram Panchayat E-Services platform
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
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
                  label="Last Name"
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
                  label="Email Address"
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
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={loading}
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
                  label="Password"
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
                  label="Confirm Password"
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
