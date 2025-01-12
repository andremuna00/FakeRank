import React, {useState, useEffect, useRef } from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom';
import NavigationButton from '../Components/navigation-button';

import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';
import AceEditor from "react-ace";
import TestCaseListItem from '../Components/CreateExercise/TestCaseListItem';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


//In this page you modify a exercise
function ExerciseModify (){

    const {challengeId, exerciseId} = useParams();
    const { getAccessTokenSilently, user } = useAuth0()

    const [tempExTitle, setTempExTitle] = useState('');
    const [tempExLanguage, setTempExLanguage] = useState('');
    const [sourceCode, setSourceCode] = useState('');
    
    const [tempInput, setTempInput] = useState("");
    const [tempOutput, setTempOutput] = useState("");
    const [checked, setChecked] = useState(true); 
    const [testCaseList, setTestCaseList] = useState([]);

    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const [show, setShow] = useState(false);
    const target = useRef(null);
    const [timer, setTimer] = useState(null)
    
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
            setTempExTitle(res.data.title)
            setTempExLanguage(res.data.language)
            setSourceCode(Buffer.from(res.data.sourceCode, 'base64').toString())

            try{
                setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(res.data.description))))
            }catch{
                setEditorState(EditorState.createEmpty())
            }
            
        })
    };

      //get testcases
    const getTestCases = async() => {
 
        const token = await getAccessTokenSilently()

        axios.get(`/api/testcases/exercises/${exerciseId}`,
        {
        headers: {
            'Authorization': `Bearer ${token}`
        }
        }).then(res => {
            console.log(res.data)
            setTestCaseList(res.data)
        })
    };

    useEffect(() => {
        getExercise()
        getTestCases()
      }, []);


    //setexercise
    const setExercise = async() => {      

        if (tempExTitle == '') return alert("Please insert the title")
        if (tempExLanguage == '') return alert("Please insert a language")
        if (sourceCode == '') return alert("Please insert the source code")
        if ( !editorState.getCurrentContent().hasText()) return alert("Please insert the description")


        const token = await getAccessTokenSilently()

        const contentState = editorState.getCurrentContent()
        const json = JSON.stringify(convertToRaw(contentState))
        
        axios.patch(`/api/exercises`,
        {
            sourceCode : Buffer.from(sourceCode).toString('base64'),
            id: exerciseId,
            challenge_id : challengeId,
            title: tempExTitle,
            description: json,
            language: tempExLanguage
            },
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => {
            setShow(true);
            setTimeout(() => setShow(false),5000)
            console.log('saved')

        }).catch(err => {
            console.log(err);
            alert("Something went wrong")
        })
    };

    //new testcase
    const newTestCase = async() => {      
        const token = await getAccessTokenSilently()
        
        axios.post(`/api/testcases`,
        {
            exercise_id: exerciseId,
            input : Buffer.from(tempInput).toString('base64'),
            output: Buffer.from(tempOutput).toString('base64'),
            visible: checked,            
            },
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(res => {
            console.log('saved')
        }).catch(err => {
            console.log(err);
            alert("Please create the exercise first")
        })
    };

    /*Funzione che aggiunge/rimuove i linguaggi selezionati per l'esercizio */
    const handleLangToggle = (e) =>{
        setTempExLanguage(e.target.id)
    }

    // true: not hidden, false:hidden
    const handleChange = () => {     
        setChecked(!checked); 
      }; 

    
    /*Aggiunge un test case a TestCaseList, successivamente viene ripulito il form relativo */
    const pushTestCase = () =>{
        newTestCase()
        clearTestCaseForm();
        window.location.reload(true)
    }


    const removeTestCase = async(id) => {      
        const token = await getAccessTokenSilently()
        
        axios.delete(`/api/testcases/${id}`, 
            {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                console.log('deleted');
            })
            window.location.reload(true)
    };


    /*Ripulisce i campi del form (sezione Test Cases) dopo l'aggiunta di un test case */
    const clearTestCaseForm = ()=>{
        setTempInput("");
        setTempOutput("");
    }
    

    return (
        <div >
            <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">      
                <small className="d-block text-end mt-3 "> 
                <NavigationButton dir={`/profile/ChallengeModify/${challengeId}`} text="< Challenge creation"></NavigationButton>
                </small>                     
                <h1 className="m-0 font-weight-bold text-primary">Exercise Modify</h1>                   
            </div>
                    
                    <div className="card shadow mb-4">
                        <div className="card-body">
                            
                            <form className="m-1 row mb-4">
                            <fieldset>
                                <legend>Exercise Information</legend>
                                <div className="form-group col-12">
                                
        
                                    <div className="row mt-2 mb-2">
                                        <label htmlFor="title">Title</label>
                                        <input type="text" value={tempExTitle || ""} onChange={(e)=>{setTempExTitle(e.target.value)}} className="form-control" id="title" placeholder={tempExTitle || ""}></input>
                                    </div>
                                    
                                    
                                    {/*https://blog.logrocket.com/build-rich-text-editors-react-draft-js-react-draft-wysiwyg/*/}
                                    Description
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
                                        <label><input type="radio" id="java" name="lan" checked={tempExLanguage=="java"} onChange={handleLangToggle}/>Java</label>
                                        <label><input type="radio" id="python" name="lan" checked={tempExLanguage=="python"}  onChange={handleLangToggle}/>Python</label>
                                        <label><input type="radio" id="c" name="lan" checked={tempExLanguage=="c"}  onChange={handleLangToggle}/>C</label>
                                        <label><input type="radio" id="cpp" name="lan" checked={tempExLanguage=="cpp"}  onChange={handleLangToggle}/>C++</label>
                                        <label><input type="radio" id="javascript" name="lan" checked={tempExLanguage=="javascript"} onChange={handleLangToggle}/>Javascript</label>
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
                                        theme="textmate"
                                        mode={tempExLanguage=="c"||tempExLanguage=="cpp"?"c_cpp":tempExLanguage}
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
                                    

                <div></div>
                <div className="container-fluid p-3 my-3">
                
                    {/**test cases */}
                <div className="card shadow mb-4">    
                <div className="card-body">
                        <form className=" row mb-4 border-bottom border-secondary">
                        <fieldset>
                        <legend>Test Cases</legend>
                            <div className="form-group col-12">
                                <ul>
                                    {                                                                
                                        testCaseList.map(((test,index)=>{
                                        return <div id = {index} key={index}>
                                            <label htmlFor="title"> {test.visible? 'not hidden' : 'hidden'} </label>
                                            <TestCaseListItem id={test.id} input={Buffer.from(test.input, 'base64').toString()} output={Buffer.from(test.output, 'base64').toString()} delete={removeTestCase}></TestCaseListItem>
                                        </div>}))
                                    }
                                </ul>
                            
                            
                                <label htmlFor="input">Test input: </label>
                                <textarea id="input" className="form-control" rows="3" value={tempInput} onChange={(e)=>{setTempInput(e.target.value)}} placeholder="Input" ></textarea>
                            
                                <label htmlFor="output">Expected output: </label>
                                <textarea id="output" className="form-control" rows="3" value={tempOutput} onChange={(e)=>{setTempOutput(e.target.value)}} placeholder="Output" ></textarea>
                                    
                                <label htmlFor="hidden">Hidden: </label>
                                <input id="hidden" type="checkbox" onChange={handleChange}/>
                                <div></div>
                                <Button  onClick={(e)=>{e.preventDefault();pushTestCase();}}>Add test case</Button>
                                </div>
                            </fieldset>
                        </form>
                        </div>
                </div>
                </div>

                <div className="container-fluid">                           
                            
                        
                </div>            
            </div>

            <form className="ml-4 mb-4 ">
            <Button ref={target} onClick={() => {setExercise()}}>
                Save Exercise
            </Button>
            <Overlay target={target.current} show={show} placement="right">
                {(props) => (
                <Tooltip id="overlay-example" {...props}>
                    Exercise Saved
                </Tooltip>
                )}
            </Overlay>
                
            </form>  
        </div>

                    
           
            </div>
        </div>
    );
}

export default ExerciseModify;