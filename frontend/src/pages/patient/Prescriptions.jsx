import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { FileText, Calendar, User, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Prescriptions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchPrescriptions = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        navigate('/login');
        return;
      }
      console.log('Fetching prescriptions...');
      const response = await axios.get('http://localhost:5000/api/patient/prescriptions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Prescriptions fetched:', response.data.length);
      setPrescriptions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      console.error('Error details:', error.response?.data);
      setError(error.response?.data?.error || 'Error fetching prescriptions');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </Container>
    );
  }
  const renderMedicationDetails = (prescription) => {
    if (prescription.medications && prescription.medications.length > 0) {
      return (
        <List>
          {prescription.medications.map((med, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={med.name || 'Unnamed Medication'}
                secondary={
                  <>
                    {med.dosage && `Dosage: ${med.dosage}`}
                    {med.frequency && ` - Frequency: ${med.frequency}`}
                    {med.duration && ` - Duration: ${med.duration}`}
                    {med.timing && <><br />Timing: {med.timing}</>}
                    {med.instructions && <><br />Instructions: {med.instructions}</>}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      );
    } 
    else if (prescription.medication) {
      return (
        <Typography variant="body2" paragraph>
          {prescription.medication} 
          {prescription.dosage && ` - ${prescription.dosage}`}
          {prescription.frequency && ` - ${prescription.frequency}`}
        </Typography>
      );
    } 
    else {
      return (
        <Typography variant="body2" color="text.secondary">
          No detailed medication information available
        </Typography>
      );
    }
  };
  const getDoctorName = (prescription) => {
    if (prescription.doctorName) {
      return prescription.doctorName;
    }
    if (prescription.doctorId && typeof prescription.doctorId === 'object') {
      return `${prescription.doctorId.firstName || ''} ${prescription.doctorId.lastName || ''}`.trim();
    }
    return 'Unknown Doctor';
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Prescriptions
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View and manage your medical prescriptions
        </Typography>
        <Grid container spacing={3}>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <Grid item xs={12} key={prescription._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FileText size={24} color="#1976d2" />
                      <Typography variant="h6" sx={{ ml: 2 }}>
                        {prescription.diagnosis || prescription.title || 'Medical Prescription'}
                      </Typography>
                      <Chip
                        label={prescription.status || 'active'}
                        color={prescription.status === 'completed' ? 'success' : 
                               prescription.status === 'cancelled' ? 'error' : 'primary'}
                        size="small"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <Calendar size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Prescribed Date"
                          secondary={new Date(prescription.date || prescription.createdAt).toLocaleDateString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <User size={20} />
                        </ListItemIcon>
                        <ListItemText
                          primary="Prescribed By"
                          secondary={`Dr. ${getDoctorName(prescription)}`}
                        />
                      </ListItem>
                      {prescription.symptoms && (
                        <ListItem>
                          <ListItemIcon>
                            <AlertCircle size={20} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Symptoms"
                            secondary={prescription.symptoms}
                          />
                        </ListItem>
                      )}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Medications
                    </Typography>
                    {renderMedicationDetails(prescription)}
                    {prescription.notes && (
                      <>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                          Notes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {prescription.notes}
                        </Typography>
                      </>
                    )}
                    {prescription.followUpDate && (
                      <>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                          Follow-up Date
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(prescription.followUpDate).toLocaleDateString()}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No prescriptions found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your prescriptions will appear here after doctor visits
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};
export default Prescriptions; 