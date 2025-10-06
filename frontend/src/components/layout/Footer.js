import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider
} from '@mui/material';
import { useLanguage } from '../../i18n/LanguageProvider';
import {
  Business,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1 }} />
              <Typography variant="h6" component="h3">
                {t('home.title')}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t('home.description')}
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              {t('footer.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/services" color="inherit" underline="hover">
                {t('nav.browseServices')}
              </Link>
              <Link href="/my-applications" color="inherit" underline="hover">
                {t('nav.trackApplications')}
              </Link>
              <Link href="/login" color="inherit" underline="hover">
                {t('nav.login')}
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                {t('nav.contactSupport')}
              </Link>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              {t('footer.contactInfo')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  {t('footer.address')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  {t('footer.phone')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  {t('footer.email')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {t('footer.copyright')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
