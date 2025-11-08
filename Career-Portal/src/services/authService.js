import API from './api';

export const authService = {
  // Login with username or email
  login: async (usernameOrEmail, password) => {
    try {
      // console.log('Attempting login for:', usernameOrEmail);
      
      const response = await API.post('/auth/login', {
        usernameOrEmail,
        password,
      });
      
      // console.log('Login response:', response);
      
      const token = response.data;
      localStorage.setItem('token', token);
      
      // Initialize userRole
      let userRole = 'ROLE_USER';
      
      // Decode token to get user role (simple base64 decode)
      try {
        // Remove 'Bearer ' prefix if present
        const cleanToken = token.replace('Bearer ', '');
        const payload = JSON.parse(atob(cleanToken.split('.')[1]));
        // console.log('JWT Payload:', payload);
        
        // Extract role from authorities array, roles string, or roles array
        if (payload.authorities && Array.isArray(payload.authorities)) {
          userRole = payload.authorities[0];
          // console.log('Role from authorities array:', userRole);
        } else if (payload.roles && typeof payload.roles === 'string') {
          // If roles is a comma-separated string, take the first one
          userRole = payload.roles.split(',')[0];
          // console.log('Role from roles string:', userRole);
        } else if (payload.roles && Array.isArray(payload.roles)) {
          userRole = payload.roles[0];
          // console.log('Role from roles array:', userRole);
        } else if (payload.role) {
          userRole = payload.role;
          // console.log('Role from role field:', userRole);
        } else {
          // console.log('No role found in token, using default:', userRole);
        }
        
        localStorage.setItem('userRole', userRole);
        // console.log('Final user role set to:', userRole);
      } catch (e) {
        // console.error('Error parsing JWT token:', e);
        // console.error('Token that failed to parse:', token);
        userRole = 'ROLE_USER';
        localStorage.setItem('userRole', userRole);
      }
      
      // console.log('Login successful, returning:', { success: true, token, userRole });
      return { success: true, token, userRole };
    } catch (error) {
      // console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data || error.message || 'Login failed',
      };
    }
  },

  // Register Job Seeker
  registerJobSeeker: async (formData) => {
    try {
      const response = await API.post('/auth/register/jobseeker', formData);
      return { success: true, message: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Registration failed',
      };
    }
  },

  // Register Employer
  registerEmployer: async (formData) => {
    try {
      const response = await API.post('/auth/register/employer', formData);
      return { success: true, message: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || 'Registration failed',
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Check if user is employer
  isEmployer: () => {
    return localStorage.getItem('userRole') === 'ROLE_EMPLOYER';
  },

  // Check if user is job seeker
  isJobSeeker: () => {
    return localStorage.getItem('userRole') === 'ROLE_JOB_SEEKER';
  },
};