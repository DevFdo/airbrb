import {useEffect, useState} from 'react'
import {useLocation,useNavigate, useParams} from 'react-router-dom';
import dayjs from 'dayjs'

import {Alert, Box, Button, Chip, CircularProgress, Container, 
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, 
  Link, List,Snackbar, Typography} 
  from "@mui/material";

import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import HotelIcon from '@mui/icons-material/Hotel';

import * as api from '../utils/api.js'
import NavBar from "../components/NavBar.jsx";
import ImageCarousel from "../components/ImageCarousel.jsx"
import ReviewItems from "../components/ReviewItem.jsx"
import ReviewForm from "../components/ReviewForm.jsx"
import AvailabilityEditor from '../components/AvailabilityEditor.jsx';
import BookingPicker from "../components/BookingPicker.jsx";
import BookingItem from "../components/BookingItem.jsx";


const ListingDetail = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [detail, setDetail] = useState(null);
  const [auth,setAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const email=localStorage.getItem("email");
  const [availabilityRanges, setAvailabilityRanges] = useState([
    {
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    },
  ]);

  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [booking, setBooking] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  
  const expandRangesToDates = (ranges) => {
    const allDates = [];
    ranges.forEach((r) => {
      const start = dayjs(r.start);
      const end = dayjs(r.end);
      let cur = start;
      while (cur.isBefore(end) || cur.isSame(end)) {
        allDates.push(cur.format('YYYY-MM-DD'));
        cur = cur.add(1, 'day');
      }
    });
    return allDates;
  };

  const location = useLocation();
  const rawStart = location.state?.startDate;
  const rawEnd = location.state?.endDate;

  const startDate = rawStart ? dayjs(rawStart) : null;
  const endDate = rawEnd ? dayjs(rawEnd) : null;

  const loadDetail = async () => {
    const data = await api.fetchListingDetails(listingId);
    if(startDate&&endDate){
      const stayLength = startDate.isValid() && endDate.isValid()
        ? endDate.diff(startDate, 'day')
        : 1;
      data.totalPrice = data.price * stayLength;
    }
    setDetail(data);
  };

  const getMyBookings = async () => {
    const allBookings = await api.fetchBookings();
    const myBookings = allBookings.filter(allBooking => {
      return allBooking.owner===email && allBooking.listingId===listingId;
    })
    setBooking(myBookings);
    const acceptedBooking = myBookings.filter(myBooking => {
      return myBooking.status === 'accepted';
    })
    if(acceptedBooking.length > 0){
      setCanReview(true);
      setReviewingId(acceptedBooking[0].id);
    }
  }

  useEffect(() => {
    void loadDetail();
  }, [listingId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(!!token);
    if (!token) return;
    void getMyBookings();
  },[email, listingId])

  const openPublishDialog = () => {
    setAvailabilityRanges([
      {
        start: dayjs().format('YYYY-MM-DD'),
        end: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      },
    ]);
    setPublishDialogOpen(true);
  };

  const handleDelete = async () =>{
    try {
      await api.deleteListing(listingId);
      navigate(-1);
    } catch (_err) {
      setErrorMsg('Failed to delete listing');
    }
  }

  const handlePublish = async () => {
    const flatDates = expandRangesToDates(availabilityRanges);
    if (flatDates.length === 0) {
      setErrorMsg('Please add at least one availability range.');
      return;
    }
    try {
      await api.publishListing(listingId,flatDates);
      setPublishDialogOpen(false);
      void loadDetail();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to publish listing');
    }
  };

  const handleUnpublish = async () => {
    try {
      await api.unpublishListing(listingId);
      void loadDetail();
    } catch (_err) {
      setErrorMsg('Failed to unpublish listing');
    }
  };


  const handleCloseDialog = () => {
    setBookingDialogOpen(false);
  }

  const handleBookingConfirmed = async () => {
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };
  
  return(
    <>
      <NavBar />
      {!detail && (
        <CircularProgress/>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {detail && (
        <Container>
          <Box display="flex" flexDirection="row" gap={3} p={5}>
            <Box flex={1} sx={{
              display:'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ImageCarousel images={detail.metadata.images} />
            </Box>
            <Box flex={1}
              sx={{
                display:'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              <Typography variant="h3" gutterBottom>{detail.title}</Typography>
  
              <Typography variant="h5" color="text.secondary">
                {startDate && endDate
                  ? `Price per stay: $${detail.totalPrice}`
                  : `Price per night: $${detail.price}`}
              </Typography>
              <Typography variant="body1" mt={2}>
                <Typography component="span" fontWeight="bold">Address:</Typography>{' '}
                {detail.address?.street}, {detail.address?.city}, {detail.address?.state}, {detail.country?.country}
              </Typography>
              <Typography variant="body1" mt={2}>
                <Typography component="span" fontWeight="bold">Type:</Typography>{' '}
                {detail.metadata.type}
              </Typography>
              <Typography variant="body2" mt={1}>
                <Typography component="span" fontWeight="bold">Facility:</Typography>{' '}
                <HotelIcon
                  titleAccess="number of beds"
                  sx={{ verticalAlign: 'middle', mr: 1 }}/>
                {detail.metadata.bed} |
                <BedIcon
                  titleAccess="number of bedrooms"
                  sx={{ verticalAlign: 'middle', mr: 1 }} />
                {detail.metadata.bedroom} |
                <BathtubIcon
                  titleAccess="number of bathrooms"
                  sx={{ verticalAlign: 'middle', mr: 1 }} />
                {detail.metadata.bathroom}
              </Typography>
              {detail.metadata.amenities &&(
                <Box>
                  <Typography variant="body1" mt={1} fontWeight="bold" >Amenities:</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {detail.metadata.amenities.map((label, index) => (
                      <Chip variant="outlined" label={label} key={index} />
                    ))
                    }
                  </Box>
                </Box>
              )}
              {booking.length>0 &&(
                <List>
                  {booking.map((item,index) => (
                    <Box key={index}>
                      <BookingItem
                        status={item.status}
                        startDate={item.dateRange[0]}
                        endDate={item.dateRange[item.dateRange.length - 1]}
                      />
                      {index < booking.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              )}
              {auth && (
                email === detail.owner ? (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate(`/host/listings/${listingId}/edit`)}>
                      Edit
                    </Button>
                    <Button 
                      variant="outlined"
                      color="error"
                      onClick={()=>handleDelete()}>
                      Delete
                    </Button>
                    {detail.published ?(
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleUnpublish()}>
                          Unpublish</Button>
                    ):(
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={()=>openPublishDialog()}>
                          Publish
                      </Button>
                    )}
                  </Box>
                ) : (
                  <Button variant="contained" sx={{ mt: 3 }}
                    onClick={()=>{setBookingDialogOpen(true)}}>Book Now</Button>
                )
              )}
              {!auth && (
                <Link href="/login"
                  variant="body2"
                  sx={{mt:3}}
                >
                  {"Please login to make a booking!"}
                </Link>
              )}
            </Box>
          </Box>
          <Box mt={3}>
            {auth && (
              email !== detail.owner &&(
                <Box >
                  <Typography variant="body1" fontWeight="bold">
                    Enjoy your stay? Please leave us a review!
                  </Typography>
                  <ReviewForm />
                </Box>
              )
            )}
            <Typography variant="body1" fontWeight="bold">
              Reviews:
            </Typography>
            <List>
              {
                detail.reviews.map((review,index)=>(
                  <Box key={index}>
                    <ReviewItems review={review}/>
                    {index < detail.reviews.length - 1 && <Divider />}
                  </Box>
                ))
              }
            </List>
          </Box>
          <Dialog open={publishDialogOpen} onClose={() => setPublishDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Set Availability & Publish</DialogTitle>
            <DialogContent>
              <AvailabilityEditor
                availability={availabilityRanges}
                setAvailability={setAvailabilityRanges}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPublishDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handlePublish}>
                Publish
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle >Make a Booking!</DialogTitle>
            <DialogContent>
              <BookingPicker
                availability={detail.availability}
                pricePerNight={detail.price}
                listingId={listingId}
                onClose={handleCloseDialog}
                onConfirm={handleBookingConfirmed}
              />
            </DialogContent>
          </Dialog>
          <Snackbar
            open={showConfirmation}
            message="Booking confirmed!"
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          />
        </Container>
      )}
    </>
  )
}

export default ListingDetail;