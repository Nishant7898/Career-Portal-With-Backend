import API from './api';

export const jobService = {
  // Get all job postings for the authenticated employer
  getEmployerJobs: async () => {
    try {
      const response = await API.get('/jobs/employer');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch job postings',
      };
    }
  },

  // Get all job postings (public)
  getAllJobs: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.keyword) {
        params.append('keyword', filters.keyword);
      }
      if (filters.location) {
        params.append('location', filters.location);
      }
      if (filters.experience) {
        params.append('experience', filters.experience);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/jobs?${queryString}` : '/jobs';
      
      // console.log("Making API request to:", url);
      // console.log("With filters:", filters);
      
      const response = await API.get(url);
      // console.log("API response:", response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      // console.error("API error:", error);
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch job postings',
      };
    }
  },

  // Get job posting by ID
  getJobById: async (id) => {
    try {
      const response = await API.get(`/jobs/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch job posting',
      };
    }
  },

  // Create new job posting
  createJob: async (jobData) => {
    try {
      const response = await API.post('/jobs', jobData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to create job posting',
      };
    }
  },

  // Update job posting
  updateJob: async (id, jobData) => {
    try {
      const response = await API.put(`/jobs/${id}`, jobData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to update job posting',
      };
    }
  },

  // Delete job posting
  deleteJob: async (id) => {
    try {
      await API.delete(`/jobs/${id}`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to delete job posting',
      };
    }
  },

  // Get applications for a job
  getJobApplications: async (jobId) => {
    try {
      const response = await API.get(`/job-postings/${jobId}/applications`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch job applications',
      };
    }
  },

  // Get dashboard statistics for employer
  getDashboardStats: async () => {
    try {
      const response = await API.get('/job-postings/employer/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch dashboard statistics',
      };
    }
  }
};