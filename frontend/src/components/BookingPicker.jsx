import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import {useEffect, useState} from "react";
import {Button, Stack, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import * as api from "../utils/api.js"

dayjs.extend(isSameOrBefore);

const BookingPicker = ({ listingId,availability,pricePerNight,onClose,onConfirm})=>{
  const sortedAvailability = availability
    .map(date => dayjs(date))
    .filter(d => d.isValid())
    .sort((a, b) => a.isBefore(b) ? -1 : 1);
  const availableSet = new Set(availability);

  const minAvailableDate=sortedAvailability[0]?.format('YYYY-MM-DD');
  const maxAvailableDate=sortedAvailability[sortedAvailability.length - 1]?.format('YYYY-MM-DD');

  const [startDate,setStartDate]=useState('');
  const [endDate,setEndDate]=useState('');

  const [bookingLength, setBookingLength] = useState(0);

  const getRange =()=>{
    const allDates = [];

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    let cur = start;

    while (cur.isBefore(end) || cur.isSame(end)) {
      allDates.push(cur.format('YYYY-MM-DD'));
      cur = cur.add(1, 'day');
    }
    return allDates;
  }

  useEffect(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const length = end.diff(start, 'day');
      setBookingLength(length > 0 ? length : 0);
    } else {
      setBookingLength(0);
    }
  }, [startDate, endDate]);

  const totalPrice = bookingLength * pricePerNight;

  const isValidRange = () => {
    if (!startDate || !endDate) return false;

    let current = dayjs(startDate);
    while (current.isSameOrBefore(dayjs(endDate), 'day')) {
      if (!availableSet.has(current.format('YYYY-MM-DD'))) return false;
      current = current.add(1, 'day');
    }
    return true;
  };

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  }

  const handleBooking = async () => {
    const dateRange = getRange();
    try {
      await api.makeBooking(listingId, dateRange, totalPrice);
      onConfirm();
      onClose();
    }catch (err) {
      console.error(err);
    }



    onClose();
  };

  return(
    <Box display="flex" gap={2} alignItems="center">
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{mt:3}}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: minAvailableDate,
              max: maxAvailableDate
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: startDate
                ? dayjs(startDate).add(1, 'day').format('YYYY-MM-DD')
                : minAvailableDate,
              max: maxAvailableDate
            }}
          />
        </Stack>
        <Button disabled={!isValidRange()} variant="contained" sx={{mt:2}} onClick={handleBooking}>
          Confirm Booking
        </Button>
        <Button variant="outlined" onClick={handleClearDates} sx={{ mt: 2,ml:2}}>
          Clear Dates
        </Button>
      </Box>
      <Box>
        {bookingLength > 0 && (
          <Typography variant="h4" sx={{ mt: 2 }}>
            {bookingLength} night{bookingLength > 1 ? 's' : ''} · Total: ${totalPrice}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default BookingPicker;