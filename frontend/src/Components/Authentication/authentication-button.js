import React from 'react';
import LoginButton from './login-button';
import { useAuth0 } from '@auth0/auth0-react';
import UserDropdown from '../Navbar/user-dropdown';

const AuthenticationButton = () => {
  const { isAuthenticated } = useAuth0();

  // If a user is authenticated, the navbar will render his profile instead of the login button

  return isAuthenticated ? (<UserDropdown/>) : <LoginButton />;
      
};

export default AuthenticationButton;