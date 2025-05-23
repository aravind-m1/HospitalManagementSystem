import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';
const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    address: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    fetchProfile();
  }, []);
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/doctor/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/doctor/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Doctor Profile</Typography>
          <Button
            variant="outlined"
            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
            onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
            color={isEditing ? "primary" : "secondary"}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mb: 2
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              type="email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={profile.specialization}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Qualification"
              name="qualification"
              value={profile.qualification}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="experience"
              value={profile.experience}
              onChange={handleInputChange}
              disabled={!isEditing}
              type="number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};
export default Profile; 