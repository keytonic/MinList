import React, { useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";

import '../index.css'; 

import Phones from '../assets/phones.png';
import AllPlatforms from '../assets/all-platforms.png';

export default function Home(props) 
{
    const navigate = useNavigate();

    useEffect(() => 
    {
        if(localStorage.getItem("accept-cookies") == null)
        {
            const alert_bar = document.getElementById("login-bar-alert");

            if(alert_bar != null)
            {
                document.getElementById("login-bar-alert").style.display = "flex";
            }
        }

        //document.documentElement.style.backgroundImage = `linear-gradient(180deg, #88a5bf, #f4f0f0)`;
        document.documentElement.style.backgroundImage = "unset";
        document.documentElement.style.backgroundColor = "white";
        
    }, []);

    function login_register(event)
    {
        if(event.target.id == "sign-in")
        {
            navigate("/login");
        }
        else if(event.target.id == "get-started")
        {
            navigate("/register");
        }
    }

    function closeAlert(event)
    {
        const alert_bar = document.getElementById("login-bar-alert");

        if(alert_bar != null)
        {
            document.getElementById("login-bar-alert").style.display = "none";
            localStorage.setItem("accept-cookies", "true");
        }
    }

    let dsp = props.install == null ? "none" : "block";
    
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
                    <div id="login-bar-logo">
                            <svg id="minlist-logo" version="1.0" xmlns="http://www.w3.org/2000/svg" width="350.000000pt" height="350.000000pt" viewBox="0 0 350.000000 350.000000" preserveAspectRatio="xMidYMid meet">
                                <path d="M 257.6 39.9 L 235.8 61.7 L 224.7 55.9 C 212.1 49.4 199.9 45 185.3 41.8 C 177.3 40.1 172.1 39.7 157 39.6 C 131.9 39.6 117.4 42.4 96.7 51.5 C 86.4 56.1 67.8 68 59.7 75.2 L 54.9 79.5 L 106.2 130.7 L 157.5 182 L 229.4 110.1 L 301.4 38.1 L 291.4 28.1 C 286 22.5 281 18 280.5 18 C 279.9 18 269.7 27.8 257.6 39.9 Z M 174 70.5 C 179.2 71.2 186.7 72.9 190.5 74.1 C 198.2 76.4 213 82.9 213 83.9 C 213 84.2 200.6 96.9 185.5 112 L 158 139.5 L 130 111.5 C 114.6 96.1 102 83.2 102 82.9 C 102 82 114.6 76.8 123.5 74 C 138.9 69.2 157.1 67.9 174 70.5 Z"></path>
                                <path d="M 240.2 142.2 L 158 224.4 L 96.7 163.2 L 35.5 102 L 31.8 107.8 C 27.7 114.4 20.9 127.7 17.9 135.2 C 11.8 150.6 8.3 174.3 9.3 193.3 C 11.3 231.2 25.8 263.9 52.5 290.5 C 73.6 311.7 97.4 324.5 127.7 331.2 C 141.9 334.3 171.1 334.3 185.3 331.2 C 215.6 324.5 239.4 311.7 260.5 290.5 C 277.5 273.6 289.4 254.4 296.5 232.6 C 301.9 216 303.5 204.9 303.4 185.5 C 303.3 166.7 301.6 155.5 296.3 139.7 L 293.4 131.1 L 318.2 106.3 C 331.8 92.7 343 81.1 343 80.5 C 343 79.6 323.8 60 322.9 60 C 322.7 60 285.5 97 240.2 142.2 Z M 213.9 211.1 L 269.7 154.6 L 270.9 159.6 C 283 211.6 258.3 265.4 211.1 290.3 C 147 324.1 68.1 292.2 45 223 C 37.7 201.2 37.1 175.1 43.6 155 C 43.9 154.1 64.3 173.8 101.1 210.5 L 158.2 267.5 L 213.9 211.1 Z"></path>
                            </svg>
                            <svg id="title-small" version="1.0" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 200.000000 32.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,32.000000) scale(0.100000,-0.100000)"  stroke="none">
                                    <path d="M50 156 c0 -86 3 -106 15 -106 11 0 15 16 17 67 l3 67 72 -62 c40 -34 74 -62 77 -62 2 0 37 28 78 61 l73 62 3 -67 c2 -50 6 -66 17 -66 12 0 15 20 15 106 l0 106 -72 -63 c-40 -35 -82 -71 -93 -81 -20 -17 -23 -16 -113 63 l-92 80 0 -105z" ></path>
                                    <path d="M460 155 c0 -87 3 -105 15 -105 12 0 15 18 15 105 0 87 -3 105 -15 105 -12 0 -15 -18 -15 -105z" ></path>
                                    <path d="M530 154 c0 -86 3 -104 15 -104 12 0 15 15 15 79 l0 80 108 -51 c59 -27 135 -63 170 -78 l62 -29 0 105 c0 86 -3 104 -15 104 -12 0 -15 -15 -15 -79 l0 -80 -117 56 c-65 30 -142 66 -170 78 l-53 24 0 -105z" ></path>
                                    <path d="M940 155 l0 -105 150 0 c127 0 150 2 150 15 0 13 -22 15 -135 15 l-135 0 0 90 c0 73 -3 90 -15 90 -12 0 -15 -18 -15 -105z" ></path>
                                    <path d="M1270 155 c0 -87 3 -105 15 -105 12 0 15 18 15 105 0 87 -3 105 -15 105 -12 0 -15 -18 -15 -105z" ></path>
                                    <path d="M1350 240 c-24 -24 -25 -49 -6 -76 13 -17 31 -20 168 -24 l153 -5 0 -25 0 -25 -167 -3 c-140 -2 -168 -5 -168 -17 0 -13 26 -15 165 -15 152 0 167 2 185 20 24 24 25 49 6 76 -13 17 -31 20 -168 24 l-153 5 0 25 0 25 188 3 187 2 0 -90 c0 -73 3 -90 15 -90 12 0 15 17 15 90 l0 90 85 0 c69 0 85 3 85 15 0 13 -38 15 -285 15 -272 0 -286 -1 -305 -20z" ></path>
                                </g>
                            </svg>
                    </div>
                    <div id="login-bar-buttons">
                        <button id="sign-in" onClick={login_register}>Login</button>
                        <button id="get-started" onClick={login_register}>Get Started</button>
                    </div>
                </div>
            </div>
            <div id="front-wrapper">
                <div id="intro-wrapper">
                    <div id="intro">
                        <div id="intro-left">
                            <div id="tag-line">Keep Your Goals in Sight.</div>
                            <div id="some-text">MinList offers the easiest way to keep your tasks organized and within reach, ensuring nothing slips through the cracks. Its clean, distraction-free interface helps you stay focused on what matters most, effortlessly keeping you on top of your to-dos. Whether you're managing daily tasks or working toward long-term goals, MinList ensures you never lose track of what needs to be done.</div>
                            <div id="intro-button"><button id="get-started" onClick={login_register}>Create a free account</button></div>
                        </div>
                        <div id="intro-right">
                            <img id="phones" src={Phones} />
                        </div>
                    </div>
                    <div id="more-intro">
                    MinList for work, home and play.<br />Accomplish more during your day.
                    </div>

                    <div id="intro-three">
                        <img id="all-platforms" src={AllPlatforms} />

                    </div>

                    <div id="home-footer">
                        <div id="footer-top">
                            <Link to="/">Privacy Policy</Link>
                            <Link to="/">Terms of Use</Link>
                            <Link to="/">Contact</Link>
                        </div>
                        <hr />
                        <div id="footer-bottom">
                        Copyright © {String(new Date().getYear() + 1900)} MinList.net, All Rights Reserved.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}