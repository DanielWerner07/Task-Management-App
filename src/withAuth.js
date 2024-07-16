import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (Component) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      fetch('http://localhost:3001/api/checkAuth', {
        method: 'GET',
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        if (!data.authenticated) {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        navigate('/login');
      });
    }, [navigate]);

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
