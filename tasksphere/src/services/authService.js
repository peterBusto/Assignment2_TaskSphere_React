const API_BASE_URL = 'http://127.0.0.1:8000/api/auth';

export const authService = {
  // Registration
  async register(userData) {
    console.log('Sending registration data:', userData);
    
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Registration error:', error);
      
      // Handle different error formats
      let errorMessage = 'Registration failed';
      if (error.detail) {
        errorMessage = error.detail;
      } else if (error.non_field_errors) {
        errorMessage = error.non_field_errors.join(', ');
      } else if (typeof error === 'object') {
        // Handle field-specific errors with better formatting
        const errorMessages = Object.entries(error).map(([field, messages]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          const messageArray = Array.isArray(messages) ? messages : [messages];
          const formattedMessages = messageArray.map(msg => msg.charAt(0).toUpperCase() + msg.slice(1));
          return `${fieldName}: ${formattedMessages.join(', ')}`;
        });
        errorMessage = errorMessages.join('\n');
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Registration success:', data);
    return data;
  },

  // Login
  async login(credentials) {
    console.log('Sending login data:', credentials);
    
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      if (error.detail) {
        errorMessage = error.detail;
      } else if (error.non_field_errors) {
        errorMessage = error.non_field_errors.join(', ');
      } else if (typeof error === 'object') {
        // Handle field-specific errors with better formatting
        const errorMessages = Object.entries(error).map(([field, messages]) => {
          const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
          const messageArray = Array.isArray(messages) ? messages : [messages];
          const formattedMessages = messageArray.map(msg => msg.charAt(0).toUpperCase() + msg.slice(1));
          return `${fieldName}: ${formattedMessages.join(', ')}`;
        });
        errorMessage = errorMessages.join('\n');
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Login success:', data);
    // Store token in localStorage
    localStorage.setItem('authToken', data.token);
    return data;
  },

  // Logout
  async logout() {
    const token = localStorage.getItem('authToken');
    
    // If no token, just remove any existing token and return
    if (!token) {
      localStorage.removeItem('authToken');
      return { message: 'Already logged out' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Remove token from localStorage regardless of response
      localStorage.removeItem('authToken');
      
      if (!response.ok) {
        // Don't throw error for logout, just log it
        console.error('Logout API call failed:', response.status);
        return { message: 'Logged out locally' };
      }
      
      return await response.json();
    } catch (error) {
      // Remove token and handle gracefully
      localStorage.removeItem('authToken');
      console.error('Logout error:', error);
      return { message: 'Logged out locally' };
    }
  },

  // Get current token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
};
