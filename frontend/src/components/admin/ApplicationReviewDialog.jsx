import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Send,
  Info
} from '@mui/icons-material';
import { updateApplicationStatus } from '../../services/realWorldApplicationService';
import { createNotification } from '../../services/notificationService';
import toast from 'react-hot-toast';

const ApplicationReviewDialog = ({ open, onClose, application, onStatusUpdate }) => {
  const [action, setAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!action) {
      toast.error('Please select an action');
      return;
    }

    if (action === 'rejected' && !remarks.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      console.log('Full Application data:', application);
      console.log('Application.formData:', application.formData);
      console.log('Application.documents:', application.documents);
      
      // Get userId from application (could be userId or applicantId)
      const userId = application.userId || application.applicantId;
      
      if (!userId) {
        toast.error('Unable to identify application owner');
        console.error('No userId found in application:', application);
        setLoading(false);
        return;
      }

      // Determine the new status based on action
      let newStatus;
      switch (action) {
        case 'review':
          newStatus = 'under_review';
          break;
        case 'approved':
          newStatus = 'approved';
          break;
        case 'rejected':
          newStatus = 'rejected';
          break;
        case 'completed':
          newStatus = 'completed';
          break;
        default:
          newStatus = action;
      }

      // Update application status
      await updateApplicationStatus(
        application.id,
        newStatus,
        userId, // updatedBy - use the userId we found
        remarks || `Application ${action}`
      );

      // Create notification for user
      await createNotification({
        userId: userId,
        title: `Application ${newStatus.replace('_', ' ').toUpperCase()}`,
        message: action === 'rejected' 
          ? `Your ${application.serviceType} application has been rejected. Reason: ${remarks}`
          : `Your ${application.serviceType} application status has been updated to ${newStatus.replace('_', ' ')}`,
        type: action === 'rejected' ? 'error' : action === 'approved' ? 'success' : 'info',
        link: `/my-applications`,
        metadata: {
          applicationId: application.id,
          serviceType: application.serviceType,
          status: newStatus,
          remarks: remarks
        }
      });

      toast.success(`Application ${action} successfully`);
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    } finally {
      setLoading(false);
    }
  };

  if (!application) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return 'warning';
      case 'under_review':
        return 'info';
      case 'approved':
      case 'completed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Review Application</Typography>
          <Chip 
            label={application.status?.replace('_', ' ').toUpperCase()} 
            color={getStatusColor(application.status)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Application Overview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
            Application Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Application ID</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ wordBreak: 'break-all' }}>
                {application.applicationId || application.id}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Service Type</Typography>
              <Typography variant="body1" fontWeight="bold">
                {application.serviceName || application.serviceType?.replace('_', ' ').replace('-', ' ').toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Applicant Name</Typography>
              <Typography variant="body1">
                {application.applicantName || 
                 application.formData?.name || 
                 application.applicationData?.fatherName ||
                 application.applicationData?.applicantInfo?.name ||
                 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Contact</Typography>
              <Typography variant="body1">
                {application.applicantPhone || 
                 application.formData?.mobile || 
                 application.applicationData?.applicantInfo?.phone ||
                 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography variant="body1">
                {application.applicantEmail || 
                 application.formData?.email || 
                 application.applicationData?.applicantInfo?.email ||
                 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">Submitted Date</Typography>
              <Typography variant="body1">
                {application.submittedAt ? new Date(application.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Application Form Data */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
            Application Details
          </Typography>
          {(() => {
            // Check multiple possible locations for form data
            const formData = application.formData || application.applicationData;
            
            if (!formData || typeof formData !== 'object' || formData.id === 'birth_certificate') {
              return (
                <Alert severity="warning" icon={<Info />}>
                  <Typography variant="body2" fontWeight="bold">
                    No detailed form data available
                  </Typography>
                  <Typography variant="caption">
                    This application may have been submitted with a different data structure.
                  </Typography>
                </Alert>
              );
            }

            // Define logical field order based on service type
            const fieldOrder = {
              birth_certificate: [
                // Child Details
                { key: 'childFirstName', label: 'Child First Name', section: 'Child Details' },
                { key: 'childLastName', label: 'Child Last Name' },
                { key: 'childName', label: 'Full Name' },
                { key: 'dateOfBirth', label: 'Date of Birth' },
                { key: 'timeOfBirth', label: 'Time of Birth' },
                { key: 'placeOfBirth', label: 'Place of Birth' },
                { key: 'gender', label: 'Gender' },
                { key: 'weight', label: 'Weight (kg)' },
                
                // Father Details
                { key: 'fatherFirstName', label: 'Father First Name', section: 'Father Details' },
                { key: 'fatherLastName', label: 'Father Last Name' },
                { key: 'fatherName', label: 'Father Full Name' },
                { key: 'fatherAge', label: 'Father Age' },
                { key: 'fatherEducation', label: 'Father Education' },
                { key: 'fatherOccupation', label: 'Father Occupation' },
                { key: 'fatherNationality', label: 'Father Nationality' },
                
                // Mother Details
                { key: 'motherFirstName', label: 'Mother First Name', section: 'Mother Details' },
                { key: 'motherLastName', label: 'Mother Last Name' },
                { key: 'motherName', label: 'Mother Full Name' },
                { key: 'motherAge', label: 'Mother Age' },
                { key: 'motherEducation', label: 'Mother Education' },
                { key: 'motherOccupation', label: 'Mother Occupation' },
                { key: 'motherNationality', label: 'Mother Nationality' },
                
                // Address Details
                { key: 'permanentAddress', label: 'Permanent Address', section: 'Address Details' },
                { key: 'city', label: 'City' },
                { key: 'district', label: 'District' },
                { key: 'state', label: 'State' },
                { key: 'pincode', label: 'PIN Code' },
                
                // Hospital Details
                { key: 'hospitalName', label: 'Hospital Name', section: 'Hospital/Delivery Details' },
                { key: 'hospitalAddress', label: 'Hospital Address' },
                { key: 'doctorName', label: 'Doctor/Attendant Name' },
                { key: 'attendantType', label: 'Attendant Type' },
                
                // Additional Information
                { key: 'registrationDelay', label: 'Registration Delay', section: 'Additional Information' },
                { key: 'reasonForDelay', label: 'Reason for Delay' },
                { key: 'informantName', label: 'Informant Name' },
                { key: 'informantRelation', label: 'Informant Relation' },
                { key: 'informantAddress', label: 'Informant Address' }
              ]
            };

            // Get the appropriate field order or use default
            const serviceType = application.serviceType?.replace('-', '_');
            const orderedFields = fieldOrder[serviceType] || [];
            
            // If no predefined order, show all fields alphabetically
            if (orderedFields.length === 0) {
              return (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, maxHeight: 400, overflow: 'auto' }}>
                  {Object.entries(formData)
                    .filter(([key]) => !['documents', 'files', 'id', 'name', 'title', 'description', 'category', 'documentUrls', 'applicantInfo', 'submissionDetails'].includes(key))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {typeof value === 'object' ? JSON.stringify(value) : value || 'N/A'}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              );
            }

            // Render fields in defined order with sections
            let currentSection = '';
            return (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, maxHeight: 400, overflow: 'auto' }}>
                {orderedFields.map((field, index) => {
                  const value = formData[field.key];
                  
                  // Skip if field doesn't exist in data
                  if (value === undefined || value === null || value === '') return null;
                  
                  const showSection = field.section && field.section !== currentSection;
                  if (showSection) currentSection = field.section;
                  
                  return (
                    <React.Fragment key={field.key}>
                      {showSection && (
                        <Typography 
                          variant="subtitle2" 
                          color="primary" 
                          fontWeight="bold"
                          sx={{ mt: index === 0 ? 0 : 2, mb: 1 }}
                        >
                          {field.section}
                        </Typography>
                      )}
                      <Box sx={{ mb: 1, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="caption" color="text.secondary">
                          {field.label}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {typeof value === 'object' ? JSON.stringify(value) : value}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  );
                })}
              </Box>
            );
          })()}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Uploaded Documents */}
        <Box sx={{ mb: 3 }}>
          {(() => {
            // Check multiple possible locations for documents
            const docs = application.documents || 
                        application.formData?.documents || 
                        application.applicationData?.documentUrls ||
                        [];
            
            // Convert documentUrls object to array if needed
            let docsArray = [];
            if (Array.isArray(docs)) {
              docsArray = docs;
            } else if (typeof docs === 'object') {
              docsArray = Object.entries(docs).map(([type, doc]) => ({
                type,
                name: doc.name || type,
                url: doc.url || doc
              }));
            }
            
            console.log('Documents found:', docsArray);
            
            return (
              <>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary">
                  Uploaded Documents ({docsArray.length})
                </Typography>
                {docsArray.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {docsArray.map((doc, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'grey.50', 
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box sx={{ flex: 1, mr: 2 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {doc.name || doc.fileName || `Document ${index + 1}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.type || doc.fileType || 'Unknown type'}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          href={doc.url || doc.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          disabled={!doc.url && !doc.downloadURL}
                        >
                          View
                        </Button>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="warning">No documents uploaded</Alert>
                )}
              </>
            );
          })()}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Action *</InputLabel>
            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              label="Action *"
            >
              <MenuItem value="review">
                <Box display="flex" alignItems="center" gap={1}>
                  <Visibility fontSize="small" />
                  Start Review
                </Box>
              </MenuItem>
              <MenuItem value="approved">
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle fontSize="small" color="success" />
                  Approve Application
                </Box>
              </MenuItem>
              <MenuItem value="rejected">
                <Box display="flex" alignItems="center" gap={1}>
                  <Cancel fontSize="small" color="error" />
                  Reject Application
                </Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle fontSize="small" color="success" />
                  Mark as Completed
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label={action === 'rejected' ? 'Rejection Reason *' : 'Remarks (Optional)'}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              action === 'rejected'
                ? 'Please provide a detailed reason for rejection...'
                : 'Add any comments or notes...'
            }
            required={action === 'rejected'}
          />

          {action === 'rejected' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              The applicant will be notified about the rejection and the reason you provide.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !action}
          startIcon={<Send />}
          color={action === 'rejected' ? 'error' : 'primary'}
        >
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationReviewDialog;
