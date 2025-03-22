import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import { getDoc, doc,deleteDoc,updateDoc,query,collection,where,getDocs} from "firebase/firestore";
import { signOut , deleteUser, updateProfile, updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {db,auth} from "../Firebase"
import '../index.css'; 

export default function EditUser(props) 
{
    const [state, setState] = useState({
        userid: localStorage.getItem("userid"),
        username: "",
        oldUsername: "",
        email: "",
        oldEmail: "",
        new: "",
        confirm: "",
        showReset: false
    });

    const navigate = useNavigate();

    function logOut()
    {
        signOut(auth).then(() => 
        {
            // Sign-out successful.
        }).catch((error) => 
        {
            console.log(error.code,",",error.message);
        });

        document.body.style.overflowY = "unset";
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
                            setState(previousState => { return { ...previousState, username: snap.data().username, oldUsername: snap.data().username, email: snap.data().email, oldEmail: snap.data().email }});
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
            if(event.target.value != "") 
                document.getElementById("reset-eye-new").style.display = "block";
            else
                document.getElementById("reset-eye-new").style.display = "none";
            setState(previousState => { return { ...previousState, new: event.target.value }});
        }
        else if(event.target.id == "user-modal-confirm-text")
        {
            if(event.target.value != "") 
                document.getElementById("reset-eye-confirm").style.display = "block";
            else
                document.getElementById("reset-eye-confirm").style.display = "none";
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

    async function handleClick(event)
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
            if
            (
                state.email === state.oldEmail &&
                state.username === state.oldUsername &&
                state.new === "" &&
                state.confirm === ""
            )
            {
                props.handler({editUserOpen:false});
                return;
            }

            const user = auth.currentUser;
            const currentPassword = prompt("Enter password to continue.");
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            await reauthenticateWithCredential(user, credential).then(async () => 
            {
                if(state.oldUsername !== state.username)
                {
                    if(state.username.length > 1)
                    {
                        await updateProfile(user, {displayName: state.username}).catch((error) =>
                        {
                            document.getElementById("reset-output").innerText += (" " + error.code.split("/")[1]);
                        });
                    }
                    else
                    {
                        document.getElementById("reset-output").innerText += " Username is too short.";
                    }
                }
                if(state.oldEmail !== state.email)
                {
                    if(state.email.length > 1)
                    {
                        await updateEmail(user, state.email).catch((error) =>
                        {
                            document.getElementById("reset-output").innerText += (" " + error.code.split("/")[1]);
                        });
                    }
                    else
                    {
                        document.getElementById("reset-output").innerText += " Invalid email.";
                    }
                }
                if(state.oldEmail !== state.email  || state.oldUsername !== state.username)
                {
                    if(document.getElementById("reset-output").innerText == "")
                    {
                        await updateDoc(doc(db, "users", state.userid), { username: state.username,email: state.email }).catch((error) =>
                        {
                            document.getElementById("reset-output").innerText += (" " + error.code.split("/")[1]);
                        });
                    }
                }
                if(state.new !== state.confirm) 
                {
                    document.getElementById("reset-output").innerText += " The passwords do not match.";
                }
                else if(state.new !== "" && state.confirm !=="") 
                {
                    await updatePassword(user, state.new).then(() =>
                    {
                        setState(previousState => { return { ...previousState, new: "", confirm: "", showReset: false }});

                    }).catch((error) =>
                    {
                        document.getElementById("reset-output").innerText += (" " + error.code.split("/")[1]);
                    });
                }
            })
            .catch((error) =>
            {
                if(error.code)
                {
                    if(error.code.includes("/") != false)
                    {
                        document.getElementById("reset-output").innerText += (" " + error.code.split("/")[1]);
                    }
                    else
                    {
                        document.getElementById("reset-output").innerText += (" " + error.code);
                    }
                }
                else
                {
                    document.getElementById("reset-output").innerText += (" " + error);
                }
            });
            if(document.getElementById("reset-output").innerText == "") 
            {
                props.handler({editUserOpen:false});
            }
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
                        //before we delete the user we need to delete all thier tasks 
                        const q = query(collection(db, "tasks"), where("userid", "==", state.userid));

                        await getDocs(q).then((snap) => 
                        {
                            //making sure they has some tasks
                            if(snap.empty === false)
                            {
                                //looping through all of the tasks 
                                snap.forEach(async (task) => 
                                {
                                    //and deleting them one by one
                                    await deleteDoc(doc(db, "tasks", task.id));
                                });
                            }
                        });

                        await deleteDoc(doc(db, "users", state.userid)).then(() => 
                        {
                            deleteUser(auth.currentUser);
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
                                <span id="user-modal-reset" className="modal-title-cell">Change password:</span>
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
                                    <div id="eye-wrapper">
                                        <input id="user-modal-new-text" type="password" value={state.new} onChange={handleChange} autoComplete={String(Math.random()).slice(2)}/>
                                        <div id="eye-new-outer" onClick={handleClick}> 
                                            <svg  className="reset-eye" id="reset-eye-new" style={{display: "none"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                                                <path id="new-path" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path id="new-path" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="option-row task-row">
                                    <span  id="user-modal-confirm" className="modal-title-cell">Confirm:</span>
                                    <div id="eye-wrapper">
                                        <input id="user-modal-confirm-text" type="password" value={state.confirm} onChange={handleChange} autoComplete={String(Math.random()).slice(2)}/>
                                        <div id="eye-confirm-outer" onClick={handleClick}> 
                                            <svg  className="reset-eye" id="reset-eye-confirm" style={{display: "none"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                                                <path id="new-path2" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                <path id="new-path2" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                            </svg>
                                        </div>
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

