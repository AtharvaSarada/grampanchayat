import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import {
  Schedule,
  Add,
  Edit,
  Delete,
  Person,
  LocationOn,
  AccessTime,
  CalendarToday,
  Check,
  Close
} from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
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
import { format, addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';

const AppointmentScheduler = ({ userRole = 'user' }) => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: new Date(),
    duration: 30,
    location: '',
    serviceType: '',
    status: 'scheduled'
  });

  const serviceTypes = [
    'Birth Certificate',
    'Death Certificate',
    'Marriage Certificate',
    'Income Certificate',
    'Caste Certificate',
    'Domicile Certificate',
    'Property Registration',
    'Tax Payment',
    'License Application',
    'General Inquiry'
  ];

  const appointmentStatuses = [
    'scheduled',
    'confirmed',
    'in-progress',
    'completed',
    'cancelled',
    'rescheduled'
  ];

  useEffect(() => {
    loadAppointments();
  }, [currentUser]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      let appointmentsQuery;

      if (userRole === 'user') {
        // Load user's appointments
        appointmentsQuery = query(
          collection(db, 'appointments'),
          where('userId', '==', currentUser.uid),
          orderBy('appointmentDate', 'asc')
        );
      } else {
        // Load all appointments for staff/admin
        appointmentsQuery = query(
          collection(db, 'appointments'),
          orderBy('appointmentDate', 'asc')
        );
      }

      const snapshot = await getDocs(appointmentsQuery);
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appointmentDate: doc.data().appointmentDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setAppointmentForm({
      title: '',
      description: '',
      date: addDays(new Date(), 1), // Default to tomorrow
      time: new Date(),
      duration: 30,
      location: 'Gram Panchayat Office',
      serviceType: '',
      status: 'scheduled'
    });
    setDialogOpen(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentForm({
      title: appointment.title,
      description: appointment.description,
      date: appointment.appointmentDate,
      time: appointment.appointmentDate,
      duration: appointment.duration,
      location: appointment.location,
      serviceType: appointment.serviceType,
      status: appointment.status
    });
    setDialogOpen(true);
  };

  const handleSaveAppointment = async () => {
    try {
      // Combine date and time
      const appointmentDateTime = new Date(appointmentForm.date);
      appointmentDateTime.setHours(appointmentForm.time.getHours());
      appointmentDateTime.setMinutes(appointmentForm.time.getMinutes());

      // Validate appointment is in the future
      if (isBefore(appointmentDateTime, new Date())) {
        toast.error('Appointment must be scheduled for a future date and time');
        return;
      }

      const appointmentData = {
        title: appointmentForm.title,
        description: appointmentForm.description,
        appointmentDate: appointmentDateTime,
        duration: appointmentForm.duration,
        location: appointmentForm.location,
        serviceType: appointmentForm.serviceType,
        status: appointmentForm.status,
        userId: currentUser.uid,
        userName: currentUser.name || currentUser.displayName,
        userEmail: currentUser.email,
        updatedAt: new Date()
      };

      if (selectedAppointment) {
        // Update existing appointment
        await updateDoc(doc(db, 'appointments', selectedAppointment.id), appointmentData);
        toast.success('Appointment updated successfully');
      } else {
        // Create new appointment
        appointmentData.createdAt = new Date();
        await addDoc(collection(db, 'appointments'), appointmentData);
        toast.success('Appointment scheduled successfully');
      }

      setDialogOpen(false);
      loadAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Failed to save appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success('Appointment status updated');
      loadAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'info';
      case 'confirmed': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rescheduled': return 'secondary';
      default: return 'default';
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => 
      isAfter(apt.appointmentDate, now) && 
      ['scheduled', 'confirmed'].includes(apt.status)
    );
  };

  const getTodayAppointments = () => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    return appointments.filter(apt => 
      isAfter(apt.appointmentDate, today) && 
      isBefore(apt.appointmentDate, tomorrow)
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
            Appointment Scheduler
          </Typography>
          {userRole === 'user' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateAppointment}
            >
              Schedule Appointment
            </Button>
          )}
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {getUpcomingAppointments().length}
                </Typography>
                <Typography color="text.secondary">
                  Upcoming
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {getTodayAppointments().length}
                </Typography>
                <Typography color="text.secondary">
                  Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </Typography>
                <Typography color="text.secondary">
                  Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main">
                  {appointments.filter(apt => apt.status === 'cancelled').length}
                </Typography>
                <Typography color="text.secondary">
                  Cancelled
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Appointments List */}
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {userRole === 'user' ? 'My Appointments' : 'All Appointments'}
            </Typography>
            
            {loading ? (
              <Typography>Loading appointments...</Typography>
            ) : appointments.length === 0 ? (
              <Alert severity="info">
                No appointments scheduled. 
                {userRole === 'user' && (
                  <Button onClick={handleCreateAppointment} sx={{ ml: 1 }}>
                    Schedule your first appointment
                  </Button>
                )}
              </Alert>
            ) : (
              <List>
                {appointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              {appointment.title}
                            </Typography>
                            <Chip
                              label={appointment.status}
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                              {format(appointment.appointmentDate, 'MMM dd, yyyy')}
                              <AccessTime sx={{ fontSize: 14, ml: 1, mr: 0.5 }} />
                              {format(appointment.appointmentDate, 'HH:mm')}
                              <LocationOn sx={{ fontSize: 14, ml: 1, mr: 0.5 }} />
                              {appointment.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Service: {appointment.serviceType}
                            </Typography>
                            {userRole !== 'user' && (
                              <Typography variant="body2" color="text.secondary">
                                <Person sx={{ fontSize: 14, mr: 0.5 }} />
                                {appointment.userName} ({appointment.userEmail})
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {userRole !== 'user' && appointment.status === 'scheduled' && (
                            <IconButton
                              size="small"
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              color="primary"
                              title="Confirm"
                            >
                              <Check />
                            </IconButton>
                          )}
                          
                          {(userRole === 'user' || ['admin', 'officer', 'staff'].includes(userRole)) && (
                            <IconButton
                              size="small"
                              onClick={() => handleEditAppointment(appointment)}
                              title="Edit"
                            >
                              <Edit />
                            </IconButton>
                          )}
                          
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            color="error"
                            title="Cancel"
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < appointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Appointment Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Appointment Title"
                  value={appointmentForm.title}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={appointmentForm.serviceType}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, serviceType: e.target.value }))}
                    label="Service Type"
                  >
                    {serviceTypes.map(service => (
                      <MenuItem key={service} value={service}>{service}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Appointment Date"
                  value={appointmentForm.date}
                  onChange={(newDate) => setAppointmentForm(prev => ({ ...prev, date: newDate }))}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Appointment Time"
                  value={appointmentForm.time}
                  onChange={(newTime) => setAppointmentForm(prev => ({ ...prev, time: newTime }))}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Duration (minutes)</InputLabel>
                  <Select
                    value={appointmentForm.duration}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, duration: e.target.value }))}
                    label="Duration (minutes)"
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={45}>45 minutes</MenuItem>
                    <MenuItem value={60}>1 hour</MenuItem>
                    <MenuItem value={90}>1.5 hours</MenuItem>
                    <MenuItem value={120}>2 hours</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={appointmentForm.location}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </Grid>
              
              {userRole !== 'user' && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={appointmentForm.status}
                      onChange={(e) => setAppointmentForm(prev => ({ ...prev, status: e.target.value }))}
                      label="Status"
                    >
                      {appointmentStatuses.map(status => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={appointmentForm.description}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAppointment} variant="contained">
              {selectedAppointment ? 'Update' : 'Schedule'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentScheduler;
