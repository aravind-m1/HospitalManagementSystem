import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Users,
  Calendar,
  Activity,
  ClipboardList,
} from 'lucide-react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    appointmentsToday: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    departmentStats: {},
  });
  const [appointments, setAppointments] = useState({
    completed: [],
    pending: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      console.log('Fetching admin dashboard data...');
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, { headers })
          .catch(error => {
            console.error('Error fetching stats:', error);
            return { data: {} };
          }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/appointments`, { headers })
          .catch(error => {
            console.error('Error fetching appointments:', error);
            return { data: { completed: [], pending: [], cancelled: [] } };
          }),
      ]);
      console.log('Dashboard data received:', { 
        statsReceived: !!statsRes.data, 
        appointmentsReceived: !!appointmentsRes.data 
      });
      setStats(prevStats => ({
        ...prevStats,
        totalDoctors: statsRes.data?.totalDoctors || 0,
        totalPatients: statsRes.data?.totalPatients || 0,
        totalAppointments: statsRes.data?.totalAppointments || 0,
        appointmentsToday: statsRes.data?.appointmentsToday || 0,
        completedAppointments: statsRes.data?.completedAppointments || 0,
        pendingAppointments: statsRes.data?.pendingAppointments || 0,
        departmentStats: statsRes.data?.departmentStats || {},
      }));
      setAppointments({
        completed: appointmentsRes.data?.completed || [],
        pending: appointmentsRes.data?.pending || [],
        cancelled: appointmentsRes.data?.cancelled || [],
      });
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          error.message || 
                          'Error fetching dashboard data';
      setError(errorMessage);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleFocus = () => {
      fetchDashboardData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  const departmentData = Object.entries(stats.departmentStats || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const appointmentStatusData = [
    { name: 'Completed', value: stats.completedAppointments },
    { name: 'Pending', value: stats.pendingAppointments },
    { name: 'Total Today', value: stats.appointmentsToday },
  ];
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
      </Box>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Users color="#3498db" size={24} />
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Total Doctors
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalDoctors}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Calendar color="#2ecc71" size={24} />
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Today's Appointments
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {stats.appointmentsToday}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Activity color="#e74c3c" size={24} />
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Completed
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {stats.completedAppointments}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ClipboardList color="#f39c12" size={24} />
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                Pending
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {stats.pendingAppointments}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      {}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Appointments by Department
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Status Overview
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Appointments
        </Typography>
        <Grid container spacing={2}>
          {appointments.pending.slice(0, 5).map((apt) => (
            <Grid item xs={12} key={apt.id}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date & Time
                    </Typography>
                    <Typography variant="body1">
                      {new Date(apt.date).toLocaleDateString()} {apt.time}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Doctor
                    </Typography>
                    <Typography variant="body1">{apt.doctor}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {apt.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Patient
                    </Typography>
                    <Typography variant="body1">{apt.patient}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};
export default Dashboard; 