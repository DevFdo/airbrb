import * as React from 'react';
import {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Button, Menu, MenuItem} from "@mui/material";

import {API_BASE_URL} from "../config.js";

export default function NavBar() {

  const navigate = useNavigate();

  const [auth,setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuth(!!token);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    console.log(localStorage.getItem('token'));
    const response = await axios.post(API_BASE_URL+'/user/auth/logout',{},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (response.status === 200) {
      alert("Successfully Logged Out!");
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setAuth(false);
      navigate('/');
    }
    else{
      alert("Can not Log out:"+response.data.error);
    }
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        {auth && (
          <div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/host/listings');
                }}
              >
                My Hosted Listings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/');
                }}
              >
                All Listings
              </MenuItem>
            </Menu>
          </div>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        AIRBRB
        </Typography>
        {auth && (
          <div>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{variant: 'contained'}}>
              Log out
            </Button>
          </div>
        )}
        {!auth && (
          <div>
            <Button
              color="inherit"
              sx={{ variant: 'contained'}}
              component={Link}
              to="/login">
              Get Started
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}