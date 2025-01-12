import React from 'react';
import SubmittedChallListItem from './SubmittedChallListItem';

// If a user submits a challenge, it will be displayed here, where it will be possible to review the code.
// The editor will be read-only and won't let the user to make further modifications.

const SubmittedChallList = (props) => {

    const isEmpty = () =>{
        if(props.challList==null) return true
        else return false;}


    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
            <div className="d-flex flex-row justify-content-between align-items-center">
                <div><h6 className="m-0 font-weight-bold text-primary">Submitted Challenges</h6></div>
              </div>
            </div>
                <div className="card-body">
                    { isEmpty()
                        ?
                        <div>no submission</div>
                        :
                        props.challList.map((chall) => {
                            console.log(chall)
                            return <SubmittedChallListItem key = {chall.id} idSub={chall.id} title={chall.challenge_title} descr={chall.challenge_end} challenge={chall.challenge}></SubmittedChallListItem>

                        }
                    )
                }
                    
                       
            </div>
        </div>
    );
}

export default SubmittedChallList;