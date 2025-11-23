import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerStudent: (data) => api.post('/auth/student/register', data),
};

export const adminAPI = {
  getStudents: (params) => api.get('/admin/students', { params }),
  getStudent: (enrollmentNumber) => api.get(`/admin/students/${enrollmentNumber}`),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (enrollmentNumber, data) => api.put(`/admin/students/${enrollmentNumber}`, data),
  deleteStudent: (enrollmentNumber) => api.delete(`/admin/students/${enrollmentNumber}`),
  createMarks: (data) => api.post('/admin/marks', data),
  getMarks: (enrollmentNumber) => api.get(`/admin/marks/${enrollmentNumber}`),
  updateMarks: (enrollmentNumber, data) => api.put(`/admin/marks/${enrollmentNumber}`, data),
};

export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  getScorecard: () => api.get('/student/scorecard'),
};

export default api;