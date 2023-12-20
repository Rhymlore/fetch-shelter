import React, { useState, useEffect } from 'react';
import { getDogBreeds, searchDogs, fetchDogDetails } from '../services/api'; // Adjust the import path as needed
import { Select, MenuItem, InputLabel, FormControl, Container, Box, Grid, Checkbox, ListItemText, Typography, Divider, TextField, Pagination, Button } from '@mui/material';
import DogCard from '../components/DogCard';
import { SearchDogsParams, Dog } from '../utils/types';
import localForage from 'localforage';
import Star from '@mui/icons-material/Star';

const SearchPage: React.FC = () => {
    const [breeds, setBreeds] = useState([]); // Options for breed filtering
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState('breed:asc');
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [favorites, setFavorites] = useState(new Set());
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalResults: 0,
        resultsPerPage: 24
    });
    const [zipCode, setZipCode] = useState(''); // Zip code for location filtering
    const [zipCodesArray, setZipCodesArray] = useState<string[]>([]);
    
    // Fetch breeds for filtering options
    const fetchAndSetBreeds = async () => {
        const results = await getDogBreeds();
        setBreeds(results);
        console.log(selectedBreeds)
    };

    // Fetch dogs based on filters
    const fetchAndSetDogs = async () => {
        try {
        let params:SearchDogsParams = {
            breeds: selectedBreeds,
            sort: sortOrder,
            size: pagination.resultsPerPage,
            from: (pagination.currentPage - 1) * pagination.resultsPerPage,
        };

        if (zipCodesArray.length > 0) {
            params.zipCodes = zipCodesArray.filter(zip => zip !== "");
        }

        const searchResults = await searchDogs(params);
        if (searchResults && searchResults.resultIds.length > 0) {
        const detailedDogs = await fetchDogDetails(searchResults.resultIds);
        setPagination({...pagination, totalResults: searchResults.total});
        setDogs(detailedDogs);
        } else {
        // Handle the case where there are no results (e.g., set dogs to an empty array or show a message)
        setDogs([]);
        }
    } catch (error) {
        console.error(error);
    }
    };      

    const matchFavoriteDogs = async () => {
        try {
            const savedFavorites = await localForage.getItem('favorites')
            if (Array.isArray(savedFavorites) && savedFavorites.length > 0) {
                const detailedDogs = await fetchDogDetails(savedFavorites);
                setPagination({...pagination, totalResults: savedFavorites.length});
                setDogs(detailedDogs);
            } else {
                // Handle the case where there are no results (e.g., set dogs to an empty array or show a message)
                setDogs([]);
            }
        } catch (error) {
            console.error(error);
        }
    }
    // Fetch breeds for filtering options
    useEffect(() => {
        fetchAndSetBreeds();
    }, [selectedBreeds]);

    // Add zipcodes to array
    useEffect(() => {
        const zips = zipCode.split(',').map(zip => zip.trim());
        setZipCodesArray(zips);
      }, [zipCode]);

    // Fetch dogs based on filters
    useEffect(() => {
        fetchAndSetDogs();
    }, [selectedBreeds, sortOrder, zipCodesArray, pagination.currentPage]);

    useEffect(() => {
        const fetchSavedFavorites = async () => {
          try {
            const savedFavorites = await localForage.getItem('favorites') as string[];
            if (savedFavorites) {
              setFavorites(new Set(savedFavorites));
            }
          } catch (error) {
            console.error('Failed to fetch favorites:', error);
          }
        };
      
        fetchSavedFavorites();
      }, []);

    const toggleFavorite = (dogId:string) => {
    setFavorites((prevFavorites) => {
        const newFavorites = new Set(prevFavorites);
        if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
        } else {
        newFavorites.add(dogId);
        }
        localForage.setItem('favorites', Array.from(newFavorites)); // Save updated favorites
        return newFavorites;
    });
    };


    return (
        <Container sx={{pt:6, margin:"auto"}} maxWidth={"xl"}>
            <Typography variant='h4'>Search</Typography>
            <Divider sx={{mt:2}}/>
            <Typography variant='h6' sx={{my:2}}>Use filters to find your new pup!</Typography>
            <Box sx={{width: '100%', display:"flex", flexDirection:"row", justifyContent:"flex-start"}}>
                <FormControl fullWidth sx={{marginRight:"1em"}}>
                    <InputLabel id="breed-label">Breeds</InputLabel>
                    <Select
                        labelId="breed-label"
                        id="breed-select"
                        multiple
                        value={selectedBreeds}
                        onChange={(e) => setSelectedBreeds(e.target.value as string[])}
                        renderValue={(selected) => (selected).join(', ')}
                    >
                        {breeds.map((breed: string) => (
                            <MenuItem key={breed} value={breed}>
                                <Checkbox checked={selectedBreeds.includes(breed)} />
                                <ListItemText primary={breed} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth >
                <InputLabel id="sort-age-label">Sort by</InputLabel>
                <Select
                    labelId="sort-age-label"
                    id="sort-age-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <MenuItem value="breed:asc">Alphabetically by Breed - Ascending</MenuItem>
                    <MenuItem value="breed:desc">Alphabetically by Breed - Descending</MenuItem>
                    <MenuItem value="age:asc">Age - Ascending</MenuItem>
                    <MenuItem value="age:desc">Age - Descending</MenuItem>
                </Select>
                </FormControl>
                <FormControl fullWidth sx={{marginLeft:"1em"}}>
                <TextField
                    label="Zip Codes"
                    placeholder="12345, 67890"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                />
                </FormControl>
                <Button variant="outlined" sx={{marginLeft:"1em"}} onClick={() => matchFavoriteDogs()} fullWidth>
                    <Typography variant='body1'>Show Favorites</Typography><Star/>
                </Button>
            </Box>
            <Box>
                <Grid container spacing={3}>
                {dogs.map((dog) => (
                    <Grid item xs={12} sm={4} md={2} key={dog.id}>
                        <DogCard 
                        id={dog.id}
                        name={dog.name} 
                        img={dog.img} 
                        breed={dog.breed} 
                        age={dog.age} 
                        location={dog.zip_code} 
                        favorited={favorites.has(dog.id)} 
                        handleFavorites={() => toggleFavorite(dog.id)} 
                        />
                    </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", mt:2}}>
                <Pagination
                    count={Math.ceil((pagination.totalResults / pagination.resultsPerPage)-1)}
                    page={pagination.currentPage}
                    onChange={(e, page) => {
                        setPagination({...pagination, currentPage: page});
                        window.scrollTo(0, 0);
                    }}
                />
            </Box>
        </Container>
    );
};

export default SearchPage;
