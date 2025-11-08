import axios from 'axios';

// Create a separate axios instance for public file uploads (no auth required)
const PublicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const fileService = {
  // Upload resume file
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await PublicAPI.post('/files/upload/resume', formData);
      
      return { success: true, data: response.data };
    } catch (error) {
      // console.error('Resume upload error:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to upload resume',
      };
    }
  },

  // Upload photo file
  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await PublicAPI.post('/files/upload/photo', formData);
      
      return { success: true, data: response.data };
    } catch (error) {
      // console.error('Photo upload error:', error);
      return {
        success: false,
        message: error.response?.data?.error || error.message || 'Failed to upload photo',
      };
    }
  },
};