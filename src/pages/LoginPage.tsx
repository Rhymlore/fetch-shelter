import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { TextField, Button, Container, FormControl, Box, Typography } from '@mui/material'
import localForage from 'localforage';

interface LoginPageProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
}
const LoginPage = ({isLoggedIn, setIsLoggedIn}: LoginPageProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            await login(name, email);
            localForage.setItem('isLoggedIn', true);
            setIsLoggedIn(true);
            navigate('/search');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{textAlign:"center", display:"flex", flexDirection:"column", maxWidth:"400px", margin:"auto"}}>
            <Typography variant='h3' sx={{marginTop:"2rem"}}>Login</Typography>
            <FormControl sx={{marginTop:"2rem"}}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl sx={{marginTop:"1rem"}}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <Button variant="contained" color="primary" fullWidth sx={{marginTop:"1rem"}} component="form" onClick={handleSubmit}>
                Login
            </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;
