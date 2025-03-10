


import React, { useState, useEffect } from "react";
import '../index.css'; 

export default function About(props) 
{
    const [state, setState] = useState(0);

    useEffect(() => {
        console.log("About render");
    });

    return (
        <>
        </>
    );
}

