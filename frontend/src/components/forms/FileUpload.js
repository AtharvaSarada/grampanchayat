import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Image,
  PictureAsPdf,
  Delete,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { validateFile } from '../../services/storage';

const FileUpload = ({
  label,
  helperText,
  required = false,
  multiple = false,
  accept = 'image/*,.pdf',
  maxSize = 5 * 1024 * 1024, // 5MB
  files = [],
  onChange,
  error = null,
  disabled = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const allowedTypes = accept.includes('image') 
    ? ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    : ['application/pdf'];

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  }, []);

  const handleFiles = (newFiles) => {
    if (disabled) return;

    const validFiles = [];
    const errors = {};

    newFiles.forEach((file, index) => {
      const validation = validateFile(file, {
        maxSize,
        allowedTypes,
        required: false
      });

      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors[`file_${index}`] = validation.errors;
      }
    });

    setValidationErrors(errors);

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      onChange(updatedFiles);
    }
  };

  const removeFile = (index) => {
    if (disabled) return;
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image color="primary" />;
    } else if (file.type === 'application/pdf') {
      return <PictureAsPdf color="error" />;
    }
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      
      {/* Upload Area */}
      <Box
        sx={{
          border: `2px dashed ${dragOver ? 'primary.main' : error ? 'error.main' : 'grey.300'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          bgcolor: dragOver ? 'action.hover' : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.3s ease'
        }}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => {
          if (!disabled) document.getElementById(`file-input-${label}`).click();
        }}
      >
        <input
          id={`file-input-${label}`}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="body1" gutterBottom>
          {dragOver ? 'Drop files here' : 'Click or drag files to upload'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {accept.includes('image') ? 'Images (JPEG, PNG) and PDF files' : 'PDF files only'} 
          {' • Max size: '}{(maxSize / (1024 * 1024)).toFixed(1)}MB
        </Typography>
      </Box>

      {/* Helper Text */}
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <Typography variant="body2">
            Some files could not be uploaded:
          </Typography>
          {Object.values(validationErrors).map((errors, index) => (
            <Typography key={index} variant="caption" display="block">
              • {errors.join(', ')}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uploaded Files ({files.length})
          </Typography>
          <List dense>
            {files.map((file, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  bgcolor: 'background.paper', 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1
                }}
              >
                <ListItemIcon>
                  {getFileIcon(file)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" noWrap>
                        {file.name}
                      </Typography>
                      <Chip 
                        label={formatFileSize(file.size)} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  }
                  secondary={file.type}
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    size="small"
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
    </Box>
  );
};

export default FileUpload;
