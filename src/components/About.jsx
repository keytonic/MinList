import React from "react";
import { Link } from "react-router-dom";
import '../index.css'; 

export default function About(props) 
{
    function handleClick2(event)
    {
        if
        (
            event.target.id == "task-modal-wrapper"
        )
        {
            props.handler({aboutOpen:false});
            return;
        }
    }

    function handleClick(event)
    {
        if
        (
            event.target.id == "modal-close" || 
            event.target.id == "modal-close-icon" || 
            event.target.id == "modal-close-path" ||
            event.target.id == "modal-close-button"
        )
        {
            props.handler({aboutOpen:false});
            return;
        }
    }

    if(props.open == false) return (<></>);

    return (
        <>
            <div className="modal-wrapper" id="task-modal-wrapper" onClick={handleClick2}>
                <div className="modal-window">
                    <div className="modal-header">
                        <div className="modal-nav"></div>
                        <div className="modal-title">About</div>
                        <div className="modal-nav" id="modal-close" onClick={handleClick}>
                            <svg id="modal-close-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="modal-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div id="about-content">
                            <Link id="logo-link-about" to="/">
                                <svg id="minlist-logo-big" version="1.0" xmlns="http://www.w3.org/2000/svg" width="350.000000pt" height="350.000000pt" viewBox="0 0 350.000000 350.000000" preserveAspectRatio="xMidYMid meet">
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
                            </Link>

                            <span>A To-Do List That Works for You.</span>
                            <span id="copyright">© 2024 <a href="">Andrew Towner</a>. All rights reserved.</span>


                            <a href="https://www.buymeacoffee.com/drootown" target="_blank">
                                <img src="https://keytonic.net/projects/buymeacoffee.svg/?backgroundcolor=e2e4e800&coffee=a52a2a&color=4d708e&borderwidth=0" alt="Buy Me A Coffee" width="150" />
                            </a>
                        </div>
                    </div>
                    <div className="modal-footer" style={{justifyContent: "center"}}>
                        <button type="button" id="modal-close-button" onClick={handleClick} style={{ margin: "0", marginBottom: "15px"}} >Close</button>
                    </div>
                </div>
            </div>
        </>
    );
}