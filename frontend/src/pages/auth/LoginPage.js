import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Link,
  Alert,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Business
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useLanguage } from '../../i18n/LanguageProvider';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && currentUser) {
      // Redirect based on user role (officer is treated as admin)
      const role = currentUser.role === 'officer' ? 'admin' : currentUser.role;
      
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'staff':
          navigate('/staff/dashboard', { replace: true });
          break;
        case 'user':
        default:
          navigate('/user/dashboard', { replace: true });
          break;
      }
    }
  }, [currentUser, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError(t('auth.fillAllFields'));
      return;
    }

    setLoading(true);
    setError('');
    dispatch(loginStart());

    try {
      // Firebase Auth will handle the authentication
      // AuthContext will automatically detect the auth state change
      // and redirect to the appropriate dashboard
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      
      toast.success(t('auth.loginSuccess'));
      // Don't navigate here - let AuthContext handle the redirect
      // The AuthContext will detect the auth state change and redirect appropriately
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = t('auth.loginFailed');
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = t('auth.userNotFound');
          break;
        case 'auth/wrong-password':
          errorMessage = t('auth.wrongPassword');
          break;
        case 'auth/invalid-email':
          errorMessage = t('auth.invalidEmail');
          break;
        case 'auth/user-disabled':
          errorMessage = t('auth.userDisabled');
          break;
        case 'auth/too-many-requests':
          errorMessage = t('auth.tooManyRequests');
          break;
        default:
          errorMessage = error.message || t('auth.unexpectedError');
      }
      
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <ChakraSpinner size="40px" />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {t('auth.checkingAuth')}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Don't render login form if user is already authenticated
  if (currentUser) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <ChakraSpinner size="40px" />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            {t('auth.redirecting')}
          </Typography>
        </Box>
      </Box>
    );
  }

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
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Business color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              {t('auth.welcomeBack')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('auth.signInAccess')}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.email')}
              name="email"
              autoComplete="email"
              autoFocus
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
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
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
                  {t('auth.signingIn')}
                </>
              ) : (
                t('auth.signIn')
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/forgot-password" 
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                {t('auth.forgotPassword')}
              </Link>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth.newToPlatform')}
            </Typography>
          </Divider>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('auth.dontHaveAccount')}
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              sx={{ mt: 1 }}
            >
              {t('auth.createAccountButton')}
            </Button>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
