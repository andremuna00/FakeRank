import React from 'react';
import CreatedChallListItem from './CreatedChallListItem';
import NavigationButton from '../navigation-button';

// The owner of the challenge, after its creation will find a row that allows to generate the related link
// a link to the page that makes you edit the challenge and a button to delete it. The row will let the user to
// check the current submissions of the users.

const CreatedChallList = (props) => {
    const isEmpty = () =>{
        if(props.challList==null) return true
        else return false;}
        
    return (
        <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div><h6 className="m-0 font-weight-bold text-primary">{props.name}</h6></div>
                <div><NavigationButton dir="/profile/ChallengeCreation" text="+"/></div>
              </div>
            </div>
                <div className="card-body">{
                    isEmpty()
                    ?
                    <div>no challenges</div>
                    :
                        props.challList.map(chall => {
                            return <CreatedChallListItem key = {chall.id} idChall={chall.id}  title={chall.title} descr={chall.end_date} start={chall.start_date}></CreatedChallListItem>

                        }
                    )
                }
                </div>
        </div>
    );
}

export default CreatedChallList;