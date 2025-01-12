import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../assets/css/fakerank-css.css"
import "../assets/css/sb-admin-2.css"
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'

//In this page you see the infornation of the challenge before starting it
function ChallengeWaiting() {
  const { getAccessTokenSilently, user } = useAuth0()
  const { challengeId} = useParams();
  const [ title, setTitle] = useState("Missing title");
  const [ start_date, setStart_date ] = useState(new Date());
  const [ end_date, setEnd_date ] = useState(new Date());
  const [ owner, setOwner ] = useState("Unknown");

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/profile/Challenge/${challengeId}`; 
    navigate(path);
  }

  // get challenge data
  const getInfoChallenge = async()=>{      
      const token = await getAccessTokenSilently();

    axios.get(`/api/challenges/${challengeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      console.log(res);
      setTitle(res.data.title);
      setStart_date(res.data.start_date);
      setEnd_date(res.data.end_date);
    }).catch(err => {
      console.log(err);
    })
  };


  const pageLoad = () =>{
    return (title === "Missing title")
  }

  // print challenge info
  getInfoChallenge();
  return  <div className="text-center content">

          {pageLoad()
            ?
            <div> <Spinner animation="border" />Loading...</div>
            :
            <div className="form-signin w-100 m-auto">
            <FontAwesomeIcon icon={faGraduationCap} size="5x" className='mb-4' color="#2e59d9"/>
            <h1 className="h3 mb-3 fw-normal">Challenge</h1>
            <h1 className="h1 mb-3 fw-normal">{title}</h1>
            <h2 className="h3 mb-3 fw-normal">Start: {start_date.slice(0, -5)}</h2>
            <h2 className="h3 mb-3 fw-normal">End: {end_date.slice(0, -5)}</h2>
            <button type="button" className="btn btn-primary btn-icon-split" onClick={routeChange}>   
              <FontAwesomeIcon icon={faCheck} className="icon text-white-50 mt-1 ml-1" />
              <span className="text">Start Challenge</span>
            </button>
          </div>
          }          
          </div>

}

export default ChallengeWaiting