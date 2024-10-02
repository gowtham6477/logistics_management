import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GovtDashboard from './components/GovtDashboard';
import PrivatePartnerDashboard from './components/PrivatePartnerDashboard';
import TruckDriverDashboard from './components/TruckDriverDashboard';

import './App.css'; // Import global styles



function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/govt-dashboard" element={<GovtDashboard />} />
          <Route path="/private-partner-dashboard" element={<PrivatePartnerDashboard />} />
          <Route path="/truck-driver-dashboard" element={<TruckDriverDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
