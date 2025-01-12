import React, {useState, useEffect} from 'react';
import {  withAuthenticationRequired  } from '@auth0/auth0-react';
import CreatedChallList from '../Components/Profile/CreatedChallList';
import AttemptedChallList from '../Components/Profile/AttemptedChallList';
import SubmittedChallList from '../Components/Profile/SubmittedChallList';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import NavigationButton from '../Components/navigation-button';

const Profile = () => {

  const [submissionaList, setSubmissionaList] = useState(null)
  const [submittedList, setSubmittedList] = useState(null)
  const [createdChallList, setCreatedChallList] = useState(null);

  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    getSubmissions()    
    getChallenges()   
  }, []);

    // Get all the submissions related to the current user
    const getSubmissions = async() => {      
      const token = await getAccessTokenSilently()
      
      axios.get(`/api/submissions`,
      {
          headers: {
            'Authorization': `Bearer ${token}`
          }
      }).then(res => {
        // Save submitted and ongoing submissions in two different lists:
        //not already submited:
        setSubmissionaList(res.data.filter(x=>((new Date(x.end_date).getTime() ==  new Date(x.challenge_end).getTime()) && (new Date().getTime() <  new Date(x.challenge_end).getTime()))))
        //list of submission submited:
        setSubmittedList(res.data.filter(x=>(new Date(x.end_date).getTime() < new Date().getTime()) || ((new Date(x.end_date).getTime() == new Date(x.challenge_end).getTime()) && (new Date().getTime() >=  new Date(x.challenge_end).getTime()))  ))
      })
    };

  //get challenges
  const getChallenges = async() => {      
    const token = await getAccessTokenSilently()
    
    axios.get(`/api/challenges`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      //save
      setCreatedChallList(res.data)
    })
  };


  

  return (
    <div>
      <div className="container-fluid">

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <NavigationButton dir={`/`} text="< Home"></NavigationButton>
        </div> 

        
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h1 className="h3 mb-0 text-gray-800">Profile</h1>
        </div>
        
        <CreatedChallList name="Created Challenges" challList={createdChallList}></CreatedChallList>
        
        <AttemptedChallList challList={submissionaList}></AttemptedChallList>  
                  
        <SubmittedChallList challList={submittedList}></SubmittedChallList> 


        

      </div>

      

    </div>



  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <div>Loading...</div>,
});