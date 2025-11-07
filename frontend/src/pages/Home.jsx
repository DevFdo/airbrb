import {useEffect, useState} from 'react';
import dayjs from "dayjs";
import axios from "axios";

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import SortIcon from '@mui/icons-material/Sort';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Button, Chip, CircularProgress, Divider, Slider, Stack, Typography} from '@mui/material';

import NavBar from "../components/NavBar.jsx";
import ListingCard from "../components/ListingCard.jsx"
import {API_BASE_URL} from '../config';

const today = dayjs(new Date());

// Just return the ids
const fetchListing = async () => {
  const response = await axios.get(`${API_BASE_URL}/listings`);
  console.log(response);
  if (response.status === 200) {
    const listingsArray = response.data.listings;
    return listingsArray.map(listing => listing.id);
  }
  else{
    console.log('Error loading listings');
    return null;
  }
}

const fetchListingDetails = async (id) => {
  console.log(id);
  const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
  if (response.status === 200) {
    console.log(response.data.listings);
    return response.data.listing;
  }
  else{
    console.log(`Error loading listing!${id}`);
    return null;
  }
}

// Calculate date range in fomrat of YYYY-MM-DD
const getDateRange = (start, end) => {
  const range = [];
  let current = dayjs(start);
  const last = dayjs(end);
  while (current.isBefore(last) || current.isSame(last)) {
    range.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }
  return range;
};

const Home = () => {


  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isFilteringDate, setIsFilteringDate] = useState(false);

  const [maximumPrice, setMaximumPrice] = useState(1000);
  const [minimumPrice, setMinimumPrice] = useState(100);

  const [maximumBed, setMaximumBed] = useState(6);
  const [minimumBed, setMinimumBed] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // change this to the maximum value of the bed number and minimum number of bed number
  const [bedroomRange, setBedroomRange] = useState([1, 6]);
  // change this to the minimum price and maximum price
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [sortMode, setSortMode] = useState('none');

  /* all the useEffect
  ************************/

  useEffect(() => {
    const fetchData = async () => {
      const ids = await fetchListing();
      const details = await Promise.all(ids.map(fetchListingDetails));
      setListings(details);
      setFilteredListings(details);

      const maxBed = Math.max(...details.map(listing => listing.metadata.bedroom));
      setMaximumBed(maxBed);

      const minBed = Math.min(...details.map(listing => listing.metadata.bedroom));
      setMinimumBed(minBed);

      const maxPrice = Math.max(...details.map(listing => listing.price));
      setMaximumPrice(maxPrice);

      const minPrice = Math.min(...details.map(listing => listing.price));
      setMinimumPrice(minPrice);

      setBedroomRange([minBed, maxBed]);
      setPriceRange([minPrice, maxPrice]);

      setLoading(false);
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (!listings || listings.length === 0) {
      setFilteredListings([]);
      return;
    }

    const term = searchInput.trim().toLowerCase();

    const result = listings.filter(listing => {
      const titleMatch = listing.title?.toLowerCase().includes(term);
      const addressMatch = Object.values(listing.address || {})
        .some(field => field?.toLowerCase().includes(term));
      const priceMatch = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      const bedMatch= listing.metadata.bedroom >= bedroomRange[0] && listing.metadata.bedroom <= bedroomRange[1];
      let dateMatch = true;
      if (startDate && endDate) {
        setIsFilteringDate(true)
        const dateRange = getDateRange(startDate, endDate);
        const availableDates = listing.availability || [];
        dateMatch = dateRange.every(date => availableDates.includes(date))
      }
      return (titleMatch || addressMatch)&& priceMatch && bedMatch&&dateMatch;
    });

    setFilteredListings(result);
  }, [searchInput,priceRange,bedroomRange,listings,startDate,endDate]);

    /* all the onclick functions
  ************************/

    const handleFilteringDate = () =>{
      setStartDate(null);
      setEndDate(null);
      setIsFilteringDate(false);
    }

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2} direction="row">
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  minDate={today}
                  format="YYYY-MM-DD"
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate)}
                  minDate={startDate}
                  format="YYYY-MM-DD"
                />
                {isFilteringDate && (
                  <IconButton aria-label="delete" size="large" onClick={handleFilteringDate}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Stack>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={2}  >
            <Typography gutterBottom>Bedrooms</Typography>
            <Slider
              value={bedroomRange}
              onChange={(e)=>setBedroomRange(e.target.value)}
              valueLabelDisplay="auto"
              min={minimumBed}
              max={maximumBed}
              marks={[
                { value: minimumBed, label: `${minimumBed}` },
                { value: maximumBed, label: `${maximumBed}` }
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography gutterBottom>Price Range ($)</Typography>
            <Slider
              value={priceRange}
              onChange={(e)=>setPriceRange(e.target.value)}
              valueLabelDisplay="auto"
              min={minimumPrice}
              max={maximumPrice}
              step={50}
              marks={[
                { value: minimumPrice, label: `$${minimumPrice}` },
                { value: maximumPrice, label: `$${maximumPrice}` }
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
        
        {loading && (
          <Grid container spacing={5} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress/>
          </Grid>
        )}
        {!loading && (
          <Grid container spacing={5} sx={{ mt: 4, justifyContent: 'center', alignItems: 'center' }}>
            {filteredListings.length > 0 &&(
              filteredListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <ListingCard
                    title={listing.title}
                    userInitial={listing.owner.charAt(0).toUpperCase()}
                    thumbnail={listing.thumbnail}
                    reviewNum={listing.reviews.length}
                  />
                </Grid>
                ))
            )}
            {filteredListings.length === 0 && (
              <Typography variant={"h4"} color='textDisabled'>No Listing Published</Typography>
            )
            }
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Home;