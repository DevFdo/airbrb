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

const ListingCard = ({title,userInitial,thumbnail,reviewNum, youtubeUrl}) => {

  const embedUrl = toYoutubeEmbed(youtubeUrl);
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
        { embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            style={{ width: '100%', height: '180px', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
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