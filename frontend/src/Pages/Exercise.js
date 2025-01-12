import CodeEditor from '../Components/Editor/CodeEditor'
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import TestNavBar from '../Components/TestsNavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Timer from '../Components/Timer';
import { convertFromRaw, Editor, EditorState } from 'draft-js';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Accordion from 'react-bootstrap/Accordion';
import CircularTimer from '../Components/Timer/CircularTimer';
import NavigationButton from '../Components/navigation-button';

//In this page you do a specific exercise, with its testcases
function Exercise() {
  const { getAccessTokenSilently, user } = useAuth0()
  const { challengeId, exerciseId} = useParams();
  const [exercise, setexercise] = React.useState([]);
  const [refresh, setRefresh] = useState(false);
  const [chalenge, setChalenge] = useState("");

  const [expired, setExpired] = useState(false);
  const [startDate, setStartDate ] = useState('');
  const [endDate, setEndDate] = useState('');

  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );

  const [open, setOpen] = useState(false);

  //get exercise
  const getExercise = async() => {      
    const token = await getAccessTokenSilently()
    
    axios.get(`/api/exercises/${exerciseId}`,
  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
  }).then(res => {
    //salvare 
    setexercise(res.data)
    setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(res.data.description))))
  })
  };

  const getChallenge = async() => {      
    const token = await getAccessTokenSilently()
    
    axios.get(`/api/challenges/${challengeId}`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
      
      setChalenge(res.data)
      setStartDate(res.data.start_date)
      setEndDate(res.data.end_date)
      console.log(res.data);

      //obtain current date in ms
      var current_date = new Date().getTime();
      //transform the date in ms
      var start_date = new Date(res.data.start_date).getTime();
      var end_date = new Date(res.data.end_date).getTime();
      if (current_date < start_date || current_date > end_date)
          setExpired(true)
      
    })
  };

  //componentdidmount con reacthook, mi raccomando da chiamare quando fai la get
  useEffect(() => {
    getExercise()
    getChallenge()
    setInterval(()=>checkDate(), 1000)
    
  }, [endDate, startDate]);

  

  const checkDate = () =>{ 
    var current_date = new Date().getTime();   
    //transform the date in ms
    var start_date = new Date(startDate).getTime();    
    var end_date = new Date(endDate).getTime();
    if (current_date < start_date || current_date > end_date){
      
      setExpired(true)}
  }


  return (
    <div>
    {expired && <div  className="text-center justify-content-center content">
      <h1 className="h3 mb-3 font-weight-normal">The Challenge has expired</h1>
      <NavigationButton dir={`/profile`} text="< Profile"> </NavigationButton></div>}
    
    {!expired && <Container fluid>
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
      
        <small className="d-block text-end mt-3 "> 
        <NavigationButton dir={`/profile/Challenge/${challengeId}`} text="X"></NavigationButton>  
        </small>                     
        <h1 className="m-0 font-weight-bold text-primary">{exercise.title}</h1>                   
      
        
        {chalenge!="" && <CircularTimer style={{"height": "0.2rem"}} end_time={new Date(chalenge.end_date).getTime()}></CircularTimer>}
      </div>

      <div className="card shadow mb-4">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>View exercise description</Accordion.Header>
            <Accordion.Body>
            <Editor editorState={editorState} readOnly={true}/>
            {/*convertFromRaw(JSON.parse(res.data.description))*/}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <Row>
        <Col lg={8}>
        <Card >
          <CodeEditor RefreshTestCases={()=>{setRefresh(!refresh)}}/>
      </Card>
        </Col>
        <Col lg={4}>
        <TestNavBar exerciseId={exerciseId} refresh={refresh} />
        </Col>
      </Row>
      
    </Container>}
    </div>
  )
}

export default Exercise