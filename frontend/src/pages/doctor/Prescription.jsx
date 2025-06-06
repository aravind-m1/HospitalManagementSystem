import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Print as PrintIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Prescription = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    symptoms: '',
    notes: '',
    followUpDate: '',
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        timing: '',
        instructions: '',
      }
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    fetchAppointments();
  }, []);
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view appointments');
        return [];
      }
      console.log('Fetching appointments for prescription form');
      const response = await axios.get(API_ENDPOINTS.DOCTOR.APPOINTMENTS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Appointments fetched:', response.data.length);
      const eligibleAppointments = response.data
        .filter(apt => apt.status === 'confirmed' || apt.status === 'pending');
      console.log('Filtered eligible appointments:', eligibleAppointments.length);
      setAppointments(eligibleAppointments);
      return eligibleAppointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      console.error('Error response data:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch appointments';
      setError(errorMessage);
      return [];
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleMedicationChange = (index, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };
  const addMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          timing: '',
          instructions: '',
        }
      ]
    }));
  };
  const removeMedication = (index) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSnackbarOpen(false);
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      if (!token || !role) {
        throw new Error('You must be logged in to create prescriptions');
      }
      if (role !== 'doctor') {
        throw new Error('Only doctors can create prescriptions');
      }
      const appointment = appointments.find(apt => apt._id === selectedAppointment);
      if (!appointment) {
        throw new Error('Please select a valid appointment');
      }
      const patientId = appointment.patientId._id;
      if (!patientId) {
        throw new Error('Invalid patient information');
      }
      if (!prescriptionData.diagnosis || !prescriptionData.symptoms) {
        throw new Error('Diagnosis and symptoms are required');
      }
      if (!prescriptionData.medications.length) {
        throw new Error('At least one medication is required');
      }
      for (const med of prescriptionData.medications) {
        if (!med.name || !med.dosage || !med.frequency || !med.duration || !med.timing) {
          throw new Error('All medication fields are required');
        }
      }
      const prescriptionPayload = {
        patientId: patientId,
        diagnosis: prescriptionData.diagnosis,
        symptoms: prescriptionData.symptoms,
        medications: prescriptionData.medications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          timing: med.timing,
          instructions: med.instructions || ''
        })),
        notes: prescriptionData.notes || '',
        followUpDate: prescriptionData.followUpDate || null,
        appointmentId: appointment._id
      };
      console.log('Sending prescription payload:', prescriptionPayload);
      const response = await axios.post(API_ENDPOINTS.DOCTOR.PRESCRIBE, prescriptionPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Prescription created successfully:', response.data);
      setSnackbarOpen(true);
      setPrescriptionData({
        diagnosis: '',
        symptoms: '',
        notes: '',
        followUpDate: '',
        medications: [
          {
            name: '',
            dosage: '',
            frequency: '',
            duration: '',
            timing: '',
            instructions: '',
          }
        ],
      });
      setSelectedAppointment('');
      await fetchAppointments();
    } catch (error) {
      console.error('Error saving prescription:', error);
      console.error('Error response data:', error.response?.data);
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.error || 'Not authorized to create prescriptions';
        setError(errorMessage);
        if (errorMessage.includes('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('userId');
          window.location.href = '/login';
          return;
        }
      } else {
        const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to save prescription';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Write Prescription</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Patient Appointment</InputLabel>
                <Select
                  value={selectedAppointment}
                  onChange={(e) => setSelectedAppointment(e.target.value)}
                  required
                >
                  {appointments.map((appointment) => (
                    <MenuItem key={appointment._id} value={appointment._id}>
                      {appointment.patientName || 'Unknown Patient'} - {new Date(appointment.date).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Symptoms"
                name="symptoms"
                value={prescriptionData.symptoms}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosis"
                name="diagnosis"
                value={prescriptionData.diagnosis}
                onChange={handleInputChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Medications</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addMedication}
                  variant="contained"
                  color="primary"
                >
                  Add Medication
                </Button>
              </Box>
              {prescriptionData.medications.map((medication, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    onClick={() => removeMedication(index)}
                    disabled={prescriptionData.medications.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Medicine Name"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Dosage"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Frequency"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Timing"
                        value={medication.timing}
                        onChange={(e) => handleMedicationChange(index, 'timing', e.target.value)}
                        placeholder="e.g., After meals"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Special Instructions"
                        value={medication.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        multiline
                        rows={2}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={prescriptionData.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Follow-up Date"
                name="followUpDate"
                type="date"
                value={prescriptionData.followUpDate}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<SaveIcon />}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Prescription'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prescription Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {selectedAppointment && (
              <Typography variant="h6" gutterBottom>
                Patient: {appointments.find(apt => apt._id === selectedAppointment)?.patientName || 'Unknown Patient'}
              </Typography>
            )}
            <Typography variant="subtitle1" gutterBottom>Date: {new Date().toLocaleDateString()}</Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Symptoms:</Typography>
              <Typography paragraph>{prescriptionData.symptoms}</Typography>
              <Typography variant="subtitle1" gutterBottom>Diagnosis:</Typography>
              <Typography paragraph>{prescriptionData.diagnosis}</Typography>
              <Typography variant="subtitle1" gutterBottom>Medications:</Typography>
              {prescriptionData.medications.map((med, index) => (
                <Box key={index} sx={{ ml: 2, mb: 2 }}>
                  <Typography>
                    {index + 1}. {med.name} - {med.dosage}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
                    • Frequency: {med.frequency}
                    <br />
                    • Duration: {med.duration}
                    <br />
                    • Timing: {med.timing}
                    {med.instructions && (
                      <>
                        <br />
                        • Instructions: {med.instructions}
                      </>
                    )}
                  </Typography>
                </Box>
              ))}
              {prescriptionData.notes && (
                <>
                  <Typography variant="subtitle1" gutterBottom>Additional Notes:</Typography>
                  <Typography paragraph>{prescriptionData.notes}</Typography>
                </>
              )}
              {prescriptionData.followUpDate && (
                <Typography>
                  Follow-up Date: {new Date(prescriptionData.followUpDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button onClick={handlePrint} startIcon={<PrintIcon />}>Print</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Prescription saved successfully!
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
export default Prescription; 