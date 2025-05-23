import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { Lock } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    prescriptionAlerts: true,
  });
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.DOCTOR.CHANGE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  const handleNotificationSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.DOCTOR.NOTIFICATIONS, {
        notificationSettings: notifications
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Notification preferences updated successfully');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
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
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </form>
          </Paper>
        </Grid>
        {}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Lock size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6">Notification Preferences</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.emailNotifications}
                  onChange={handleNotificationChange}
                  name="emailNotifications"
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.appointmentReminders}
                  onChange={handleNotificationChange}
                  name="appointmentReminders"
                />
              }
              label="Appointment Reminders"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.prescriptionAlerts}
                  onChange={handleNotificationChange}
                  name="prescriptionAlerts"
                />
              }
              label="Prescription Alerts"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleNotificationSubmit}
              startIcon={<Save />}
              sx={{ mt: 2 }}
            >
              Save Preferences
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Settings; 