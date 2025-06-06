import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Calendar,
  ClipboardList,
  FileText,
  User,
  Clock,
  Activity,
  Settings as SettingsIcon,
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const PatientHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.PATIENT.PROFILE, { headers }),
        axios.get(API_ENDPOINTS.PATIENT.APPOINTMENTS, { headers }),
        axios.get(API_ENDPOINTS.PATIENT.PRESCRIPTIONS, { headers })
      ]);
      setPatientInfo(profileRes.data);
      const sortedAppointments = appointmentsRes.data
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingAppointments(sortedAppointments);
      const sortedPrescriptions = prescriptionsRes.data.prescriptions || [];
      setRecentPrescriptions(sortedPrescriptions);
      setError('');
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError(error.response?.data?.error || 'Error fetching your information');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Schedule a new appointment with a doctor',
      icon: <Calendar size={24} />,
      color: '#4CAF50',
      path: '/patient/book-appointment',
      action: () => navigate('/patient/book-appointment'),
    },
    {
      title: 'My Appointments',
      description: 'View and manage your appointments',
      icon: <ClipboardList size={24} />,
      color: '#2196F3',
      path: '/patient/appointments',
      action: () => navigate('/patient/appointments'),
    },
    {
      title: 'Prescriptions',
      description: 'Access your medical prescriptions',
      icon: <FileText size={24} />,
      color: '#9C27B0',
      path: '/patient/prescriptions',
      action: () => navigate('/patient/prescriptions'),
    },
    {
      title: 'Medical History',
      description: 'View your medical records and history',
      icon: <Activity size={24} />,
      color: '#FF5722',
      path: '/patient/medical-history',
      action: () => navigate('/patient/medical-history'),
    },
    {
      title: 'Profile',
      description: 'View and update your profile',
      icon: <User size={24} />,
      color: '#795548',
      path: '/patient/profile',
      action: () => navigate('/patient/profile'),
    },
    {
      title: 'Settings',
      description: 'Manage your account settings',
      icon: <SettingsIcon size={24} />,
      color: '#607D8B',
      path: '/patient/settings',
      action: () => navigate('/patient/settings'),
    },
  ];
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
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={4}>
        {}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {patientInfo.firstName}!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Here's an overview of your health information and upcoming appointments.
            </Typography>
          </Paper>
        </Grid>
        {}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.2s' }
                  }}
                  onClick={action.action}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ color: action.color, mr: 1 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="h6">{action.title}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Clock size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Appointment with Dr. ${appointment.doctorId?.firstName || ''} ${appointment.doctorId?.lastName || ''}`}
                    secondary={new Date(appointment.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
              {recentPrescriptions.slice(0, 3).map((prescription, index) => (
                <ListItem key={`prescription-${index}`}>
                  <ListItemIcon>
                    <FileText size={24} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Prescription: ${prescription.diagnosis || prescription.medications?.[0]?.name || 'Medication'}`}
                    secondary={new Date(prescription.createdAt || prescription.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
              {upcomingAppointments.length === 0 && recentPrescriptions.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No recent activity"
                    secondary="Book an appointment to get started"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default PatientHome; 