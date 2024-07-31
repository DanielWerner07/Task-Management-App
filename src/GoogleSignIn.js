import React, { useEffect } from 'react';
import { gapi } from 'gapi-script';

const GoogleSignIn = () => {
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const handleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then(user => {
      const profile = user.getBasicProfile();
      console.log('Name: ' + profile.getName());
      console.log('Email: ' + profile.getEmail());
      // You can store the profile information in local storage or context
    });
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
};

export default GoogleSignIn;
