import React from 'react';
import AttemptedChallListItem from './AttemptedChallListItem';

// For each ongoing challenge, the profile page renders a row with the related title, deadline 
// and a button that redirects the user to the challenge

const AttemptedChallList = (props) => {

    const isEmpty = () =>{
        if(props.challList==null) return true
        else return false;}


    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div><h6 className="m-0 font-weight-bold text-primary">Attempted Challenges</h6></div>
              </div>
            </div>
                <div className="card-body">
                    { isEmpty()
                        ?
                        <div>no submission</div>
                        :
                        props.challList.map((chall) => {
                            console.log(chall)
                            return <AttemptedChallListItem key = {chall.id} idChall={chall.id} title={chall.challenge_title} descr={chall.challenge_end} challenge={chall.challenge}></AttemptedChallListItem>

                        }
                    )
                }
                    
                       
            </div>
        </div>
    );
}

export default AttemptedChallList;