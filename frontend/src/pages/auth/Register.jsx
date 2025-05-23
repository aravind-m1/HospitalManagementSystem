import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalHospital, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  margin: 0,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/medical-pattern.png")',
    opacity: 0.05,
    zIndex: 1,
  },
}));

const GlassBox = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 8px 32px rgba(0, 136, 255, 0.1)',
  textAlign: 'center',
  position: 'relative',
  zIndex: 2,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 48px rgba(0, 136, 255, 0.2)',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, registrationData);
      const { token, user, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user.id);
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.error || 
        error.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContainer>
      <GlassBox>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <LocalHospital sx={{ color: '#0088ff', fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #0088ff, #00ff88)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            City General Hospital
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#1a1a1a' }}>
          Create Account 🏥
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                color: '#0088ff',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Already have an account? Sign in
            </MuiLink>
          </Box>
        </Box>
      </GlassBox>
    </AuthContainer>
  );
};
export default Register; 