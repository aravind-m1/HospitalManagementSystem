import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { Lock, Shield, Save } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Settings = () => {
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
    newsletterSubscription: false,
  });
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.PATIENT.CHANGE_PASSWORD,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.response?.data?.error || 'Failed to update password');
    }
  };
  const handleNotificationChange = async (event) => {
    const { name, checked } = event.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked,
    }));
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.PATIENT.NOTIFICATIONS,
        { [name]: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setNotifications(prev => ({
        ...prev,
        [name]: !checked,
      }));
    }
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Lock size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6">Change Password</Typography>
            </Box>
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
              />
              <TextField
                fullWidth
                margin="normal"
                type="password"
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
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
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.newsletterSubscription}
                  onChange={handleNotificationChange}
                  name="newsletterSubscription"
                />
              }
              label="Newsletter Subscription"
            />
          </Paper>
          {}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Shield size={24} style={{ marginRight: '8px' }} />
              <Typography variant="h6">Privacy Settings</Typography>
            </Box>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Profile Visibility"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Control who can see your profile information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Share Medical History with Doctors"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Allow doctors to access your medical history
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Settings; 