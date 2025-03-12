import React, { useState, useEffect } from "react";
import { getDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import {db} from "../Firebase"
import '../index.css'; 

export default function EditTodo(props) 
{
    const [state, setState] = useState({
        title: "",
        list: "",
        details: "",
    });

    useEffect(() => {
        console.log("EditTodo render");
    });

    useEffect(() => 
    {
        if(props.todoid != "")
        {
            try
            {
                const fetchData = async () => 
                {
                    await getDoc(doc(db, 'tasks', props.todoid)).then((snap) => 
                    {
                        if (snap.exists()) 
                        {
                            setState(previousState => { return { 
                                ...previousState, 
                                title: snap.data().text, 
                                list: snap.data().list,
                                details: snap.data().details
                            }});
                        }
                    });
                };
                fetchData();
            }
            catch (err) 
            {
                console.log(err);
            } 
        }
    },[props.todoid]);

    function handleChange(event)
    {
        if(event.target.id == "task-modal-title-text")
        {
            setState(previousState => { return { ...previousState, title: event.target.value }});
        }
        else if(event.target.id == "task-modal-list-text")
        {
            setState(previousState => { return { ...previousState, list: event.target.value }});
        }
        else if(event.target.id == "task-modal-details-text")
        {
            setState(previousState => { return { ...previousState, details: event.target.value }});
        }
    }

    function handleClick(event)
    {
        if
        (
            event.target.id == "modal-close" || 
            event.target.id == "modal-close-icon" || 
            event.target.id == "modal-close-path" ||
            event.target.id == "task-modal-wrapper"
        )
        {
            setState(previousState => { return { ...previousState, title: "", list: "", details: "" }});
            props.handler({editTodoId: ""});
            return;
        }
        else if(event.target.id == "modal-delete-button")
        {
            try
            {
                const fetchData = async () => 
                {
                    await deleteDoc(doc(db, "tasks", props.todoid)).then(() => 
                    {
                        setState(previousState => { return { ...previousState, title: "", list: "", details: "" }});
                        props.handler({editTodoId: "", reRender: true});
                        return;
                    });
                };
                fetchData();
            } 
            catch (err) 
            {
                console.log(err);
            } 
        }
        else if(event.target.id == "modal-save-button")
        {
            try
            {
                const fetchData = async () => 
                {
                    await updateDoc(doc(db, "tasks", props.todoid), 
                    { 
                        text: state.title,
                        list: state.list,
                        details: state.details
                    }).then(() => 
                    {
                        setState(previousState => { return { ...previousState, title: "", list: "", details: "" }});
                        props.handler({editTodoId: "", reRender: true});
                        return;
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

    function GetOptions(args)
    {
        if(props.lists.empty === true) return (<></>);

        const options = [];

        props.lists.forEach((list) => 
        {
            options.push(<option key={Math.random()} value={list}>{list}</option>);
        });
        
        return (options);
    }

    if(props.todoid == "") return(<></>);


    return (
        <>
            <div className="modal-wrapper" id="task-modal-wrapper" onClick={handleClick}>
                <div className="modal-window">
                    <div className="modal-header">
                        <div className="modal-nav"></div>
                        <div className="modal-title">Edit To-do</div>
                        <div className="modal-nav" id="modal-close" onClick={handleClick}>
                            <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="option-row task-row">
                            <span  id="task-modal-title" className="modal-title-cell">Title:</span>
                            <input id="task-modal-title-text" type="text" value={state.title} onChange={handleChange}/>
                        </div>
                        <div className="option-row task-row">
                            <span  id="task-modal-list" className="modal-title-cell">List:</span>
                            <select id="task-modal-list-text" value={state.list} onChange={handleChange}>
                                <GetOptions />
                            </select>
                        </div>
                        <div className="option-row task-row task-row-custom">
                            <span  id="task-modal-details" className="modal-title-cell">Details:</span>
                            <textarea id="task-modal-details-text" className="details-text-custom" rows="4" cols="50" value={state.details} onChange={handleChange}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="modal-delete-button" onClick={handleClick}>Delete</button>
                        <button type="button" id="modal-save-button" onClick={handleClick}>Save</button>
                    </div>
                </div>
            </div>
        </>
    );
}