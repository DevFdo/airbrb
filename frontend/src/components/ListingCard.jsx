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
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';
import { toYoutubeEmbed } from '../utils/helpers';


const PLACEHOLDER_THUMBNAIL = 'https://media.cntraveler.com/photos/67f53f14f89653830ad19b2b/3:2/w_960,h_640,c_limit/Airbnb-05d669ab-3115-4fce-b5fd-0de123aaf780.jpg';


const ListingCard = ({title,userInitial,thumbnail,reviewNum, youtubeUrl, images = [],onClick}) => {

  const embedUrl = toYoutubeEmbed(youtubeUrl);

  const hasRealThumbnail = thumbnail && thumbnail !== PLACEHOLDER_THUMBNAIL;
  // only creates image slider if there is a thumbnail else placeholder
  const slides = hasRealThumbnail ? [thumbnail, ...images.filter((img) => img !== thumbnail)] : [];

  const [imgIndex, setImgIndex] = useState(0);

  const prevImg = () => {
    setImgIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextImg = () => {
    setImgIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <Card sx={{ width: 250,cursor: 'pointer'}}
      onClick={onClick}>
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
        ) : hasRealThumbnail ? (
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
              src={slides[imgIndex]}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', }}
            />
            {slides.length > 1 && (
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
        ): (
          // no real thumbnail - always show placeholder thumbnail
          <img
            src={PLACEHOLDER_THUMBNAIL}
            alt="placeholder"
            style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
          />
        )}
      </CardMedia>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {reviewNum === 0 && 'No review'}
          {reviewNum === 1 && '1 Review'}
          {reviewNum > 1 && `${reviewNum} Reviews`}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ListingCard;