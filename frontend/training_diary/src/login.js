import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoogleLogin = ({ onLoginSuccess }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: '42379345688-pct8948ievr9pl261l58ml0o8cga8cut.apps.googleusercontent.com',
      callback: handleCredentialResponse
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );

    window.google.accounts.id.prompt();
  }, []);

  const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // Hier können Sie Benutzerinformationen extrahieren und an onLoginSuccess weitergeben
    const user = { name: "Google User", email: "user@example.com" };
    axios.post("http://localhost:5000/callback", { token: response.credential }, { withCredentials: true }).then((response) => {
      console.log(response);
      onLoginSuccess(user);
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
