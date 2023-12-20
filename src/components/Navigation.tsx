import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import localForage from 'localforage';

interface NavigationProps {
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
}

const Navigation = ({isLoggedIn,setIsLoggedIn}:NavigationProps) => {
    const navigate = useNavigate();

    const handleClick = async () => {
        const loginStatus = await localForage.getItem('isLoggedIn');
        if (loginStatus) {
          await localForage.setItem('isLoggedIn', false);
          setIsLoggedIn(false);
          navigate('/logout');
        } else {
          await localForage.setItem('isLoggedIn', true);
          setIsLoggedIn(true);
          navigate('/login');
        }
      };      
    
    useEffect(() => {
        localForage.getItem('isLoggedIn').then(value => {
        setIsLoggedIn(value === true);
        });
    }, [isLoggedIn]);
    return (
        <Button variant="contained" color="secondary" size="large" onClick={handleClick}>
        {isLoggedIn ? "Logout" : "Login"}
        </Button>
    );
    };

    export default Navigation;