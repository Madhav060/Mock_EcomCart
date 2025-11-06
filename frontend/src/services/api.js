// =============================================================================
// FILE: src/utils/api.js
// PURPOSE: Centralized API configuration with automatic token handling
// =============================================================================

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - automatically adds token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        if (user && user.token) {
          // Add token to Authorization header
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log('✅ Token attached to request:', config.url);
        }
      } catch (error) {
        console.error('❌ Error parsing userInfo:', error);
        // Clear corrupted data
        localStorage.removeItem('userInfo');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('❌ 401 Unauthorized - clearing user data and redirecting to login');
      
      // Clear invalid token
      localStorage.removeItem('userInfo');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;