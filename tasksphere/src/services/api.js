import axios from 'axios';

const API_BASE_URL = 'https://assignment2-task-sphere-django.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User-friendly error messages for common scenarios
const getErrorMessage = (error) => {
  // Network errors (no internet connection)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.';
    }
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  const { status, data } = error.response;

  // Handle specific HTTP status codes
  switch (status) {
    case 400:
      // Bad Request - validation errors
      if (data && typeof data === 'object') {
        // Extract ALL error messages from Django validation errors
        const allErrors = [];
        for (const [field, errors] of Object.entries(data)) {
          if (Array.isArray(errors)) {
            allErrors.push(...errors);
          } else if (typeof errors === 'string') {
            allErrors.push(errors);
          }
        }
        if (allErrors.length > 0) {
          return allErrors.join('\n');
        }
      }
      return 'Please check your information and try again.';

    case 401:
      // Unauthorized
      localStorage.removeItem('authToken');
      return 'Your session has expired. Please sign in again.';

    case 403:
      // Forbidden
      return 'You do not have permission to perform this action.';

    case 404:
      // Not Found
      return 'The requested resource was not found.';

    case 408:
    case 504:
      // Timeout
      return 'The server is taking too long to respond. Please try again later.';

    case 409:
      // Conflict (e.g., duplicate email/username)
      if (data?.email) return 'An account with this email already exists.';
      if (data?.username) return 'This username is already taken.';
      return 'This information conflicts with an existing account.';

    case 422:
      // Unprocessable Entity
      return 'The information you provided is invalid. Please check and try again.';

    case 429:
      // Too Many Requests
      return 'Too many attempts. Please wait a moment and try again.';

    case 500:
    case 502:
    case 503:
      // Server errors
      return 'Something went wrong on our end. Please try again later.';

    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    // Transform error into user-friendly message
    const friendlyMessage = getErrorMessage(error);
    const enhancedError = new Error(friendlyMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;

    return Promise.reject(enhancedError);
  }
);


export default api;
