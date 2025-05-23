import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CalendarMonth,
  AccessTime,
  Person,
  CheckCircle,
  Cancel,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { isSameDay } from 'date-fns';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const AppointmentCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const IconText = ({ icon: Icon, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
    {Icon && <Icon color="primary" fontSize="small" />}
    {children}
  </Box>
);

const StatusIcon = ({ status }) => {
  const IconComponent = (() => {
    switch (status.toLowerCase()) {
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return Cancel;
      default:
        return AccessTime;
    }
  })();
  return <IconComponent fontSize="small" />;
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view appointments');
        return;
      }
      console.log('Fetching doctor appointments with token:', token.substring(0, 10) + '...');
      const response = await axios.get(API_ENDPOINTS.DOCTOR.APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched doctor appointments:', response.data);
      if (response.data && Array.isArray(response.data)) {
        console.log('Number of appointments:', response.data.length);
        if (response.data.length > 0) {
          console.log('First appointment example:', response.data[0]);
        }
        setAppointments(response.data);
      } else {
        console.log('Unexpected response format:', typeof response.data);
        setError('Received invalid data format from server');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || '');
    setStatus(appointment.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update appointments');
        return;
      }
      const endpoint = `${API_ENDPOINTS.DOCTOR.APPOINTMENTS}/${selectedAppointment._id}`;
      console.log(`Updating appointment at: ${endpoint}`);
      console.log('Update data:', { status, notes });
      const response = await axios.put(
        endpoint,
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Update response:', response.data);
      setAppointments(appointments.map(apt => 
        apt._id === selectedAppointment._id 
          ? { 
              ...apt, 
              notes, 
              status,
              statusColor: getStatusColor(status)
            }
          : apt
      ));
      handleClose();
      setError(''); 
      alert('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error);
      console.error('Error response data:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to update appointment';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const isDateMatch = selectedDate ? isSameDay(aptDate, selectedDate) : true;
    const isStatusMatch = selectedStatus ? apt.status === selectedStatus : true;
    const searchLower = search.toLowerCase();
    const patientName = ((apt.patientId && (apt.patientId.firstName || apt.patientId.lastName)) ? 
      `${apt.patientId.firstName || ''} ${apt.patientId.lastName || ''}`.toLowerCase() : 
      '');
    const isSearchMatch = (!search || 
      (patientName.includes(searchLower) || 
      (apt.reason && apt.reason.toLowerCase().includes(searchLower))));
    return isDateMatch && isStatusMatch && isSearchMatch;
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        Appointments
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {appointments.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No appointments found
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAppointments.map((appointment) => (
            <Grid item xs={12} md={6} lg={4} key={appointment._id}>
              <AppointmentCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>
                      {appointment.patientName && appointment.patientName[0] || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {appointment.patientName || 'Unknown Patient'}
                      </Typography>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                        icon={<StatusIcon status={appointment.status} />}
                      />
                    </Box>
                  </Box>
                  <IconText icon={CalendarMonth}>
                    <Typography>{new Date(appointment.date).toLocaleDateString()}</Typography>
                  </IconText>
                  <IconText icon={AccessTime}>
                    <Typography>{appointment.time}</Typography>
                  </IconText>
                  <IconText icon={Person}>
                    <Typography>{appointment.reason}</Typography>
                  </IconText>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      onClick={() => handleOpen(appointment)}
                      sx={{ borderRadius: 2 }}
                    >
                      Manage
                    </Button>
                  </Box>
                </CardContent>
              </AppointmentCard>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedAppointment.patientName || 'Unknown Patient'}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="pending">
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTime fontSize="small" /> Pending
                    </Box>
                  </MenuItem>
                  <MenuItem value="confirmed">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircle fontSize="small" color="primary" /> Confirmed
                    </Box>
                  </MenuItem>
                  <MenuItem value="completed">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircle fontSize="small" /> Completed
                    </Box>
                  </MenuItem>
                  <MenuItem value="cancelled">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Cancel fontSize="small" /> Cancelled
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={4}
                margin="normal"
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments; 