import { ListItem, ListItemText,Rating, ListItemAvatar} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";

const ReviewItem = ({ review }) => {
  return (

    <ListItem alignItems="center" >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: red[500] }} aria-label="reviewer">
          {review.reviewer.charAt(0).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={review.comment}
      />
      <Rating value={review.score} readOnly />
    </ListItem>
  )
}

export default ReviewItem