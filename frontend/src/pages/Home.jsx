import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";

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
import {Button, Chip, CircularProgress, Divider, Slider, Stack, TextField, Typography} from '@mui/material';

import NavBar from "../components/NavBar.jsx";
import ListingCard from "../components/ListingCard.jsx"
import * as api from "../utils/api.js"

// Calculate date range in format of YYYY-MM-DD
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

// Calculate average rating of a listing
const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.score, 0);
  return total / reviews.length;
};

const Home = () => {
  const navigate = useNavigate();

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
      const ids = await api.fetchListing();
      const details = await Promise.all(ids.map(id => api.fetchListingDetails(id)));


      const published = details.filter(detail => detail.published)

      const sortedPublished = [...published].sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      const email = localStorage.getItem('email');
      let prioritizedListings = sortedPublished;
      // if the user is logged in
      if (email) {
        const allBookings = await api.fetchBookings();

        const bookedListingIds = new Set(
          allBookings
            .filter(b => b.owner === email)
            .map(b => b.listingId)
        );
        const booked = sortedPublished.filter(l => bookedListingIds.has(l.id.toString()));
        const unbooked = sortedPublished.filter(l => !bookedListingIds.has(l.id.toString()));

        prioritizedListings = [...booked, ...unbooked];
      }
      // Initialize Bed, Price range
      setListings(prioritizedListings);
      setFilteredListings(prioritizedListings);

      const maxBed = Math.max(...prioritizedListings.map(listing => listing.metadata.bedroom));
      setMaximumBed(maxBed);

      const minBed = Math.min(...prioritizedListings.map(listing => listing.metadata.bedroom));
      setMinimumBed(minBed);

      const maxPrice = Math.max(...prioritizedListings.map(listing => listing.price));
      setMaximumPrice(maxPrice);

      const minPrice = Math.min(...prioritizedListings.map(listing => listing.price));
      setMinimumPrice(minPrice);
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
      // searching
      const titleMatch = listing.title?.toLowerCase().includes(term);
      const addressMatch = Object.values(listing.address || {})
        .some(field => field?.toLowerCase().includes(term));
      // price
      const priceMatch = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      // bed
      const bedMatch= listing.metadata.bedroom >= bedroomRange[0] && listing.metadata.bedroom <= bedroomRange[1];
      //date range
      let dateMatch = true;
      if (startDate && endDate) {
        setIsFilteringDate(true)
        const dateRange = getDateRange(startDate, endDate);
        const availableDates = listing.availability || [];
        dateMatch = dateRange.every(date => availableDates.includes(date))
      }
      return (titleMatch || addressMatch)&& priceMatch && bedMatch&&dateMatch;
    });
    //sort
    if (sortMode === 'asc') {
      result.sort((a, b) => getAverageRating(a.reviews) - getAverageRating(b.reviews));
    } else if (sortMode === 'desc') {
      result.sort((a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews));
    }

    setFilteredListings(result);
  }, [searchInput,priceRange,bedroomRange,listings,startDate,endDate,sortMode]);

  /* all the onclick functions
  ************************/

  const handleFilteringDate = () =>{
    setStartDate('');
    setEndDate('');
    setIsFilteringDate(false);
  }

  const handleSortMode = () => {
    setSortMode((prev) => {
      if (prev === 'none') return 'desc';
      if (prev === 'desc') return 'asc';
      return 'none';
    });
  };

  const handleNavigate = (id) =>{
    if (startDate && endDate) {
      navigate(`/detail/${id}`, {
        state: {
          startDate: startDate,
          endDate: endDate
        }
      });
    } else {
      navigate(`/detail/${id}`);
    }
  }

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
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center',width: { xs: '100%', sm: 400 }}}
              aria-label="Search destinations. Results update automatically as you type."
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

        <Grid
          container
          spacing={5}
          aria-live="polite"
          aria-atomic="true"
          sx={{ mt: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Stack spacing={2} direction="row" sx={{alignItems:'center'}} >
              <TextField
                label="Start Date"
                type="date"
                size="small"
                value={startDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: dayjs().format('YYYY-MM-DD'),
                  'aria-label': 'Start date for filtering listings'
                }}
                onChange={(e) => {
                  const newStart = e.target.value;
                  if (dayjs(newStart).isAfter(dayjs(startDate))) {
                    setEndDate('');
                  }
                  setStartDate(newStart);
                }}
              />
              <TextField
                label="End"
                type="date"
                size="small"
                value={endDate}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: startDate,
                  'aria-label': 'End date for filtering listings'
                }}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {isFilteringDate && (
                <IconButton aria-label="delete" size="large" onClick={handleFilteringDate}>
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              )}
            </Stack>
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
              aria-labelledby="bedroom-slider-label"
              aria-valuetext={`${bedroomRange} bedrooms`}
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
              aria-labelledby="price-slider-label"
              aria-valuetext={`${priceRange} price`}
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
              aria-label={
                sortMode === 'none'
                  ? 'No sort applied. Activate to sort ascending.'
                  : sortMode === 'desc'
                    ? 'Currently sorted descending. Activate to sort ascending.'
                    : 'Currently sorted ascending. Activate to sort descending.'
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
          <Grid container 
            spacing={5}
            aria-live="polite"
            aria-atomic="true"
            sx={{ mt: 4, mb:4, alignItems: 'center',justifyContent: { xs: 'center', sm: 'flex-start' }}}>
            {filteredListings.length > 0 &&(
              filteredListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <ListingCard
                    title={listing.title}
                    userInitial={listing.owner.charAt(0).toUpperCase()}
                    thumbnail={listing.thumbnail}
                    reviewNum={listing.reviews.length}
                    youtubeUrl={listing.metadata?.youtubeUrl}
                    images={listing.metadata?.images}
                    onClick={() => handleNavigate(listing.id)}
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