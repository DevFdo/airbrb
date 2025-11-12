import {useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { API_BASE_URL } from '../config';

const Login = () => {
    
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const handleSnackClose = () => {
    setSnackOpen(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(API_BASE_URL+'/user/auth/login', {
      email: email, password: password,},
    {headers: {'Content-Type': 'application/json'}}
    )
    if (response.status === 200) {
      setSnackMsg('Successfully logged in');
      setSnackSeverity('success');
      setSnackOpen(true);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    else{
      setSnackMsg('Cannot log in: ' + (response.data?.error || 'Unknown error'));
      setSnackSeverity('error');
      setSnackOpen(true);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{mt:1}}>
            <TextField
              margin="normal"
              fullWidth
              required
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register"
                  variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      
      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
