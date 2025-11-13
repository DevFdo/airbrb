import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PLACEHOLDER_THUMBNAIL = 'https://media.cntraveler.com/photos/67f53f14f89653830ad19b2b/3:2/w_960,h_640,c_limit/Airbnb-05d669ab-3115-4fce-b5fd-0de123aaf780.jpg';

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);
  const validImages = images.length > 0 ? images : [""];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % validImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [validImages.length]);

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = () => {
    setIndex(prev => (prev + 1) % validImages.length);
  };

  const currentImage = validImages[index];

  return (
    <Box position="relative" width="100%" height={300} overflow="hidden" borderRadius={2} display="flex" alignItems="center" justifyContent="center">
      {currentImage?.trim() ? (
        <img
          src={currentImage}
          alt={`Listing image ${index + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <img
        src={PLACEHOLDER_THUMBNAIL}
        alt="placeholder"
        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
        />
      )}

      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          top: '50%',
          left: 10,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.7)'
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          top: '50%',
          right: 10,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.7)'
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default ImageCarousel;
