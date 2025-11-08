import API from './api';

export const companyService = {
  // Get all companies with optional filters
  getAllCompanies: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.companyName) {
        params.append('companyName', filters.companyName);
      }
      if (filters.industry) {
        params.append('industry', filters.industry);
      }
      if (filters.foundedAfter) {
        params.append('foundedAfter', filters.foundedAfter);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/employer/all?${queryString}` : '/employer/all';
      
      // console.log('Fetching companies from:', url);
      const response = await API.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // console.error('Error fetching companies:', error);
      return {
        success: false,
        message: error.response?.data || error.message || 'Failed to fetch companies'
      };
    }
  },

  // Get company by ID
  getCompanyById: async (id) => {
    try {
      const response = await API.get(`/employer/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // console.error('Error fetching company:', error);
      return {
        success: false,
        message: error.response?.data || error.message || 'Failed to fetch company'
      };
    }
  },

  // Search companies with advanced filters
  searchCompanies: async (searchParams) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] && searchParams[key].toString().trim()) {
          params.append(key, searchParams[key]);
        }
      });
      
      const queryString = params.toString();
      const url = queryString ? `/employer/all?${queryString}` : '/employer/all';
      
      const response = await API.get(url);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // console.error('Error searching companies:', error);
      return {
        success: false,
        message: error.response?.data || error.message || 'Failed to search companies'
      };
    }
  }
};