import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'applications/birth-certificates/userId/fileName')
 * @returns {Promise<string>} Download URL
 */
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} basePath - Base storage path
 * @returns {Promise<string[]>} Array of download URLs
 */
export const uploadMultipleFiles = async (files, basePath) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}_${index}_${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      return uploadFile(file, filePath);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Delete file from Firebase Storage
 * @param {string} fileURL - The download URL of the file to delete
 */
export const deleteFile = async (fileURL) => {
  try {
    const fileRef = ref(storage, fileURL);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'],
    required = true
  } = options;

  const errors = [];

  if (required && !file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }

  if (file) {
    if (file.size > maxSize) {
      errors.push(`File size should be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate storage path for application files
 * @param {string} serviceType - Type of service (e.g., 'birth-certificate')
 * @param {string} userId - User ID
 * @param {string} fileName - Original file name
 * @returns {string} Storage path
 */
export const generateStoragePath = (serviceType, userId, fileName) => {
  const timestamp = Date.now();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `applications/${serviceType}/${userId}/${timestamp}_${cleanFileName}`;
};
