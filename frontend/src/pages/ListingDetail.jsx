import {useEffect, useState} from 'react'
import {useLocation, useParams} from 'react-router-dom';
import dayjs from 'dayjs'

import {Box, Button, Chip, CircularProgress, Divider, List} from "@mui/material";
import Typography from "@mui/material/Typography";
import BathtubIcon from '@mui/icons-material/Bathtub';
import BedIcon from '@mui/icons-material/Bed';
import HotelIcon from '@mui/icons-material/Hotel';
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

import * as api from '../utils/api.js'
import NavBar from "../components/NavBar.jsx";
import ImageCarousel from "../components/ImageCarousel.jsx"
import ReviewItems from "../components/ReviewItems.jsx"

const ListingDetail = () => {
  const { listingId } = useParams();
  const [detail, setDetail] = useState(null);
  const [auth,setAuth] = useState(false);

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

  return(
    <>
      <NavBar />
      {!detail && (
        <CircularProgress/>
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
                    <Button variant="outlined" color="primary">Edit</Button>
                    <Button variant="outlined" color="error">Delete</Button>
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