import React, { useState } from 'react';
import './ManagerForm.css';

function ManagerForm() {
  const [formData, setFormData] = useState({
    managerName: '',
    managerAge: '',
    managerAddress: '',
    managerId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Manager Data Submitted:', formData);
    // Add logic to submit the form data to the backend or API endpoint
  };

  return (
    <div className="manager-form-container">
      <h2>Manager Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="managerName">Manager Name:</label>
          <input
            type="text"
            id="managerName"
            name="managerName"
            value={formData.managerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="managerAge">Manager Age:</label>
          <input
            type="number"
            id="managerAge"
            name="managerAge"
            value={formData.managerAge}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="managerAddress">Manager Address:</label>
          <input
            type="text"
            id="managerAddress"
            name="managerAddress"
            value={formData.managerAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="managerId">Manager ID:</label>
          <input
            type="text"
            id="managerId"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default ManagerForm;
