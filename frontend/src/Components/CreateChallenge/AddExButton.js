import React from 'react';
import { useNavigate } from 'react-router-dom';


const AddExButton = (props) => {
    const history = useNavigate();
    const dir = props.dir;
    const text = props.text;
    
    return (
        <button className="btn btn-primary btn-icon-split"
        onClick={() =>{
                sessionStorage.setItem("challengeName", props.challName);
                sessionStorage.setItem("startDate", props.sDate);
                sessionStorage.setItem("endDate", props.eDate);
                history(dir);
            }
        }>
        <span className="text">{text}</span>
        </button>
        
    );
};

export default AddExButton;
