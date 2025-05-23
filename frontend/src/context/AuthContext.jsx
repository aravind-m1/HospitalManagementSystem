import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  
  if (!axios.defaults.baseURL) {
    console.warn('API URL not configured! Please set REACT_APP_API_URL environment variable.');
    axios.defaults.baseURL = 'http://localhost:5000'; // Fallback for development
  }

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Auth verification error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials);
      console.log('Login response:', response.data);
      const { token, user, role } = response.data;
      if (!token || !user || !role) {
        throw new Error('Invalid response format from server');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user.id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({
        ...user,
        role: role
      });
      return { 
        success: true,
        role: role
      };
    } catch (error) {
      console.error('Login failed:', error.response || error);
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/register', userData);
      const { token, user, role } = response.data;
      if (!token || !user || !role) {
        throw new Error('Invalid response format from server');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', user.id);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({
        ...user,
        role: role
      });
      return { success: true, role };
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          error: 'Unable to connect to the server. Please check your internet connection and try again.'
        };
      }
      if (error.response?.status === 500) {
        return {
          success: false,
          error: 'Server error occurred. Please try again later.'
        };
      }
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (userData) => {
    try {
      const role = localStorage.getItem('role');
      const response = await axios.put(`/api/${role}/profile`, userData);
      const updatedUser = response.data;
      setUser({
        ...user,
        ...updatedUser
      });
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Profile update failed'
      };
    }
  };

  const value = {
    user,
    setUser,
    loading,
    checkAuth,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 