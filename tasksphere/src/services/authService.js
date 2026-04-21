import api from './api';

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register/', userData);
      
      // Django registration doesn't return a token, so we need to login automatically
      const loginResponse = await api.post('/api/auth/login/', {
        email: userData.email,
        password: userData.password
      });
      
      // Store token from login response
      if (loginResponse.data.token) {
        localStorage.setItem('authToken', loginResponse.data.token);
      } else {
        throw new Error('No token received from auto-login');
      }
      
      // Return combined data
      return {
        ...response.data,
        token: loginResponse.data.token,
        login_data: loginResponse.data
      };
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login/', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout/');
      localStorage.removeItem('authToken');
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      throw error;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  }
};
