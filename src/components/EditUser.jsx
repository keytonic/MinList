


import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { googleLogout } from '@react-oauth/google';
import { getDoc, doc,deleteDoc,updateDoc} from "firebase/firestore";
import {db} from "../Firebase"
import bcrypt from 'bcryptjs'
import '../index.css'; 

export default function EditUser(props) 
{
    const [state, setState] = useState({
        userid: localStorage.getItem("userid"),
        username: "",
        email: "",
        new: "",
        confirm: "",
        showReset: false
    });

    const navigate = useNavigate();


    function logOut()
    {
        document.body.style.overflowY = "unset";
        googleLogout();
        localStorage.clear();
        props.handler({loggedIn: false});
        navigate('/home');
        return;
    }


    useEffect(() => {

        if (state.userid != null && props.open != false)
        {
            //console.log("test");

            try
            {
                const fetchData = async () => 
                {
                    await getDoc(doc(db, 'users', state.userid)).then((snap) => 
                    {
                        if (snap.exists()) 
                        {
                            setState(previousState => { return { ...previousState, username: snap.data().username, email: snap.data().email }});
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
        
    },[props.open]);

    function handleChange(event)
    {
        document.getElementById("reset-output").innerText = "";
        
        if(event.target.id == "user-modal-username-text")
        {
            setState(previousState => { return { ...previousState, username: event.target.value }});
        }
        else if(event.target.id == "user-modal-email-text")
        {
            setState(previousState => { return { ...previousState, email: event.target.value }});
        }
        else if(event.target.id == "user-modal-new-text")
        {
            setState(previousState => { return { ...previousState, new: event.target.value }});
        }
        else if(event.target.id == "user-modal-confirm-text")
        {
            setState(previousState => { return { ...previousState, confirm: event.target.value }});
        }
    }

    function handleClick2(event)
    {
        if
        (
            event.target.id == "task-modal-wrapper" 
        )
        {
            props.handler({editUserOpen:false});
            setState(previousState => { return { ...previousState, new: "", confirm: "", showReset: false }});
            return;
        }
    }

    function handleClick(event)
    {
        if
        (
            event.target.id == "modal-close" || 
            event.target.id == "modal-close-icon" || 
            event.target.id == "modal-close-path"
        )
        {
            props.handler({editUserOpen:false});
            setState(previousState => { return { ...previousState, new: "", confirm: "", showReset: false }});
            return;
        }
        else if(event.target.id == "modal-save-button")
        {
            try
            {
                if(state.email.length < 5 )
                {
                    document.getElementById("reset-output").innerText = "Enter a valid email.";
                    return;
                }
                else if(state.username.length < 2 )
                {
                    document.getElementById("reset-output").innerText = "Username too short.";
                    return;
                }
                else if(state.new != "" && state.new.length < 2 || state.confirm != "" && state.confirm.length < 2)
                {
                    document.getElementById("reset-output").innerText = "New password is too short.";
                    return;
                }
                else if((state.new != "" && state.confirm != "" && state.confirm !== state.new) || state.confirm !== state.new)
                {
                    document.getElementById("reset-output").innerText = "Passwords do not match.";
                    return;
                }
                else if(state.new != "" && state.confirm != "" && state.confirm === state.new)
                {
                    const salt = bcrypt.genSaltSync(10);

                    const fetchData = async () => 
                    {
                        await updateDoc(doc(db, "users", state.userid), 
                        { 
                            password: bcrypt.hashSync(state.new, salt),
                            username: state.username,
                            email: state.email,
                            last: new Date()
                        }).then(() => 
                        {
                            setState(previousState => { return { ...previousState, new: "", confirm: "", showReset: false }});
                            logOut();
                            return;
                        });
                    };
                    fetchData();
                }
                else
                {
                    const fetchData = async () => 
                    {
                        await updateDoc(doc(db, "users", state.userid), 
                        { 
                            username: state.username,
                            email: state.email,
                            last: new Date()
                        }).then(() => 
                        {
                            setState(previousState => { return { ...previousState, new: "", confirm: "", showReset: false }});
                        });
                    };
                    fetchData();
                }
            } 
            catch (err) 
            {
                console.log(err);
            }

            props.handler({editUserOpen:false});
            return;
        }
        else if(event.target.id == "modal-delete-button")
        {
            let text = "Do you really want to delete your account?";

            if (confirm(text) == true) 
            {
                try
                {
                    const fetchData = async () => 
                    {
                        await deleteDoc(doc(db, "users", state.userid)).then(() => 
                        {
                            logOut();
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
            return;
        }
        else if (event.target.id == "pass-reset-right" || event.target.id == "icon-reset" || event.target.id == "path-reset" )
        {
            document.getElementById("reset-output").innerText = "";
            setState(previousState => { return { ...previousState, showReset: !state.showReset, new: "", confirm: "" }});
            return;
        }
        else if (event.target.id == "eye-new-outer" || event.target.id == "reset-eye-new" || event.target.id == "new-path")
        {
            let eyeNew = document.getElementById("user-modal-new-text");
           
            

            if(eyeNew.type == "password")
            {
                eyeNew.type = "text";
                return;
            }
            else
            {
                eyeNew.type = "password";
                return;
            }
            
           return;
        }
        else if(event.target.id == "eye-confirm-outer" || event.target.id == "reset-eye-confirm" || event.target.id == "new-path2")
        {
            let eyeConfirm = document.getElementById("user-modal-confirm-text");

            if(eyeConfirm.type == "password")
            {
                eyeConfirm.type = "text";
                
                return;
            }
            else
            {
                eyeConfirm.type = "password";
                return;
            }

            return;
        }
        return;
    }



    if(props.open == false) return (<></>);


    return (
        <>
            <div className="modal-wrapper" id="task-modal-wrapper" onClick={handleClick2}>
                <div className="modal-window">
                    <div className="modal-header">
                        <div className="modal-nav"></div>
                        <div className="modal-title">Edit Account</div>
                        <div className="modal-nav" id="modal-close" onClick={handleClick}>
                            <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body">


                        <div className="option-row task-row">
                            <span  id="user-modal-username" className="modal-title-cell">Name:</span>
                            <input id="user-modal-username-text" type="text" value={state.username} onChange={handleChange}/>
                        </div>

                        <div className="option-row task-row">
                            <span  id="user-modal-email" className="modal-title-cell">Email:</span>
                            <input id="user-modal-email-text" type="text" value={state.email} onChange={handleChange}/>
                        </div>

                        <div className="option-row task-row reset-row">
                            <div id="pass-reset-left">
                                <span id="user-modal-reset" className="modal-title-cell">Reset password:</span>
                            </div>
                            <div id="pass-reset-right" onClick={handleClick}>
                                <svg id="icon-reset" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">

                                    { state.showReset !== true && 
                                        <path id="path-reset" fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                                    }

                                    { state.showReset === true && 
                                        <path id="path-reset" fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                                    }

                                    </svg>
                            </div>
                        </div>

                        { 
                            state.showReset === true && 

                            <form id="reset-form">
                                <div className="option-row task-row">
                                    <span  id="user-modal-new" className="modal-title-cell">New:</span>
                                    <input id="user-modal-new-text" type="password" value={state.new} onChange={handleChange} autoComplete={String(Math.random()).slice(2)}/>
                                    <div id="eye-new-outer" onClick={handleClick}> 
                                        <svg  className="reset-eye" id="reset-eye-new" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                                            <path id="new-path" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                            <path id="new-path" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="option-row task-row">
                                    <span  id="user-modal-confirm" className="modal-title-cell">Confirm:</span>
                                    <input id="user-modal-confirm-text" type="password" value={state.confirm} onChange={handleChange} autoComplete={String(Math.random()).slice(2)}/>
                                    <div id="eye-confirm-outer" onClick={handleClick}> 
                                        <svg  className="reset-eye" id="reset-eye-confirm" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                                            <path id="new-path2" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                            <path id="new-path2" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                        </svg>
                                    </div>
                                </div>
                                
                            </form>
                        }

                        <div id="reset-output"></div>

                    </div>
                    <div className="modal-footer" >
                        <button type="button" id="modal-delete-button" onClick={handleClick} style={{ margin: "0", marginBottom: "15px"}} >Delete</button>
                        <button type="button" id="modal-save-button"  onClick={handleClick} style={{ margin: "0", marginBottom: "15px"}} >Save</button>
                    </div>
                </div>
            </div>
        </>
    );
}

