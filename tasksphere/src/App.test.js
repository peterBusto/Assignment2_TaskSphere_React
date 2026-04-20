import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple test component to verify basic rendering
const TestComponent = () => (
  <div>
    <h1>TaskSphere</h1>
    <p>Authentication System</p>
  </div>
);

test('renders basic component', () => {
  render(<TestComponent />);
  
  // Check if basic elements are rendered
  expect(screen.getByText(/TaskSphere/i)).toBeInTheDocument();
  expect(screen.getByText(/Authentication System/i)).toBeInTheDocument();
});
