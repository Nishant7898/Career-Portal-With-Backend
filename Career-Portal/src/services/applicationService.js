import API from './api';

export const applicationService = {
  // Get applications for a specific job (for employers)
  getApplicationsForJob: async (jobId) => {
    try {
      const response = await API.get(`/applications/job/${jobId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch job applications',
      };
    }
  },

  // Get my applications (for job seekers)
  getMyApplications: async () => {
    try {
      const response = await API.get('/applications/my-history');
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to fetch applications',
      };
    }
  },

  // Apply for a job (for job seekers)
  applyForJob: async (jobId, resumeFile = null) => {
    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await API.post(`/applications/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to apply for job',
      };
    }
  },

  // Update application status (for employers)
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    try {
      const response = await API.put(`/applications/${applicationId}/status`, {
        newStatus: status,
        recruiterNotes: notes
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to update application status',
      };
    }
  },

  // Download resume for an application (for employers)
  downloadResume: async (applicationId) => {
    try {
      const response = await API.get(`/applications/${applicationId}/resume`, {
        responseType: 'blob',
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'resume.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Failed to download resume',
      };
    }
  }
};