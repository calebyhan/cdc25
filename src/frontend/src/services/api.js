// API service for handling all backend communication
import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // GET / - Server status and endpoints
  getServerStatus: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // GET /api - API information
  getApiInfo: async () => {
    const response = await api.get('/api');
    return response.data;
  },

  // GET /api/about - Project information
  getAbout: async () => {
    const response = await api.get('/api/about');
    return response.data;
  },

  // GET /api/astronauts - Test astronauts list
  getAstronauts: async () => {
    const response = await api.get('/api/astronauts');
    return response.data;
  },

  // GET /api/predict - Prediction endpoint info
  getPredictInfo: async () => {
    const response = await api.get('/api/predict');
    return response.data;
  },

  // POST /api/predict - Make risk prediction
  makePrediction: async (astronautData) => {
    const response = await api.post('/api/predict', astronautData);
    return response.data;
  },

  // GET /api/health - Health check
  getHealth: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  // GET /api/visualizations - Data for charts
  getVisualizations: async () => {
    const response = await api.get('/api/visualizations');
    return response.data;
  },

  // GET /api/test-error - Test error handling
  testError: async () => {
    const response = await api.get('/api/test-error');
    return response.data;
  },
};

// Utility function to handle API errors consistently
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.error || error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      details: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'No response from server. Please check if the backend is running.',
      status: 0,
      details: 'Network error or server unavailable',
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
      details: error.toString(),
    };
  }
};

export default api;