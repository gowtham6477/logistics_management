import React, { useState } from 'react';

function DriverForm() {
  const [driverName, setDriverName] = useState('');
  const [driverAddress, setDriverAddress] = useState('');
  const [driverMobile, setDriverMobile] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle driver form submission
    console.log("Driver Details Submitted:", { driverName, driverAddress, driverMobile });
    // Add logic to send the data to backend or store it in state
  };

  return (
    <div className="driver-form">
      <h3>Driver Details</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Driver Name:</label>
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Driver Address:</label>
          <input
            type="text"
            value={driverAddress}
            onChange={(e) => setDriverAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Driver Mobile Number:</label>
          <input
            type="tel"
            value={driverMobile}
            onChange={(e) => setDriverMobile(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Driver Details</button>
      </form>
    </div>
  );
}

export default DriverForm;
