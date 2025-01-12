import React, {useState, useEffect} from 'react';
import {  withAuthenticationRequired  } from '@auth0/auth0-react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useParams } from 'react-router-dom';
import AceEditor from 'react-ace-builds';
import NavigationButton from '../Components/navigation-button';

const ResultsUser = () => {

  const { challengeId, submissionId } = useParams()
  const [exercises, setExercises] = useState([])
  const [ls, setLs] = useState([])

  
  const { getAccessTokenSilently } = useAuth0()

  
  // Similarly to the Results page, retrieves all the exercise submissions related by the user identified with submissionId, but
  // it will display the code submitted instead of the passed testcases.
  const getExercises = async() => {      
    const token = await getAccessTokenSilently()
    let exerciseList = []
    
    axios.get(`/api/exercises/challenges/${challengeId}`,
    {
        headers: {
          'Authorization': `Bearer ${token}`
        }
    }).then(res => {
 
      exerciseList = res.data.map(x => [x.id, x.title])
      setExercises(exerciseList)


      for(var i=0 ; i< exerciseList.length ; i++){

        const index = i

        axios.get(`/api/testcases/exercises/${exerciseList[index][0]}`,
        {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        }).then(res => {

          const number_test_cases = res.data.length

          let out = {}

          axios.get(`/api/exercise_submissions/submissions/${submissionId}/exercises/${exerciseList[index][0]}`,
          {
              headers: {
                'Authorization': `Bearer ${token}`
              }
          }).then(res => {

            out["exerciseId"] = exerciseList[index][0]
            out["number_test_cases"] = number_test_cases
            out["submission"] = res.data


            setLs(ls =>[...ls, out])
            
          }).catch(err =>{

            console.log(err)
            setLs(ls =>[...ls, out])
          })
          
        })
      }
    })

  };





  useEffect(() => {
    getExercises()
  }, []);

    
  return (
    <>  
    <Card>
        <Card.Body>
        <Card.Title>
          
          <small className="d-block text-end mt-3 "> 
            <NavigationButton dir={`/profile`} text="X"></NavigationButton>  
          </small> 
          <h1>Submitted Code</h1>
        </Card.Title>
        </Card.Body>
        <Tab.Container className="container-md" id="left-tabs-example" defaultActiveKey="0">
        <Row>
            <Col sm={1} style = {{'height': '70vh', 'overflowY': 'auto'}}>
            <Nav variant="pills" className="flex-column">
                {exercises.map((ex, index) => (             
                <Nav.Item key = {index}>                
                    <Nav.Link key = {index} eventKey={index}> {ex[1]}</Nav.Link>
                </Nav.Item>
                ))}
            </Nav>
            </Col>
            <Col sm={10}>
            <Tab.Content>
            {exercises.map((ex, index) => ( 
              (ls.find(x=>x.exerciseId === ex[0])==undefined||ls.find(x=>x.exerciseId === ex[0]).submission==undefined) ? 
                (<Tab.Pane key = {index} eventKey={index}>No code submitted yet for this exercise</Tab.Pane>):        
                (<Tab.Pane key = {index} eventKey={index}>
                <AceEditor
                    value={Buffer.from(ls.find(x=>x.exerciseId === ex[0]).submission.sourceCode, 'base64').toString()}
                    style={{ width: "100%", height: "50vh" }}
                    mode={ls.find(x=>x.exerciseId === ex[0]).submission.language == "c" || ls.find(x=>x.exerciseId === ex[0]).submission.language == "cpp" ? "c_cpp" : ls.find(x=>x.exerciseId === ex[0]).submission.language}
                    theme={"monokai"}
                    name="ace"
                    onLoad={() => {}}
                    onChange={() => {}}
                    fontSize={14}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    readOnly={true}
                    setOptions={{
                        showLineNumbers: true,
                        tabSize: 4,
                    }}
                />
                </Tab.Pane>)
            ))}
            </Tab.Content>
            </Col>
        </Row>
        </Tab.Container>
        <Card.Footer>
        </Card.Footer>
    </Card>   
    </>
  );
};

export default withAuthenticationRequired(ResultsUser, {
  onRedirecting: () => <div>Loading...</div>,
});