import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '', // Empty because Vite proxy handles routing '/api' to 'http://localhost:5000'
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor to add Authorization Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopez_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
