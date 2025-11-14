import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";
import { useState} from "react";
import {Button, Rating} from "@mui/material";
import TextField from "@mui/material/TextField";

const ReviewForm = () => {
  const email = localStorage.getItem("email");

  const [comment, setComment] = useState('');
  const [score, setScore] = useState(3);

  return(
    <Box display="flex" alignItems="flex-start" justifyItems="center" gap={2} mt={3} mb={3}>
      <Avatar sx={{ bgcolor: red[500] }} aria-label="reviewer">{email.charAt(0).toUpperCase()}</Avatar>
      <Box width="100%">
        <Rating
          value={score}
          onChange={(e, newValue) => setScore(newValue)}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button variant="contained" sx={{ mt: 3 }}>Send</Button>
      </Box>

    </Box>
  )
}

export default ReviewForm;