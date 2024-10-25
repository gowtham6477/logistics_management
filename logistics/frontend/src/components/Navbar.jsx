import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ role }) => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Where is My Truck</div>
      <ul className="navbar-links">
        {role === 'admin' && <li><Link to="/govt-dashboard">Govt Dashboard</Link></li>}
        {role === '3pl-partner' && <li><Link to="/private-partner-dashboard">Private Partner Dashboard</Link></li>}
        {role === 'manager' && <li><Link to="/manager-dashboard">Manager Dashboard</Link></li>}
        {role === 'driver' && <li><Link to="/truck-driver-dashboard">Driver Dashboard</Link></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
