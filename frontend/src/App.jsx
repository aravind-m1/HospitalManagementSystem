import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPatients from './pages/doctor/Patients';
import DoctorPrescription from './pages/doctor/Prescription';
import DoctorProfile from './pages/doctor/Profile';
import DoctorSettings from './pages/doctor/Settings';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAppointments from './pages/patient/Appointments';
import PatientPrescriptions from './pages/patient/Prescriptions';
import PatientMedicalHistory from './pages/patient/MedicalHistory';
import PatientBookAppointment from './pages/patient/BookAppointment';
import PatientProfile from './pages/patient/Profile';
import PatientSettings from './pages/patient/Settings';
import AdminDashboard from './pages/admin/Dashboard';
import AdminDoctors from './pages/admin/ManageDoctors';
import AdminPatients from './pages/admin/PatientsList';
import AdminSettings from './pages/admin/Settings';
import MainLayout from './layouts/MainLayout';

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            {}
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            {}
            <Route path="/admin" element={<PrivateRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
            {}
            <Route path="/doctor" element={<PrivateRoute />}>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorAppointments />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="prescriptions" element={<DoctorPrescription />} />
              <Route path="settings" element={<DoctorSettings />} />
              <Route path="*" element={<Navigate to="/doctor/dashboard" replace />} />
            </Route>
            {}
            <Route path="/patient" element={<PrivateRoute />}>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="appointments" element={<PatientAppointments />} />
              <Route path="book-appointment" element={<PatientBookAppointment />} />
              <Route path="medical-history" element={<PatientMedicalHistory />} />
              <Route path="prescriptions" element={<PatientPrescriptions />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="settings" element={<PatientSettings />} />
              <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
            </Route>
            {}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};
export default App; 