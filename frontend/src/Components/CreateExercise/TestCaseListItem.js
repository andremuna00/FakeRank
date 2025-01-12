import React from 'react'


function TestCaseListItem (props){
    return (
        <div className="row border-bottom border-secondary mb-4">
            <div className="col-10">
                <p className="text-primary">Test input: {props.input}</p>
                <p className="text-primary">Expected output: {props.output}</p>
            </div>

            <div className="col-2 ">
                {/*Button for deleting the test case. The event handler for onClick event is passed through props */}
                <button className="btn btn-danger mr-1" onClick={(e)=>{e.preventDefault();props.delete(props.id)}}>Delete</button>
            </div>
        </div>
    )
}

export default TestCaseListItem;