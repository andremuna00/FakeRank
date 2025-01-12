import React from 'react'
import "../assets/css/sb-admin-2.css"
function TestCase(props) {

  return (
    <div className="my-3 p-3 bg-white rounded box-shadow">
        <h6 className="border-bottom border-gray pb-2 mb-0 ">Test Case</h6>
        <div className="media text-muted pt-3">
          
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong className="d-block text-gray-dark">Input</strong>
            <br/>
            <pre>{props.input}</pre>
            
          </p>
        </div>
        <div className="media text-muted pt-3">
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
          <strong className="d-block text-gray-dark">Your output</strong>
          <br/>
           <pre>{props.user_output}</pre>
          </p>
        </div>
        <div className="media text-muted pt-3">
          
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong className="d-block text-gray-dark">Expected output</strong>
            <br/>
            <pre>{props.output}</pre>
          </p>
        </div>
        <div className="media text-muted pt-3">
         
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong className="d-block text-gray-dark">Passed</strong>
            <br/>
            <pre>{props.passed}</pre>
          </p>
        </div>
      </div>

  )
}

export default TestCase