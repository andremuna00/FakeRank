import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/css/sb-admin-2.min.css"

const NavigationButton = (props) => {
    const history = useNavigate();
    
    const { dir, text } = props
    return (
        <button className=" mx-1 btn btn-primary btn-icon-split"
        onClick={() =>
            history(dir)
        }>
        <span className="text">{text}
        </span>
        </button>
        
    );
};

export default NavigationButton;