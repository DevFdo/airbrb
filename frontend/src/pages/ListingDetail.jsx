import {useEffect, useState} from 'react'
import {useLocation,useNavigate, useParams} from 'react-router-dom';
import dayjs from 'dayjs'

import {Alert, Box, Button, Chip, CircularProgress, Container, Divider, Link, List, Typography} from "@mui/material";
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import HotelIcon from '@mui/icons-material/Hotel';

import * as api from '../utils/api.js'
import NavBar from "../components/NavBar.jsx";
import ImageCarousel from "../components/ImageCarousel.jsx"
import ReviewItems from "../components/ReviewItem.jsx"
import ReviewForm from "../components/ReviewForm.jsx"

const ListingDetail = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [detail, setDetail] = useState(null);
  const [auth,setAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const email=localStorage.getItem("email");

  const location = useLocation();
  const rawStart = location.state?.startDate;
  const rawEnd = location.state?.endDate;

  const startDate = rawStart ? dayjs(rawStart) : null;
  const endDate = rawEnd ? dayjs(rawEnd) : null;

  useEffect(() => {
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
    void loadDetail();
  }, [listingId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(!!token);
  }, []);

  const handleDelete = async () =>{
    try {
      await api.deleteListing(listingId);
      navigate(-1);
    } catch (_err) {
      setErrorMsg('Failed to delete listing');
    }
  }

  
  
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
              {auth && (
                email === detail.owner ? (
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button variant="outlined" color="primary"
                      onClick={() => navigate(`/host/listings/${listingId}/edit`)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error"
                      onClick={handleDelete}>
                      Delete
                    </Button>
                    {detail.published ?(
                      <Button variant="outlined" color="error">Unpublish</Button>
                    ):(
                      <Button variant="outlined" color="primary">Publish</Button>
                    )}
                  </Box>
                ) : (
                  <Button variant="contained" sx={{ mt: 3 }}>Book Now</Button>
                  //TODO:A list of My booking status
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
        </Container>
      )}
    </>
  )
}

export default ListingDetail;