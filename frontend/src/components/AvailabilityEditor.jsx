import { Stack, TextField, IconButton, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

const AvailabilityEditor = ({ availability, setAvailability }) => {
  const handleChange = (index, field, value) => {
    const copy = [...availability];
    copy[index][field] = value;
    setAvailability(copy);
  };

  const handleAdd = () => {
    setAvailability((prev) => [
      ...prev,
      {
        start: dayjs().format('YYYY-MM-DD'),
        end: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      },
    ]);
  };

  const handleRemove = (index) => {
    setAvailability((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2">
        Add one or more date ranges. We will flatten them into {'"'}2025-11-09{'"'}, {'"'}2025-11-10{'"'}, ... to match your backend.
      </Typography>
      {availability.map((range, idx) => (
        <Stack key={idx} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Start"
            type="date"
            size="small"
            value={range.start}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: dayjs().format('YYYY-MM-DD'),
              'aria-label': 'Start date for filtering listings'
            }}
            onChange={(e) => handleChange(idx, 'start', e.target.value)}
          />
          <TextField
            label="End"
            type="date"
            size="small"
            value={range.end}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: range.start,
              'aria-label': 'Start date for filtering listings'
            }}
            onChange={(e) => handleChange(idx, 'end', e.target.value)}
          />
          <IconButton onClick={() => handleRemove(idx)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Button variant="outlined" onClick={handleAdd}>
        Add another range
      </Button>
    </Stack>
  );
};

export default AvailabilityEditor;
