import React from 'react'


function EditExercise (props){

    return (<div>
          <form className="m-1 row ">
            <fieldset className="form-group col-12">
                <div className="row mt-2">
                    <label htmlFor="title">Title</label>
                    <input type="text" value={props.exTitle} onChange={props.setExTitle} className="form-control" id="title" placeholder="Exercise title"></input>
                </div>
                
                <div className="row mt-2">
                    <label htmlFor="description">Description</label>
                    <input type="text" value={props.exDescription} onChange={(e)=>{props.setExDescription(e.target.value)}} className="form-control" id="description" placeholder="Exercise description"></input>
                </div>
                
                <div className="row">
                    <label className="mt-2">Languages</label>
                    <label><input  type="checkbox" id="java" name="java" onChange={props.handleLangToggle}/>Java</label>
                    <label><input type="checkbox" id="python" name="python" onChange={props.handleLangToggle}/>Python</label>
                    <label><input type="checkbox" id="c" name="c" onChange={props.handleLangToggle}/>C</label>
                    <label><input type="checkbox" id="c#" name="c#" onChange={props.handleLangToggle}/>C#</label>
                    <label><input type="checkbox" id="c++" name="c++" onChange={props.handleLangToggle}/>C++</label>
                    <label><input type="checkbox" id="html" name="html" onChange={props.handleLangToggle}/> HTML</label>
                    <label><input type="checkbox" id="css" name="css" onChange={props.handleLangToggle}/>Css</label>
                    <label><input type="checkbox" id="markdown" name="markdown" onChange={props.handleLangToggle}/>Markdown</label>
                </div>
            </fieldset>
          </form>
    </div>);
}

export default EditExercise;