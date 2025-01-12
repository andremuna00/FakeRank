import React from 'react';
import "../../assets/css/sb-admin-2.css"
import ProfilePic from "../../assets/img/undraw_profile.svg";
import { useAuth0 } from '@auth0/auth0-react';

const UserDropdown = (props) => {

    const {user} = useAuth0()
    
    const { logout } = useAuth0();
    return (
        <li className="nav-item dropdown no-arrow" id="userInfo">
            <span className="nav-link dropdown-toggle" id="userDropdown" role="button"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" 
                onClick={()=>{

                    // If the user clicks on his icon, it will display a button to get to the profile page and another one to log out

                    var userInfo = document.getElementById("userInfo")
                    var userInfoList = document.getElementById("userInfoList")

                    if(userInfo.className.includes("show")){
                        userInfo.className = userInfo.className.replace(" show","")
                        userInfoList.className = userInfoList.className.replace(" show","")
                    } else {
                        userInfo.className += " show"
                        userInfoList.className += " show"
                    }
                }}>
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{user.email}</span>
                <img className="img-profile rounded-circle" alt="Profile" src={ProfilePic} />
            </span>
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" id="userInfoList" aria-labelledby="userDropdown">
                <a className="dropdown-item" href="/profile" role="button">
                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                    Profile
                </a>
                <div className="dropdown-divider"></div>
                <span className="dropdown-item" data-toggle="modal" data-target="#logoutModal" role="button"
                    onClick={ () =>
                        logout({
                        returnTo: window.location.origin,
                        })
                    }>
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                </span>
            </div>
        </li>
    );
    
};

export default UserDropdown;