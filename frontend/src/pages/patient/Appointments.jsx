import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
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

const IconText = ({ icon: Icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
    <Icon size={20} />
    <Typography variant="body2">{text}</Typography>
  </Box>
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view appointments');
        return;
      }
      console.log('Fetching patient appointments with token:', token.substring(0, 10) + '...');
      const response = await axios.get(API_ENDPOINTS.PATIENT.APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched patient appointments response:', response.data);
      if (response.data && Array.isArray(response.data)) {
        console.log('Number of appointments:', response.data.length);
        console.log('First appointment (if any):', response.data[0] || 'No appointments');
      } else {
        console.log('Unexpected response format:', typeof response.data);
      }
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const handleCancelAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_ENDPOINTS.PATIENT.APPOINTMENTS}/${selectedAppointment._id}/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointments.map(apt =>
        apt._id === selectedAppointment._id
          ? { ...apt, status: 'cancelled', cancelReason }
          : apt
      ));
      setCancelDialogOpen(false);
      setCancelReason('');
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError(error.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'pending':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'pending':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Grid item xs={12} md={6} key={appointment._id}>
              <AppointmentCard>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Dr. {appointment.doctorId ? 
                        `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 
                        (appointment.doctorName || 'Unknown')}
                    </Typography>
                    <Chip
                      label={appointment.status}
                      sx={{
                        bgcolor: getStatusColor(appointment.status),
                        color: 'white',
                      }}
                      icon={React.createElement(getStatusIcon(appointment.status), {
                        size: 16,
                        style: { color: 'white' },
                      })}
                    />
                  </Box>
                  <IconText
                    icon={Calendar}
                    text={new Date(appointment.date).toLocaleDateString()}
                  />
                  <IconText
                    icon={Clock}
                    text={appointment.time}
                  />
                  {appointment.reason && (
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                      Reason: {appointment.reason}
                    </Typography>
                  )}
                  {appointment.status === 'pending' && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelClick(appointment)}
                      >
                        Cancel Appointment
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </AppointmentCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No appointments found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Book an appointment to get started
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for cancellation"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Appointment
          </Button>
          <Button 
            onClick={handleCancelAppointment} 
            color="error"
            disabled={!cancelReason.trim()}
          >
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Appointments; 