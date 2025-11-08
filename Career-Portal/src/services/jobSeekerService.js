import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config (no auth required for job seekers)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobSeekerService = {
  // Get all job seekers
  getAllJobSeekers: async () => {
    try {
      // console.log('Fetching job seekers from API');
      
      const response = await api.get('/jobseekers/all');
      
      return {
        success: true,
        data: response.data,
        message: 'Job seekers fetched successfully'
      };
    } catch (error) {
      // console.error('Error fetching job seekers:', error);
      
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          data: null,
          message: error.response.data?.message || `Server error: ${error.response.status}`
        };
      } else if (error.request) {
        // Request was made but no response received
        return {
          success: false,
          data: null,
          message: 'No response from server. Please check your connection.'
        };
      } else {
        // Something else happened
        return {
          success: false,
          data: null,
          message: 'An unexpected error occurred'
        };
      }
    }
  }
};