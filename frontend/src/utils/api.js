import {API_BASE_URL} from "../config.js";
import axios from "axios";

// Register
export const register = async (email,name,password) =>{
  const response = await axios.post(API_BASE_URL+'/user/auth/register',{
    email: email,
    password: password,
    name: name,
  },
  {headers: {'Content-Type': 'application/json'}}
  );
  return response;
}

// Login
export const login = async (email,password) => {
  const response = await axios.post(API_BASE_URL+'/user/auth/login', {
    email: email, password: password,},
  {headers: {'Content-Type': 'application/json'}}
  );
  return response;
}

// Logout
export const logout = async () => {
  const response = await axios.post(API_BASE_URL + '/user/auth/logout', {},
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  return response;
}
// Get all listings
export const fetchListing = async () => {
  const response = await axios.get(`${API_BASE_URL}/listings`);
  if (response.status === 200) {
    const listingsArray = response.data.listings;
    return listingsArray.map(listing => listing.id);
  }
  else{
    console.log('Error loading listings');
    return null;
  }
}

// Get page detail through id
export const fetchListingDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
  if (response.status === 200) {
    return {id,
      ...response.data.listing};
  }
  else{
    console.log(`Error loading listing!${id}`);
    return null;
  }
}

// Delete a listing
export const deleteListing = async (id) =>{
  token = localStorage.getItem('token');
  await axios.delete(`${API_BASE_URL}/listings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Publish Listing