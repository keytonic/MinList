


import React, { useState, useEffect } from "react";
import '../index.css'; 

export default function BoilerPlate(props) 
{
    const [state, setState] = useState(0);

    useEffect(() => {
        console.log("Install render");
    });

    return (
        <>
        </>
    );
}

