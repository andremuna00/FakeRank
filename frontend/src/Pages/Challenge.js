
import ExerciseForChallenge from '../Components/ExerciseForChallenge'
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import Timer from '../Components/Timer';
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import CircularTimer from '../Components/Timer/CircularTimer';
import NavigationButton from '../Components/navigation-button';

//In this page you have the challenge and its exercise
function Challenge(){

  const { getAccessTokenSilently, user } = useAuth0()
  const { challengeId} = useParams();
  const [exercises, setExercises] = useState([]);
  const [chalenge, setChalenge] = useState("");

  const [startDate, setStartDate ] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expired, setExpired] = useState(false);

  const [submissionId, setSubmissionId] = useState(0);
  let navigate = useNavigate();

  const RedirectProfile = () => {
    let path = `/profile`;
    navigate(path);
    }
  
  const getExercise = async() => {      
      const token = await getAccessTokenSilently()
      
      axios.get(`/api/exercises/challenges/${challengeId}`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      setExercises(res.data)
    })
  };

  const getChallenge = async() => {      
    const token = await getAccessTokenSilently()
    
    axios.get(`/api/challenges/${challengeId}`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      setChalenge(res.data)
      setStartDate(res.data.start_date)
      setEndDate(res.data.end_date)

      //obtain current date in ms
      var current_date = new Date().getTime();
      //transform the date in ms
      var start_date = new Date(res.data.start_date).getTime();
      var end_date = new Date(res.data.end_date).getTime();
      if (current_date < start_date || current_date > end_date)
          setExpired(true)
    })
  };

  const getSubmission = async () => {
    if(challengeId != undefined){

        const token = await getAccessTokenSilently()
        axios.get(`/api/submissions`,
        {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(res => {

            let submission = res.data.filter(x => x.challenge == challengeId)[0]
            if(submission == undefined || new Date(submission.end_date).getTime() < new Date().getTime()){
              let path_redirect = `/profile/ChallengePartecipate/${challengeId}`
              navigate(path_redirect)
              return;
            }
            setSubmissionId(submission.id)
     
        })

    }
  }

  //set submission end_date as current date
  const submit = async() => {      
    console.log(submissionId)
    const token = await getAccessTokenSilently()
    
    axios.patch(`/api/submissions/${submissionId}/submit`,
    {},
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {console.log(res.data); RedirectProfile()})
  };


    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
      getExercise();  
      getChallenge()  
      getSubmission()
      setInterval(()=>checkDate(), 1000)
    }, [startDate, endDate]);

    const checkDate = () =>{ 
      var current_date = new Date().getTime();   
      //transform the date in ms
      var start_date = new Date(startDate).getTime();    
      var end_date = new Date(endDate).getTime();
      if (current_date < start_date || current_date > end_date){
        
        setExpired(true)}
    }

  const exerciseList = exercises.map((exercise, index) => <ExerciseForChallenge key = {exercise.id} exerciseId={exercise.id}   
  title={exercise.title} description={exercise.description} index = {index} challengeId={challengeId}/>)

    return (
      <div>
      {expired && <div  className="text-center justify-content-center content">
      <h1 className="h3 mb-3 font-weight-normal">The Challenge has expired</h1>
      <NavigationButton dir={`/profile`} text="< Profile"> </NavigationButton></div>}
      {!expired && <div className ="container">
    
    
      <div className="row  text-white">
          
        <div className="col-sm bg-gradient-primary rounded shadow-sm d-inline-flex p-2 justify-content-start" >

        <div>
          
        <FontAwesomeIcon icon={faGraduationCap} size="2x" color='#ffffff' />
        
        </div>
          
        
        <div>
        
          <h1 className="h3 mb-5 text-white lh-1">Title: {chalenge.title}</h1>
          <h1 className="h6 mb-3 text-white lh-1">End: { chalenge.end_date == undefined ? "" : chalenge.end_date.slice(0, -5)}</h1>
        </div>
          
        </div>
        <div className="col-sm bg-gradient-white mb-2 ">
        {chalenge!="" && <CircularTimer style={{"height": "0.2rem"}} end_time={new Date(chalenge.end_date).getTime()}></CircularTimer>} 
        </div>
        
      </div>
      

      

      <div className="my-3 p-3 bg-body rounded shadow-sm">

        <h6 className="border-bottom pb-2 mb-0" style={{"fontSize": "1.4rem", "fontWeight": "bold"}}>Exercises</h6>
        
        {exerciseList}

        
       
          
        <small className="d-block text-end mt-3 ">          
        <div className="btn-group">
          <button type="button" className="btn btn btn-outline-secondary" onClick={RedirectProfile}>Save Challenge</button>
          <button type="button" className="btn btn btn-primary" onClick={submit}>Submit Challenge</button>
        </div>
        </small>
           
      </div>    
  
    </div>}
  </div>
      )
}

export default Challenge
