import {
  Card, CardHeader, CardContent, CardActions, CardMedia, Typography, IconButton, Chip, Stack, Button, Tooltip, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';


const HostListingCard = ({ listing, onEdit, onDelete, onPublish, onUnpublish }) => {
  const reviews = listing.reviews || [];
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.score, 0) / reviews.length : 0;

  const beds = listing.metadata?.beds || listing.metadata?.bedroom || 0;
  const bathrooms = listing.metadata?.bathroom || 0;
  const propertyType = listing.metadata?.type || 'N/A';
  const price = listing.price || 0;
  const isPublished = listing.published === true;
  const youtubeUrl = listing.metadata?.youtubeUrl;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader title={listing.title} subheader={propertyType} />

      <CardMedia>
        {youtubeUrl ? (
          <iframe
            src={youtubeUrl}
            title={listing.title}
            style={{ width: '100%', height: '160px', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : listing.thumbnail ? (
          <img
            src={listing.thumbnail}
            alt={listing.title}
            style={{ width: '100%', height: '160px', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '160px',
              bgcolor: 'grey.200'
            }}
          />
        )}
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;          
            const diff = avg - index;

            // full star
            if (diff >= 1) {
              return <StarIcon key={starValue} fontSize="small" sx={{ color: '#FFD700' }} />;
            }
            // half star
            if (diff > 0) {
              return <StarHalfIcon key={starValue} fontSize="small" sx={{ color: '#FFD700' }} />;
            }
            // empty star
            return <StarBorderIcon key={starValue} fontSize="small" sx={{ color: '#ccc' }} />;
          })}
    
          <Typography variant="body2">
            {avg.toFixed(1)} ({reviews.length} reviews)
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip size="small" label={`${beds} beds`} />
          <Chip size="small" label={`${bathrooms} bathrooms`} />
        </Stack>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          ${price} / night
        </Typography>
      </CardContent>
      <CardActions>
        <Tooltip title="Edit listing">
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete listing">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {isPublished ? (
          <Button startIcon={<PublicOffIcon />} size="small" onClick={onUnpublish}>
            Unpublish
          </Button>
        ) : (
          <Button startIcon={<PublicIcon />} size="small" onClick={onPublish}>
            Publish
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default HostListingCard;
