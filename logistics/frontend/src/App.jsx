import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
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
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <FontAwesomeIcon icon={faTruck} className="header-icon" />
            <h1>Where is My Truck</h1>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<BackgroundLogin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/govt-dashboard" element={<GovtDashboard />} />
          <Route path="/private-partner-dashboard" element={<PrivatePartnerDashboard />} />
          <Route path="/truck-driver-dashboard" element={<TruckDriverDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
