import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GovtDashboard from './components/GovtDashboard';
import PrivatePartnerDashboard from './components/PrivatePartnerDashboard';
import TruckDriverDashboard from './components/TruckDriverDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/govt-dashboard" element={<GovtDashboard />} />
        <Route path="/private-partner-dashboard" element={<PrivatePartnerDashboard />} />
        <Route path="/truck-driver-dashboard" element={<TruckDriverDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
