import { useState } from 'react'
import { Routes, Route, MemoryRouter } from "react-router-dom";

import Body from './components/Body'; 
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

import './index.css'

export default function App() {
    const [state, setState] = useState({
        loggedIn: localStorage.getItem("userid") == null ? false : true
    });

    function handleState(props)
    {
        if (props.hasOwnProperty("loggedIn")) 
        {
            setState(previousState => { return { ...previousState, loggedIn: props.loggedIn }});
        }
    }

    return (
        <>
            <MemoryRouter >
                <Routes>
                    <Route path="/"         element={ state.loggedIn == true ? <Body handler={handleState} /> : <Home handler={handleState} /> } />
                    <Route path="/home"     element={ state.loggedIn == true ? <Body handler={handleState} /> : <Home handler={handleState} /> } />
                    <Route path="/login"    element={ state.loggedIn == true ? <Body handler={handleState} /> : <Login handler={handleState} /> } />
                    <Route path="/register" element={ state.loggedIn == true ? <Body handler={handleState} /> : <Register handler={handleState} /> } />
                    <Route path="*"         element={ state.loggedIn == true ? <Body handler={handleState} /> : <Home handler={handleState} /> } />
                </Routes>
            </MemoryRouter>
        </>
    )
}