import React, {useState} from 'react'

import CodeEditor from '../Components/Editor/CodeEditor';


function ExerciseCreation (){

    const [tempExTitle, setTempExTitle] = useState('');
    const [tempExDescription, setTempExDescription] = useState('');
    const [tempExLanguages, setTempExLanguages] = useState([]);
    const [whitelist, setWhitelist] = useState('');
    const [blacklist, setBlacklist] = useState('');
    
    /* Function that handles language selection for an exercise (event handler for onChange event in the language checkbox) */
    const handleLangToggle = (e) =>{
        if(e.target.checked){
            if(!tempExLanguages.includes(e.target.id, 0)){
                let newList = tempExLanguages; 
                newList.push(e.target.id);
                setTempExLanguages(newList);
            }
        }
        else{
            let newList = tempExLanguages;
            let list = newList.filter((elem)=>{return elem!=e.target.id});
            setTempExLanguages(list);
        }
        
    }

    return (
        <div>
                <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Exercise information</h6>
                        </div>

                        <div className="card-body">
                            <form className="m-1 row ">
                                <div className="form-group col-12">
                                    <div className="row mt-2">
                                        <label htmlFor="title">Title</label>
                                        <input type="text" value={tempExTitle} onChange={(e)=>{setTempExTitle(e.target.value)}} className="form-control" id="title" placeholder="Exercise title"></input>
                                    </div>
                                    
                                    <div className="row mt-2">
                                        <label htmlFor="description">Description</label>
                                        <input type="text" value={tempExDescription} onChange={(e)=>{setTempExDescription(e.target.value)}} className="form-control" id="description" placeholder="Exercise description"></input>
                                    </div>
                                    
                                    <div className="row">
                                        <label className="mt-2">Languages</label>
                                        <label><input  type="checkbox" id="java" name="java" onChange={handleLangToggle}/>Java</label>
                                        <label><input type="checkbox" id="python" name="python" onChange={handleLangToggle}/>Python</label>
                                        <label><input type="checkbox" id="c" name="c" onChange={handleLangToggle}/>C</label>
                                        <label><input type="checkbox" id="c#" name="c#" onChange={handleLangToggle}/>C#</label>
                                        <label><input type="checkbox" id="c++" name="c++" onChange={handleLangToggle}/>C++</label>
                                        <label><input type="checkbox" id="html" name="html" onChange={handleLangToggle}/> HTML</label>
                                        <label><input type="checkbox" id="css" name="css" onChange={handleLangToggle}/>Css</label>
                                        <label><input type="checkbox" id="markdown" name="markdown" onChange={handleLangToggle}/>Markdown</label>
                                    </div>
                                </div>
                            </form> 
                        </div>
                    </div>


                    <div className="card shadow mb-4">
                    <div className="card-body">
                        <label className="mb-0">Source code</label>
                        <CodeEditor></CodeEditor>
                    </div>
                    
                    <form className="m-1 row ">
                        <div className="form-group col-12">
                            <div className="row mt-2">
                                <label htmlFor="title">Blacklist methods</label>
                                <input type="text" value={blacklist} onChange={(e)=>{setBlacklist(e.target.value)}} className="form-control" id="title" placeholder="Blacklisted methods' names"></input>
                            </div>
                            
                            <div className="row mt-2">
                                <label htmlFor="description">Whitelist methods</label>
                                <input type="text" value={whitelist} onChange={(e)=>{setWhitelist(e.target.value)}} className="form-control" id="description" placeholder="Whitelisted methods' names"></input>
                            </div>
                        </div>
                    </form>

                </div>  

        </div>
    );
}

export default ExerciseCreation;