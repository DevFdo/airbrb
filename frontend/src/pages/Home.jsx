import {useState} from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SortIcon from '@mui/icons-material/Sort';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Button, Chip, Divider, Pagination, Slider, Typography} from '@mui/material';

import NavBar from "../components/NavBar.jsx";
import ListingCard from "../components/ListingCard.jsx"

/**
 * This is a mock sample! Please delete this after integrated with backend!
 * * */

const data = {
  listings: [
    {
      "id": 56513315,
      "title": "Oceanside Villa",
      "owner": "alina@unsw.edu.au",
      "address": {},
      "thumbnail": "",
      "price": 350,
      "reviews": [
        {},
        {}
      ]
    },
    {
      "id": 56513316,
      "title": "Cabin in the wood",
      "owner": "johnathan@unsw.edu.au",
      "address": {},
      "thumbnail": "",
      "price": 350,
      "reviews": [
        {}
      ]
    },
    {
      "id": 56513317,
      "title": "The Red Mansion",
      "owner": "pyotr@unsw.edu.au",
      "address": {},
      "thumbnail": "",
      "price": 350,
      "reviews": [
        {}
      ]
    },
  ]
}

const Home = () => {

  // change this to the maximum value of the bed number and minimum number of bed number
  const [bedroomRange, setBedroomRange] = useState([1, 6]);

  const handleBedroomChange = (event, newValue) => {
    setBedroomRange(newValue);
  };

  // change this to the minimum price and maximum price
  const [priceRange, setPriceRange] = useState([100, 1000]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const [sortMode, setSortMode] = useState('none');

  const handleSortMode = () => {
    setSortMode((prev) => {
      if (prev === 'none') return 'desc';
      if (prev === 'desc') return 'asc';
      return 'none';
    });
  };

  return (
    <>
      <NavBar />
      <Container
        maxWidth="lg"
        padding = {2}
      >
        <Grid container spacing={2} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center',width: 400}}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search destinations"
                inputProps={{ 'aria-label': 'Search destinations' }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={5} sx={{ mt: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={6} md={2}  >
            <Typography gutterBottom>Bedrooms</Typography>
            <Slider
              value={bedroomRange}
              onChange={handleBedroomChange}
              valueLabelDisplay="auto"
              min={1}
              max={6}
              marks={[
                { value: 1, label: '1' },
                { value: 6, label: '6' }
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography gutterBottom>Price Range ($)</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={50}
              max={2000}
              step={50}
              marks={[
                { value: 50, label: '$50' },
                { value: 2000, label: '$2000' }
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              variant={sortMode === 'none' ? 'outlined' : 'contained'}
              onClick={handleSortMode}
              startIcon={
                sortMode === 'none' ? <SortIcon /> :
                  sortMode === 'desc' ? <ArrowDownwardIcon /> :
                    <ArrowUpwardIcon />
              }
            >
              {sortMode === 'none' && 'No Sort Applied'}
              {sortMode === 'desc' && 'Sort Descending '}
              {sortMode === 'asc' && 'Sort Ascending'}
            </Button>
          </Grid>
        </Grid>

        <Divider>
          <Chip label="Listings" size="small" />
        </Divider>
        
        <Grid container spacing={5} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
          {data.listings.map((listing) => (
            <Grid item xs={12} sm={6} md={4} key={listing.id}>
              <ListingCard
                title={listing.title}
                userInitial={listing.owner.charAt(0).toUpperCase()}
                thumbnail={listing.thumbnail}
                reviewNum={listing.reviews.length}
              />
            </Grid>
          ))}
        </Grid>
        {/*Change the pagination count into the count of total pages*/}
        <Grid container spacing={5} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Pagination count={5} />
        </Grid>
      </Container>
    </>
  );
};

export default Home;