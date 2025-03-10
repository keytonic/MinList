


import React, { useState, useEffect } from "react";
import '../index.css'; 


import { useRef } from 'react'
import bcrypt from 'bcryptjs'
import {db} from "../Firebase"
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { Link , useNavigate} from "react-router-dom";



export default function Register(props) 
{
    const [state, setState] = useState(0);

    useEffect(() => {
        console.log("Register render");
    });

    useEffect(() => {
        if(localStorage.getItem("accept-cookies") == null)
        {
            const alert_bar = document.getElementById("login-bar-alert");

            if(alert_bar != null)
            {
                document.getElementById("login-bar-alert").style.display = "flex";
            }
        }
    },[]);



    const navigate = useNavigate();

    const salt = bcrypt.genSaltSync(10);
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    function closeAlert(event)
    {
        const alert_bar = document.getElementById("login-bar-alert");

        if(alert_bar != null)
        {
            document.getElementById("login-bar-alert").style.display = "none";
            localStorage.setItem("accept-cookies", "true");
        }
    }

    function handleClick(event)
    {
        if(event.target.id == "login")
        {
            navigate("/login");
            return;
        }

        let target = event.target;
    
        if(target.id.indexOf("form-") == -1) return;
    
        target.setAttribute("placeholder", "");
        
        document.getElementById(target.id + "-label").style.opacity = "1";
        document.getElementById(target.id + "-label").style.top = "2px";
        document.getElementById(target.id + "-label").style.left = "3px";
    }
    
    function handleBlur(event)
    {
        let target = event.target;
    
        if(target.id.indexOf("form-") == -1) return;
     
        if(target.value.length <= 0)
        {
            target.setAttribute("placeholder",target.getAttribute("placeholder-slug"));
            document.getElementById(target.id + "-label").style.opacity = "0";
            document.getElementById(target.id + "-label").style.top = "40px";
            document.getElementById(target.id + "-label").style.left = "13px";
        }
    }

    function validateForm() 
    {
        let email = document.forms["form_register"]["email"];
        let password = document.forms["form_register"]["password"];
        let username = document.forms["form_register"]["username"];

        password.style.backgroundColor = "#beccd3";
        email.style.backgroundColor = "#beccd3";
        username.style.backgroundColor = "#beccd3";

        if (email.value.length < 5) 
        {
            email.style.backgroundColor = "#ef6461";
            email.style.color = "black";
            document.getElementById("alert_register").innerText = "Enter a valid email.";
            return false;
        }
        else if(password.value.length < 2)
        {
            password.style.backgroundColor = "#ef6461";
            password.style.color = "black";
            document.getElementById("alert_register").innerText = "Password too short.";
            return false;
        }
        else if(username.value.length < 2)
        {
            username.style.backgroundColor = "#ef6461";
            username.style.color = "black";
            document.getElementById("alert_register").innerText = "Username too short.";
            return false;
        }

        return true;
    }

    async function handleForm(e) 
    {
        e.preventDefault();

        if(validateForm() == false) return;

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const hashedPassword = bcrypt.hashSync(password, salt); 
        const username = usernameRef.current.value;

        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        let data = null;
        querySnapshot.forEach((doc) => {
            data = doc.data();
        });

        if(data != null)
        {
            document.getElementById("alert_register").innerText = "Email already registered.";
            //console.log("Email already registered.");
            return;
        }

        const docRef = await addDoc(collection(db, "users"), { username: username, email: email, password: hashedPassword, lists: [] });
        //console.log(`New user added email: ${email} username: ${username} id: ${docRef.id}`);
        navigate('/login');
    }

    return (
        <>
            <div id="top-container">
                <div className="login-bar-alert" id="login-bar-alert">
                    <div className="login-bar-alert-cell" id="alert-text">
                        <span>This site uses cookies for analytics, personalized content and ads. By continuing to browse this site, you agree to this use. <a href="#">Learn More.</a></span>
                    </div>
                    <div className="login-bar-alert-cell" id="close-alert" onClick={closeAlert} >
                        <svg id="close-alert-svg"  xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#747474" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                </div>
                <div className="login-bar">
                    <div className="login-bar-logo" id="login-bar-logo">
                        <Link to="/">
                            <svg id="minlist-logo" version="1.0" xmlns="http://www.w3.org/2000/svg" width="350.000000pt" height="350.000000pt" viewBox="0 0 350.000000 350.000000" preserveAspectRatio="xMidYMid meet">
                                <path d="M 257.6 39.9 L 235.8 61.7 L 224.7 55.9 C 212.1 49.4 199.9 45 185.3 41.8 C 177.3 40.1 172.1 39.7 157 39.6 C 131.9 39.6 117.4 42.4 96.7 51.5 C 86.4 56.1 67.8 68 59.7 75.2 L 54.9 79.5 L 106.2 130.7 L 157.5 182 L 229.4 110.1 L 301.4 38.1 L 291.4 28.1 C 286 22.5 281 18 280.5 18 C 279.9 18 269.7 27.8 257.6 39.9 Z M 174 70.5 C 179.2 71.2 186.7 72.9 190.5 74.1 C 198.2 76.4 213 82.9 213 83.9 C 213 84.2 200.6 96.9 185.5 112 L 158 139.5 L 130 111.5 C 114.6 96.1 102 83.2 102 82.9 C 102 82 114.6 76.8 123.5 74 C 138.9 69.2 157.1 67.9 174 70.5 Z"></path>
                                <path d="M 240.2 142.2 L 158 224.4 L 96.7 163.2 L 35.5 102 L 31.8 107.8 C 27.7 114.4 20.9 127.7 17.9 135.2 C 11.8 150.6 8.3 174.3 9.3 193.3 C 11.3 231.2 25.8 263.9 52.5 290.5 C 73.6 311.7 97.4 324.5 127.7 331.2 C 141.9 334.3 171.1 334.3 185.3 331.2 C 215.6 324.5 239.4 311.7 260.5 290.5 C 277.5 273.6 289.4 254.4 296.5 232.6 C 301.9 216 303.5 204.9 303.4 185.5 C 303.3 166.7 301.6 155.5 296.3 139.7 L 293.4 131.1 L 318.2 106.3 C 331.8 92.7 343 81.1 343 80.5 C 343 79.6 323.8 60 322.9 60 C 322.7 60 285.5 97 240.2 142.2 Z M 213.9 211.1 L 269.7 154.6 L 270.9 159.6 C 283 211.6 258.3 265.4 211.1 290.3 C 147 324.1 68.1 292.2 45 223 C 37.7 201.2 37.1 175.1 43.6 155 C 43.9 154.1 64.3 173.8 101.1 210.5 L 158.2 267.5 L 213.9 211.1 Z"></path>
                            </svg>
                        </Link>
                    </div>
                    <div className="login-bar-buttons" id="login-bar-buttons">
                        <button id="login" onClick={handleClick}>Login</button>
                    </div>
                </div>
            </div>
            <div id="register-wrapper">
                <div id="register-wrapper-inside">
                    <div id="big-logo-with-text">
                        <Link to="/">
                            <svg id="minlist-logo-big" version="1.0" xmlns="http://www.w3.org/2000/svg" width="350.000000pt" height="350.000000pt" viewBox="0 0 350.000000 350.000000" preserveAspectRatio="xMidYMid meet">
                                <path d="M 257.6 39.9 L 235.8 61.7 L 224.7 55.9 C 212.1 49.4 199.9 45 185.3 41.8 C 177.3 40.1 172.1 39.7 157 39.6 C 131.9 39.6 117.4 42.4 96.7 51.5 C 86.4 56.1 67.8 68 59.7 75.2 L 54.9 79.5 L 106.2 130.7 L 157.5 182 L 229.4 110.1 L 301.4 38.1 L 291.4 28.1 C 286 22.5 281 18 280.5 18 C 279.9 18 269.7 27.8 257.6 39.9 Z M 174 70.5 C 179.2 71.2 186.7 72.9 190.5 74.1 C 198.2 76.4 213 82.9 213 83.9 C 213 84.2 200.6 96.9 185.5 112 L 158 139.5 L 130 111.5 C 114.6 96.1 102 83.2 102 82.9 C 102 82 114.6 76.8 123.5 74 C 138.9 69.2 157.1 67.9 174 70.5 Z"></path>
                                <path d="M 240.2 142.2 L 158 224.4 L 96.7 163.2 L 35.5 102 L 31.8 107.8 C 27.7 114.4 20.9 127.7 17.9 135.2 C 11.8 150.6 8.3 174.3 9.3 193.3 C 11.3 231.2 25.8 263.9 52.5 290.5 C 73.6 311.7 97.4 324.5 127.7 331.2 C 141.9 334.3 171.1 334.3 185.3 331.2 C 215.6 324.5 239.4 311.7 260.5 290.5 C 277.5 273.6 289.4 254.4 296.5 232.6 C 301.9 216 303.5 204.9 303.4 185.5 C 303.3 166.7 301.6 155.5 296.3 139.7 L 293.4 131.1 L 318.2 106.3 C 331.8 92.7 343 81.1 343 80.5 C 343 79.6 323.8 60 322.9 60 C 322.7 60 285.5 97 240.2 142.2 Z M 213.9 211.1 L 269.7 154.6 L 270.9 159.6 C 283 211.6 258.3 265.4 211.1 290.3 C 147 324.1 68.1 292.2 45 223 C 37.7 201.2 37.1 175.1 43.6 155 C 43.9 154.1 64.3 173.8 101.1 210.5 L 158.2 267.5 L 213.9 211.1 Z"></path>
                            </svg>
                        </Link>
                    </div>
                    <div className='App'>
                        <header className='App-header'>
                            <form id="form_register" name="form_register" onSubmit={handleForm}>
                                <label htmlFor="form-username" className="opacity0" id="form-username-label">Username:</label>
                                <input id="form-username"  name="username"  ref={usernameRef} type='text' placeholder-slug="Username" placeholder='Username' required autoComplete={String(Math.random()).slice(2)} onClick={handleClick} onBlur={handleBlur} />  
                                <label htmlFor="form-email" className="opacity0" id="form-email-label">Email:</label>
                                <input id="form-email"  name="email"  ref={emailRef} type='email' placeholder-slug="Email" placeholder='Email' required autoComplete={String(Math.random()).slice(2)} onClick={handleClick} onBlur={handleBlur} />
                                <label htmlFor="form-password" className="opacity0" id="form-password-label">Password:</label>
                                <input id="form-password" name="password" ref={passwordRef} type='password' placeholder-slug="Password" placeholder='Password' required autoComplete={String(Math.random()).slice(2)}  onClick={handleClick} onBlur={handleBlur} />
                                <span id="alert_register"></span>
                                <button id="register_submit" type="submit">Register</button>
                            </form>
                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}

