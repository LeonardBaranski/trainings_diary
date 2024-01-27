import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import GoogleLogin from './login'; // Pfad zur GoogleLogin-Komponente
import axios from 'axios';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://localhost:5000/mydata')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  }, [tab]);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    console.log("Logging out")
    axios.post("http://localhost:5000/logout");
    // Optional: Logout Logik für Google, falls notwendig
  };

  return (
    <div className="App">
      <h1>Willkommen zu meiner Anwendung</h1>
      {!isLoggedIn && <GoogleLogin onLoginSuccess={handleLoginSuccess} />}
      {isLoggedIn && user && (
        <div>
          <div>Willkommen, {user.name}!</div>
          <button onClick={handleLogout}>Ausloggen</button>
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
            <Tab label="Upload Data" />
            <Tab label="View Data" />
          </Tabs>
          {tab === 0 && (
            <Box>
              {/* Code to upload data goes here */}
            </Box>
          )}
          {tab === 1 && (
            <Box>
              {data && <div>Your data: {JSON.stringify(data)}</div>}
            </Box>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

