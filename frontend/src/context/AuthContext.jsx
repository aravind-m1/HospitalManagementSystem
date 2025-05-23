import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Response error:', error.response || error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          const currentPath = window.location.pathname.toLowerCase();
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            navigate('/');
          }
        }
        return Promise.reject(error);
      }
    );
    checkAuth();
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      console.log('Checking auth with:', { token: !!token, role, userId });
      if (!token || !role || !userId) {
        console.log('Missing auth data:', { token: !!token, role, userId });
        throw new Error('No authentication token, role, or user ID found');
      }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Verifying auth with role:', role);
      const response = await axios.get(`/api/${role}/profile`);
      console.log('Profile response:', response.data);
      setUser({
        ...response.data,
        role: role,
        id: userId
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      console.error('Error response:', error.response?.data);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      const currentPath = window.location.pathname.toLowerCase();
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}; 