import axios from "axios";

const API_BASE_URL = 'http://localhost:5005';

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

// Create a listing
export const createListing = async (body) => {
  const token = localStorage.getItem('token');
  axios.post(`${API_BASE_URL}/listings/new`, body, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

// Update a listing
export const updateListing = async (id,body) => {
  const token = localStorage.getItem('token');
  await axios.put(`${API_BASE_URL}/listings/${id}`,body,{
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

// Delete a listing
export const deleteListing = async (id) =>{
  const token = localStorage.getItem('token');
  await axios.delete(`${API_BASE_URL}/listings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Publish Listing
export const publishListing = async (id,dates) =>{
  const token = localStorage.getItem('token');
  await axios.put(`${API_BASE_URL}/listings/publish/${id}`,{
    availability: dates },{
    headers: {Authorization: `Bearer ${token}`,},
  })
}

// Unpublish Listing
export const unpublishListing = async (id) =>{
  const token = localStorage.getItem('token');
  axios.put(`${API_BASE_URL}/listings/unpublish/${id}`,
    {},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}