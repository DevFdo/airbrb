import { useState } from 'react';
import {
  Box, Grid, TextField, MenuItem, Typography, Stack, Chip, Button, FormControl, InputLabel, Select, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PROPERTY_TYPES = ['Apartment', 'House', 'Cabin', 'Studio', 'Townhouse'];
const PLACEHOLDER_THUMBNAIL = 'https://media.cntraveler.com/photos/67f53f14f89653830ad19b2b/3:2/w_960,h_640,c_limit/Airbnb-05d669ab-3115-4fce-b5fd-0de123aaf780.jpg';

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
  const [thumbnail, setThumbnail] = useState(initialData.thumbnail && initialData.thumbnail !== '' ? initialData.thumbnail : '');
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

  // when user uploads a thumbnail file
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setThumbnail(dataUrl);       // explicit thumbnail
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = '';
    }
  };

  // handle file upload -> data URL -> add to images array
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setImageError('');
      const dataUrl = await fileToDataUrl(file);

      setImages((prev) => [...prev, dataUrl]);
      // skip if same as thumbnail
      // setImages((prev) => {
      //   if (thumbnail && thumbnail === dataUrl) {
      //     return prev; // don’t add duplicate
      //   }
      //   return [...prev, dataUrl];
      // });
    } catch (err) {
      setImageError(err.message || 'Failed to load image');
    } finally {
      // reset input so user can upload same file again if needed
      e.target.value = '';
    }
  };

  const handleDeleteImage = (img) => {
    setImages((prev) =>  prev.filter((i) => i !== img));
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
      thumbnail: thumbnail || PLACEHOLDER_THUMBNAIL,
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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 1100 }}> 
      {/* ROW 2: address */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          label="Street"
          required
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <TextField
          label="City"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          label="State"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <TextField
          label="Postcode"
          required
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />
        <TextField
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </Box>
  
      {/* ROW 3: price per night + numbers */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
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
        <Grid item xs={12} md={3}>
          <TextField
            label="Bedrooms"
            type="number"
            required
            fullWidth
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Bathrooms"
            type="number"
            required
            fullWidth
            value={bathroom}
            onChange={(e) => setBathroom(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Total beds"
            type="number"
            required
            fullWidth
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
          />
        </Grid>
      </Grid>
        
      {/* ROW 4: amenities (left) + YouTube (right) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Amenities"
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
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {amenities.map((a) => (
              <Chip key={a} label={a} onDelete={() => handleDeleteAmenity(a)} />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6} >
          <TextField
            label="YouTube URL (optional)"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            helperText="Paste an embeded link."
          />
        </Grid>
      </Grid>
  
      {/* ROW 5: thumbnail */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Thumbnail image
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button variant="outlined" component="label">
              Upload thumbnail
              <input type="file" accept="image/*" hidden onChange={handleThumbnailUpload} />
            </Button>
            {thumbnail && (
              <Button
                variant="text"
                color="error"
                onClick={() => setThumbnail('')}
              >
                Remove thumbnail
              </Button>
            )}
          </Stack>
          <Typography variant="body2" sx={{ mt: 1 }}>
            If you don't upload a thumbnail, we'll use the default placeholder image as thumbnail.
          </Typography>
          {thumbnail && (
            <Box
              sx={{
                mt: 1,
                width: 160,
                height: 100,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #ddd',
              }}
            >
              <img
                src={thumbnail}
                alt="thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
  
      {/* ROW 6: property images */}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Property images
          </Typography>
          <Button variant="outlined" component="label" sx={{ mb: 1 }}>
            Upload image
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
          {imageError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {imageError}
            </Typography>
          )}
          <Box sx={{ mt: 1, minHeight: 110 }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
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
          </Box>
        </Grid>
      </Grid>
  
      {/* ROW 7: submit */}
      <Grid container>
        <Grid item>
          <Button type="submit" variant="contained" size="large">
            {submitLabel}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );  
  
};

export default ListingForm;