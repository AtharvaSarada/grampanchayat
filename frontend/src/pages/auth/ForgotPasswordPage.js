import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';
import ChakraSpinner from '../../components/common/ChakraSpinner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success('Password reset email sent successfully!');
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later');
          break;
        default:
          setError('Failed to send password reset email. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom color="primary">
                Check Your Email
              </Typography>
              
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  We've sent a password reset link to:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {email}
                </Typography>
              </Alert>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please check your email and click the link to reset your password. 
                If you don't see the email, check your spam folder.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                  sx={{ mr: 2 }}
                >
                  Back to Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                >
                  Try Different Email
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your email address and we'll send you a link to reset your password
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
              disabled={loading}
              placeholder="Enter your registered email address"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <>
                  <ChakraSpinner size="20px" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Back to Login
                </Link>
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" underline="hover">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
