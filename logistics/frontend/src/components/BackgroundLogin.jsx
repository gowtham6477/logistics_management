// BackgroundLogin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackgroundLogin.css'; // Make sure this CSS file exists

const BackgroundLogin = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="background-container">
      <button className="login-button" onClick={handleLoginClick}>
        Login
      </button>
    </div>
  );
};

export default BackgroundLogin;
