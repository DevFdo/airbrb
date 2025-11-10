import Card from '@mui/material/Card';
import Box from "@mui/material/Box";
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';


// helper: turn whatever the user pasted into an actual youtube embed url
const toYoutubeEmbed = (url) => {
  if (!url) return '';

  const trimmed = url.trim();
  // already an embed link
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // normal watch link: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // short link: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  return trimmed;
};

const ListingCard = ({title,userInitial,thumbnail,reviewNum, youtubeUrl, images = [],}) => {

  const embedUrl = toYoutubeEmbed(youtubeUrl);
  const [imgIndex, setImgIndex] = useState(0);

  const hasImages = images && images.length > 0;

  const prevImg = () => {
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImg = () => {
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {userInitial}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
      />
      <CardMedia>
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            style={{ width: '100%', height: '180px', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : hasImages ? (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '180px',
              overflow: 'hidden',
              bgcolor: 'grey.100',
            }}
          >
            <img
              src={images[imgIndex]}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {images.length > 1 && (
              <>
                <IconButton
                  onClick={prevImg}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 6,
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.6)',
                  }}
                  size="small"
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={nextImg}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 6,
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(255,255,255,0.6)',
                  }}
                  size="small"
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        ) : thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200'
            }}
          >
            <MapsHomeWorkIcon sx={{ fontSize: 60, color: 'grey.500' }} />
          </Box>
        )}
      </CardMedia>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {reviewNum === 0 && 'No review'}
          {reviewNum === 1 && '1 Review'}
          {reviewNum > 1 && `${reviewNum} Reviews`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Typography variant="body2" sx={{ color: 'text.secondary'}}>
          <PendingActionsIcon color="action" sx={{ color: 'action' }} /> Pending
        </Typography>
        
      </CardActions>
    </Card>
  );
}

export default ListingCard;