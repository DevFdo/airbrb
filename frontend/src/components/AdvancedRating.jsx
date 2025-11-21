import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tooltip, 
  LinearProgress, 
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const AdvancedRating = ({ reviews, averageRating }) => {
  const [selectedRating, setSelectedRating] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Calculate rating breakdown
  const calculateBreakdown = () => {
    const breakdown = {
      5: { count: 0, percentage: 0 },
      4: { count: 0, percentage: 0 },
      3: { count: 0, percentage: 0 },
      2: { count: 0, percentage: 0 },
      1: { count: 0, percentage: 0 },
    };
    
    if (!reviews || reviews.length === 0) return breakdown;
    
    // Count reviews for each rating
    reviews.forEach(review => {
      const rating = Math.round(review.score); // Round to nearest star
      if (breakdown[rating] !== undefined) {
        breakdown[rating].count++;
      }
    });
    
    // Calculate percentages
    const total = reviews.length;
    Object.keys(breakdown).forEach(star => {
      breakdown[star].percentage = total > 0 
        ? ((breakdown[star].count / total) * 100).toFixed(1)
        : 0;
    });
    
    return breakdown;
  };
  
  const breakdown = calculateBreakdown();
  
  // Filter reviews by selected rating
  const filteredReviews = selectedRating 
    ? reviews.filter(r => Math.round(r.score) === selectedRating)
    : [];
  
  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRating(null);
  };
  
  // Render star display
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const avg = averageRating;
      const diff = avg - index;

      // Full star
      if (diff >= 1) {
        return <StarIcon key={index} fontSize="medium" sx={{ color: '#FFD700' }} />;
      }
      // Half star
      if (diff > 0) {
        return <StarHalfIcon key={index} fontSize="medium" sx={{ color: '#FFD700' }} />;
      }
      // Empty star
      return <StarBorderIcon key={index} fontSize="medium" sx={{ color: '#ccc' }} />;
    });
  };
  
  return (
    <Box>
      {/* Rating Display with Tooltip */}
      <Tooltip
        title={
          <Box sx={{ p: 1, minWidth: 300 }}>
            <Typography variant="subtitle2" gutterBottom>
              Rating Breakdown
            </Typography>
            {[5, 4, 3, 2, 1].map(star => (
              <Box 
                key={star} 
                sx={{ 
                  mb: 1, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  p: 0.5,
                  borderRadius: 1,
                  transition: 'background-color 0.2s'
                }}
                onClick={() => handleStarClick(star)}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    {star} <StarIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} />
                  </Typography>
                  <Box sx={{ flexGrow: 1, minWidth: 100 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseFloat(breakdown[star].percentage)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ minWidth: 60 }}>
                    {breakdown[star].percentage}%
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    ({breakdown[star].count})
                  </Typography>
                </Stack>
              </Box>
            ))}
            <Typography variant="caption" sx={{ mt: 1, display: 'block', fontStyle: 'italic' }}>
              Click on a rating to see all reviews
            </Typography>
          </Box>
        }
        arrow
        interactive
        placement="bottom-start"
      >
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ cursor: 'pointer' }}
          aria-label={`Average rating ${averageRating.toFixed(1)} out of 5 from ${reviews?.length || 0} reviews`}
        >
          {renderStars()}
          <Typography variant="body1" fontWeight="bold">
            {averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({reviews?.length || 0} {reviews?.length === 1 ? 'review' : 'reviews'})
          </Typography>
        </Stack>
      </Tooltip>
      
      {/* Modal for Filtered Reviews */}
      <Dialog 
        open={modalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">
                {selectedRating} Star Reviews
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseModal} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent dividers>
          <Stack spacing={2}>
            {filteredReviews.length === 0 ? (
              <Typography align="center" color="text.secondary">
                No reviews with this rating yet.
              </Typography>
            ) : (
              filteredReviews.map((review, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon 
                              key={i}
                              sx={{ 
                                fontSize: 18,
                                color: i < review.score ? '#FFD700' : '#ccc' 
                              }} 
                            />
                          ))}
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {review.reviewer || 'Anonymous'}
                        </Typography>
                      </Stack>
                      {review.comment && (
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdvancedRating;