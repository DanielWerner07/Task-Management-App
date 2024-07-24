import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/');
    } else {
      fetchUserDetails();
    }
  }, [userId, navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
      setUsername(response.data.username);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div className="account-container">
      <h1>Account Details</h1>
      {error && <p className="error-message">{error}</p>}
      <p><strong>Username:</strong> {username}</p>
      <button onClick={() => navigate('/home')} className="button">
        Back to Home
      </button>
    </div>
  );
};

export default Account;
