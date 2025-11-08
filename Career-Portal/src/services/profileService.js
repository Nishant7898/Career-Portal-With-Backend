import API from './api';

export const profileService = {
  // Get job seeker profile
  getJobSeekerProfile: async () => {
    try {
      const response = await API.get('/jobseeker/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch job seeker profile',
      };
    }
  },

  // Update job seeker profile
  updateJobSeekerProfile: async (profileData) => {
    try {
      const response = await API.put('/jobseeker/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to update job seeker profile',
      };
    }
  },

  // Get employer profile
  getEmployerProfile: async () => {
    try {
      const response = await API.get('/employer/profile');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch employer profile',
      };
    }
  },

  // Update employer profile
  updateEmployerProfile: async (profileData) => {
    try {
      const response = await API.put('/employer/profile', profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to update employer profile',
      };
    }
  },
};