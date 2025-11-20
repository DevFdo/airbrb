import * as React from 'react';
import {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HouseIcon from '@mui/icons-material/House';
import {Button, Menu, MenuItem, Snackbar, Alert,Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";

import * as api from "../utils/api.js"

export default function NavBar() {

  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const [auth,setAuth] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success'); 

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

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await api.logout();
      
      if (response.status === 200) {
        setSnackMsg('Successfully logged out');
        setSnackSeverity('success');
        setSnackOpen(true);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setAuth(false);
        setTimeout(() => {
          navigate('/');
        }, 1000);

      }
    } catch (err) {
      setSnackMsg('Could not log out: ' + (err.response?.data?.error || err.message));
      setSnackSeverity('error');
      setSnackOpen(true);
    }
  };

  const handleHome = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            titleAccess="Home"
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={handleHome}
            sx={{ mr: 2 }}
          >
            <HouseIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AIRBRB
          </Typography>
          {auth && (
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: red[500] }}  alt="user Avatar">
                    {email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
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
                  <MenuItem onClick={handleLogout}>
                    Log out
                  </MenuItem>
                </Menu>
              </div>
            </Box>
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

      {/* Snackbar for messages */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={handleSnackClose} 
          severity={snackSeverity} 
          variant="filled" 
          sx={{ 
            width: '100%',
            minWidth: 300,
            fontSize: '0.95rem',
            boxShadow: 3,
          }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </>
  );
}