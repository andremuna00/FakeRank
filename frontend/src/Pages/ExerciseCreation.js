import React, {useState} from 'react'
import NavigationButton from '../Components/navigation-button';
import Button from 'react-bootstrap/Button';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState } from 'draft-js';
import AceEditor from "react-ace";
import TestCaseListItem from '../Components/CreateExercise/TestCaseListItem';
import { useParams, useNavigate} from 'react-router-dom';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';


//In this page you create a new exercise
function ExerciseCreation (){

    const { getAccessTokenSilently, user } = useAuth0();
    const { challengeId } = useParams();

    const [tempExTitle, setTempExTitle] = useState('');
    const [tempExLanguage, setTempExLanguage] = useState("");
    const [sourceCode, setSourceCode] = useState('');

    const [tempInput, setTempInput] = useState("");
    const [tempOutput, setTempOutput] = useState("");
    const [checked, setChecked] = useState(true); 
    const [testCaseList, setTestCaseList] = useState([]);

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    
    let navigate = useNavigate(); 
    

    
    
    const setTestCase= async(testCase, exerciseId) => {      
        const token = await getAccessTokenSilently()

        // post request for saving the test cases for current exercise
        axios.post(`/api/testcases`,
        {
            exercise_id: exerciseId,
            input: Buffer.from(testCase.input).toString('base64'),
            output: Buffer.from(testCase.output).toString('base64'),
            visible: testCase.visible

            },
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => {
            console.log('saved')
            let newList = [...testCaseList];
            newList.push(res.data);
            setTestCaseList(newList);

        }).catch(err => {
            console.log(err);
            alert("Please first create the Exercise")
        })
    };

    /*Function that handles language selection for the current exercise */
    const handleLangToggle = (e) =>{
        setTempExLanguage(e.target.id);
    }


    /*Function that saves the exercise in the database (onClick event handler for "Save Exercise" button)*/
    const saveExercise = async () =>{
        // fields validation
        if (tempExTitle == '') return alert("Please insert the title")
        if (tempExLanguage == '') return alert("Please insert a language")
        if (sourceCode == '') return alert("Please insert the source code")
        if ( !editorState.getCurrentContent().hasText()) return alert("Please insert the description")
        

        const token = await getAccessTokenSilently()

        // convert the formatted exercise description in a JSON object, in order to save it in the database (calling a draft.js API) 
        const contentState = editorState.getCurrentContent()
        const json = JSON.stringify(convertToRaw(contentState))

        
        // post request for saving the exercise in the database
        axios.post(`/api/exercises`,
        {
            
            sourceCode : Buffer.from(sourceCode).toString('base64'),
            challenge_id : challengeId,
            title: tempExTitle,
            description: json,
            language:  tempExLanguage
            },
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => {
            
            testCaseList.forEach(x => setTestCase(x, res.data.id))
            let path = '/profile/ChallengeModify/'+challengeId;
            navigate(path)

            

        }).catch(err => {
            console.log(tempExLanguage)
            console.log(sourceCode)
            console.log(err);
            alert("Something went wrong")
        })
    }

    /*Function that adds a test case in the "testCaseList" state variable (called when "Add test case button" is clicked) */
    const pushTestCase = () =>{
        var testCase = {"input": tempInput, "output": tempOutput, "visible":checked};
        let newList = [...testCaseList];
        newList.push(testCase);
        setTestCaseList(newList);
        clearTestCaseForm();
    }
 
    const removeTestCase = async(id) => {  
        let new_l = testCaseList;
        setTestCaseList( new_l.filter((x,index)=>index !==id) );
    };

    /* Function that clears test case fileds after a new one is added to the list */
    const clearTestCaseForm = ()=>{
        setTempInput("");
        setTempOutput("");
    }

    // Function that handles the hidden checkbox in the test case form (set if the current test case will be hidden)
    const handleChange = () => {     
        setChecked(!checked); 
    }; 

    return (
        <div>
            <div className="container-fluid p-3 my-3">
                                
            <div className="d-sm-flex align-items-center justify-content-between mb-4">      
                <small className="d-block text-end mt-3 "> 
                <NavigationButton dir={`/profile/ChallengeModify/${challengeId}`} text="< Challenge creation"></NavigationButton>
                </small>                     
                <h1 className="m-0 font-weight-bold text-primary">Exercise Creation</h1>                   
            </div>
                    
            <div className="card shadow mb-4">
                 <div className="card-body">
            
                <form className="m-1 row mb-4">
                <fieldset>
                    <legend>Exercise Information</legend>
                    <div className="form-group col-12">
                        <div className="row mt-2 mb-2" >
                            <label htmlFor="title">Title</label>
                            <input type="text" value={tempExTitle} onChange={(e)=>{setTempExTitle(e.target.value)}} className="form-control" id="title" placeholder="Exercise title"></input>
                        </div>
                        <label className="mt-2">Description:</label>
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            wrapperClassName="wrapper-class"
                            editorClassName="editor-class"
                            toolbarClassName="toolbar-class"
                            toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                            }}
                        />
                        
                        <div className="row mt-2 mb-2">
                            <label className="mt-2">Languages:</label>
                            <label><input  type="radio" id="java" name="lan" onChange={handleLangToggle}/>Java</label>
                            <label><input type="radio" id="python" name="lan" onChange={handleLangToggle}/>Python</label>
                            <label><input type="radio" id="c" name="lan" onChange={handleLangToggle}/>C</label>
                            <label><input type="radio" id="cpp" name="lan" onChange={handleLangToggle}/>C++</label>
                            <label><input type="radio" id="javascript" name="lan" onChange={handleLangToggle}/>Javascript</label>
                        </div>
                        </div>
                        </fieldset>
                    </form>

                        <form className="m-1 row mb-4 ">
                        <fieldset>
                        <legend>Source Code</legend>
                        <AceEditor
                            value={sourceCode}
                            style={{ width: "100%", height: "50vh" }}
                            name="ace"
                            mode={tempExLanguage=="c"||tempExLanguage=="cpp"?"c_cpp":tempExLanguage}
                            theme="textmate"
                            onLoad={() => {}}
                            onChange={(e) => setSourceCode(e)}
                            fontSize={14}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            setOptions={{
                                showLineNumbers: true,
                                tabSize: 4,
                            }}/>
            
                            </fieldset>
                            
                        </form>
                        
                    <div className="card shadow mb-4">
                        <div className="card-body">
                            <form className=" row mb-4 border-bottom border-secondary">
                            <fieldset>
                            <legend>Test Cases</legend>
                                <div className="form-group col-12">
                                <ul>
                                        {
                                            testCaseList.map(((test,index)=>{
                                            return <div>
                                                <label htmlFor="title"> {test.visible? 'not hidden' : 'hidden'} </label>
                                                <TestCaseListItem id={index} key={index} input={test.input} output={test.output} delete={removeTestCase}></TestCaseListItem>
                                            </div>}))
                                        }
                                    </ul>
                                
                                
                                    <label htmlFor="input">Test input: </label>
                                    <textarea id="input" className="form-control" rows="3" value={tempInput} onChange={(e)=>{setTempInput(e.target.value)}} placeholder="Input" ></textarea>
                                
                                    <label htmlFor="output">Expected output: </label>
                                    <textarea id="output" className="form-control" rows="3" value={tempOutput} onChange={(e)=>{setTempOutput(e.target.value)}} placeholder="Output" ></textarea>
                                    <div></div>
                                    <label htmlFor="hidden">Hidden: </label> {'    '}
                                    <input id="hidden" type="checkbox" onChange={handleChange}/>
                                    <div></div>
                                    <Button  onClick={(e)=>{e.preventDefault();pushTestCase();}}>Add test case</Button>
                                    </div>
                                </fieldset>
                            </form>
                    </div>
                    </div>

                    <form className="mb-4 ml-1">
                        <button type="button" className="btn btn-secondary" onClick={()=>{saveExercise() }}>Add Exercise</button>
                    </form>
                    
                    </div>
                </div>
                    
            </div>

        </div>
    );
}

export default ExerciseCreation;