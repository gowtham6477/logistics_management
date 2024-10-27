// api.js

import axios from 'axios';

// Function to make the login API call
export const login = async (username, password, role) => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      username,
      password,
      role,
    });

    return response.data; // Return the data received from the backend
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};
