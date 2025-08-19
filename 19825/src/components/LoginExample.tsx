import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField, Box, Typography } from '@mui/material';
import { setCredentials } from '../store/authSlice';
import { useRouter } from 'next/navigation';

const LoginExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    // Mock login - replace with actual API call
    const mockResponse = {
      token: 'admin_jwt_token_here',
      user: {
        id: '1',
        fullName: 'Admin User',
        email: email,
        role: 'admin'
      }
    };

    // Store credentials in cookies via Redux
    dispatch(setCredentials(mockResponse));
    
    // Redirect to dashboard
    router.push('/dashboard');
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Login
      </Typography>
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button
        fullWidth
        variant="contained"
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginExample;