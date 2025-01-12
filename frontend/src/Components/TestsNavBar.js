import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import TestCase from './TestCase';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

function TestsNavBar(props) {

  const [listTest, setlistTest] = useState([]);
  const { getAccessTokenSilently } = useAuth0()
  const {exerciseId} = useParams()

  //Retrieves all the testcases related to the current exercise and the output produced by the user in CodeEditor
  const getTestCases = async() => {

    const ExerciseId = props.exerciseId    
    const token = await getAccessTokenSilently()

    axios.get(`/api/testcases/exercises/${exerciseId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      
      if(sessionStorage.getItem('results'+exerciseId) !== null && sessionStorage.getItem('results'+exerciseId) !== "undefined"){

        var ls = JSON.parse(sessionStorage.getItem('results'+exerciseId))
        ls = ls.map(x => [x.id, Buffer.from(x.stdout, 'base64').toString(), x.passed])
        console.log(ls)

        for(var i=0 ; i<ls.length ; i++){
          for(var j=0 ; j< res.data.length; j++){
            if(ls[i][0] === res.data[j]["id"]){

              res.data[j]["user_output"] = ls[i][1]
              res.data[j]["passed"] = ls[i][2]
            }
          }
        }

      }
      setlistTest(res.data)
    })
  };

  useEffect(() => {
    getTestCases()
  }, [props.refresh]);


  return (

    <Card>
      <Card.Body>
        <Card.Title>Test Cases</Card.Title>
      </Card.Body>
      <Tab.Container className="container-md" id="left-tabs-example" defaultActiveKey="0">
        <Row>
          <Col sm={3} style = {{'height': '70vh', 'overflowY': 'auto'}}>
            <Nav variant="pills" className="flex-column">
              {listTest.map((test, index) => (             
                <Nav.Item key = {index} eventKey={index}>                
                  <Nav.Link key = {index} eventKey={index}> Test case {index + 1} {test.passed==undefined ? "" : test.passed ?'\u2705' : '\u274C'}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
            {listTest.map((test, index) => (             
              <Tab.Pane key = {index} eventKey={index}>
                <TestCase input = {test.input !== undefined ? Buffer.from(test.input, 'base64').toString() : "Hidden case"} user_output={test.user_output || "Not executed"} output = {test.output !== undefined ? Buffer.from(test.output, 'base64').toString() : "Hidden case"} passed = {test.passed === undefined ? "Not executed" : test.passed.toString()}/>              </Tab.Pane>
            ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <Card.Footer>
        <small className="text-muted">Number of passed test cases: {
          listTest.length>0 ? (listTest.map(x => x.passed).map(y => y===true ? 1 : 0).reduce((a,b)=>a+b)+0).toString() : "0"}</small>
      </Card.Footer>
    </Card>
  );
}
  

export default TestsNavBar;