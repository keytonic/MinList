import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { getDoc, doc,deleteDoc,updateDoc,query,collection,where,getDocs} from "firebase/firestore";
import { signOut , deleteUser, updateProfile, updatePassword, updateEmail, reauthenticateWithPopup, EmailAuthProvider, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";
import {db,auth} from "../Firebase"

import OptionCard from './OptionCard';
import About from './About';
import EditUser from './EditUser';
import '../index.css'; 

export default function MenuOptions(props) 
{
    const [state, setState] = useState({
        aboutOpen: false,
        editUserOpen: false,
        background: localStorage.getItem("background") == null ? "" : localStorage.getItem("background")
    });

    const navigate = useNavigate();

    useEffect(() => 
    {
        handlePosition();
    });

    useEffect(() => 
    {
        window.addEventListener('resize', handlePosition);
    },[]);

    useEffect(() => 
    {
        let modalWrapper = document.getElementsByClassName("modal-wrapper")[0];

        if(modalWrapper != null)
        {
            modalWrapper.style.visibility = "visible";
            modalWrapper.style.opacity = "1";
        }

    }, [state.aboutOpen,state.editUserOpen]);

    function logOut()
    {
        signOut(auth).then(() => 
        {

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

    function presentAddToHome() 
    {
        props.install.prompt();  

        props.install.userChoice.then(choice => 
        {
            if (choice.outcome === 'accepted') 
            {
                //console.log('User accepted');
            } 
            else 
            {
                //console.log('User dismissed');
                
            }

            document.getElementById("option-card-install").style.display = "none";
        });
    }

    function handleState(args)
    {
        if (args.hasOwnProperty("showAll")) 
        {
            props.handler({showAll:args.showAll});
        }
        else if (args.hasOwnProperty("aboutOpen")) 
        {
            setState(previousState => { return { ...previousState, aboutOpen: !state.aboutOpen }});
        }
        else if (args.hasOwnProperty("editUserOpen")) 
        {
            setState(previousState => { return { ...previousState, editUserOpen: !state.editUserOpen }});
        }
        else if (args.hasOwnProperty("loggedIn")) 
        {
            props.handler({loggedIn: props.loggedIn});
        }
    }

    function handlePosition()
    {
        const headerWrapper = document.getElementById("header-wrapper");

        if(headerWrapper == null) return;
        
        const rec = document.getElementById("header-wrapper").getBoundingClientRect();

        if(rec == null) return;

        const menu = document.getElementById("menu-options-wrapper");

        if(menu == null) return;
        
        menu.style.right = rec.left + "px";

        if(rec.width < 400) 
        {
            menu.style.width = rec.width + "px";
        }
        else
        {
            menu.style.width = "75%";
        }
    }

    function handleClick2(event)
    {
        if
        (
            event.target.id == "menu-outer"
        )
        {
            document.body.style.overflowY = "unset";
            props.handler({menuOptionsOpen:false});
        }
    }

    function handleClick(event)
    {
        if
        (
            event.target.id == "menu-options-header-right" || 
            event.target.id == "options-menu-close" || 
            event.target.id == "options-menu-close-path"
        )
        {
            document.body.style.overflowY = "unset";
            props.handler({menuOptionsOpen:false});
            
        }
        else if(event.target.id == "menu-options-header-left" || event.target.id == "about-icon" || event.target.id == "about-path")
        {
            setState(previousState => { return { ...previousState, aboutOpen:true}});
        }
        else if(event.target.id == "button-edit")
        {
            setState(previousState => { return { ...previousState, editUserOpen:true}});
        }
        else if(event.target.id == "button-logout")
        {
            logOut();
        }
        else if(event.target.id == "button-delete")
        {
            let type = localStorage.getItem("type");
            
            if(type == "google" || type == "facebook")
            {
                let text = "Do you really want to delete your account?";
                
                if (confirm(text) == true) 
                {
                    let provider = null;

                    if(type == "google")
                    {
                        provider = new GoogleAuthProvider();
                    }
                    else if(type == "facebook")
                    {
                        provider = new FacebookAuthProvider();
                    }
                    
                    reauthenticateWithPopup(auth.currentUser, provider).then(async () => 
                    {
                        let userid = localStorage.getItem("userid");

                        //before we delete the user we need to delete all thier tasks 
                        await getDocs(query(collection(db, "tasks"), where("userid", "==", userid))).then((snap) => 
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

                        await deleteDoc(doc(db, "users", userid)).then(() => 
                        {
                            deleteUser(auth.currentUser);
                            logOut();
                            return;
                        });

                    }).catch((error) =>
                    {
                        console.log(error.code.split("/")[1]);
                    });
                } 
                return;
            }
        }
    }

    function handleChange(event)
    {
        if(event.target.id == "background-select")
        {
            setState(previousState => { return { ...previousState, background: event.target.value }});
            localStorage.setItem("background",event.target.value);
            props.handler({background: event.target.value});
        }

    }

    if(props.open == false) return(<></>);

    let dsp = props.install == null ? "none" : "flex";

    return (
        <>
            <div id="menu-outer" onClick={handleClick2}>
                <div id="menu-options-wrapper">
                    <div id="menu-options-header">
                        <div id="menu-options-header-left" onClick={handleClick}>
                            <svg id="about-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="about-path" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"></path>
                            </svg>
                        </div>
                        <div id="menu-options-header-center">Options</div>
                        <div id="menu-options-header-right" onClick={handleClick}>
                            <svg id="options-menu-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="options-menu-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
                            </svg>
                        </div>
                    </div>

                    <OptionCard name="showAll" text="Show completed to-dos" handler={handleState} />

                    <div id="option-card" className="option-card">
                        <div id="option-card-right">Choose a background</div>
                        <div id="option-button-right">
                            <select id="background-select" value={state.background} onChange={handleChange}>
                                <option value=""></option>
                                <option value="3px-tile">3px-tile</option>
                                <option value="argyle">argyle</option>
                                <option value="black-orchid">black-orchid</option>
                                <option value="brick-wall-dark">brick-wall-dark</option>
                                <option value="classy-fabric">classy-fabric</option>
                                <option value="dark-mosaic">dark-mosaic</option>
                                <option value="diagmonds">diagmonds</option>
                                <option value="my-little-plaid-dark">my-little-plaid-dark</option>
                                <option value="purty-wood">purty-wood</option>
                                <option value="real-carbon-fibre">real-carbon-fibre</option>
                                <option value="shattered-dark">shattered-dark</option>
                                <option value="shley-tree-2">shley-tree-2</option>
                                <option value="type">type</option>
                            </select>
                        </div>
                    </div>

                    <div id="option-card-install" className="option-card" style={{display: dsp}}>
                        <div id="option-card-right">Install MinList on your device</div>
                        <div id="option-button-right">
                            <button id="installButton" type="button" onClick={presentAddToHome}>Install</button>
                        </div>
                    </div>

                    { localStorage.getItem("type") !== null && 
                    <div id="option-card" className="option-card">
                        <div id="option-card-right">Delete your account</div>
                        <div id="option-button-right">
                            <button id="button-delete" type="button" onClick={handleClick} style={{}}>Delete</button>
                        </div>
                    </div>
                    }

                    { localStorage.getItem("type") === null && 
                    <div id="option-card" className="option-card">
                        <div id="option-card-right">Edit your account</div>
                        <div id="option-button-right">
                            <button id="button-edit" type="button" onClick={handleClick} style={{}}>Edit</button>
                        </div>
                    </div>
                    }

                    <div id="option-card" className="option-card">
                        <div id="option-card-right">End the current session and exit</div>
                        <div id="option-button-right">
                            <button id="button-logout" type="button" onClick={handleClick} style={{}}>Logout</button>
                        </div>
                    </div>

                </div>
            </div>
            <About open={state.aboutOpen} handler={handleState} />
            <EditUser open={state.editUserOpen} handler={handleState} />
        </>
    );
}