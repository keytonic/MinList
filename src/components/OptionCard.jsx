import React, { useState } from "react";
import '../index.css'; 

export default function OptionCard(props) 
{
    const [state, setState] = useState({
        checked: localStorage.getItem(props.name) == "true" ? true : false,
        text: props.text,
        name: props.name
    });

    function handleClick(event)
    {
        if(event.target.id == "option-card-left" || event.target.id == "options-menu-check" || event.target.id == "options-menu-check-path")
        {
            let checked = !state.checked;
            setState(previousState => { return { ...previousState, checked: checked }});
            localStorage.setItem(state.name,checked);

            const dynamicObject = {[state.name]: (checked == true ? "true" : "false")};
            props.handler(dynamicObject);
        }
    }

    let disp = (state.checked == true ? "unset" : "none");

    return (
        <div id="option-card" className="option-card">
            <div id="option-card-right">{state.text}</div>
            <div id="option-card-left" onClick={handleClick}>
                <svg id="options-menu-check" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                    <path id="options-menu-check-path" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                    <path style={{display: disp}} id="options-menu-check-path" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                </svg>
            </div>
        </div>
    );
}