import React, { useState } from 'react';

function PartnerForm() {
  const [customerId, setCustomerId] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle partner form submission
    console.log("3PL Partner Details Submitted:", { customerId, organizationName });
    // Add logic to send the data to backend or store it in state
  };

  return (
    <div className="partner-form">
      <h3>3PL Partner Details</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Customer ID:</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Organization Name:</label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Partner Details</button>
      </form>
    </div>
  );
}

export default PartnerForm;
