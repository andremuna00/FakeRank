import React from 'react'

import { useNavigate } from "react-router-dom";  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
  
function ExerciseForChallenge(props) {

  const { exerciseId, title , description,  challengeId, index} = props;

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/profile/Exercise/${challengeId}/${exerciseId}`; 
      navigate(path);
    }

  return (
    <div className="d-flex text-muted pt-3">
        <FontAwesomeIcon icon={faCode} size="2x" className='mb-4 mr-2' color="#2e59d9"/>
      <div className="pb-3 ml-2 mb-0 small lh-sm border-bottom w-100">
        <div className="d-flex justify-content-between">
          <strong className="text-gray-dark" style={{"fontSize": "1.2rem"}}>{title}</strong>
          <button type="button" className="btn btn-sm btn-primary" onClick={routeChange}>    
          solve
            </button>
        </div>
      </div>
    </div>
  )
}

export default ExerciseForChallenge