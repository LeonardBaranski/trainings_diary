import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, TextField, Snackbar, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import GoogleLogin from './login'; // Path to GoogleLogin component
import axios from 'axios';
import Footer from './footer.js'; // Path to Footer component

const BASE_URL = process.env.REACT_APP_BASE_URL;

const theme = createTheme({
  palette: {
    primary: {
      main: '#fdd835', // Yellow
    },
    secondary: {
      main: '#000000', // Black
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#000000', // Black for tab text
          '&.Mui-selected': {
            color: '#fdd835', // Yellow for selected tab
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White for AppBar background
          color: '#000000', // Black for AppBar text
        },
      },
    },
  },
});

const parseDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString();
};

const convertPaceToKmh = (paceStr) => {
  const [minutes, seconds] = paceStr.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds;
  const kmh = totalSeconds > 0 ? (3600 / totalSeconds).toFixed(2) : 0;
  return kmh;
};


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);
  const [distance, setDistance] = useState('');
  const [speed, setSpeed] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const columns = [
    { field: 'date', headerName: 'Datum', width: 180 },
    { field: 'distance', headerName: 'Distanz (km)', width: 130 },
    { field: 'speed', headerName: 'Pace (min/km)', width: 130 },
    { field: 'heartRate', headerName: 'Herzfrequenz (bpm)', width: 160 },
    {
      field: 'actions',
      headerName: 'Aktionen',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error" // Verwenden Sie die passende Farbe
          onClick={() => handleDelete(params.row._id.$oid)} // Aufrufen der Löschfunktion mit der Zeilen-ID
        >
          Löschen
        </Button>
      ),
    },
  ];

  const chartData = data?.map((item) => ({
    name: parseDate(item.date),
    Pace: convertPaceToKmh(item.speed),
  }));

  const handleDistanceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*,?[0-9]*$/.test(value)) {
      setDistance(value);
    }
  };

  const handleSpeedChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^0-9:]/g, '');
  
    if (sanitizedValue === value) {
      setSpeed(value);
    }
  };

  const handleHeartRateChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]+$/.test(value)) {
      setHeartRate(value);
    }
  };

  useEffect(() => {
    if (tab === 1 && isLoggedIn) {
      axios.get(`${BASE_URL}/mydata`, { withCredentials: true })
        .then(response => setData(response.data))
        .catch(error => console.error('Error fetching data', error));
    }
  }, [tab, isLoggedIn]);

  const fetchData = () => {
    axios.get(`${BASE_URL}/mydata`, { withCredentials: true })
      .then(response => {
        setData(response.data); // Aktualisieren Sie die Daten im State
      })
      .catch(error => console.error('Fehler beim Abrufen der Daten', error));
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios.post(`${BASE_URL}/mydata`, { distance, speed, heartRate }, { withCredentials: true })
      .then(() => {
        setDistance('');
        setSpeed('');
        setHeartRate('');
        setSnackbarMessage('Daten erfolgreich hochgeladen');
        setSnackbarOpen(true);
      })
      .catch(error => {
        setSnackbarMessage('Fehler beim Hochladen der Daten');
        setSnackbarOpen(true);
        console.error('Fehler beim Hochladen der Daten', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${BASE_URL}/mydata/${id}`, { withCredentials: true })
      .then(() => {
        fetchData();
        setSnackbarMessage('Datensatz wurde erfolgreich gelöscht');
        setSnackbarOpen(true);
      })
      .catch(error => {
        setSnackbarMessage('Fehler beim Löschen des Datensatzes');
        setSnackbarOpen(true);
        console.error('Fehler beim Löschen des Datensatzes', error);
      });
  };

  const handleLoginSuccess = user => {
    setIsLoggedIn(true);
    setUser(user);
  };

  const handleLogout = () => {
    axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true })
      .then(response => {
        if (response.data.message === 'Successfully logged out') {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch(error => console.error('Error logging out', error));
  };

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Trainingstagebuch
              </Typography>
              <GoogleLogin onLoginSuccess={handleLoginSuccess} />
            </Toolbar>
          </AppBar>

          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <Grid item xs={12} md={6}>
              <Box p={3} textAlign="center" boxShadow={3} bgcolor="#fdd835" color="#000000" borderRadius={"10px"}>
                <Typography variant="h3" gutterBottom fontFamily={"Oswald"}>
                  Online Trainingstagebuch
                </Typography>
              </Box>
              <Box mt={3} p={3} boxShadow={3} bgcolor="#ffffff" color="#000000" borderRadius={"10px"}>
                <Typography variant="h5" gutterBottom>
                  Was ist das?
                </Typography>
                <Typography variant="body1" paragraph>
                  Das Online Trainingstagebuch ist eine benutzerfreundliche Webanwendung, die es Ihnen ermöglicht, Ihre
                  Trainingsdaten einfach zu erfassen und detailliert auszuwerten.
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Wie funktioniert es?
                </Typography>
                <Typography variant="body1" paragraph>
                  Melden Sie sich ganz einfach mit Ihrem Google-Konto an und laden Sie Ihre Trainingsdaten hoch.
                  Diese Daten werden sicher in unserer Datenbank gespeichert und können bequem in einer übersichtlichen Tabelle
                  angezeigt werden.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </div>
        <Footer />
      </ThemeProvider>
      
    );
  }


  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Trainingstagebuch
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
              {user.name}
            </Typography>
            {!isLoggedIn && <GoogleLogin onLoginSuccess={handleLoginSuccess} />}
            {isLoggedIn && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
          </Toolbar>
        </AppBar>
        

        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Grid item xs={12} md={6}>
          <Box p={3} textAlign="center" boxShadow={3} bgcolor="#fdd835" color="#000000" borderRadius={"10px"}>
                <Typography variant="h3" gutterBottom fontFamily={"Oswald"}>
                  Online Trainingstagebuch
                </Typography>
              </Box>
            <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)} centered>
              <Tab label="Daten hochladen" />
              <Tab label="Deine Trainings" />
              <Tab label="Datenvisualisierungen" />
            </Tabs>

            {tab === 0 && (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Strecke in km"
                  value={distance}
                  onChange={handleDistanceChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Pace (min/km)"
                  value={speed}
                  onChange={handleSpeedChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Herzfrequenz (spm)"
                  value={heartRate}
                  onChange={handleHeartRateChange}
                  margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Hochladen
                </Button>
              </Box>
            )}

            {tab === 1 && data && (
                      <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                          rows={data.map((item, index) => ({ ...item, id: index }))}
                          columns={columns}
                          pageSize={5}
                        />
                      </div>
                    )}

            {tab === 2 && (
              <LineChart width={600} height={300} data={chartData} style={{marginTop: "20px"}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Pace" stroke="#fdd835" />
              </LineChart>
        )} 
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default App;

