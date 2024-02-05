import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const GoogleLogin = ({ onLoginSuccess }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );

      window.google.accounts.id.prompt();
    };

    initializeGoogleSignIn();
  }, []);

  const handleCredentialResponse = (response) => {
    axios.post(`${BASE_URL}/callback`, { token: response.credential }, { withCredentials: true })
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        setIsLoggedIn(true);
        onLoginSuccess(userData); // Assuming onLoginSuccess updates the parent component
      })
      .catch((error) => {
        console.error('Login failed:', error);
        // Optionally set an error state and display it
      });
  };

  return (
    <div>
      {!isLoggedIn && <div id="google-signin-button"></div>}
      {isLoggedIn && <div>Willkommen, {user.name}!</div>}
    </div>
  );
};

export default GoogleLogin;
