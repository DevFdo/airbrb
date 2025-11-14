import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Alert, Button, Stack } from '@mui/material';

import NavBar from '../components/NavBar.jsx';
import ListingForm from '../components/ListingForm.jsx';
import * as api from '../utils/api.js'

const CreateListing = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const ownerEmail = localStorage.getItem('email');

  const handleCreate = async (payload) => {
    try {
      const body = {
        ...payload,
        owner: ownerEmail,
      };
      await api.createListing(body);
      navigate('/host/listings');
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.response?.data?.error || 'Failed to create listing');
    }
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Create New Listing
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
        <ListingForm onSubmit={handleCreate} submitLabel="Create Listing" />
      </Container>
    </>
  );
};

export default CreateListing;
