import axios, { AxiosInstance, AxiosError } from 'axios';

// API instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Parse timeout safely - avoid NaN
const parseTimeout = (value: string | undefined): number => {
  const num = parseInt(value || '10000', 10);
  return isNaN(num) ? 10000 : num;
};

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: parseTimeout(import.meta.env.VITE_API_TIMEOUT),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    // Only in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only in browser environment
    if (typeof window !== 'undefined') {
      // 401 Unauthorized - Token expired or invalid
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Avoid infinite redirect loops
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    // 403 Forbidden - No permission
    if (error.response?.status === 403) {
      console.error('No permission to access this resource');
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      console.debug('Resource not found');
    }

    // 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;
