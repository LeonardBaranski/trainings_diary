import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import GoogleLogin from './login'; // Pfad zur GoogleLogin-Komponente
import axios from 'axios';
import { t } from 'prettier';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);
  const [distance, setDistance] = useState('');
  const [speed, setPace] = useState('');
  const [heart_rate, setHeartRate] = useState('');

  useEffect(() => {
    if (tab === 1) {
      axios.get('http://localhost:5000/mydata', { withCredentials: true })
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
  }, [tab]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/mydata', { distance, speed, heart_rate }, { withCredentials: true })
      .then(response => {
        console.log('Data uploaded successfully');
        // Optionally, fetch the updated data list
      })
      .catch(error => {
        console.error('There was an error uploading the data!', error);
      });
  };

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const handleLogout = () => {
    console.log("Logging out")
    axios.post("http://localhost:5000/logout", {}, { withCredentials: true }).then((response) => {
      if (response.data.message === "Successfully logged out") {
        console.log(response);
        setIsLoggedIn(false);
        setUser(null);
      }
    })
    .catch(error => {
      console.error('There was an error logging out!', error);
    });
    // Optional: Logout Logik für Google, falls notwendig
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <h1>Willkommen zu meiner Anwendung</h1>
        <GoogleLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }
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
              <form onSubmit={handleSubmit}>
                <input type="text" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="Strecke in km" />
                <input type="text" value={speed} onChange={(e) => setPace(e.target.value)} placeholder="Pace (min/km)" />
                <input type="text" value={heart_rate} onChange={(e) => setHeartRate(e.target.value)} placeholder="Herzfrequenz (bpm)" />
                <button type="submit">Daten hochladen</button>
              </form>
            </Box>
          )}
          {tab === 1 && (
            <Box>
              {data && (
                <div>
                  <h2>Deine Lauftrainings:</h2>
                  <ul>
                    {data.map((item, index) => (
                      <li key={index}>
                        Strecke: {item.distance} km,
                        Pace: {item.speed} min/km,
                        Herzfrequenz: {item.heart_rate} bpm
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Box>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

