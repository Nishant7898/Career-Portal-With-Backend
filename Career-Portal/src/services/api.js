import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token; // Token already includes 'Bearer '
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    // console.log('API Response:', response);
    return response;
  },
  (error) => {
    // console.log('API Error:', error);
    if (error.response?.status === 401) {
      // console.log('API: Received 401 response, token may be invalid');
      // Don't automatically redirect - let components handle this
      // localStorage.removeItem('token');
      // localStorage.removeItem('userRole');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;