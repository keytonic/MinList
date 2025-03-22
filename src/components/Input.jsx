import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import {db} from "../Firebase"
import '../index.css'; 

export default function Input(props) 
{
    const [state, setState] = useState({
        inputValue: ""
    });

    useEffect(() => 
    {
        handlePosition();
    });

    useEffect(() => 
    {
        window.addEventListener('scroll', handlePosition);
    },[]);

    function handlePosition()
    {
        const inputWrapper = document.getElementById("input-wrapper");

        if(inputWrapper == null) return;

        if(window.scrollY >= 60)
        {
            inputWrapper.style.position = "sticky";
            inputWrapper.style.top = "0px";
            inputWrapper.style.zIndex = "1";
            inputWrapper.style.width = "100%";
            inputWrapper.style.minHeight = "60px";
            inputWrapper.style.borderRadius = "0";
            inputWrapper.style.boxShadow = "0px 4px 7px 3px #00000038";
        }
        else
        {
            inputWrapper.style.position = "inherit";
            inputWrapper.style.top = "inherit";
            inputWrapper.style.zIndex = "inherit";
            inputWrapper.style.width = "calc(100% - 20px)";
            inputWrapper.style.minHeight = "50px";
            inputWrapper.style.borderRadius = "inherit";
            inputWrapper.style.boxShadow = "unset";
        }
    }

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
                    if(props.userid == null) return;

                    await addDoc(collection(db, "tasks"), 
                    { 
                        checked: "false", 
                        list: props.list, 
                        text: toSentenceCase(state.inputValue), 
                        userid: props.userid,
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

    function toSentenceCase(str) 
    {
        if (!str) return "";
        const sentence = str.toLowerCase();
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
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