import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';


function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('truckDriver'); // Default role is truckDriver
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Predefined login details for each role
  const users = {
    govt: { username: 'adminUser', password: 'govtPass123' },
    privatePartner: { username: 'partnerUser', password: 'partnerPass123' },
    truckDriver: { username: 'driverUser', password: 'driverPass123' },
    Manager: {username: 'ManagerUser', password: 'managerPass123'}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate credentials based on the role selected
    const selectedUser = users[role];

    if (username === selectedUser.username && password === selectedUser.password) {
      setErrorMessage(''); // Clear any previous error message
      // Navigate to the respective dashboard based on the role
      if (role === 'govt') {
        navigate('/govt-dashboard');
      } else if (role === 'privatePartner') {
        navigate('/private-partner-dashboard');
      } 
      else  if (role === 'truckDriver') {

        navigate('/truck-driver-dashboard');
      }
      else {
        navigate('/manager-dashboard');
      }
    } else {
      // Set error message if credentials are incorrect
      setErrorMessage('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="truckDriver">Truck Driver</option>
          <option value="govt">Admin</option>
          <option value="privatePartner">3PL Partner</option>
          <option value="Manager">Manager</option>
        </select>
        <button type="submit">Login</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
}

export default LoginPage;