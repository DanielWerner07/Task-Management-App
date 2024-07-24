import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setEmail(response.data.email || '');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`http://localhost:3001/api/users/${userId}/email`, { email: newEmail });
      setSuccess(response.data.message);
      setEmail(newEmail);
      setNewEmail('');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await axios.delete(`http://localhost:3001/api/users/${userId}`);
      setSuccess(response.data.message);
      localStorage.removeItem('userId');
      navigate('/');
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div className="account-container">
      <h1>Account Page</h1>
      <div className="user-info">
        <h2>Username: {username}</h2>
        <h2>Email: {email}</h2>
      </div>
      <form onSubmit={handleEmailUpdate} className="email-form">
        <div className="form-group">
          <label>New Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">Update Email</button>
      </form>
      <button onClick={handleDeleteAccount} className="button delete-button">Delete Account</button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button onClick={() => navigate('/home')} className="button">Go to Home Page</button>
    </div>
  );
};

export default Account;
