import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import NavigationButton from '../navigation-button';

const CreatedChallListItem = (props) => {

    const [show, setShow] = useState(false);
    let executing = new Date(props.start).getTime() < new Date().getTime() ;
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { getAccessTokenSilently, user } = useAuth0()

    //delete challenge
    const deleteChallenge = async() => {      
        const token = await getAccessTokenSilently()
        
        axios.delete(`/api/challenges/${props.idChall}`, 
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                console.log('deleted');
            })
            window.location.reload(true)
    };

    const link = "http://localhost:3000/profile/ChallengePartecipate/" + props.idChall

    return (
        <div className="d-flex flex-row justify-content-between align-items-center  border-bottom border-secondary mb-4">

            <div>
                <p className="text-primary">Title: {props.title}</p>
                <p className="text-secondary">End Challenge: {props.descr.slice(0, -5)}</p>
            </div>

            <div>
                <button className="btn btn-primary mr-1" onClick={handleShow}>Generate link</button>
                <NavigationButton dir={`/Challenge/Results/${props.idChall}`} text="Analyze submissions"></NavigationButton>
                {!executing &&<NavigationButton dir={`/profile/ChallengeModify/${props.idChall}`} text="Edit"></NavigationButton>}
                {executing && <button className="btn btn-primary mr-1" disabled>Editing disabled</button>}
                <button className='btn btn-danger ' onClick={deleteChallenge}>Delete</button>
            </div>

            <>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Partecipation Link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='d-flex align-items-center flex-column'>
                        <p>{link}</p>
                        <CopyToClipboard text={link}>
                            <button className="btn btn-primary mr-1">Copy</button>
                        </CopyToClipboard>
                    </Modal.Body>
                </Modal>
                </>
            

        </div>

    );
}

export default CreatedChallListItem;