import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPages.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    terms_agreed: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.terms_agreed) {
      errors.terms_agreed = 'You must agree to the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      setRegistrationSuccess(true);
      // Redirect to dashboard after 2.5 seconds to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      // Error is already handled in the context
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join TaskSphere to manage your tasks efficiently</p>
        
        {error && <div className="error-message">{error}</div>}
        
        {registrationSuccess && (
          <div className="success-message">
            <h3>🎉 Account Created Successfully!</h3>
            <p>Welcome to TaskSphere! You will be redirected to your dashboard in a moment...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={validationErrors.username ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.username && (
                <span className="error-text">{validationErrors.username}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={validationErrors.first_name ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.first_name && (
                <span className="error-text">{validationErrors.first_name}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={validationErrors.last_name ? 'error' : ''}
                disabled={loading}
              />
              {validationErrors.last_name && (
                <span className="error-text">{validationErrors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? 'error' : ''}
              disabled={loading}
            />
            {validationErrors.email && (
              <span className="error-text">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={validationErrors.password ? 'error' : ''}
              disabled={loading}
            />
            {validationErrors.password && (
              <span className="error-text">{validationErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={validationErrors.confirm_password ? 'error' : ''}
              disabled={loading}
            />
            {validationErrors.confirm_password && (
              <span className="error-text">{validationErrors.confirm_password}</span>
            )}
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms_agreed"
                name="terms_agreed"
                checked={formData.terms_agreed}
                onChange={handleChange}
                className={validationErrors.terms_agreed ? 'error' : ''}
                disabled={loading}
              />
              <label htmlFor="terms_agreed" className="checkbox-label">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                I agree to the <button type="button" className="link-button" onClick={() => alert('Terms and Conditions will be displayed here')}>Terms and Conditions</button> and <button type="button" className="link-button" onClick={() => alert('Privacy Policy will be displayed here')}>Privacy Policy</button>
              </label>
            </div>
            {validationErrors.terms_agreed && (
              <span className="error-text">{validationErrors.terms_agreed}</span>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
