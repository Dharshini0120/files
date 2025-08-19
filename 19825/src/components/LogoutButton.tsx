import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { logout } from '../store/authSlice';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/signin');
  };

  return (
    <Button 
      variant="outlined" 
      color="secondary" 
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;