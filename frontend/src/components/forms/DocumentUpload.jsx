import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { validateFile } from '../../utils/formValidation';
import { storage } from '../../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DocumentUpload = ({ 
  requiredDocuments = [], 
  uploadedDocuments = [], 
  onDocumentsChange,
  maxFiles = 10,
  serviceType = 'general'
}) => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewDialog, setPreviewDialog] = useState({ open: false, file: null });

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (uploadedDocuments.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    files.forEach(file => uploadFile(file));
    
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadFile = async (file) => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const fileId = `${Date.now()}_${file.name}`;
    const filePath = `applications/${currentUser.uid}/${serviceType}/${fileId}`;
    const storageRef = ref(storage, filePath);

    setUploading(true);
    setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            const newDocument = {
              id: fileId,
              name: file.name,
              type: file.type,
              size: file.size,
              url: downloadURL,
              path: filePath,
              uploadedAt: new Date().toISOString(),
              status: 'uploaded'
            };

            const updatedDocuments = [...uploadedDocuments, newDocument];
            onDocumentsChange(updatedDocuments);

            toast.success(`${file.name} uploaded successfully`);
            
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          } catch (error) {
            console.error('Error getting download URL:', error);
            toast.error(`Failed to process ${file.name}`);
          }
        }
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (document) => {
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, document.path);
      await deleteObject(storageRef);

      // Remove from local state
      const updatedDocuments = uploadedDocuments.filter(doc => doc.id !== document.id);
      onDocumentsChange(updatedDocuments);

      toast.success(`${document.name} deleted successfully`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete ${document.name}`);
    }
  };

  const handlePreviewFile = (document) => {
    setPreviewDialog({ open: true, file: document });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <PdfIcon color="error" />;
    if (fileType.includes('image')) return <ImageIcon color="primary" />;
    return <FileIcon color="action" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRequiredDocumentStatus = (docName) => {
    const uploaded = uploadedDocuments.some(doc => 
      doc.name.toLowerCase().includes(docName.toLowerCase()) ||
      docName.toLowerCase().includes(doc.name.toLowerCase().split('.')[0])
    );
    return uploaded;
  };

  return (
    <Box>
      {/* Required Documents List */}
      {requiredDocuments.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Required Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please upload the following documents. All documents should be clear and readable.
          </Typography>
          
          <List dense>
            {requiredDocuments.map((doc, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getRequiredDocumentStatus(doc) ? (
                    <CheckIcon color="success" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={doc}
                  secondary={getRequiredDocumentStatus(doc) ? 'Uploaded' : 'Required'}
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={getRequiredDocumentStatus(doc) ? 'Complete' : 'Pending'}
                    color={getRequiredDocumentStatus(doc) ? 'success' : 'error'}
                    size="small"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Upload Area */}
      <Paper 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          border: '2px dashed',
          borderColor: 'primary.main',
          bgcolor: 'primary.50',
          mb: 3,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.100'
          }
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Upload Documents
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Click here or drag and drop files to upload
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported formats: PDF, JPG, PNG • Maximum file size: 5MB • Maximum {maxFiles} files
        </Typography>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </Paper>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Uploading files...
          </Typography>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <Box key={fileId} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption">{fileId.split('_')[1]}</Typography>
                <Typography variant="caption">{Math.round(progress)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          ))}
        </Paper>
      )}

      {/* Uploaded Files List */}
      {uploadedDocuments.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Documents ({uploadedDocuments.length}/{maxFiles})
          </Typography>
          
          <List>
            {uploadedDocuments.map((document) => (
              <ListItem key={document.id} divider>
                <ListItemIcon>
                  {getFileIcon(document.type)}
                </ListItemIcon>
                <ListItemText
                  primary={document.name}
                  secondary={`${formatFileSize(document.size)} • Uploaded ${new Date(document.uploadedAt).toLocaleDateString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handlePreviewFile(document)}
                    sx={{ mr: 1 }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFile(document)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* File Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onClose={() => setPreviewDialog({ open: false, file: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {previewDialog.file?.name}
        </DialogTitle>
        <DialogContent>
          {previewDialog.file && (
            <Box sx={{ textAlign: 'center' }}>
              {previewDialog.file.type.includes('image') ? (
                <img 
                  src={previewDialog.file.url} 
                  alt={previewDialog.file.name}
                  style={{ maxWidth: '100%', maxHeight: '500px' }}
                />
              ) : previewDialog.file.type.includes('pdf') ? (
                <iframe
                  src={previewDialog.file.url}
                  width="100%"
                  height="500px"
                  title={previewDialog.file.name}
                />
              ) : (
                <Typography>Preview not available for this file type</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false, file: null })}>
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={() => window.open(previewDialog.file?.url, '_blank')}
          >
            Open in New Tab
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Guidelines */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          <strong>Document Upload Guidelines:</strong>
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Ensure all documents are clear and readable</li>
          <li>Upload original documents or certified copies</li>
          <li>File names should be descriptive (e.g., "aadhaar_card.pdf")</li>
          <li>Maximum file size: 5MB per file</li>
          <li>Supported formats: PDF, JPG, PNG</li>
        </ul>
      </Alert>
    </Box>
  );
};

export default DocumentUpload;
