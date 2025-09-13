import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
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
                E-Services for Gram Panchayath
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Digital governance platform providing online access to government services, 
              making citizen services more efficient and transparent.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/services" color="inherit" underline="hover">
                Browse Services
              </Link>
              <Link href="/my-applications" color="inherit" underline="hover">
                Track Applications
              </Link>
              <Link href="/login" color="inherit" underline="hover">
                Citizen Login
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact Support
              </Link>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  Gram Panchayat Office, Village Name, District, State
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  +91-XXXXX-XXXXX
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 16 }} />
                <Typography variant="body2">
                  support@grampanchayat.gov.in
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} E-Services for Gram Panchayath. 
            Part of Digital India Initiative. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
