import React, { useState } from "react";
import { updateDoc,doc } from "firebase/firestore";
import {db} from "../Firebase"
import '../index.css'; 

export default function TodoCard(props) 
{
    const [state, setState] = useState({
        checked: props.checked
    });

    function handleClick(event)
    {
        if(event.target.id == "todo-card-left" || event.target.id == "check-todo-icon" || event.target.id == "check-todo-icon-path")
        {
            let checked = state.checked == "true" ? "false" : "true";

            try
            {
                const fetchData = async () => 
                {
                    setState(previousState => { return { ...previousState, checked: checked }});
                    await updateDoc(doc(db, "tasks", props.id), { checked: checked });

                    if(checked == "true" && props.showall == "false")
                    {
                        const storedObjectString = localStorage.getItem("counts");
                        const storedObject = JSON.parse(storedObjectString);
                        storedObject[props.list] = storedObject[props.list] - 1;
                        localStorage.setItem("counts", JSON.stringify(storedObject));
                    }
                };
                fetchData();
            } 
            catch (err) 
            {
                console.log(err);
            }
        }
        else if(event.target.id == "todo-card-right" || event.target.id == "edit-todo-icon" || event.target.id == "edit-todo-icon-path")
        {
            props.handler({editTodoId: props.id});
        }
    }

    if(props.showall == "false" && state.checked == "true") return(<></>);

    let disp = state.checked == "true" ? "unset" : "none";

    return (
        <div className="todo-card">
            <div id="todo-card-left" onClick={handleClick}>
                <svg id="check-todo-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                    <path id="check-todo-icon-path" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                    <path style={{ display: disp}} id="check-todo-icon-path" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                </svg>
            </div>
            <div id="todo-card-center">
                {props.text}
            </div>
            <div id="todo-card-right" onClick={handleClick}>
                <svg id="edit-todo-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                    <path id="edit-todo-icon-path" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path>
                </svg>
            </div>
        </div>
    );
}