import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Container, Typography, Paper, Button, Alert, CircularProgress, Stack, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import NavBar from '../components/NavBar';
import * as api from '../utils/api';

const BookingRequests = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch listing details
      const listingData = await api.fetchListingDetails(id);
      setListing(listingData);

      // Fetch all bookings
      const allBookings = await api.fetchBookings();
      
      // Filter bookings for this specific listing
      const listingBookings = allBookings.filter(
        (booking) => booking.listingId === id
      );
      
      setBookings(listingBookings);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load booking requests');
      setLoading(false);
    }
  };

  

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4">
            Booking Requests - {listing?.title}
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/host/listings')}>
            Back to Listings
          </Button>
        </Stack>

        {/* Success/Error Messages */}
        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
          </Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Statistics Card */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarTodayIcon color="primary" />
                  <Typography variant="h6">{getDaysOnline()}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Days Online
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6">{getDaysBookedThisYear()}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Days Booked (This Year)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AttachMoneyIcon color="success" />
                  <Typography variant="h6">${getProfitThisYear()}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Profit (This Year)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6">{bookings.length}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Total Booking Requests
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Booking Requests Table */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Booking Request History
          </Typography>

          {bookings.length === 0 ? (
            <Alert severity="info">No booking requests yet.</Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Guest</strong></TableCell>
                    <TableCell><strong>Date Range</strong></TableCell>
                    <TableCell><strong>Nights</strong></TableCell>
                    <TableCell><strong>Total Price</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.owner}</TableCell>
                      <TableCell>
                        {dayjs(booking.dateRange[0]).format('DD/MM/YYYY')} -{' '}
                        {dayjs(booking.dateRange[booking.dateRange.length - 1]).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>{booking.dateRange.length - 1} nights</TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.status === 'pending' ? (
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleAccept(booking.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleDeny(booking.id)}
                            >
                              Deny
                            </Button>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {booking.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default BookingRequests;