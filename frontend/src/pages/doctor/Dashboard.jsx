import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PendingActions as PendingIconMUI,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { API_ENDPOINTS } from '../../config/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    todayAppointments: [],
    stats: {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0
    }
  });
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      console.log('Fetching doctor dashboard data...');
      const response = await axios.get(API_ENDPOINTS.DOCTOR.DASHBOARD, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        console.log('Doctor dashboard data received successfully');
        const formattedData = {
          ...response.data,
          todayAppointments: (response.data.todayAppointments || []).map(apt => ({
            ...apt,
            formattedDate: format(new Date(apt.date), 'MMMM dd, yyyy'),
            formattedTime: apt.time ? format(new Date(`2000-01-01T${apt.time}`), 'hh:mm a') : 'N/A'
          }))
        };
        setDashboardData(formattedData);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.error || 
                           error.response?.data?.details || 
                           error.message || 
                           'Failed to fetch dashboard data. Please try again.';
      setError(errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); 
    return () => clearInterval(interval);
  }, [fetchDashboardData]);
  const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return <CheckCircleIcon color="success" />;
      case 'pending': return <PendingIconMUI color="warning" />;
      case 'cancelled': return <CancelIcon color="error" />;
      case 'completed': return <CheckCircleIcon color="info" />;
      default: return <ScheduleIcon />;
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Doctor Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/doctor/appointments')}
        >
          View All Appointments
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>Total Appointments</Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {dashboardData.stats.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>Confirmed</Typography>
            <Typography variant="h3" component="div" color="success.main" sx={{ flexGrow: 1 }}>
              {dashboardData.stats.confirmed}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>Pending</Typography>
            <Typography variant="h3" component="div" color="warning.main" sx={{ flexGrow: 1 }}>
              {dashboardData.stats.pending}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography variant="h6" gutterBottom>Cancelled</Typography>
            <Typography variant="h3" component="div" color="error.main" sx={{ flexGrow: 1 }}>
              {dashboardData.stats.cancelled}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Today's Appointments
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {format(new Date(), 'MMMM dd, yyyy')}
              </Typography>
            </Box>
            {dashboardData.todayAppointments.length > 0 ? (
              <Box>
                {dashboardData.todayAppointments.map((appointment) => (
                  <Paper
                    key={appointment._id}
                    sx={{
                      p: 2,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        cursor: 'pointer'
                      }
                    }}
                    onClick={() => navigate(`/doctor/appointments/${appointment._id}`)}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {appointment.patientName || 
                         (appointment.patientId ? 
                          `${appointment.patientId.firstName || ''} ${appointment.patientId.lastName || ''}` : 
                          'Unknown Patient')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Time: {appointment.formattedTime}
                      </Typography>
                      {appointment.reason && (
                        <Typography variant="body2" color="text.secondary">
                          Reason: {appointment.reason}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={appointment.status}
                        color={getStatusChipColor(appointment.status)}
                        icon={getStatusIcon(appointment.status)}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box py={3} textAlign="center">
                <Typography variant="body1" color="text.secondary">
                  No appointments scheduled for today
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/doctor/appointments')}
                >
                  Schedule New Appointment
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Dashboard; 
 