import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  AccountCircle, 
  Home, 
  Business,
  ExitToApp,
  Dashboard,
  AdminPanelSettings,
  Work
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import NotificationSystem from '../notifications/NotificationSystem';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '../../i18n/LanguageProvider';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { t } = useLanguage();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate('/')}
        >
          <Business />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('home.title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            <Home sx={{ mr: 1 }} />
            {t('nav.home')}
          </Button>
          
          <Button color="inherit" onClick={() => navigate('/services')}>
            {t('nav.services')}
          </Button>

          {isAuthenticated ? (
            <>
              <LanguageToggle variant="icon" />
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* Role-based Dashboard Navigation */}
                {currentUser?.role === 'admin' || currentUser?.role === 'officer' ? (
                  <MenuItem onClick={() => { navigate('/admin/dashboard'); handleClose(); }}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    {t('dashboard.admin.title')}
                  </MenuItem>
                ) : currentUser?.role === 'staff' ? (
                  <MenuItem onClick={() => { navigate('/staff/dashboard'); handleClose(); }}>
                    <Work sx={{ mr: 1 }} />
                    {t('dashboard.staff.title')}
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => { navigate('/user/dashboard'); handleClose(); }}>
                    <Dashboard sx={{ mr: 1 }} />
                    {t('nav.dashboard')}
                  </MenuItem>
                )}
                
                {/* Additional Admin/Staff Menu Items */}
                {(currentUser?.role === 'admin' || currentUser?.role === 'officer') && (
                  <>
                    <MenuItem onClick={() => { navigate('/admin/users'); handleClose(); }}>
                      {t('dashboard.admin.users')}
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/services'); handleClose(); }}>
                      {t('dashboard.admin.services')}
                    </MenuItem>
                    <MenuItem onClick={() => { navigate('/admin/applications'); handleClose(); }}>
                      {t('dashboard.admin.applications')}
                    </MenuItem>
                  </>
                )}
                
                {currentUser?.role === 'staff' && (
                  <MenuItem onClick={() => { navigate('/staff/applications'); handleClose(); }}>
                    {t('nav.myApplications')}
                  </MenuItem>
                )}
                
                {/* Common Menu Items */}
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  {t('nav.profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  {t('nav.logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                {t('nav.login')}
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                {t('nav.register')}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
