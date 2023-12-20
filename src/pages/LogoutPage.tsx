import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import localForage from 'localforage';
import { Box, Container, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

    useEffect(() => {
        const performLogout = async () => {
            try {
            await logout(); // Call the logout API
            await localForage.setItem('isLoggedIn', false);
            } catch (error) {
            console.error('Logout failed:', error);
            // Optionally, handle any errors, e.g., show an error message
            }
        };
        performLogout();
        const timeoutId = setTimeout(() => {
            navigate('/login');
          }, 2000);
        // Clean up the timeout when the component is unmounted
        return () => clearTimeout(timeoutId);
    }, [navigate]);
  return (
    <Container sx={{ animation: `${fadeIn} 1s ease-in-out`, marginTop:"3rem"}} maxWidth="xl">
        <Box sx={{textAlign:"center"}}>
            <Typography variant='h3'>Logging out...</Typography>
            <Typography variant='h4'>Redirecting to login page...</Typography>
        </Box>
    </Container>
  );
};

export default LogoutPage;