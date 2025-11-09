import { useState } from 'react';
import {
  Box, Grid, TextField, MenuItem, Typography, Stack, Chip, Button, FormControl, InputLabel, Select,
} from '@mui/material';

const PROPERTY_TYPES = ['Apartment', 'House', 'Cabin', 'Studio', 'Townhouse'];

const ListingForm = ({ 
  onSubmit, 
  initialData = {}, 
  submitLabel = 'Save Listing',
  showImagesField = false,
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [street, setStreet] = useState(initialData.address?.street || '');
  const [city, setCity] = useState(initialData.address?.city || '');
  const [state, setState] = useState(initialData.address?.state || '');
  const [postcode, setPostcode] = useState(initialData.address?.postcode || '');
  const [country, setCountry] = useState(initialData.address?.country || 'Australia');
  const [price, setPrice] = useState(initialData.price || 0);
  const [thumbnail, setThumbnail] = useState(initialData.thumbnail || '');
  const [propertyType, setPropertyType] = useState(initialData.metadata?.type || '');
  const [bedroom, setBedroom] = useState(initialData.metadata?.bedroom || 1);
  const [bathroom, setBathroom] = useState(initialData.metadata?.bathroom || 1);
  const [beds, setBeds] = useState(initialData.metadata?.beds || 1);
  const [amenities, setAmenities] = useState(initialData.metadata?.amenities || []);
  const [amenityInput, setAmenityInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState(initialData.metadata?.youtubeUrl || '');
  const [imageInput, setImageInput] = useState('');
  const [images, setImages] = useState(showImagesField && initialData.metadata?.images ? initialData.metadata.images: []);

  const handleAddAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
    }
    setAmenityInput('');
  };

  const handleDeleteAmenity = (item) => {
    setAmenities((prev) => prev.filter((a) => a !== item));
  };

  const handleAddImage = () => {
    const trimmed = imageInput.trim();
    if (trimmed && !images.includes(trimmed)) {
      setImages((prev) => [...prev, trimmed]);
    }
    setImageInput('');
  };

  const handleDeleteImage = (url) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      address: {
        street,
        city,
        state,
        postcode,
        country,
      },
      price: Number(price),
      thumbnail: thumbnail || 'https://media.cntraveler.com/photos/67f53f14f89653830ad19b2b/3:2/w_960,h_640,c_limit/Airbnb-05d669ab-3115-4fce-b5fd-0de123aaf780.jpg',
      metadata: {
        bedroom: Number(bedroom),
        bathroom: Number(bathroom),
        type: propertyType,
        amenities,
        youtubeUrl: youtubeUrl.trim(),
        beds: Number(beds),
        ...(showImagesField ? { images } : {}),
      },
    };
    onSubmit(payload);
  };
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: '1100px', }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Listing Title"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingForm;