import API from './api';

export const employerService = {
  // Create employer profile (for existing users without profile)
  createProfile: async () => {
    try {
      const response = await API.post('/employer/create-profile');
      return { success: true, message: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to create employer profile',
      };
    }
  },

  // Get all companies (public endpoint)
  getAllCompanies: async (companyName = '', industry = '', foundedAfter = '') => {
    try {
      const params = new URLSearchParams();
      if (companyName) params.append('companyName', companyName);
      if (industry) params.append('industry', industry);
      if (foundedAfter) params.append('foundedAfter', foundedAfter);
      
      const response = await API.get(`/employer/all?${params.toString()}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch companies',
      };
    }
  },
};