import React, { useState, useEffect } from "react";
import '../index.css'; 

export default function ListCard(props) 
{
    const [state, setState] = useState({
        //checked: ((props.text == props.current) ? true : false),
        text: props.text,
        count: 0
    });

    useEffect(() => {
        console.log(`ListCard render: ${state.text}`);
    });

    function handleClick(event)
    {
        if(event.target.id == "list-card-left" || event.target.id == "lists-menu-check" || event.target.id == "lists-menu-check-path")
        {
            if(localStorage.getItem("list") == state.text)
            {
                localStorage.removeItem("list");
                props.handler({currentList:""});
            }
            else
            {
                localStorage.setItem("list", state.text);
                props.handler({currentList:state.text});
            }
        }
        else if(event.target.id == "list-card-right" || event.target.id == "lists-menu-edit" || event.target.id == "lists-menu-edit-path")
        {
            props.handler({editListId: state.text});
        }
    }

    let disp = props.text == props.current ? "unset" : "none";

    return (
        <div id="list-card" className="list-card">
            <div id="list-card-left" onClick={handleClick}>
                <svg id="lists-menu-check" className="lists-menu-check" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                    <path id="lists-menu-check-path" d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                    <path  style={{display: disp}} id="lists-menu-check-path" className="lists-menu-check-path" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                </svg>
            </div>
            <div id="list-card-center">{props.text}</div>
            <div id="list-card-right" onClick={handleClick}>
                <svg id="lists-menu-edit" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="grey" viewBox="0 0 16 16">
                    <path id="lists-menu-edit-path" d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path>
                </svg>
            </div>
        </div>
    );
}