import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { User, Mail, Phone, Home, Edit2, Save, X } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    bloodGroup: '',
    emergencyContact: '',
  });
  const [editedProfile, setEditedProfile] = useState({});

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        return;
      }
      const response = await axios.get(API_ENDPOINTS.PATIENT.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setError('');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.PATIENT.PROFILE,
        editedProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      setEditedProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.error || 'Failed to update profile');
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">My Profile</Typography>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit2 size={20} />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          ) : (
            <Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<X size={20} />}
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save size={20} />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {profile.firstName?.[0]}
                {profile.lastName?.[0]}
              </Avatar>
              <Typography variant="h6">
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Patient ID: {profile._id}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={isEditing ? editedProfile.firstName : profile.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={isEditing ? editedProfile.lastName : profile.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={isEditing ? editedProfile.email : profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={isEditing ? editedProfile.phone : profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={isEditing ? editedProfile.dateOfBirth : profile.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={2}
                  value={isEditing ? editedProfile.address : profile.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blood Group"
                  name="bloodGroup"
                  value={isEditing ? editedProfile.bloodGroup : profile.bloodGroup}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact"
                  name="emergencyContact"
                  value={isEditing ? editedProfile.emergencyContact : profile.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 