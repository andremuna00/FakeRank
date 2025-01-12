import React, { useState } from "react";
import AceEditor from "react-ace";
import "react-ace-builds/webpack-resolver-min";
import axios from "axios";
import "./Editor.css";
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from 'react-router-dom'
import Card from 'react-bootstrap/Card';


const CodeEditor = ({RefreshTestCases}) => {

    const { getAccessTokenSilently } = useAuth0();
    let navigate = useNavigate();
    //state for language and style
    const [language, setLanguage] = React.useState("");
    const [theme, setTheme] = React.useState("monokai");
    const [sourceCode, setSourceCode] = React.useState("");
    const {challengeId, exerciseId} = useParams()
    const [submissionId, setSubmissionId] = React.useState("");
    const [consoleText, setConsoleText] = React.useState("");
    const [testCaseInput, setTestCaseInput] = React.useState("");
    const [expectedOutput, setExpectedOutput] = React.useState("");
    const [consoleColor, setConsoleColor] = React.useState("green");
    const [date, setDate] = useState(Date.now());
    const [date_now, setDate_now] = useState(Date.now());
    const {user} = useAuth0()


    // Retrieves the template of an exercise if the user hasn't started
    const getTemplateExercise = async ()=>{

        const token = await getAccessTokenSilently()


        axios.get(`/api/exercises/${exerciseId}`,
        {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }).then(res => {

            setLanguage(res.data.language)
            setSourceCode(Buffer.from(res.data.sourceCode, 'base64').toString())

        }).catch(err => {

            console.log("template not retrieved")
        })

    }


    // Checks if the user has started the challenge and in case redirects to the page where you have to insert the key
    const findSubmissionID = async () => {

        if(challengeId != undefined){

            const token = await getAccessTokenSilently()
            axios.get(`/api/submissions`,
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                
                let submission = res.data.filter(x => x.challenge == challengeId)[0]
                if(submission == undefined || new Date(submission.end_date).getTime() < new Date().getTime()){
                    let path_redirect = `/profile/ChallengePartecipate/${challengeId}`
                    navigate(path_redirect)
                    return;
                  }
                setSubmissionId(submission.id)


                axios.get(`/api/exercise_submissions/submissions/${submission.id}/exercises/${exerciseId}`,
                {
                    headers: {
                    'Authorization': `Bearer ${token}`
                    }
                }).then(res => {

                    setLanguage(res.data.language)
                    setSourceCode(Buffer.from(res.data.sourceCode, 'base64').toString())
                    
                    
                }).catch(err => {

                    getTemplateExercise();
                })
                
            })

        }
        
    }


    //function to handle body of script change
    React.useEffect(() => {
        findSubmissionID();
        setInterval(()=>setDate_now(Date.now()), 1000)
    }, []);

    return (
        <div>
        <Card.Body>
            <div className="d-flex flex-row mb-3">
            <p className="mr-3">Selected language: <span style={{"color": "blue", "fontWeight": "bold"}}>{language}</span></p>
            <select
                value={theme}
                className="mr-3"
                onChange={(e) => setTheme(e.target.value)}>
                <option value="monokai">Monokai</option>
                <option value="github">Github</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="kuroir">Kuroir</option>
                <option value="twilight">Twilight</option>
                <option value="xcode">Xcode</option>
                <option value="textmate">Textmate</option>
                <option value="solarized_dark">Solarized Dark</option>
                <option value="solarized_light">Solarized Light</option>
                <option value="terminal">Terminal</option>
            </select>

            <button
                type="button" className="btn btn-sm btn-primary mr-3"
                onClick={async () => {
                    const token = await getAccessTokenSilently()

                    axios.post('/api/exercise_submissions', {
                        user_id: user.sub.substring(6),
                        submission_id:submissionId,
                        exercise_id: exerciseId,
                        language: language,
                        code: Buffer.from(sourceCode).toString('base64')
                        },
                        {
                            headers: {
                            'Authorization': `Bearer ${token}`
                            }
                        }).then(res => {

                            // Stores the results of the exercises in order to pass them to the TestCaseNavBar component
                            sessionStorage.setItem('results'+exerciseId, JSON.stringify(res.data.results));
                            RefreshTestCases();
                            setDate(Date.now())
                        })
                        .catch(err => {
                            console.log(err);
                            alert("Invalid source code - Didn't compile or no output")
                        })

                }}
            >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Run all test cases
            </button>

            <button
                type="button" className="btn btn-sm btn-primary mr-3"
                onClick={async () => {
                    const token = await getAccessTokenSilently()
                    
                    axios.post('/api/execute', {
                        language: language,
                        source_code: Buffer.from(sourceCode).toString('base64')
                        },
                        {
                            headers: {
                            'Authorization': `Bearer ${token}`
                            }
                        }).then(res => {

                            var ClearInterval = (Text, Color, Id) => {
                                setConsoleColor(Color);
                                setConsoleText(Text);
                                clearInterval(Id);
                            }
                            var startTime = new Date().getTime();
                            var Id = setInterval(() => {
                                if(new Date().getTime() - startTime > 60000){
                                    ClearInterval("Request Error", "red", Id); return;
                                }
                                axios.get('/api/results/' + res.data.token,
                                {
                                    headers: {
                                      'Authorization': `Bearer ${token}`
                                    }
                                })
                                    .then(res => {
                                        setDate(Date.now())
                                        if (res.data.stdout != null)
                                            var stdout = Buffer.from((res.data.stdout), 'base64');
                                        if (res.data.stderr != null)
                                            var stderr = Buffer.from((res.data.stderr), 'base64');
                                        if (res.data.compile_output != null)
                                            var compile_output = Buffer.from((res.data.compile_output), 'base64');
                                        switch (res.data.status.id) {
                                            case 1:
                                                break; //In Queue
                                            case 2:
                                                break;//Processing
                                            case 3:
                                                ClearInterval(stdout, "green", Id); break;
                                            case 4:
                                                ClearInterval(stderr, "red", Id); break;
                                            case 5:
                                                ClearInterval("Time Limit Exceeded\n" + stderr, "red", Id); break;
                                            case 6:
                                                ClearInterval("Compilation Error\n" + compile_output, "yellow", Id); break;
                                            case 7:
                                                ClearInterval("Runtime Error - Segmentation Fault\n" + stderr, "red", Id); break;
                                            case 8:
                                                ClearInterval("Runtime Error (SIGXFSZ)\n" + stderr, "red", Id); break;
                                            case 9:
                                                ClearInterval("Runtime Error (SIGFPE)\n" + stderr, "red", Id); break;
                                            case 10:
                                                ClearInterval("Runtime Error (SIGABRT)\n" + stderr, "red", Id); break;
                                            case 11:
                                                ClearInterval("Runtime Error (NZEC)\n" + stderr, "red", Id); break;
                                            case 12:
                                                ClearInterval("Runtime Error (Other)\n" + stderr, "red", Id); break;
                                            case 13:
                                                ClearInterval("Internal Error\n" + stderr, "red", Id); break;
                                            case 14:
                                                ClearInterval("Exec Format Error\n" + stderr, "red", Id); break;
                                            default:
                                                ClearInterval("Unknown Error\n" + stderr, "red", Id); break;
                                        }
                                    }
                                    )
                            }, 1000);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        
                }}
            >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Run source code
            </button>

            <button
                type="button" className="btn btn-sm btn-primary mr-3"
                onClick={async () => {
                    {/*Ask user to fill two input text for the test case*/}
                    if (testCaseInput == null || testCaseInput == "" || expectedOutput == null || expectedOutput == "") {
                        alert("Input or output is empty");
                        return;
                    }
                    
                    const token = await getAccessTokenSilently()

                    axios.post('/api/execute', {
                        language: language,
                        stdin: Buffer.from(testCaseInput).toString('base64'),
                        expected_output: Buffer.from(expectedOutput).toString('base64'),
                        source_code: Buffer.from(sourceCode).toString('base64')
                        },
                        {
                            headers: {
                            'Authorization': `Bearer ${token}`
                            }
                        }).then(res => {

                            var ClearInterval = (Text, Color, Id) => {
                                setConsoleColor(Color);
                                setConsoleText(Text);
                                clearInterval(Id);
                            }
                            var startTime = new Date().getTime();
                            var Id = setInterval(() => {
                                if(new Date().getTime() - startTime > 60000){
                                    ClearInterval("Request Error", "red", Id); return;
                                }
                                axios.get('/api/results/' + res.data.token,
                                {
                                    headers: {
                                      'Authorization': `Bearer ${token}`
                                    }
                                })
                                    .then(res => {
                                        if (res.data.stdout != null)
                                            var stdout = Buffer.from((res.data.stdout), 'base64');
                                        if (res.data.stderr != null)
                                            var stderr = Buffer.from((res.data.stderr), 'base64');
                                        if (res.data.compile_output != null)
                                            var compile_output = Buffer.from((res.data.compile_output), 'base64');
                                        switch (res.data.status.id) {
                                            case 1:
                                                break; //In Queue
                                            case 2:
                                                break;//Processing
                                            case 3:
                                                var des = res.data.status.description;
                                                if(des !== null && des == "Accepted")
                                                    ClearInterval("Correct Answer: "+stdout, "green", Id);
                                                else
                                                    ClearInterval(stdout, "green", Id);
                                                break;
                                            case 4:
                                                var des = res.data.status.description;
                                                if(des !== null && des == "Wrong Answer")
                                                    ClearInterval(res.data.status.description+": "+stdout, "red", Id);
                                                else
                                                    ClearInterval(stderr, "red", Id); 
                                                break;
                                            case 5:
                                                ClearInterval("Time Limit Exceeded\n" + stderr, "red", Id); break;
                                            case 6:
                                                ClearInterval("Compilation Error\n" + compile_output, "yellow", Id); break;
                                            case 7:
                                                ClearInterval("Runtime Error - Segmentation Fault\n" + stderr, "red", Id); break;
                                            case 8:
                                                ClearInterval("Runtime Error (SIGXFSZ)\n" + stderr, "red", Id); break;
                                            case 9:
                                                ClearInterval("Runtime Error (SIGFPE)\n" + stderr, "red", Id); break;
                                            case 10:
                                                ClearInterval("Runtime Error (SIGABRT)\n" + stderr, "red", Id); break;
                                            case 11:
                                                ClearInterval("Runtime Error (NZEC)\n" + stderr, "red", Id); break;
                                            case 12:
                                                ClearInterval("Runtime Error (Other)\n" + stderr, "red", Id); break;
                                            case 13:
                                                ClearInterval("Internal Error\n" + stderr, "red", Id); break;
                                            case 14:
                                                ClearInterval("Exec Format Error\n" + stderr, "red", Id); break;
                                            default:
                                                ClearInterval("Unknown Error\n" + stderr, "red", Id); break;
                                            
                                        }
                                        setDate(Date.now())
                                    }
                                    )
                            }, 1000);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }}
            >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Run custom test cases
            </button>

            <button
                type="button" className="btn btn-sm btn-primary ml-auto"
                onClick={async () => {
                    const token = await getAccessTokenSilently()
                    axios.post('/api/exercise_submissions', {
                        user_id: user.sub.substring(6),
                        submission_id:submissionId,
                        exercise_id: exerciseId,
                        language: language,
                        code: Buffer.from(sourceCode).toString('base64')
                        },
                        {
                            headers: {
                            'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(res => {
                            setDate(Date.now())
                            console.log(res);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }}
            >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save
            </button>
            </div>
            
            <AceEditor
                value={sourceCode}
                style={{ width: "100%", height: "50vh" }}
                mode={language=="cpp"||language=="c"?"c_cpp":language}
                theme={theme}
                name="ace"
                onLoad={() => {}}
                onChange={(e) => setSourceCode(e)}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                    showLineNumbers: true,
                    tabSize: 4,
                }}
            />
            <div className="d-flex flex-row">
            <div className="d-flex flex-column">
                <div style={{height: "5vh", marginTop: "10px", textAlign:"center"}}><i>Custom Test Case Input</i></div>
                <textarea
                    value = {testCaseInput}
                    onChange={(e) => setTestCaseInput(e.target.value)}
                        style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        border: "black 1px solid",
                        width: "100%",
                        height: "10vh",
                        fontSize: "16px",
                        padding: "10px",
                        boxSizing: "border-box",
                    }}
                ></textarea>
                <div style={{height: "5vh", marginTop: "1vh", textAlign:"center"}}><i>Custom Test Case Expected Output</i></div>
                <textarea
                    value = {expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        border: "black 1px solid",
                        width: "100%",
                        height: "10vh",
                        fontSize: "16px",
                        padding: "10px",
                        boxSizing: "border-box",
                    }}
                ></textarea>
            </div>
            <textarea value={consoleText} readOnly={true}
                //style for console
                style={{
                    backgroundColor: "#000",
                    color: consoleColor,
                    border: "none",
                    width: "100%",
                    height: "31vh",
                    fontSize: "16px",
                    padding: "10px",
                    boxSizing: "border-box",
                    marginTop: "10px",
                    marginLeft: "10px"
                }}

            />
            </div>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Last updated {Math.round((date_now - date)/60000 )} mins ago</small>
        </Card.Footer>
        </div>
    );
};

export default CodeEditor;