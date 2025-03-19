import React from "react";
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
                        <span>Who, what, when, where, why</span>
                    </div>
                    <div className="modal-footer" style={{justifyContent: "center"}}>
                        <button type="button" id="modal-close-button" onClick={handleClick} style={{ margin: "0", marginBottom: "15px"}} >Close</button>
                    </div>
                </div>
            </div>
        </>
    );
}