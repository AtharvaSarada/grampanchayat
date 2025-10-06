import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
  Paper
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  InsertDriveFile,
  Image,
  PictureAsPdf
} from '@mui/icons-material';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DocumentUpload = ({
  documents = [],
  onDocumentsChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['application/pdf', 'image/jpeg', 'image/png'],
  applicationId = null // For organizing files by application
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    setError('');

    // Validate file count
    if (documents.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }

      if (!acceptedTypes.includes(file.type)) {
        setError(`File "${file.name}" has unsupported format. Allowed: PDF, JPG, PNG`);
        return;
      }
    }

    if (!currentUser) {
      setError('You must be logged in to upload documents');
      return;
    }

    setUploading(true);

    try {
      // Upload files to Firebase Storage
      const newDocuments = await Promise.all(
        files.map(async (file) => {
          // Create unique file path
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2);
          const fileName = `${timestamp}_${randomId}_${file.name}`;
          
          // Organize files by user and application
          const filePath = applicationId 
            ? `documents/${currentUser.uid}/applications/${applicationId}/${fileName}`
            : `documents/${currentUser.uid}/general/${fileName}`;
          
          // Create storage reference
          const storageRef = ref(storage, filePath);
          
          // Upload file
          const uploadResult = await uploadBytes(storageRef, file);
          
          // Get download URL
          const downloadURL = await getDownloadURL(uploadResult.ref);
          
          return {
            id: `${timestamp}_${randomId}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: downloadURL,
            path: filePath,
            uploadedAt: new Date().toISOString(),
            uploadedBy: currentUser.uid
          };
        })
      );

      onDocumentsChange([...documents, ...newDocuments]);
      toast.success(`${newDocuments.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files. Please try again.');
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }

    // Clear input
    event.target.value = '';
  };

  const handleRemoveDocument = async (documentId) => {
    try {
      // Find the document to remove
      const documentToRemove = documents.find(doc => doc.id === documentId);
      
      if (documentToRemove && documentToRemove.path) {
        // Delete from Firebase Storage
        const storageRef = ref(storage, documentToRemove.path);
        await deleteObject(storageRef);
      }
      
      // Remove from local state
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      onDocumentsChange(updatedDocuments);
      
      toast.success('Document removed successfully');
    } catch (error) {
      console.error('Error removing document:', error);
      // Still remove from local state even if Firebase deletion fails
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      onDocumentsChange(updatedDocuments);
      toast.error('Document removed locally, but may still exist in storage');
    }
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <PictureAsPdf color="error" />;
    } else if (type.startsWith('image/')) {
      return <Image color="primary" />;
    }
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 2, mb: 2, border: '2px dashed #ccc' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Upload Documents
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Drag and drop files here or click to browse
          </Typography>
          
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="file-upload"
            disabled={uploading || documents.length >= maxFiles}
          />
          
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUpload />}
              disabled={uploading || documents.length >= maxFiles}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
          </label>
          
          <Box sx={{ mt: 1 }}>
            <Chip 
              label={`${documents.length}/${maxFiles} files`} 
              size="small" 
              color={documents.length >= maxFiles ? 'error' : 'default'}
            />
          </Box>
        </Box>
      </Paper>

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Uploading files...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {documents.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Documents ({documents.length})
          </Typography>
          <List>
            {documents.map((doc) => (
              <ListItem key={doc.id} divider>
                <Box sx={{ mr: 2 }}>
                  {getFileIcon(doc.type)}
                </Box>
                <ListItemText
                  primary={doc.name}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        Size: {formatFileSize(doc.size)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveDocument(doc.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Accepted formats: {acceptedTypes.map(type => {
            if (type === 'application/pdf') return 'PDF';
            if (type === 'image/jpeg') return 'JPG';
            if (type === 'image/png') return 'PNG';
            return type;
          }).join(', ')}
          <br />
          Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
        </Typography>
      </Box>
    </Box>
  );
};

export default DocumentUpload;
