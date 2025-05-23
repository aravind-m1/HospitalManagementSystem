import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, Lock, Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
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
  maxWidth: '400px',
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputBase-root': {
    color: '#1a1a1a',
    background: '#ffffff',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 136, 255, 0.1)',
    },
    '&.Mui-focused': {
      background: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 136, 255, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#0088ff',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
    transition: 'border-color 0.3s ease',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0088ff',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#0088ff',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: '#0088ff',
  },
}));

const StyledSelect = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    color: '#1a1a1a',
    background: '#ffffff',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 136, 255, 0.1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#0088ff',
      },
    },
    '&.Mui-focused': {
      background: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 136, 255, 0.1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#0088ff',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    '&.Mui-focused': {
      color: '#0088ff',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
    transition: 'border-color 0.3s ease',
  },
}));

const GlowButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '12px',
  marginTop: theme.spacing(2),
  background: 'linear-gradient(45deg, #0088ff, #00ff88)',
  color: '#fff',
  borderRadius: '12px',
  fontWeight: 'bold',
  textTransform: 'none',
  fontSize: '1.1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #0066cc, #00cc66)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 136, 255, 0.2)',
  },
  '&.Mui-disabled': {
    background: 'linear-gradient(45deg, #0088ff80, #00ff8880)',
    color: 'rgba(255, 255, 255, 0.8)',
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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
    setLoading(true);
    setError('');
    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role
      });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('userId', response.data.user.id);
        switch (response.data.role) {
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
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Unable to connect to the server. Please make sure the server is running and try again.');
      } else {
        setError(
          error.response?.data?.error || 
          'Login failed. Please check your credentials and try again.'
        );
      }
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
          Welcome Back 👋
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledSelect fullWidth>
            <InputLabel id="role-label">Select Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              label="Select Role"
              onChange={handleChange}
              required
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </StyledSelect>
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
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
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          <GlowButton type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </GlowButton>
          <Typography sx={{ mt: 3, color: '#666666' }}>
            Don't have an account?{' '}
            <MuiLink
              onClick={() => navigate('/register')}
              sx={{
                color: '#0088ff',
                textDecoration: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Register
            </MuiLink>
          </Typography>
        </form>
      </GlassBox>
    </AuthContainer>
  );
};

export default Login; 