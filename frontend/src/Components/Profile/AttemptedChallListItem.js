import React from 'react';
import NavigationButton from '../navigation-button';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";

const AttemptedChallListItem = (props) => {
    const { getAccessTokenSilently, user } = useAuth0()

    //delete submission
    const deleteSubmission = async() => {      
        const token = await getAccessTokenSilently()
        
        axios.delete(`/api/submissions/${props.idChall}`, 
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                console.log('deleted');
                window.location.reload(true)
            })
            
    };


    //submit the challenge
    const submitChallenge = async() => {
        const token = await getAccessTokenSilently()
        
        axios.patch(`/api/submissions/${props.idChall}/submit`,
        {},
        {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        }).then(
            window.location.reload(true)
        )
    };

    return (
        <div className="d-flex flex-row justify-content-between align-items-center border-bottom border-secondary mb-4">
            <div>
                <p className="text-primary">Title: {props.title}</p>
                <p className="text-secondary">End Challenge: {props.descr.slice(0, -5)}</p>
            </div>
            <div>
                <NavigationButton dir={`/profile/Challenge/${props.challenge}`} text="Solve"></NavigationButton>
                {/*submit button: active if the challenge is still ongoing, inactive if the challenge 
                is going through review, and replaced once the review is over */}
                <button className='btn btn-primary ml-1' onClick={submitChallenge}>Submit</button>
                <button className='btn btn-danger ml-1' onClick={deleteSubmission}>Quit</button>
            </div>

        </div>
    );
}

export default AttemptedChallListItem;