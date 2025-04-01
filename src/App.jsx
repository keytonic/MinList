import { useState, useEffect } from 'react'
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"

import Body from './components/Body'; 
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import './index.css'

export default function App() {
    const [state, setState] = useState({
        loggedIn: localStorage.getItem("userid") == null ? false : true,
        install: null
    });

    useEffect(() => 
    {
        window.addEventListener('beforeinstallprompt', function (event) 
        {
            event.preventDefault();
            handleBeforeInstallPrompt(event);
        });
    }, []);

    function handleBeforeInstallPrompt(event)
    {
        setState(previousState => { return { ...previousState, install: event }});
    }

    function handleState(props)
    {
        if (props.hasOwnProperty("loggedIn")) 
        {
            setState(previousState => { return { ...previousState, loggedIn: props.loggedIn }});
        }
    }

    return (
        <>
            <GoogleOAuthProvider clientId='360679642563-6hqegrft4avr60vsqrse3pb4v6qpemdd.apps.googleusercontent.com'>
                <MemoryRouter >
                    <Routes>
                        <Route path="/"         element={ state.loggedIn == true ? <Body install={state.install} handler={handleState} /> : <Home install={state.install} handler={handleState} /> } />
                        <Route path="/home"     element={ state.loggedIn == true ? <Body install={state.install} handler={handleState} /> : <Home install={state.install} handler={handleState} /> } />
                        <Route path="/login"    element={ state.loggedIn == true ? <Body install={state.install} handler={handleState} /> : <Login install={state.install} handler={handleState} /> } />
                        <Route path="/privacy"  Component ={() => { window.location.href = './privacy.txt'; return null; }} />
                        <Route path="/register" element={ state.loggedIn == true ? <Body install={state.install} handler={handleState} /> : <Register install={state.install} handler={handleState} /> } />
                        <Route path="/tos"      Component ={() => { window.location.href = './tos.txt'; return null; }} />
                        <Route path="*"         element={ state.loggedIn == true ? <Body install={state.install} handler={handleState} /> : <Home install={state.install} handler={handleState} /> } />
                    </Routes>
                </MemoryRouter>
            </GoogleOAuthProvider>
        </>
    )
}