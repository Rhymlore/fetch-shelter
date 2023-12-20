import React from 'react';
import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Star } from '@mui/icons-material';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PetsIcon from '@mui/icons-material/Pets';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface DogCardProps {
    id?: string;
    name: string;
    img: string;
    breed: string;
    age: number;
    location: string;
    favorited: boolean; 
    handleFavorites: () => void; 
}

const DogCard: React.FC<DogCardProps> = ({ id, name, img, breed, age, location, favorited, handleFavorites }) => {
    return (
        <Card className="dog-card" sx={{ mt: 3, width: "100%", maxWidth: { xs: 300, sm: 360, md: 400 } }}>
            <CardMedia 
                component="img" 
                alt={name} 
                image={img} 
                sx={{ 
                    height: { xs: 200, sm: 250 }, 
                    width: "100%", 
                    objectFit: 'cover' 
                }} 
            />
            <CardContent>
                <Box sx={{display: "flex", flexDirection:"row", justifyContent:"space-between"}}>
                <Typography variant="h5" component="h2" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {name}
                </Typography>
                {favorited ? 
                <Button /* Starred */ onClick={handleFavorites}>
                    <Star />
                </Button>
                :
                <Button /* Not Starred */ onClick={handleFavorites}>
                    <StarBorderOutlinedIcon />
                </Button>
                }
                </Box>
                <Box sx={{display: "flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                <PetsIcon color='primary' sx={{marginBottom:"5px"}}/>
                <Typography variant="body1" component="p">
                    : {breed}
                </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                <DateRangeIcon color='primary' sx={{marginBottom:"5px"}}/>
                <Typography variant="body1" component="p">
                : {age} years old
                </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection:"row", justifyContent:"flex-start", alignItems:"center"}}>
                <LocationOnIcon color='primary' sx={{marginBottom:"5px"}}/>
                <Typography variant="body1" component="p">
                    : {location}
                </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DogCard;
