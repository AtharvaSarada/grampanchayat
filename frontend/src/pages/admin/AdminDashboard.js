import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Fab,
  Tooltip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  Settings,
  Add,
  Edit,
  Delete,
  Visibility,
  CheckCircle,
  Cancel,
  Warning,
  TrendingUp,
  PersonAdd,
  Build,
  Work,
  Message,
  Schedule,
  Folder
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import DocumentManager from '../../components/documents/DocumentManager';
import InternalMessaging from '../../components/messaging/InternalMessaging';
import AppointmentScheduler from '../../components/appointments/AppointmentScheduler';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { createSampleData, createAllSampleData } from '../../utils/createSampleData';
import ChakraSpinner from '../../components/common/ChakraSpinner';
import { getAllServices } from '../../data/servicesData';

// Generate secure random password
const generateSecurePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Send password email notification
const sendPasswordEmail = async (email, password, firstName, lastName) => {
  try {
    // This would typically be done through a backend service
    // For now, we'll use the notification service
    const { notifyPasswordCreated } = await import('../../services/notificationService');
    await notifyPasswordCreated(email, password, firstName, lastName);
  } catch (error) {
    console.error('Error sending password email:', error);
  }
};

// Convert servicesData to admin-compatible format
const convertServicesDataToAdminFormat = () => {
  const allServices = getAllServices();
  return allServices.map(service => ({
    name: service.title,
    description: service.description,
    category: service.category,
    requiredDocuments: service.documentsRequired ? service.documentsRequired.join(', ') : 'Standard documents required',
    processingTime: service.processingTime,
    fee: parseInt(service.fee.replace('₹', '').replace('Free', '0')) || 0,
    status: 'active',
    isAvailable: true,
    serviceId: service.id
  }));
};

// Seed all 21 services if none exist
const seedDefaultServices = async (currentUserId) => {
  try {
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    if (servicesSnapshot.empty) {
      console.log('No services found, seeding all 21 services...');
      
      const allServices = convertServicesDataToAdminFormat();
      
      for (const service of allServices) {
        const serviceData = {
          ...service,
          createdBy: currentUserId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await addDoc(collection(db, 'services'), serviceData);
      }
      
      toast.success(`All ${allServices.length} services have been added to the system`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error seeding default services:', error);
    return false;
  }
};

// Force populate all 21 services (for admin use)
const populateAllServices = async (currentUserId) => {
  try {
    console.log('Force populating all 21 services...');
    
    const allServices = convertServicesDataToAdminFormat();
    console.log('Services to populate:', allServices.length, allServices);
    
    // Get existing services to avoid duplicates
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    const existingServices = servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    let addedCount = 0;
    let updatedCount = 0;
    
    for (const service of allServices) {
      // Check if service already exists by name or serviceId
      const existingService = existingServices.find(
        existing => existing.name === service.name || existing.serviceId === service.serviceId
      );
      
      const serviceData = {
        ...service,
        createdBy: currentUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      if (existingService) {
        // Update existing service
        const serviceRef = doc(db, 'services', existingService.id);
        await updateDoc(serviceRef, {
          ...serviceData,
          createdAt: existingService.createdAt, // Keep original creation date
        });
        updatedCount++;
      } else {
        // Add new service
        await addDoc(collection(db, 'services'), serviceData);
        addedCount++;
      }
    }
    
    toast.success(`Services populated: ${addedCount} added, ${updatedCount} updated. Total: ${allServices.length} services`);
    return true;
  } catch (error) {
    console.error('Error populating all services:', error);
    toast.error('Failed to populate services');
    return false;
  }
};

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalServices: 0
  });
  
  // Data states
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  
  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    phone: '',
    password: '',
    sendPasswordEmail: true
  });
  
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    category: '',
    requiredDocuments: '',
    processingTime: '',
    fee: '',
    status: 'active',
    isAvailable: true
  });

  useEffect(() => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'officer')) {
      loadDashboardData();
    }
  }, [currentUser]);

  // Refresh services when Services tab is selected
  useEffect(() => {
    if (activeTab === 3 && currentUser) { // Services tab index is 3
      refreshServices();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      
      // Load applications
      const applicationsSnapshot = await getDocs(collection(db, 'applications'));
      const applicationsData = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(applicationsData);
      
      // Load services with proper ordering
      const servicesQuery = query(
        collection(db, 'services'),
        orderBy('name')
      );
      const servicesSnapshot = await getDocs(servicesQuery);
      let servicesData = servicesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure proper data types
          fee: data.fee || 0,
          status: data.status || 'active',
          isAvailable: data.isAvailable !== false,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        };
      });
      
      console.log('Loaded services:', servicesData.length, servicesData);
      
      // If no services exist, seed default services
      if (servicesData.length === 0) {
        const seeded = await seedDefaultServices(currentUser.uid);
        if (seeded) {
          // Reload services after seeding
          const newServicesSnapshot = await getDocs(servicesQuery);
          servicesData = newServicesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              fee: data.fee || 0,
              status: data.status || 'active',
              isAvailable: data.isAvailable !== false,
              createdAt: data.createdAt?.toDate?.() || new Date(),
              updatedAt: data.updatedAt?.toDate?.() || new Date()
            };
          });
        }
      }
      
      setServices(servicesData);
      
      // Calculate stats
      setStats({
        totalUsers: usersData.length,
        totalApplications: applicationsData.length,
        pendingApplications: applicationsData.filter(app => app.status === 'Pending').length,
        totalServices: servicesData.length
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        role: newRole,
        updatedAt: new Date()
      });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleCreateUser = async () => {
    try {
      if (!userForm.firstName || !userForm.lastName || !userForm.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate phone number (exactly 10 digits)
      if (userForm.phone && !/^\d{10}$/.test(userForm.phone)) {
        toast.error('Invalid phone number - must be exactly 10 digits');
        return;
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate names (alphabetic only)
      if (!/^[a-zA-Z\s]+$/.test(userForm.firstName) || !/^[a-zA-Z\s]+$/.test(userForm.lastName)) {
        toast.error('Names should contain only alphabetic characters');
        return;
      }

      // Generate password if not provided
      const password = userForm.password || generateSecurePassword();
      
      // Validate password strength
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }

      toast.loading('Creating user account...', { id: 'create-user' });

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userForm.email.trim().toLowerCase(), 
        password
      );

      // Store user profile data in Firestore
      const userData = {
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        name: `${userForm.firstName.trim()} ${userForm.lastName.trim()}`,
        email: userForm.email.trim().toLowerCase(),
        phone: userForm.phone.trim(),
        role: userForm.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: currentUser.uid,
        isAdminCreated: true,
        mustChangePassword: !userForm.password // If auto-generated, user must change it
      };
      
      // Store in Firestore with the Auth UID as document ID
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, userData);

      // Send password email if requested
      if (userForm.sendPasswordEmail) {
        await sendPasswordEmail(
          userForm.email.trim(), 
          password, 
          userForm.firstName.trim(), 
          userForm.lastName.trim()
        );
        toast.success('User created and password sent via email!', { id: 'create-user' });
      } else {
        toast.success(`User created! Password: ${password}`, { 
          id: 'create-user',
          duration: 10000 // Show for 10 seconds so admin can copy
        });
      }

      // Update local state
      setUsers([...users, { id: userCredential.user.uid, ...userData }]);
      setUserDialogOpen(false);
      setUserForm({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        role: 'user', 
        phone: '', 
        password: '', 
        sendPasswordEmail: true 
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(
        error.code === 'auth/email-already-in-use' 
          ? 'A user with this email already exists' 
          : 'Failed to create user', 
        { id: 'create-user' }
      );
    }
  };

  const handleUpdateUser = async () => {
    try {
      if (!userForm.firstName || !userForm.lastName || !userForm.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate phone number (exactly 10 digits)
      if (userForm.phone && !/^\d{10}$/.test(userForm.phone)) {
        toast.error('Invalid phone number - must be exactly 10 digits');
        return;
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate names (alphabetic only)
      if (!/^[a-zA-Z\s]+$/.test(userForm.firstName) || !/^[a-zA-Z\s]+$/.test(userForm.lastName)) {
        toast.error('Names should contain only alphabetic characters');
        return;
      }

      const updateData = {
        ...userForm,
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        name: `${userForm.firstName.trim()} ${userForm.lastName.trim()}`, // For backward compatibility
        email: userForm.email.trim().toLowerCase(),
        phone: userForm.phone.trim(),
        updatedAt: new Date()
      };

      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, updateData);
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...updateData } : user
      ));
      
      setUserDialogOpen(false);
      setSelectedUser(null);
      setUserForm({ firstName: '', lastName: '', email: '', role: 'user', phone: '' });
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleCreateService = async () => {
    try {
      if (!serviceForm.name || !serviceForm.description) {
        toast.error('Please fill in service name and description');
        return;
      }

      const serviceData = {
        ...serviceForm,
        name: serviceForm.name.trim(),
        description: serviceForm.description.trim(),
        category: serviceForm.category.trim(),
        requiredDocuments: serviceForm.requiredDocuments.trim(),
        processingTime: serviceForm.processingTime.trim(),
        fee: serviceForm.fee ? parseFloat(serviceForm.fee) : 0,
        status: serviceForm.status || 'active',
        isAvailable: serviceForm.isAvailable !== false,
        createdBy: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'services'), serviceData);
      setServices([...services, { id: docRef.id, ...serviceData }]);
      setServiceDialogOpen(false);
      setServiceForm({ 
        name: '', 
        description: '', 
        category: '', 
        requiredDocuments: '', 
        processingTime: '',
        fee: '',
        status: 'active',
        isAvailable: true
      });
      toast.success('Service created successfully');
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service');
    }
  };

  const handleUpdateService = async () => {
    try {
      if (!serviceForm.name || !serviceForm.description) {
        toast.error('Please fill in service name and description');
        return;
      }

      const updateData = {
        ...serviceForm,
        name: serviceForm.name.trim(),
        description: serviceForm.description.trim(),
        category: serviceForm.category.trim(),
        requiredDocuments: serviceForm.requiredDocuments.trim(),
        processingTime: serviceForm.processingTime.trim(),
        fee: serviceForm.fee ? parseFloat(serviceForm.fee) : 0,
        status: serviceForm.status || 'active',
        isAvailable: serviceForm.isAvailable !== false,
        updatedAt: new Date()
      };

      const serviceRef = doc(db, 'services', selectedService.id);
      await updateDoc(serviceRef, updateData);
      
      setServices(services.map(service => 
        service.id === selectedService.id ? { ...service, ...updateData } : service
      ));
      
      setServiceDialogOpen(false);
      setSelectedService(null);
      setServiceForm({ 
        name: '', 
        description: '', 
        category: '', 
        requiredDocuments: '', 
        processingTime: '',
        fee: '',
        status: 'active',
        isAvailable: true
      });
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', serviceId));
        setServices(services.filter(service => service.id !== serviceId));
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Under Review': return 'info';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'staff': return 'primary';
      case 'officer': return 'secondary';
      case 'user': return 'default';
      default: return 'default';
    }
  };

  // Statistics Cards Component
  const StatsCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <People color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalUsers}</Typography>
                <Typography color="text.secondary">Total Users</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Assignment color="info" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalApplications}</Typography>
                <Typography color="text.secondary">Total Applications</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.pendingApplications}</Typography>
                <Typography color="text.secondary">Pending Applications</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Build color="success" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.totalServices}</Typography>
                <Typography color="text.secondary">Total Services</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Users Management Tab
  const UsersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">User Management</Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => {
            setSelectedUser(null);
            setUserForm({ firstName: '', lastName: '', email: '', role: 'user', phone: '', password: '', sendPasswordEmail: true });
            setUserDialogOpen(true);
          }}
        >
          Add User
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={getRoleColor(user.role)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{user.phone || 'N/A'}</TableCell>
                <TableCell>
                  {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ mr: 1, minWidth: 80 }}>
                    <Select
                      value={user.role}
                      onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="staff">Staff</MenuItem>
                      <MenuItem value="officer">Officer</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setUserForm({
                        firstName: user.firstName || user.name?.split(' ')[0] || '',
                        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
                        email: user.email || '',
                        role: user.role || 'user',
                        phone: user.phone || '',
                        password: '', // Don't show existing password
                        sendPasswordEmail: true
                      });
                      setUserDialogOpen(true);
                    }}
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.id === currentUser.uid}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Applications Management Tab
  const ApplicationsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Application Oversight</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application ID</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.slice(0, 10).map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.id.substring(0, 8)}...</TableCell>
                <TableCell>{application.serviceId}</TableCell>
                <TableCell>{application.userId}</TableCell>
                <TableCell>
                  <Chip 
                    label={application.status} 
                    color={getStatusColor(application.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{application.assignedTo || 'Unassigned'}</TableCell>
                <TableCell>
                  {application.submittedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Refresh services data
  const refreshServices = async () => {
    try {
      const servicesQuery = query(
        collection(db, 'services'),
        orderBy('name')
      );
      const servicesSnapshot = await getDocs(servicesQuery);
      const servicesData = servicesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fee: data.fee || 0,
          status: data.status || 'active',
          isAvailable: data.isAvailable !== false,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        };
      });
      setServices(servicesData);
      
      toast.success(`Loaded ${servicesData.length} services`);
    } catch (error) {
      console.error('Error refreshing services:', error);
      toast.error('Failed to refresh services');
    }
  };

  const handleCreateSampleData = async () => {
    try {
      setLoading(true);
      await createAllSampleData();
      toast.success('Sample data created successfully!');
      // Reload dashboard data
      await loadDashboardData();
    } catch (error) {
      console.error('Error creating sample data:', error);
      toast.error('Failed to create sample data');
    } finally {
      setLoading(false);
    }
  };

  const handlePopulateAllServices = async () => {
    try {
      setLoading(true);
      await populateAllServices(currentUser.uid);
      // Reload services data
      await refreshServices();
      // Reload dashboard data to update stats
      await loadDashboardData();
    } catch (error) {
      console.error('Error populating services:', error);
      toast.error('Failed to populate services');
    } finally {
      setLoading(false);
    }
  };

  // Toggle service availability
  const handleToggleServiceAvailability = async (serviceId, currentStatus) => {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      const newStatus = !currentStatus;
      
      await updateDoc(serviceRef, {
        isAvailable: newStatus,
        status: newStatus ? 'active' : 'temporarily_unavailable',
        updatedAt: new Date()
      });
      
      setServices(services.map(service => 
        service.id === serviceId 
          ? { ...service, isAvailable: newStatus, status: newStatus ? 'active' : 'temporarily_unavailable' }
          : service
      ));
      
      toast.success(`Service ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling service availability:', error);
      toast.error('Failed to update service status');
    }
  };

  // Services Management Tab
  const ServicesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Service Management ({services.length} services)</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<TrendingUp />}
            onClick={refreshServices}
          >
            Refresh Services
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Add />}
            onClick={handlePopulateAllServices}
            disabled={loading}
          >
            Populate All 21 Services
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedService(null);
              setServiceForm({ 
                name: '', 
                description: '', 
                category: '', 
                requiredDocuments: '', 
                processingTime: '',
                fee: '',
                status: 'active',
                isAvailable: true
              });
              setServiceDialogOpen(true);
            }}
          >
            Add Service
          </Button>
        </Box>
      </Box>

      {services.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Services Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get started by adding your first service
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedService(null);
              setServiceForm({ 
                name: '', 
                description: '', 
                category: '', 
                requiredDocuments: '', 
                processingTime: '',
                fee: '',
                status: 'active',
                isAvailable: true
              });
              setServiceDialogOpen(true);
            }}
          >
            Add First Service
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Fee</TableCell>
                <TableCell>Processing Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{service.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {service.description?.substring(0, 50)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={service.category || 'Uncategorized'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {service.fee && service.fee > 0 ? `₹${service.fee}` : 'Free'}
                  </TableCell>
                  <TableCell>{service.processingTime || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={service.status === 'active' ? 'Active' : 'Inactive'} 
                      color={service.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={service.isAvailable !== false ? 'Available' : 'Temporarily Unavailable'} 
                      color={service.isAvailable !== false ? 'primary' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Service">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedService(service);
                            setServiceForm({
                              name: service.name || '',
                              description: service.description || '',
                              category: service.category || '',
                              requiredDocuments: service.requiredDocuments || '',
                              processingTime: service.processingTime || '',
                              fee: service.fee || '',
                              status: service.status || 'active',
                              isAvailable: service.isAvailable !== false
                            });
                            setServiceDialogOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={service.isAvailable !== false ? 'Mark as Unavailable' : 'Mark as Available'}>
                        <IconButton
                          size="small"
                          color={service.isAvailable !== false ? 'warning' : 'success'}
                          onClick={() => handleToggleServiceAvailability(service.id, service.isAvailable)}
                        >
                          {service.isAvailable !== false ? <Cancel /> : <CheckCircle />}
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Service">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  // Overview Tab
  const OverviewTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>System Overview</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <Typography variant="body2" color="text.secondary">
                System activity and user engagement metrics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" onClick={() => setActiveTab(1)}>
                  Manage Users
                </Button>
                <Button variant="outlined" onClick={() => setActiveTab(3)}>
                  Manage Services
                </Button>
                <Button variant="outlined" onClick={() => setActiveTab(8)}>
                  View Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );



  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <ChakraSpinner size="40px" />
        </Box>
      </Container>
    );
  }

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'officer')) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">
            Access denied. You need admin or officer privileges to access this dashboard.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" gutterBottom color="primary">
                <Dashboard sx={{ mr: 2, verticalAlign: 'middle' }} />
                Admin Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage users, oversee applications, and configure services
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateSampleData}
              disabled={loading}
              startIcon={<Add />}
            >
              Create Sample Data
            </Button>
          </Box>
        </Paper>

        {/* Statistics Cards */}
        <StatsCards />

        {/* Management Tabs */}
        <Paper elevation={3}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="scrollable" scrollButtons="auto">
              <Tab icon={<Dashboard />} label="Overview" />
              <Tab icon={<People />} label="Users" />
              <Tab icon={<Assignment />} label="Applications" />
              <Tab icon={<Build />} label="Services" />
              <Tab icon={<Message />} label="Messages" />
              <Tab icon={<Schedule />} label="Appointments" />
              <Tab icon={<Folder />} label="Documents" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: activeTab === 4 || activeTab === 5 || activeTab === 6 ? 0 : 3 }}>
            {activeTab === 0 && <OverviewTab />}
            {activeTab === 1 && <UsersTab />}
            {activeTab === 2 && <ApplicationsTab />}
            {activeTab === 3 && <ServicesTab />}
            {activeTab === 4 && <InternalMessaging />}
            {activeTab === 5 && <AppointmentScheduler userRole="admin" />}
            {activeTab === 6 && <DocumentManager userRole="admin" />}
          </Box>
        </Paper>

        {/* User Dialog */}
        <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Create New User'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                  required
                  helperText="Alphabetic characters only"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                  required
                  helperText="Alphabetic characters only"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  helperText="Valid email format required"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    label="Role"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="officer">Officer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  helperText="Exactly 10 digits required"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              {!selectedUser && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password (Optional)"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      helperText="Leave blank to auto-generate a secure password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={userForm.sendPasswordEmail}
                          onChange={(e) => setUserForm({ ...userForm, sendPasswordEmail: e.target.checked })}
                        />
                      }
                      label="Send password via email to user"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setUserDialogOpen(false);
              setSelectedUser(null);
              setUserForm({ firstName: '', lastName: '', email: '', role: 'user', phone: '', password: '', sendPasswordEmail: true });
            }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={selectedUser ? handleUpdateUser : handleCreateUser}
            >
              {selectedUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Service Dialog */}
        <Dialog open={serviceDialogOpen} onClose={() => setServiceDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedService ? 'Edit Service' : 'Create New Service'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Processing Time"
                  value={serviceForm.processingTime}
                  onChange={(e) => setServiceForm({ ...serviceForm, processingTime: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Required Documents"
                  value={serviceForm.requiredDocuments}
                  onChange={(e) => setServiceForm({ ...serviceForm, requiredDocuments: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Fee (₹)"
                  type="number"
                  value={serviceForm.fee}
                  onChange={(e) => setServiceForm({ ...serviceForm, fee: e.target.value })}
                  helperText="Leave blank if service is free"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Status</InputLabel>
                  <Select
                    value={serviceForm.status}
                    onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                    label="Service Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="temporarily_unavailable">Temporarily Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={serviceForm.isAvailable}
                      onChange={(e) => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })}
                    />
                  }
                  label="Service is currently available to users"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setServiceDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={selectedService ? handleUpdateService : handleCreateService}
            >
              {selectedService ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
