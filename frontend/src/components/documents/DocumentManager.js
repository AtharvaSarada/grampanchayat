import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  Description,
  Download,
  Delete,
  Visibility,
  Security,
  CheckCircle,
  Warning,
  Error,
  Folder,
  InsertDriveFile
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../services/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DocumentManager = ({ applicationId = null, userRole = 'user' }) => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  const documentCategories = {
    'identity': 'Identity Proof',
    'address': 'Address Proof',
    'income': 'Income Certificate',
    'caste': 'Caste Certificate',
    'birth': 'Birth Certificate',
    'death': 'Death Certificate',
    'marriage': 'Marriage Certificate',
    'property': 'Property Documents',
    'other': 'Other Documents'
  };

  useEffect(() => {
    loadDocuments();
  }, [applicationId, currentUser]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      let documentsQuery;
      
      if (applicationId) {
        // Load documents for specific application
        documentsQuery = query(
          collection(db, 'documents'),
          where('applicationId', '==', applicationId),
          orderBy('uploadedAt', 'desc')
        );
      } else {
        // Load user's documents
        documentsQuery = query(
          collection(db, 'documents'),
          where('uploadedBy', '==', currentUser.uid),
          orderBy('uploadedAt', 'desc')
        );
      }

      const snapshot = await getDocs(documentsQuery);
      const documentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
      }));
      
      setDocuments(documentsData);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or image files.');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      setDocumentTitle(file.name.split('.')[0]);
      setUploadDialogOpen(true);
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile || !documentTitle.trim()) {
      toast.error('Please select a file and provide a title');
      return;
    }

    try {
      const fileId = `${Date.now()}_${selectedFile.name}`;
      const storageRef = ref(storage, `documents/${currentUser.uid}/${fileId}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Track upload progress
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        },
        (error) => {
          console.error('Upload error:', error);
          toast.error('Upload failed');
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        },
        async () => {
          // Upload completed
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save document metadata to Firestore
            const documentData = {
              title: documentTitle.trim(),
              category: documentCategory,
              fileName: selectedFile.name,
              fileSize: selectedFile.size,
              fileType: selectedFile.type,
              downloadURL,
              storagePath: `documents/${currentUser.uid}/${fileId}`,
              uploadedBy: currentUser.uid,
              uploadedByName: currentUser.name || currentUser.displayName,
              applicationId: applicationId || null,
              uploadedAt: new Date(),
              isVerified: false,
              verifiedBy: null,
              verifiedAt: null,
              status: 'pending'
            };

            await addDoc(collection(db, 'documents'), documentData);
            
            toast.success('Document uploaded successfully');
            setUploadDialogOpen(false);
            setSelectedFile(null);
            setDocumentTitle('');
            setDocumentCategory('');
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
            
            loadDocuments();
          } catch (error) {
            console.error('Error saving document metadata:', error);
            toast.error('Failed to save document information');
          }
        }
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Upload failed');
    }
  };

  const downloadDocument = async (document) => {
    try {
      const link = document.createElement('a');
      link.href = document.downloadURL;
      link.download = document.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Download failed');
    }
  };

  const deleteDocument = async (document) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'documents', document.id));
      
      // Delete from Storage
      const storageRef = ref(storage, document.storagePath);
      await deleteObject(storageRef);
      
      toast.success('Document deleted successfully');
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const verifyDocument = async (documentId, isVerified) => {
    if (!['admin', 'officer', 'staff'].includes(userRole)) {
      toast.error('Insufficient permissions');
      return;
    }

    try {
      await updateDoc(doc(db, 'documents', documentId), {
        isVerified,
        verifiedBy: currentUser.uid,
        verifiedAt: new Date(),
        status: isVerified ? 'verified' : 'rejected'
      });
      
      toast.success(`Document ${isVerified ? 'verified' : 'rejected'} successfully`);
      loadDocuments();
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Failed to update document status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle />;
      case 'rejected': return <Error />;
      case 'pending': return <Warning />;
      default: return <Description />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          <Folder sx={{ mr: 1, verticalAlign: 'middle' }} />
          Document Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => document.getElementById('file-input').click()}
        >
          Upload Document
        </Button>
        <input
          id="file-input"
          type="file"
          hidden
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </Box>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Uploading...</Typography>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <Box key={fileId} sx={{ mb: 1 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption">{Math.round(progress)}%</Typography>
            </Box>
          ))}
        </Paper>
      )}

      {/* Documents Grid */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading documents...</Typography>
        </Box>
      ) : documents.length === 0 ? (
        <Alert severity="info">
          No documents uploaded yet. Click "Upload Document" to add your first document.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {documents.map((document) => (
            <Grid item xs={12} sm={6} md={4} key={document.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <InsertDriveFile sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2" noWrap>
                      {document.title}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {documentCategories[document.category] || 'Other'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip
                      icon={getStatusIcon(document.status)}
                      label={document.status?.toUpperCase() || 'PENDING'}
                      color={getStatusColor(document.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Uploaded: {format(document.uploadedAt, 'MMM dd, yyyy')}
                  </Typography>
                  
                  <Typography variant="caption" display="block" color="text.secondary">
                    Size: {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => downloadDocument(document)}
                    title="Download"
                  >
                    <Download />
                  </IconButton>
                  
                  {['admin', 'officer', 'staff'].includes(userRole) && (
                    <>
                      <IconButton
                        size="small"
                        onClick={() => verifyDocument(document.id, true)}
                        title="Verify"
                        color="success"
                      >
                        <CheckCircle />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => verifyDocument(document.id, false)}
                        title="Reject"
                        color="error"
                      >
                        <Error />
                      </IconButton>
                    </>
                  )}
                  
                  {(document.uploadedBy === currentUser.uid || ['admin', 'officer'].includes(userRole)) && (
                    <IconButton
                      size="small"
                      onClick={() => deleteDocument(document)}
                      title="Delete"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Document Title"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          
          <TextField
            fullWidth
            select
            label="Category"
            value={documentCategory}
            onChange={(e) => setDocumentCategory(e.target.value)}
            SelectProps={{ native: true }}
          >
            <option value="">Select Category</option>
            {Object.entries(documentCategories).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </TextField>
          
          {selectedFile && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>File:</strong> {selectedFile.name}
              </Typography>
              <Typography variant="body2">
                <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
              <Typography variant="body2">
                <strong>Type:</strong> {selectedFile.type}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button onClick={uploadDocument} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManager;
