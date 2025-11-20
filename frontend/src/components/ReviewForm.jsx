import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";
import { useState} from "react";
import {Button, Rating} from "@mui/material";
import TextField from "@mui/material/TextField";

const ReviewForm = ({onSubmit}) => {
  const email = localStorage.getItem("email");

  const [comment, setComment] = useState('');
  const [score, setScore] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      score: score,
      reviewer: email,
      comment: comment
    };
    setComment('');
    setScore(3);
    onSubmit(payload);
  }

  return(
    <Box display="flex" component="form" onSubmit={handleSubmit} alignItems="flex-start" justifyItems="center" gap={2} mt={3} mb={3}>
      <Avatar sx={{ bgcolor: red[500] }} aria-label="reviewer">{email.charAt(0).toUpperCase()}</Avatar>
      <Box width="100%">
        <Rating
          value={score}
          onChange={(e, newValue) => setScore(newValue)}
          sx={{ mb: 1 }}
          aria-label="Listing rating"
          aria-valuetext={`${score} out of 5 stars`}
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>Send</Button>
      </Box>

    </Box>
  )
}

export default ReviewForm;