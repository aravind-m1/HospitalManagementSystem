import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ClipboardList,
} from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const PatientCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const IconText = ({ icon: Icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
    <Icon size={20} />
    <Typography variant="body2">{text}</Typography>
  </Box>
);

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view patients');
        return;
      }
      const response = await axios.get(API_ENDPOINTS.DOCTOR.PATIENTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error.response?.data?.error || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_ENDPOINTS.DOCTOR.PATIENTS}/${selectedPatient._id}/notes`,
        { notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPatients(patients.map(patient =>
        patient._id === selectedPatient._id
          ? { ...patient, notes: [...(patient.notes || []), notes] }
          : patient
      ));
      setDialogOpen(false);
      setNotes('');
      setSelectedPatient(null);
    } catch (error) {
      console.error('Error adding notes:', error);
      setError(error.response?.data?.error || 'Failed to add notes');
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
      <Typography variant="h4" gutterBottom>
        My Patients
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        {patients.length > 0 ? (
          patients.map((patient) => (
            <Grid item xs={12} md={6} key={patient._id}>
              <PatientCard>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {patient.firstName?.[0]}
                      {patient.lastName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {patient.firstName} {patient.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Patient ID: {patient._id}
                      </Typography>
                    </Box>
                  </Box>
                  <IconText
                    icon={ClipboardList}
                    text={patient.email}
                  />
                  {patient.phone && (
                    <IconText
                      icon={ClipboardList}
                      text={patient.phone}
                    />
                  )}
                  {patient.lastVisit && (
                    <IconText
                      icon={ClipboardList}
                      text={`Last Visit: ${new Date(patient.lastVisit).toLocaleDateString()}`}
                    />
                  )}
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      startIcon={<ClipboardList />}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setDialogOpen(true);
                      }}
                    >
                      Add Notes
                    </Button>
                  </Box>
                  {patient.notes && patient.notes.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Recent Notes
                      </Typography>
                      {patient.notes.slice(0, 2).map((note, index) => (
                        <Paper
                          key={index}
                          variant="outlined"
                          sx={{ p: 1, mt: 1, bgcolor: 'grey.50' }}
                        >
                          <Typography variant="body2">{note}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </PatientCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No patients found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You currently don't have any patients assigned
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Patient Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddNotes}
            color="primary"
            disabled={!notes.trim()}
          >
            Add Notes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Patients; 