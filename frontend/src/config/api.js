const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Patient endpoints
  PATIENT: {
    PROFILE: `${API_BASE_URL}/api/patient/profile`,
    APPOINTMENTS: `${API_BASE_URL}/api/patient/appointments`,
    PRESCRIPTIONS: `${API_BASE_URL}/api/patient/prescriptions`,
    MEDICAL_HISTORY: `${API_BASE_URL}/api/patient/medical-history`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/patient/change-password`,
    NOTIFICATIONS: `${API_BASE_URL}/api/patient/notifications`,
  },
  // Doctor endpoints
  DOCTOR: {
    PROFILE: `${API_BASE_URL}/api/doctor/profile`,
    APPOINTMENTS: `${API_BASE_URL}/api/doctor/appointments`,
    DASHBOARD: `${API_BASE_URL}/api/doctor/dashboard`,
    PATIENTS: `${API_BASE_URL}/api/doctor/patients`,
    PRESCRIBE: `${API_BASE_URL}/api/doctor/prescribe-medication`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/doctor/change-password`,
    NOTIFICATIONS: `${API_BASE_URL}/api/doctor/notifications`,
  },
};

export default API_ENDPOINTS; 