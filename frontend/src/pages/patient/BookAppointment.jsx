import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));
const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
  });
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDoctors();
  }, [navigate]);
  useEffect(() => {
    if (appointmentData.doctorId && appointmentData.date) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [appointmentData.doctorId, appointmentData.date, fetchAvailableSlots]);
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/doctor/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to fetch doctors. Please try again later.');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAvailableSlots = useCallback(async () => {
    try {
      setError('');
      if (!appointmentData.doctorId || !appointmentData.date) {
        setAvailableSlots([]);
        return;
      }
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }
      console.log('Fetching slots with:', {
        doctorId: appointmentData.doctorId,
        date: appointmentData.date
      });
      const response = await axios.get('/api/patient/available-slots', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          doctorId: appointmentData.doctorId,
          date: appointmentData.date,
        },
      });
      console.log('Server response:', response.data);
      if (response.data && response.data.availableSlots) {
        setAvailableSlots(response.data.availableSlots);
        if (response.data.availableSlots.length === 0) {
          setError('No available slots for the selected date. Please choose another date.');
        }
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response format from server. Please try again.');
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Error fetching available slots:', err.response || err);
      if (err.response?.status === 404) {
        setError('The available slots service is not available. Please try again later.');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to fetch available time slots. Please try again.');
      }
      setAvailableSlots([]);
    }
  }, [appointmentData.doctorId, appointmentData.date, navigate]);
  const formatTimeSlot = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    if (name === 'date' || name === 'doctorId') {
      setAppointmentData(prev => ({
        ...prev,
        [name]: value,
        time: ''
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Your session has expired. Please login again.');
        navigate('/login');
        return;
      }
      if (!appointmentData.doctorId || !appointmentData.date || !appointmentData.time || !appointmentData.reason) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }
      const selectedDate = new Date(appointmentData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        setError('Cannot book appointments for past dates');
        setLoading(false);
        return;
      }
      const requestData = {
        doctorId: appointmentData.doctorId,
        date: appointmentData.date,
        time: appointmentData.time,
        reason: appointmentData.reason
      };
      console.log('Submitting appointment request:', {
        requestData,
        url: '/api/patient/appointments'
      });
      const response = await axios.post('/api/patient/appointments', requestData);
      console.log('Server response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      if (response.data && response.data.message) {
        const appointment = response.data.appointment;
        const doctorName = appointment.doctorId ? 
          `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 
          'Unknown Doctor';
        setSuccess(`Appointment booked successfully with ${doctorName} for ${appointment.date} at ${appointment.time}`);
        setAppointmentData({
          doctorId: '',
          date: '',
          time: '',
          reason: ''
        });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          error.message ||
                          'Failed to book appointment. Please try again.';
      setError(errorMessage);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  const today = new Date().toISOString().split('T')[0];
  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom>
          Book an Appointment
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Doctor</InputLabel>
                <Select
                  name="doctorId"
                  value={appointmentData.doctorId}
                  onChange={handleChange}
                  required
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Appointment Date"
                value={appointmentData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Time</InputLabel>
                <Select
                  name="time"
                  value={appointmentData.time}
                  onChange={handleChange}
                  required
                  disabled={!appointmentData.date || availableSlots.length === 0}
                >
                  {availableSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {formatTimeSlot(slot)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="reason"
                label="Reason for Visit"
                value={appointmentData.reason}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !appointmentData.time}
              >
                {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </StyledPaper>
    </Container>
  );
};
export default BookAppointment; 