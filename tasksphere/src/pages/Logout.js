import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css';

const Logout = () => {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Redirect to login page after successful logout
        setTimeout(() => {
          navigate('/login');
        }, 2000); // 2 second delay to show logout message
      } catch (error) {
        // Still redirect even if logout fails
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logout-content">
          <div className="logout-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16L21 12M21 12L17 8M21 12H9M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Logging Out</h2>
          
          {loading ? (
            <p>Signing you out of your account...</p>
          ) : (
            <p>You have been successfully logged out.</p>
          )}
          
          <p className="redirect-message">
            You will be redirected to the login page in a moment...
          </p>
          
          <div className="logout-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
