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
        throw new Error('We couldn\'t complete your sign-in. Please try logging in manually.');
      }

      // Return combined data
      return {
        ...response.data,
        token: loginResponse.data.token,
        login_data: loginResponse.data
      };
    } catch (error) {
      // Extract all Django error messages
      if (error.response?.status === 400) {
        const data = error.response.data;
        const messages = [];

        // Collect all error messages from all fields
        for (const errors of Object.values(data)) {
          if (Array.isArray(errors)) {
            messages.push(...errors);
          } else if (typeof errors === 'string') {
            messages.push(errors);
          }
        }

        if (messages.length > 0) {
          // Join all error messages with newlines
          throw new Error(messages.join('\n'));
        }
      }
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
      // Extract all Django error messages for login
      if (error.response?.status === 400 || error.response?.status === 401) {
        const data = error.response.data;
        const messages = [];

        // Collect all error messages from all fields
        for (const errors of Object.values(data)) {
          if (Array.isArray(errors)) {
            messages.push(...errors);
          } else if (typeof errors === 'string') {
            messages.push(errors);
          }
        }

        if (messages.length > 0) {
          throw new Error(messages.join('\n'));
        }

        // Fallback to generic message if no specific field error
        throw new Error('The email or password you entered is incorrect. Please try again.');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout/');
      localStorage.removeItem('authToken');
      return response.data;
    } catch (error) {
      // Always clear token locally even if server request fails
      localStorage.removeItem('authToken');
      // Don't throw error for logout - it's a safe operation
      return { message: 'You have been signed out.' };
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  getToken: () => {
    return localStorage.getItem('authToken');
  }
};
