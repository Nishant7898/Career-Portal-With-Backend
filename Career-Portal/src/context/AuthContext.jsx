import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    
    setLoading(false);
  }, []);

  const login = async (usernameOrEmail, password) => {
    const result = await authService.login(usernameOrEmail, password);
    
    if (result.success) {
      setIsAuthenticated(true);
      setUserRole(result.userRole);
    }
    
    return result;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const value = {
    isAuthenticated,
    userRole,
    loading,
    login,
    logout,
    isEmployer: () => userRole === 'ROLE_EMPLOYER',
    isJobSeeker: () => userRole === 'ROLE_JOB_SEEKER',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};