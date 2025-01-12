import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../assets/css/fakerank-css.css"
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import NavigationButton from '../Components/navigation-button';


//In this page you try to partecipate to a challenge, you need to insert the correct key
function ChallengePartecipate() {
  const { getAccessTokenSilently, user } = useAuth0()
  const { challengeId} = useParams();
  const [accessed, setAccessed] = useState(false);
  const [tried, setTried] = useState(false);

  let navigate = useNavigate();
  const [expired, setExpired] = useState(false);

  useEffect(()=>{
    getDate();
    checkSubmission();
    if(accessed===true && expired===false){
      let path = `/profile/ChallengeWaiting/${challengeId}`; 
      navigate(path);
    }
  })

  const getDate = async () => {
    const token = await getAccessTokenSilently()
    axios.get(`/api/challenges/${challengeId}`,
    {
        headers: {
        'Authorization': `Bearer ${token}`
        }
    }).then(res => {

        //obtain current date in ms
        var current_date = new Date().getTime();
        //transform the date in ms
        var start_date = new Date(res.data.start_date).getTime();
        var end_date = new Date(res.data.end_date).getTime();
        if (current_date < start_date || current_date > end_date)
            setExpired(true)
    })
  }

  // Checks if the user has already started the challenge and in case redirect automatically
  const checkSubmission = async ()=>{
    const token = await getAccessTokenSilently()
    axios.get(`/api/submissions`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      console.log(res.data)
      if(res.data.filter(x=>new Date(x.end_date).getTime()<new Date().getTime()).map(x => x.challenge).includes(challengeId))
        setExpired(true)
      if(res.data.map(x => x.challenge).includes(challengeId)){
        setAccessed(true)
      }
    })
  }


  // connects to backend to compare the key with the actual one, in case it's correct the user is redirected
  const tryToAccess = async() => { 
    
      
    const key = document.getElementById("inputPassword").value
    
    const token = await getAccessTokenSilently()
    axios.post(`/api/submissions`,{
      key: key,
      challenge_id: challengeId
    },
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      console.log(res.data)
      setAccessed(true)
    }).finally(() => {
    setTried(true)})
  };

  return (
    <div className="text-center d-flex justify-content-center content">
    {expired && <div className="container-fluid p-3 my-3"><h1 className="h3 mb-3 font-weight-normal">Challenge not available</h1><NavigationButton dir={`/profile`} text="< Profile"> </NavigationButton></div>}
    {!expired && <form className="form-signin">
        <FontAwesomeIcon icon={faGraduationCap} size="5x" className='mb-4' color="#2e59d9"/>

      <h1 className="h3 mb-3 font-weight-normal">Insert Key</h1>
      {tried && accessed===false &&
        <div className="alert alert-danger" role="alert">
          Wrong key, try again!
        </div>}
      <label for="inputPassword" className="sr-only">Key Challenge</label>
      <input type="password" id="inputPassword" className="form-control" placeholder="key Challenge" required=""/>
      <button className="btn my-3 btn-lg btn-primary btn-block" type="button" onClick={() => tryToAccess()} >Partecipate Challenge</button>
    </form>}
  </div>
  )
}

export default ChallengePartecipate