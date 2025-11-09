import {useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { API_BASE_URL } from '../config';

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("Passwords don't match");
      return;
    }
    const response = await axios.post(API_BASE_URL+'/user/auth/register',
      {
        email: email,
        password: password,
        name: name,
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }}
    )
    if (response.status === 200) {
      alert("User registered successfully");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      navigate('/login');
    }
    else{
      alert("Can not Register:"+response.data.error);
    }
  };

  return (
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
          Register
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
            fullWidth
            required
            id="name"
            label="Name"
            name="name"
            autoFocus
            onChange={(e) => setName(e.target.value)}
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="password confirm"
            label="Password Confirm"
            type="password"
            id="password-confirm"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
          <Link href="/login"
            variant="body2"
          >
            {"Already have an account? Log In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
