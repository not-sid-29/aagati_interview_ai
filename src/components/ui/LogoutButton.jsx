import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import  auth  from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button 
      onClick={handleLogout}
      variant="ghost"
      className="text-red-500 hover:text-red-700"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;