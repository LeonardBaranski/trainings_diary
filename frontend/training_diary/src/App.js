import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Button, TextField, Card, CardContent, AppBar, Toolbar, Grid, Typography } from '@mui/material';
import GoogleLogin from './login'; // Pfad zur GoogleLogin-Komponente
import axios from 'axios';
import './App.css';


const colorprimary = '#263E5A';
const colorsecondary = '#D8C4B7';
const colorbutton = '#5393C0';

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
    console.log(user)
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
  };


  return (
    <div className="App">
      <Container maxWidth="sm" className="background">
        {!isLoggedIn ? (
          <Grid container alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
            <Grid item>
              <Typography variant="h4">Willkommen zu meiner Anwendung</Typography>
              <GoogleLogin onLoginSuccess={handleLoginSuccess} />
            </Grid>
          </Grid>
        ) : (
          <>
            <AppBar position="static" className="customAppBar" style={{ background: '#2E3B55', borderRadius: "10px"}}>
              <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  Willkommen, {user.name}
                </Typography>
                <Button color="inherit" onClick={handleLogout} style={{ backgroundColor: '#5393C0', color: '#FFF' }}>
                  Ausloggen
                </Button>
              </Toolbar>
            </AppBar>
            <Box style={{ marginTop: '20px'}}>
              <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)} className="tabsContainer" style={{ background: colorsecondary}}>
                <Tab label="Training Hochladen" />
                <Tab label="Meine Trainings" />
              </Tabs>
              {tab === 0 && (
                <Box component="form" onSubmit={handleSubmit}>
                  <div className='verticalForm'>
                    <TextField label="Strecke in km" value={distance} onChange={(e) => setDistance(e.target.value)} style={{ marginBottom: '10px' }} />
                    <TextField label="Pace (min/km)" value={speed} onChange={(e) => setPace(e.target.value)} style={{ marginBottom: '10px' }} />
                    <TextField label="Herzfrequenz (bpm)" value={heart_rate} onChange={(e) => setHeartRate(e.target.value)} style={{ marginBottom: '10px' }} />
                    <Button type="submit" variant="contained" style={{ backgroundColor: '#5393C0', color: '#FFF', marginBottom: "10px"}}>Daten hochladen</Button>
                  </div>
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  {data && (
                    <Card>
                      <CardContent className='trainings'>
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
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}
            </Box>
          </>
        )}
      </Container>
    </div>
  );
};

export default App;

