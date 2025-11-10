import { useState } from 'react';
import {
  Box, Grid, TextField, MenuItem, Typography, Stack, Chip, Button, FormControl, InputLabel, Select, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PROPERTY_TYPES = ['Apartment', 'House', 'Cabin', 'Studio', 'Townhouse'];

// helper: file -> data URL
const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
};


const ListingForm = ({ 
  onSubmit, 
  initialData = {}, 
  submitLabel = 'Save Listing',
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
  const [images, setImages] = useState(initialData.metadata?.images || []);
  const [imageError, setImageError] = useState('');

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

  // handle file upload -> data URL -> add to images array
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageError('');
      const dataUrl = await fileToDataUrl(file);
      setImages((prev) => {
        const next = [...prev, dataUrl];
        // if thumbnail is empty, set to first upload
        // if (!thumbnail) {
        //   setThumbnail(dataUrl);
        // }
        return next;
      });
    } catch (err) {
      setImageError(err.message || 'Failed to load image');
    } finally {
      // reset input so user can upload same file again if needed
      e.target.value = '';
    }
  };

  const handleDeleteImage = (img) => {
    setImages((prev) => {
      const next = prev.filter((i) => i !== img);
      // if we deleted the image that was used as thumbnail, move thumbnail to next image (if any)
      if (thumbnail === img) {
        if (next.length > 0) {
          setThumbnail(next[0]);
        } else {
          setThumbnail('');
        }
      }
      return next;
    });
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
      thumbnail: thumbnail || (images[0] ? images[0] : 'https://media.cntraveler.com/photos/67f53f14f89653830ad19b2b/3:2/w_960,h_640,c_limit/Airbnb-05d669ab-3115-4fce-b5fd-0de123aaf780.jpg'),
      metadata: {
        bedroom: Number(bedroom),
        bathroom: Number(bathroom),
        type: propertyType,
        amenities,
        youtubeUrl: youtubeUrl.trim(),
        beds: Number(beds),
        images,
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

        {/* address */}
        <Grid item xs={12} md={4}>
          <TextField
            label="Street"
            required
            fullWidth
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="City"
            required
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            label="State"
            required
            fullWidth
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Postcode"
            required
            fullWidth
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Country"
            fullWidth
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Grid>

        {/* price & type */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Price per night ($)"
            type="number"
            required
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth required sx={{minWidth: 160 }}>
            <InputLabel id="property-type-label">Property type</InputLabel>
            <Select
              labelId="property-type-label"
              id="property-type"
              value={propertyType}
              label="Property type"
              onChange={(e) => setPropertyType(e.target.value)}
            >
              {PROPERTY_TYPES.map((pt) => (
                <MenuItem key={pt} value={pt}>
                  {pt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* thumbnail */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Thumbnail URL (optional)"
            fullWidth
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            helperText="If left blank, we use the first uploaded image."
          />
        </Grid>

        {/* YouTube */}
        <Grid item xs={12} md={6} sx={{maxWidth: 200 }}>
          <TextField
            label="YouTube embed URL (optional)"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            helperText="Paste an embed YouTube link."
          />
        </Grid>

        {/* Images upload – now always shown */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Property images
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{ mb: 1 }}
          >
            Upload image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Button>
          {imageError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {imageError}
            </Typography>
          )}
          {/* preview */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
            {images.map((img) => (
              <Box
                key={img}
                sx={{
                  position: 'relative',
                  width: 120,
                  height: 90,
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: '1px solid #ddd',
                }}
              >
                <img
                  src={img}
                  alt="property"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteImage(img)}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    bgcolor: 'rgba(255,255,255,0.8)',
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* bedroom / bathroom / beds */}
        <Grid item xs={12} md={2}>
          <TextField
            label="Bedrooms"
            type="number"
            required
            fullWidth
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Bathrooms"
            type="number"
            required
            fullWidth
            value={bathroom}
            onChange={(e) => setBathroom(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Total Beds"
            type="number"
            required
            fullWidth
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
          />
        </Grid>

        {/* amenities */}
        <Grid item xs={12}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ mb: 1 }}
          >
            <TextField
              label="Amenities"
              placeholder="e.g. Wi-Fi provided"
              size="small"
              fullWidth
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
            />
            {amenityInput.trim() !== '' && (
              <Button
                variant="outlined"
                onClick={handleAddAmenity}
                sx={{ height: '56px' }}
              >
                Add
              </Button>
            )}
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {amenities.map((a) => (
              <Chip key={a} label={a} onDelete={() => handleDeleteAmenity(a)} />
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" size="large">
            {submitLabel}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ListingForm;
