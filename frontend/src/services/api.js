import axios from 'axios';
import { getIdToken } from './firebase';
import toast from 'react-hot-toast';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // If user is not authenticated, continue without token
      console.log('No auth token available');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error('Session expired. Please login again.');
          // Redirect to login page
          window.location.href = '/login';
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('The requested resource was not found.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data?.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
const api = {
  // Authentication endpoints
  auth: {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    getProfile: () => apiClient.get('/auth/profile'),
    updateProfile: (userData) => apiClient.put('/auth/profile', userData),
    changePassword: (passwordData) => apiClient.put('/auth/change-password', passwordData),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (resetData) => apiClient.post('/auth/reset-password', resetData),
  },

  // User endpoints
  user: {
    // Services
    searchServices: (params) => apiClient.get('/users/services/search', { params }),
    getAllServices: (params) => apiClient.get('/users/services', { params }),
    getServiceDetails: (serviceId) => apiClient.get(`/users/services/${serviceId}`),
    
    // Applications
    submitApplication: (applicationData) => apiClient.post('/users/applications', applicationData),
    getUserApplications: (params) => apiClient.get('/users/applications', { params }),
    getApplicationDetails: (applicationId) => apiClient.get(`/users/applications/${applicationId}`),
    getApplicationStatus: (applicationId) => apiClient.get(`/users/applications/${applicationId}/status`),
    
    // Notifications
    getUserNotifications: (params) => apiClient.get('/users/notifications', { params }),
    markNotificationAsRead: (notificationId) => apiClient.put(`/users/notifications/${notificationId}/read`),
    deleteNotification: (notificationId) => apiClient.delete(`/users/notifications/${notificationId}`),
  },

  // Staff endpoints
  staff: {
    getDashboard: () => apiClient.get('/staff/dashboard'),
    getAllServices: (params) => apiClient.get('/staff/services', { params }),
    getServiceDetails: (serviceId) => apiClient.get(`/staff/services/${serviceId}`),
    getApplications: (params) => apiClient.get('/staff/applications', { params }),
    getApplicationDetails: (applicationId) => apiClient.get(`/staff/applications/${applicationId}`),
    updateApplicationStatus: (applicationId, statusData) => 
      apiClient.put(`/staff/applications/${applicationId}/status`, statusData),
    addApplicationComment: (applicationId, commentData) => 
      apiClient.post(`/staff/applications/${applicationId}/comments`, commentData),
    getApplicationHistory: (applicationId) => 
      apiClient.get(`/staff/applications/${applicationId}/history`),
    getApplicationsStats: () => apiClient.get('/staff/applications/stats'),
    searchApplications: (params) => apiClient.get('/staff/applications/search', { params }),
    getStaffNotifications: (params) => apiClient.get('/staff/notifications', { params }),
    markNotificationAsRead: (notificationId) => 
      apiClient.put(`/staff/notifications/${notificationId}/read`),
  },

  // Officer/Admin endpoints
  officer: {
    // Dashboard & Analytics
    getAdminDashboard: () => apiClient.get('/officers/dashboard'),
    getSystemAnalytics: (params) => apiClient.get('/officers/analytics', { params }),
    
    // Service Management
    createService: (serviceData) => apiClient.post('/officers/services', serviceData),
    getAllServicesAdmin: (params) => apiClient.get('/officers/services', { params }),
    getServiceDetailsAdmin: (serviceId) => apiClient.get(`/officers/services/${serviceId}`),
    updateService: (serviceId, serviceData) => apiClient.put(`/officers/services/${serviceId}`, serviceData),
    deleteService: (serviceId) => apiClient.delete(`/officers/services/${serviceId}`),
    toggleServiceStatus: (serviceId) => apiClient.patch(`/officers/services/${serviceId}/toggle-status`),
    
    // Application Management
    getAllApplications: (params) => apiClient.get('/officers/applications', { params }),
    getApplicationDetailsAdmin: (applicationId) => apiClient.get(`/officers/applications/${applicationId}`),
    updateApplicationStatusAdmin: (applicationId, statusData) => 
      apiClient.put(`/officers/applications/${applicationId}/status`, statusData),
    bulkUpdateApplicationStatus: (bulkData) => 
      apiClient.put('/officers/applications/bulk-status-update', bulkData),
    deleteApplication: (applicationId) => apiClient.delete(`/officers/applications/${applicationId}`),
    
    // User Management
    getAllUsers: (params) => apiClient.get('/officers/users', { params }),
    getUserDetails: (userId) => apiClient.get(`/officers/users/${userId}`),
    updateUserRole: (userId, roleData) => apiClient.patch(`/officers/users/${userId}/role`, roleData),
    toggleUserStatus: (userId) => apiClient.patch(`/officers/users/${userId}/toggle-status`),
    
    // Staff Management
    createStaffAccount: (staffData) => apiClient.post('/officers/staff', staffData),
    getAllStaff: (params) => apiClient.get('/officers/staff', { params }),
    updateStaffDetails: (staffId, staffData) => apiClient.put(`/officers/staff/${staffId}`, staffData),
    deleteStaffAccount: (staffId) => apiClient.delete(`/officers/staff/${staffId}`),
    
    // Scheme Management
    createScheme: (schemeData) => apiClient.post('/officers/schemes', schemeData),
    getAllSchemes: (params) => apiClient.get('/officers/schemes', { params }),
    updateScheme: (schemeId, schemeData) => apiClient.put(`/officers/schemes/${schemeId}`, schemeData),
    deleteScheme: (schemeId) => apiClient.delete(`/officers/schemes/${schemeId}`),
    
    // Reports & Audit
    getAuditLogs: (params) => apiClient.get('/officers/audit-logs', { params }),
    generateReport: (reportType, params) => apiClient.get(`/officers/reports/${reportType}`, { params }),
    exportData: (dataType, params) => apiClient.get(`/officers/export/${dataType}`, { params }),
  },

  // Utility endpoints
  health: () => apiClient.get('/health'),
};

// Helper functions for common API patterns

// Paginated request helper
export const getPaginatedData = async (endpoint, params = {}) => {
  try {
    const response = await endpoint(params);
    return {
      data: response.data.data,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
      success: true,
    };
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Upload file helper
export const uploadFile = async (file, path) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);
  
  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Download file helper
export const downloadFile = async (url, filename) => {
  try {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    window.URL.revokeObjectURL(link.href);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    toast.error('Failed to download file');
    return false;
  }
};

// Health check helper
export const checkAPIHealth = async () => {
  try {
    const response = await api.health();
    return response.data.status === 'OK';
  } catch (error) {
    return false;
  }
};

// Export API instance and endpoints
export { apiClient };
export default api;
