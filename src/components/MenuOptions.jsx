import React, { useState, useEffect } from "react";
import '../index.css'; 
import OptionCard from './OptionCard';
import { useNavigate} from "react-router-dom";

export default function MenuOptions(props) 
{
    const [state, setState] = useState(0);

    const navigate = useNavigate();

    useEffect(() => 
    {
        console.log("MenuOptions render");

        handlePosition();
    });

    useEffect(() => 
    {
        window.addEventListener('resize', handlePosition);
    },[]);

    function handleState(args)
    {
        if (args.hasOwnProperty("showAll")) 
        {
            props.handler({showAll:args.showAll});
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

    function handleClick(event)
    {
        if(event.target.id == "menu-options-header-right" || event.target.id == "options-menu-close" || event.target.id == "options-menu-close-path")
        {
            props.handler({menuOptionsOpen:"toggle"});
        }
        else if(event.target.id == "menu-options-header-left" || event.target.id == "about-icon" || event.target.id == "about-path")
        {
            alert("about");
        }
        else if(event.target.id == "button-logout")
        {
            localStorage.removeItem("userid");
            props.handler({loggedIn: false});
            navigate('/home');
        }
        else if(event.target.id == "menu-outer")
        {
            props.handler({menuOptionsOpen:"toggle"});
        }
    }

    if(props.open == false) return(<></>);

    return (
        <div id="menu-outer" onClick={handleClick}>
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

                <div id="button-logout-wrapper">
                    <button id="button-logout" type="button" onClick={handleClick}>Logout</button>
                </div>
            </div>
        </div>
    );
}