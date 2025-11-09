import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Stack, Button, Grid, Alert, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box,
} from '@mui/material';
import dayjs from 'dayjs';
import NavBar from '../components/NavBar.jsx';
import HostListingCard from '../components/HostListingCard.jsx';
import AvailabilityEditor from '../components/AvailabilityEditor.jsx';
import { API_BASE_URL } from '../config';
const expandRangesToDates = (ranges) => {
  const allDates = [];
  ranges.forEach((r) => {
    const start = dayjs(r.start);
    const end = dayjs(r.end);
    let cur = start;
    while (cur.isBefore(end) || cur.isSame(end)) {
      allDates.push(cur.format('YYYY-MM-DD'));
      cur = cur.add(1, 'day');
    }
  });
  return allDates;
};
const HostedListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [availabilityRanges, setAvailabilityRanges] = useState([
    {
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    },
  ]);
  const token = localStorage.getItem('token');
  const currentEmail = localStorage.getItem('email');
  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">My Hosted Listings</Typography>
          <Button variant="contained" onClick={() => navigate('/host/listings/new')}>
            Create New Listing
          </Button>
        </Stack>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {listings.length === 0 && (
              <Typography variant="body1" color="text.secondary">
                You don&apos;t have any hosted listings yet.
              </Typography>
            )}
            {listings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing.id}>
                <HostListingCard
                  listing={listing}
                  onEdit={() => navigate(`/host/listings/${listing.id}/edit`)}
                  onDelete={() => handleDelete(listing.id)}
                  onPublish={() => openPublishDialog(listing)}
                  onUnpublish={() => handleUnpublish(listing.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Set Availability & Publish</DialogTitle>
        <DialogContent>
          <AvailabilityEditor
            availability={availabilityRanges}
            setAvailability={setAvailabilityRanges}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePublish}>
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default HostedListings;