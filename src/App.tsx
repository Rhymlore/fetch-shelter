import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import Navigation from './components/Navigation';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import localForage from 'localforage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#fba919',
      },
      secondary: {
        main: '#FFFFFF',
      }
    },
  });
  useEffect(() => {
    localForage.getItem('isLoggedIn').then(value => {
      setIsLoggedIn(value === true);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar sx={{display:"flex", flexDirection:"row"}}>
            <img src="/logo.png" alt="Dog Logo" style={{maxHeight:"80px", marginRight:"2rem"}} />
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", flexGrow: 1 }}>
              <Typography variant='h3' sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }, color: "#FFFFFF" }}>
                Fetch Dog Shelter
              </Typography>
              <Typography variant="caption" sx={{ color: "#FFFFFF" }}>
                Fetching Happiness, One Tail at a Time!
              </Typography>
            </Box>
            <Navigation isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
