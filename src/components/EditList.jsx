import React, { useState, useEffect } from "react";
import { updateDoc, doc, deleteDoc, query, collection, where, getDocs} from "firebase/firestore";

import {db} from "../Firebase"
import '../index.css'; 

export default function EditList(props) 
{
    const [state, setState] = useState({
        title: "",
        oldtitle: ""
    });

    useEffect(() => {
        setState({title: props.listid, oldtitle: props.listid });
    },[props.listid]);
    
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
            setState(previousState => { return { ...previousState, title: "", oldTitle: "" }});
            props.handler({editListId: ""});
            return;
        }
        else if(event.target.id == "modal-delete-button")
        {
            let newLists = props.lists.filter(item => item !== state.title);

            if(state.title == props.currentlist)
            {
                localStorage.removeItem("list");
                props.handler({currentList: ""});
            }

            try
            {
                const fetchData = async () => 
                {
                    //before we delete the list we need to delete all tasks on the list
                    const q = query(collection(db, "tasks"), where("userid", "==", props.userid), where("list", "==", state.title));

                    await getDocs(q).then((snap) => 
                    {
                        //making sure the lists wasnt empty
                        if(snap.empty === false)
                        {
                            //looping through all of the tasks on the list 
                            snap.forEach(async (task) => 
                            {
                                //and deleting them one by one
                                await deleteDoc(doc(db, "tasks", task.id));
                            });
                        }
                    });

                    //updating the users lists with this one removed
                    await updateDoc(doc(db, "users", props.userid), { lists: newLists }).then(() => 
                    {
                        setState(previousState => { return { ...previousState, title: "", oldTitle: "" }});
                        props.handler({editListId: "", lists: newLists});
                        //remove this list from counts object in local storage
                        const storedObjectString = localStorage.getItem("counts");
                        const storedObject = JSON.parse(storedObjectString);
                        delete storedObject[state.title];
                        localStorage.setItem("counts", JSON.stringify(storedObject));
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
            if(props.lists.includes(state.title) == true)
            {
                setState(previousState => { return { ...previousState, title: "", oldTitle: "" }});
                props.handler({editListId: ""});
                return;
            }

            let newLists = props.lists;

            for (let i = 0; i < newLists.length; i++) 
            {
                if (newLists[i] === state.oldtitle) 
                {
                    newLists[i] = state.title; 
                }
            }
            
            try
            {
                const fetchData = async () => 
                {
                    await updateDoc(doc(db, "users", props.userid), { lists: newLists }).then(() => 
                    {
                        if(state.oldtitle == props.currentlist)
                        {
                            localStorage.setItem("list",state.title);
                            props.handler({currentList: state.title});
                        }
                        setState(previousState => { return { ...previousState, title: "", oldTitle: "" }});
                        props.handler({editListId: ""});
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

    function handleChange(event)
    {
        if(event.target.id == "task-modal-title-text")
        {
            setState(previousState => { return { ...previousState, title: event.target.value }});
        }
    }

    if(props.listid == "") return(<></>);

    return (
        <>
            <div className="modal-wrapper" id="task-modal-wrapper" onClick={handleClick}>
                <div className="modal-window">
                    <div className="modal-header">
                        <div className="modal-nav"></div>
                        <div className="modal-title">Edit List</div>
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