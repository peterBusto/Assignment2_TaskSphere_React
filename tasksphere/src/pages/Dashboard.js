import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/logout');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px',
        padding: '20px 0',
        borderBottom: '1px solid #e1e5e9'
      }}>
        <h1 style={{ color: '#333', margin: 0 }}>TaskSphere Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          Logout
        </button>
      </header>

      <main>
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#333', marginBottom: '16px' }}>
            Welcome to TaskSphere!
          </h2>
          <p style={{ color: '#666', fontSize: '18px', lineHeight: 1.6 }}>
            You have successfully logged in. Your task management dashboard will be implemented here.
          </p>
          <p style={{ color: '#888', marginTop: '20px' }}>
            Authentication Status: <span style={{ color: '#28a745', fontWeight: '600' }}>✓ Authenticated</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
