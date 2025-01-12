import React from 'react';
import NavigationButton from '../navigation-button';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";

const SubmittedChallListItem = (props) => {
    const { getAccessTokenSilently } = useAuth0()

    //delete submission
    const deleteSubmission = async() => {      
        const token = await getAccessTokenSilently()
        
        axios.delete(`/api/submissions/${props.idSub}`, 
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                console.log('deleted');
            })
            window.location.reload(true)
    };



    return (
        <div className="d-flex flex-row justify-content-between align-items-center  border-bottom border-secondary mb-4">
            <div>
                <p className="text-primary">Title: {props.title}</p>
                <p className="text-secondary">End Challenge: {props.descr.slice(0, -5)}</p>
            </div>
            <div>
                {/*TODO: view challenge results only for my submission*/}
                <NavigationButton dir={`/Challenge/Results/Submissions/${props.idSub}/Challenges/${props.challenge}`} text={"View Results"}/>
            </div>
        </div>
    );
}

export default SubmittedChallListItem;