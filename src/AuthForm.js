import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/home');
    }
  }, [navigate]);

  const validateForm = () => {
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const url = isLogin ? 'http://localhost:3001/api/login' : 'http://localhost:3001/api/register';
      const response = await axios.post(url, { username, password });
      alert(response.data.message);
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error || 'An error occurred');
      } else {
        setError('An error occurred');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="switch-button"
        >
          {isLogin ? 'Make new account' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
