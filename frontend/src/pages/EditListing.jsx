import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, Alert, CircularProgress, Box, Stack, Button,
} from '@mui/material';

import NavBar from '../components/NavBar.jsx';
import ListingForm from '../components/ListingForm.jsx';
import { API_BASE_URL } from '../config';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/listings/${id}`);
        setListing(res.data.listing);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load listing');
        setLoading(false);
      }
    };
    void fetchListing();
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      await axios.put(
        `${API_BASE_URL}/listings/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/host/listings');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update listing');
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
              Edit Listing
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/host/listings')}>
              Cancel
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
          <ListingForm
            onSubmit={handleUpdate}
            initialData={listing}
            submitLabel="Save Changes"
            showImagesField={true}
          />
        )}
      </Container>
    </>
  );
};

export default EditListing;
