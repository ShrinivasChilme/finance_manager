import axios from 'axios';

const API_BASE_URL = 'https://finance-manager-os56.onrender.com';
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Transaction API calls
export const transactionAPI = {
  // Get all transactions
  getAll: () => api.get('/transactions'),
  
  // Download all transactions
  downloadCSV: () => api.get('/transactions/export/csv', { responseType: 'blob' }),
  downloadJSON: () => api.get('/transactions/export/json', { responseType: 'blob' }),
  
  // Download monthly transactions
  downloadMonthlyCSV: () => api.get('/transactions/export/csv/monthly', { responseType: 'blob' }),
  downloadMonthlyJSON: () => api.get('/transactions/export/json/monthly', { responseType: 'blob' }),
  downloadMonthlyPDF: () => api.get('/transactions/export/pdf/monthly', { responseType: 'blob' }),
  
  // Add new transaction
  create: (transactionData) => api.post('/transactions', transactionData),
  
  // Update transaction
  update: (id, transactionData) => api.put(`/transactions/${id}`, transactionData),
  
  // Delete transaction
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export default api;