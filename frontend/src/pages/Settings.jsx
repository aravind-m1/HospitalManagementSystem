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
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSettingsChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.SETTINGS, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      await axios.put(API_ENDPOINTS.CHANGE_PASSWORD, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3}>
        <Typography variant="h5" gutterBottom>
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
        <Box component="section" mb={4}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={() => handleSettingsChange('emailNotifications')}
                color="primary"
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsNotifications}
                onChange={() => handleSettingsChange('smsNotifications')}
                color="primary"
              />
            }
            label="SMS Notifications"
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
            </Button>
          </Box>
        </Box>
        <Box component="form" onSubmit={handleChangePassword}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Box mb={3}>
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
              helperText="Password must be at least 8 characters long"
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
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Password'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings; 