import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired/invalid
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const interviewService = {
  create: (data) => api.post('/interviews', data),
  list: (params) => api.get('/interviews', { params }),
  getById: (id) => api.get(`/interviews/${id}`),
  autosave: (id, data) => api.put(`/interviews/${id}/autosave`, data),
  submit: (id, data) => api.post(`/interviews/${id}/submit`, data),
  getReport: (id) => api.get(`/interviews/${id}/report`),
  delete: (id) => api.delete(`/interviews/${id}`),
  uploadResume: (formData) =>
    api.post('/interviews/resume-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const performanceService = {
  getAnalytics: () => api.get('/performance'),
};

export const questionService = {
  list: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  evaluatePractice: (data) => api.post('/questions/practice-evaluate', data),
  getCategories: () => api.get('/questions/categories'),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getInterviews: () => api.get('/admin/interviews'),
  updateRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
};

export default api;
