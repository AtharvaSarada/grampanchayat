import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Edit,
  Delete,
  PersonAdd,
  Search,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import toast from 'react-hot-toast';
import ChakraSpinner from '../../components/common/ChakraSpinner';

const AdminUsers = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      password: ''
    });
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        phone: userForm.phone,
        role: userForm.role,
        updatedAt: new Date()
      });
      
      toast.success('User updated successfully');
      setEditDialogOpen(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleCreateUser = async () => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userForm.email,
        userForm.password || 'Password123!'
      );

      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        phone: userForm.phone,
        role: userForm.role,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success('User created successfully');
      setCreateDialogOpen(false);
      setUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user',
        password: ''
      });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'staff': return 'warning';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <ChakraSpinner size="40px" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadUsers}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create User
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role Filter</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Role Filter"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Alert severity="info" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                {filteredUsers.length} users found
              </Alert>
            </Grid>
          </Grid>
        </Paper>

        {/* Users Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role?.toUpperCase()}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={user.id === currentUser?.uid}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    label="Role"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateUser}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                  required
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  helperText="Leave empty to use default: Password123!"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    label="Role"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="staff">Staff</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateUser}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminUsers;
