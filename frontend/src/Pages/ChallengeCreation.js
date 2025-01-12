import React, {useState} from 'react';
import { withAuthenticationRequired  } from '@auth0/auth0-react';
import NavigationButton from '../Components/navigation-button';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// In this page you create a new challenge
function ChallengeCreation(props){

    let today = new Date();  // get the date
    let day = ("0" + today.getDate()).slice(-2);  // get day with slice to have double digit day
    let month = ("0" + (today.getMonth() + 1)).slice(-2); // get your zero in front of single month digits so you have 2 digit months
    let date = today.getFullYear() + '-' + month + '-' + day ;  // compose the date string

    let hour = ("0" + today.getHours()).slice(-2); // get hour with slice to have double digit hour
    let minute = ("0" + today.getMinutes()).slice(-2); // get minute with slice to have double digit minute 
    let time = hour + ":" + minute // compose the time string


    const [startDateVisual, setStartDateVisual ] = useState(date);
    const [endDateVisual, setEndDateVisual] = useState(date);
    const [startTime, setStartTime] = useState(time);
    const [endTime, setEndTime] = useState(time);
    const { getAccessTokenSilently, user } = useAuth0();
    const [challengeName, setChallengeName] = useState('');
    const [startDate, setStartDate ] = useState(date+" "+time);
    const [endDate, setEndDate] = useState(date+" "+time);
    const [challengeKey, setChallengeKey] = useState('');
    const [challengeId, setChallengeId] = useState('');
    const [flag, setFlag] = useState(false);
    const [eyeSlash, setEyeSlash] = useState(false);

    let navigate = useNavigate(); 

    // function to move to the path specified by path variable 
    const routeChange = async() =>{ 
      let path = `/profile/ChallengeModify/${challengeId}`; 
      navigate(path);
    }
    
    const setChallenge = async() => {     

        // field validation
        if (challengeName == '') return alert("Please insert the name")
        if (challengeKey == '') return alert("Please insert the key")
        // check if the selected end date comes after the selected start date
        let d1 = new Date(endDate)
        let d2 = new Date(startDate)
        if (d1.getTime() < d2.getTime())
            return alert("End Date must be after Star Date")
      
      const token = await getAccessTokenSilently()

      // post request for saving challenge information in the database
      axios.post('/api/challenges', {
        name: challengeName,
        start_date: startDate+':00.000000',
        end_date: endDate+':00.000000',
        key: challengeKey
        },
        {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then((res) => {       
            console.log(res.data)
            setChallengeId(res.data.id)
            setFlag(true)
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong")
        })
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
            <h1 className="h3 mb-0 text-gray-800">Challenge Creation</h1>
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
                            <input className="form-control" value={startDateVisual} onChange={(e)=>{ setStartDateVisual(e.target.value) ; setStartDateFun(e.target.value) }} id="start-date" name="start-date" type="date"/>
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
                    
                    {
                        flag === false ?
                        <button type="button" className="btn btn-primary" onClick={setChallenge}> Create Challenge  </button>
                        :
                        <button type="button" className="btn btn-primary" onClick={routeChange}> Add Exercises </button>
                    }               
                </div>
                </div>             

            </div>
          
        </div>       
        
        </div>
    );
}
//}

export default withAuthenticationRequired(ChallengeCreation, {
  onRedirecting: () => <div>Loading...</div>,
});


