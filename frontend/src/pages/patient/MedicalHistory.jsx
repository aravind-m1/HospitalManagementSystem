import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Calendar,
  FileText,
  Pill,
  Stethoscope,
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const MedicalHistory = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [medicalHistory, setMedicalHistory] = useState({
    appointments: [],
    prescriptions: [],
    conditions: [],
    allergies: [],
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your medical history');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(API_ENDPOINTS.PATIENT.MEDICAL_HISTORY, { headers });
      setMedicalHistory(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching medical history:', error);
      setError(error.response?.data?.error || 'Failed to fetch medical history');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderAppointmentHistory = () => (
    <List>
      {medicalHistory.appointments.map((appointment, index) => (
        <React.Fragment key={appointment._id || index}>
          {index > 0 && <Divider />}
          <ListItem>
            <ListItemIcon>
              <Stethoscope size={24} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  Dr. {appointment.doctorId?.firstName && appointment.doctorId?.lastName ? 
                      `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}` : 
                      (appointment.doctorName || 'Unknown Doctor')}
                  <Chip
                    size="small"
                    label={appointment.status}
                    color={appointment.status === 'completed' ? 'success' : 'default'}
                    sx={{ ml: 1 }}
                  />
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Date: {new Date(appointment.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Reason: {appointment.reason}
                  </Typography>
                  {appointment.diagnosis && (
                    <Typography variant="body2" color="textSecondary">
                      Diagnosis: {appointment.diagnosis}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        </React.Fragment>
      ))}
      {medicalHistory.appointments.length === 0 && (
        <ListItem>
          <ListItemText primary="No appointment history found" />
        </ListItem>
      )}
    </List>
  );

  const renderPrescriptionHistory = () => (
    <List>
      {medicalHistory.prescriptions.map((prescription, index) => (
        <React.Fragment key={prescription._id || index}>
          {index > 0 && <Divider />}
          <ListItem>
            <ListItemIcon>
              <Pill size={24} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  {prescription.medication || prescription.medications?.[0]?.name || 'Medication'}
                </Typography>
              }
              secondary={
                <>
                  <Typography variant="body2" color="textSecondary">
                    Prescribed by: Dr. {prescription.doctorId?.firstName && prescription.doctorId?.lastName ? 
                      `${prescription.doctorId.firstName} ${prescription.doctorId.lastName}` : 
                      (prescription.doctorName || 'Unknown')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {new Date(prescription.date || prescription.createdAt).toLocaleDateString()}
                  </Typography>
                  {(prescription.dosage || prescription.medications?.[0]?.dosage) && (
                    <Typography variant="body2" color="textSecondary">
                      Dosage: {prescription.dosage || prescription.medications?.[0]?.dosage}
                    </Typography>
                  )}
                  {(prescription.frequency || prescription.medications?.[0]?.frequency) && (
                    <Typography variant="body2" color="textSecondary">
                      Frequency: {prescription.frequency || prescription.medications?.[0]?.frequency}
                    </Typography>
                  )}
                  {prescription.notes && (
                    <Typography variant="body2" color="textSecondary">
                      Notes: {prescription.notes}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItem>
        </React.Fragment>
      ))}
      {medicalHistory.prescriptions.length === 0 && (
        <ListItem>
          <ListItemText primary="No prescription history found" />
        </ListItem>
      )}
    </List>
  );

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
      <Typography variant="h4" gutterBottom>
        Medical History
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Calendar size={20} />} label="Appointments" />
          <Tab icon={<FileText size={20} />} label="Prescriptions" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {value === 0 && renderAppointmentHistory()}
          {value === 1 && renderPrescriptionHistory()}
        </Box>
      </Paper>
    </Container>
  );
};

export default MedicalHistory; 