import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import {db} from "../Firebase"
import '../index.css'; 

export default function Input(props) 
{
    const [state, setState] = useState({
        inputValue: ""
    });

    useEffect(() => {
        console.log("Input render");
    });

    function handleClick(event)
    {
        if(
            event.target.id == "input-left" || 
            event.target.id == "add-todo-icon" || 
            event.target.id == "add-todo-icon-path" || 
            event.target.id == "add-todo-input"
        )
        {
            if(state.inputValue == "") return;

            try
            {
                const fetchData = async () => 
                {
                    const userid = localStorage.getItem("userid");
    
                    if(userid == null) return;

                    await addDoc(collection(db, "tasks"), 
                    { 
                        checked: "false", 
                        list: props.list, 
                        text: state.inputValue, 
                        userid: userid,
                        details: "",
                        created: new Date()
                    }).then(() => {
                        setState(previousState => { return { ...previousState, inputValue: "" }});
                        props.handler({reRender: true});
                    });
                };
                fetchData();
            } 
            catch (err) 
            {
                console.log(err);
            } 
        }
    }

    function handleChange(event)
    {
        setState(previousState => { return { ...previousState, inputValue: event.target.value }});
    }

    function handleKeyDown(event)
    {
        if (event.key === "Enter") 
        {
            handleClick(event);
        }
    }

    return (
        <div id="input-wrapper">
            <div id="input-left" onClick={handleClick}>
                <svg id="add-todo-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                    <path id="add-todo-icon-path" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"></path>
                </svg>
            </div>
            <div id="input-right">
                <input id="add-todo-input" placeholder="Add a to-do..." type="text" onChange={handleChange} value={state.inputValue} onKeyDown={handleKeyDown} autoComplete={String(Math.random()).slice(2)}/>
            </div>
        </div>
    );
}