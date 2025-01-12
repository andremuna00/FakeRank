import React from 'react';
import AuthenticationButton from '../Authentication/authentication-button';
import "../../assets/css/sb-admin-2.css"

const NavBar = () => {
  return (
    
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
            <i className="fa fa-bars"></i>
        </button>
        <ul className="navbar-nav ml-auto">
          <AuthenticationButton/>
        </ul>
      </nav>);
};

export default NavBar;