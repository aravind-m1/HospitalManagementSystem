import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openMedicalHistoryDialog, setOpenMedicalHistoryDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [medicalHistoryEntry, setMedicalHistoryEntry] = useState({
    condition: '',
    diagnosedDate: '',
    notes: '',
  });
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/patients', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 10,
          search,
          sortField,
          sortOrder,
        },
      });
      setPatients(response.data.patients);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError(error.response?.data?.error || 'Error fetching patients');
    } finally {
      setLoading(false);
    }
  };
  const handleEditPatient = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/patients/${selectedPatient._id}`,
        selectedPatient,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Patient updated successfully');
      setOpenEditDialog(false);
      fetchPatients();
    } catch (error) {
      setError(error.response?.data?.error || 'Error updating patient');
    }
  };
  const handleDeletePatient = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/patients/${selectedPatient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Patient deleted successfully');
      setOpenDeleteDialog(false);
      fetchPatients();
    } catch (error) {
      setError(error.response?.data?.error || 'Error deleting patient');
    }
  };
  const handleAddMedicalHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/admin/patients/${selectedPatient._id}/medical-history`,
        medicalHistoryEntry,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Medical history entry added successfully');
      setOpenMedicalHistoryDialog(false);
      setMedicalHistoryEntry({
        condition: '',
        diagnosedDate: '',
        notes: '',
      });
      fetchPatients();
    } catch (error) {
      setError(error.response?.data?.error || 'Error adding medical history');
    }
  };
  const getAppointmentStatus = (status) => {
    const statusColors = {
      pending: 'warning',
      completed: 'success',
      cancelled: 'error',
    };
    return statusColors[status] || 'default';
  };
  if (loading && page === 1) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ width: '100%', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {success}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Patients Directory
        </Typography>
        <TextField
          placeholder="Search patients..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            label="Sort By"
            onChange={(e) => setSortField(e.target.value)}
          >
            <MenuItem value="createdAt">Registration Date</MenuItem>
            <MenuItem value="firstName">First Name</MenuItem>
            <MenuItem value="lastName">Last Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </Box>
      {loading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={3}>
        {patients.map((patient) => (
          <Grid item xs={12} key={patient._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}
                  >
                    {patient.firstName[0]}
                    {patient.lastName[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {patient.firstName} {patient.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <MailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        {patient.email}
                      </Typography>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {patient.phone}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Add Medical History">
                      <IconButton
                        onClick={() => {
                          setSelectedPatient(patient);
                          setOpenMedicalHistoryDialog(true);
                        }}
                        color="primary"
                      >
                        <MedicalServices />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Patient">
                      <IconButton
                        onClick={() => {
                          setSelectedPatient(patient);
                          setOpenEditDialog(true);
                        }}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Patient">
                      <IconButton
                        onClick={() => {
                          setSelectedPatient(patient);
                          setOpenDeleteDialog(true);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() =>
                          setExpandedPatient(
                            expandedPatient === patient._id ? null : patient._id
                          )
                        }
                      >
                        {expandedPatient === patient._id ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Collapse in={expandedPatient === patient._id}>
                  <Box sx={{ mt: 2 }}>
                    <Tabs
                      value={currentTab}
                      onChange={(e, newValue) => setCurrentTab(newValue)}
                      sx={{ mb: 2 }}
                    >
                      <Tab label="Personal Info" />
                      <Tab label="Medical History" />
                      <Tab label="Appointments" />
                    </Tabs>
                    {currentTab === 0 && (
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date of Birth
                          </Typography>
                          <Typography>
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Gender
                          </Typography>
                          <Typography sx={{ textTransform: 'capitalize' }}>
                            {patient.gender}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Blood Type
                          </Typography>
                          <Typography>
                            {patient.bloodType || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Address
                          </Typography>
                          <Typography>
                            {patient.address?.street}, {patient.address?.city},{' '}
                            {patient.address?.state} {patient.address?.zipCode}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Emergency Contact
                          </Typography>
                          <Typography>
                            {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship})
                            <br />
                            {patient.emergencyContact?.phoneNumber}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    {currentTab === 1 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Medical History
                        </Typography>
                        {patient.medicalHistory?.length > 0 ? (
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Condition</TableCell>
                                  <TableCell>Diagnosed Date</TableCell>
                                  <TableCell>Notes</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {patient.medicalHistory.map((history, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{history.condition}</TableCell>
                                    <TableCell>
                                      {new Date(history.diagnosedDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{history.notes}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography color="text.secondary">
                            No medical history records found.
                          </Typography>
                        )}
                      </Box>
                    )}
                    {currentTab === 2 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Appointment History
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Reason</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {patient.appointments?.map((appointment) => (
                                <TableRow key={appointment._id}>
                                  <TableCell>
                                    {new Date(appointment.date).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>{appointment.time}</TableCell>
                                  <TableCell>
                                    Dr. {appointment.doctorId?.firstName}{' '}
                                    {appointment.doctorId?.lastName}
                                  </TableCell>
                                  <TableCell>{appointment.doctorId?.specialty}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={appointment.status}
                                      size="small"
                                      color={getAppointmentStatus(appointment.status)}
                                    />
                                  </TableCell>
                                  <TableCell>{appointment.reason}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
      {}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={selectedPatient?.firstName || ''}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, firstName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={selectedPatient?.lastName || ''}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, lastName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={selectedPatient?.email || ''}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={selectedPatient?.phone || ''}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                value={selectedPatient?.dateOfBirth?.split('T')[0] || ''}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, dateOfBirth: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Type</InputLabel>
                <Select
                  value={selectedPatient?.bloodType || ''}
                  label="Blood Type"
                  onChange={(e) =>
                    setSelectedPatient({ ...selectedPatient, bloodType: e.target.value })
                  }
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditPatient}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedPatient?.firstName}{' '}
            {selectedPatient?.lastName}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeletePatient}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {}
      <Dialog
        open={openMedicalHistoryDialog}
        onClose={() => setOpenMedicalHistoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Medical History</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Condition"
                value={medicalHistoryEntry.condition}
                onChange={(e) =>
                  setMedicalHistoryEntry({
                    ...medicalHistoryEntry,
                    condition: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Diagnosed Date"
                type="date"
                value={medicalHistoryEntry.diagnosedDate}
                onChange={(e) =>
                  setMedicalHistoryEntry({
                    ...medicalHistoryEntry,
                    diagnosedDate: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={4}
                value={medicalHistoryEntry.notes}
                onChange={(e) =>
                  setMedicalHistoryEntry({
                    ...medicalHistoryEntry,
                    notes: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMedicalHistoryDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMedicalHistory}>
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default PatientsList; 