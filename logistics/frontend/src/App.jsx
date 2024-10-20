import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GovtDashboard from './components/admin/GovtDashboard';
import PrivatePartnerDashboard from './components/3PLpartners/PrivatePartnerDashboard';
import TruckDriverDashboard from './components/driver/TruckDriverDashboard';
import ManagerDashboard from './components/Manager/ManagerDashboard';
import BackgroundLogin from './components/BackgroundLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BackgroundLogin />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/govt-dashboard" element={<GovtDashboard />} />
        <Route path="/private-partner-dashboard" element={<PrivatePartnerDashboard />} />
        <Route path="/truck-driver-dashboard" element={<TruckDriverDashboard />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
