import { ListItem, ListItemText,Rating, ListItemAvatar} from '@mui/material';
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";

const ReviewItem = ({ review }) => {
  return (
    <ListItem
      alignItems="center"
      role="group"
      aria-label={`Review by user ${review.reviewer.charAt(0).toUpperCase()}: ${review.comment}. Rating: ${review.score} out of 5`}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: red[500] }} aria-label="reviewer" aria-hidden="true">
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