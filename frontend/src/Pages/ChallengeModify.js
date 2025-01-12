import React, {useState, useEffect, useRef} from 'react';
import { withAuthenticationRequired  } from '@auth0/auth0-react';
import NavigationButton from '../Components/navigation-button';
import axios from "axios";

import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import { useAuth0 } from '@auth0/auth0-react';
import { useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate} from 'react-router-dom';

//In this page you modify the challenge
function ChallengeModify(props){

    const { getAccessTokenSilently, user } = useAuth0();

    const [startDateVisual, setStartDateVisual ] = useState('');
    const [endDateVisual, setEndDateVisual] = useState('');

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [challengeName, setChallengeName] = useState('');
    const [startDate, setStartDate ] = useState('');
    const [endDate, setEndDate] = useState('');
    const [challengeKey, setChallengeKey] = useState('');
    const [exercises, setExercises] = useState([]);
    const [eyeSlash, setEyeSlash] = useState(false);
    const { challengeId } = useParams();

    const [show, setShow] = useState(false);
    const target = useRef(null);

    const navigate = useNavigate();

    // function for moving to profile route
    const goToProfile = async() =>{ 
        let path = `/profile`; 
        navigate(path);
      }

    // get request for getting the list exercise of the current challenge (passing challengeId)
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
  
    /* get request for getting current challenge information (passing challengeId) and then show the values in the form fields*/
    const getChallenge = async() => {      
      const token = await getAccessTokenSilently();
      axios.get(`/api/challenges/${challengeId}`,
      {
          headers: {
            'Authorization': `Bearer ${token}`
          }
      }).then(res => {
        
        setChallengeName(res.data.title)

        setStartDate(res.data.start_date.slice(0, -5))
        setEndDate(res.data.end_date.slice(0, -5))

        setStartDateVisual(res.data.start_date.slice(0, -11))
        
        setEndDateVisual(res.data.end_date.slice(0, -11))

        setStartTime(res.data.start_date.slice(11, -5))
        setEndTime(res.data.end_date.slice(11, -5))

        setChallengeKey(res.data.key)
      })
    };

    // function that updates the current challenge in the database
    const setChallenge = async () => {
        // fileds validation
        if (challengeName == '') return alert("Please insert the name")
        if (challengeKey == '') return alert("Please insert the key")
        
        // check if selected end date comes after selected start date
        let d1 = new Date(endDate)
        let d2 = new Date(startDate)
        if (d1.getTime() < d2.getTime())
            return alert("End Date must be after Star Date")
        
        const token = await getAccessTokenSilently()
        // patch request to update challenge in the database with the edited information
        axios.patch('/api/challenges', {
            id: challengeId,
            name: challengeName,
            start_date: startDate+':00.000000',
            end_date: endDate+':00.000000',
            key: challengeKey
            },
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                console.log('saved');
                setShow(true);
                setTimeout(() => setShow(false),5000)
                console.log('saved')
            })
            .catch(err => {
                console.log(err);
                alert("Please fill all the fields with valid values")
            })
        }

  
  
      // react hook that updates the component state 
      useEffect(() => {
        getExercise();  
        getChallenge()  
      }, []);

    // onClick event handler for "delete" button (delete the relative exercise)
    const onClickDeleteEx = (id) => deleteEx(id)

    // function that removes the exercise from the list ("exercises" state variable). It is called from OnClickDeleteEx event handler
    const deleteEx = async(exerciseId) => {      
        const token = await getAccessTokenSilently()
        
        axios.delete(`/api/exercises/${exerciseId}`, 
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                console.log('deleted');
            })
            window.location.reload(true)
    };


    // function that compose the date string before saving in in the state variable "startDate"
    const setStartDateFun = (date) =>{
        var newStartDate = startDate.slice(10)
        newStartDate = date + newStartDate         
        setStartDate(newStartDate)
    }

    // function that compose the date string before saving in in the state variable "endDate"
    const setEndDateFun = (date) =>{
        var newEndDate = endDate.slice(10)
        newEndDate = date + newEndDate
        setEndDate(newEndDate)
    }

    // function that appends start time string to start date string 
    const setStartTimeFun = (time) =>{
        var newStartDate = startDate.slice(0, -6)
        newStartDate = newStartDate + " " +  time
       
        setStartDate(newStartDate)
    }

    // function that appends end time string to end date string 
    const setEndTimeFun = (time) =>{
        var newEndDate = endDate.slice(0, -6)
        newEndDate = newEndDate + " " + time
        setEndDate(newEndDate)
    }

    // event handler for the eye button to show/hide password characters
    const togglePasswordVisiblity = () => {
        const password = document.getElementById("challengeKey");
        if (password.type === "password") {
            password.type = "text";
            setEyeSlash(true);
        } else {
            password.type = "password";
            setEyeSlash(false);
        }
    }

    return (
        <div>

        <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 className="h3 mb-0 text-gray-800">Challenge Modify</h1>
            </div>
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <small className="d-block text-end mt-3 "> 
                    <NavigationButton dir={`/profile`} text="X"></NavigationButton>  
                    </small>                     
                    <h6 className="m-0 font-weight-bold text-primary">Main challenge information</h6>
                    
                </div>
                <div className="card-body">
                <form className="m-1 row ">
                    <div className="form-group col-12">
                        <div className="row mt-2">
                            <label htmlFor="challengeName">Challenge name</label>
                            <input type="text" value={challengeName || ''} onChange={(e)=>{setChallengeName(e.target.value)}} className="form-control" id="challengeName" placeholder={challengeName}/>
                        </div>
                        
                        <div className="row mt-2">
                            <label className="control-label" htmlFor="start-date">Start date</label>
                            <input className="form-control" value={startDateVisual} onChange={(e)=>{ setStartDateVisual(e.target.value) ; setStartDateFun(e.target.value)  }} id="start-date" name="start-date" type="date"/>
                        </div>
                        <div className="row mt-2">
                            <label className="control-label" htmlFor="end-date">End date</label>
                            <input className="form-control" value={endDateVisual} onChange={(e)=>{setEndDateVisual(e.target.value); setEndDateFun(e.target.value)}} id="end-date" name="end-date" type="date"/>
                        </div>

                        
                        <div className="row mt-2">
                            <div className="col">
                                <label className="control-label" htmlFor="end-date">Start Time</label>
                                <input className="form-control" value={startTime} onChange={(e)=>{setStartTime(e.target.value); setStartTimeFun(e.target.value)}} id="end-date" name="end-date" type="time"/>
                            </div>
                            <div className="col">
                                <label className="control-label" htmlFor="end-date">End Time</label>
                                <input className="form-control" value={endTime} onChange={(e)=>{setEndTime(e.target.value); setEndTimeFun(e.target.value);}} id="end-date" name="end-date" type="time"/>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <label htmlFor="challengeKey">Challenge key</label>   
                            <div className='d-flex flex-row align-items-center'>
                                <input id="challengeKey" type="password" value={challengeKey || ''} onChange={(e)=>{setChallengeKey(e.target.value)}} className="form-control" placeholder={challengeKey}/>
                                <FontAwesomeIcon className='ml-2'  icon={eyeSlash?faEyeSlash:faEye} size="1x" onClick={togglePasswordVisiblity}/>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="d-flex flex-row-reverse">
                <Button ref={target} onClick={() => {setChallenge()}}>
                Save Challenge
                </Button>
                <Overlay target={target.current} show={show} placement="left">
                    {(props) => (
                    <Tooltip id="overlay-example" {...props} >
                        Challenge Saved
                    </Tooltip>
                    )}
                </Overlay>
                    

                </div>
                </div>

                
                


            </div>

            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Exercises</h6>
                   
              </div>
              
                <div className="card-body">
                <ul id="esList" > {exercises.map((exercise,index) => (

                    <div key = {exercise.id} className="d-flex text-muted pt-3">
                    
                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                        <FontAwesomeIcon icon={faCode} size="2x" className="text-primary mr-2"/>
                        <strong className="text-gray-dark">{exercise.title}</strong>
                        </div>
                        <small className="d-block text-end"> 
                        <div className="btn-group">
                            <NavigationButton dir={`/profile/ExerciseModify/${challengeId}/${exercise.id}`} text="Edit"></NavigationButton>
                            <button type="button" className="btn btn-sm btn-danger" onClick={()=>onClickDeleteEx(exercise.id)}>Delete</button>
                        </div>
                        </small>
                    </div>
                </div>
                </div>


                            )
                    )
                }
                </ul>

                <NavigationButton dir={`/profile/ExerciseCreation/${challengeId}`} text="Add Exercise"></NavigationButton>
            </div>
        </div>
           
        </div>   
      
        </div>
    );
}
//}

export default withAuthenticationRequired(ChallengeModify, {
  onRedirecting: () => <div>Loading...</div>,
});


