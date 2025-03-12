


import React, { useState, useEffect } from "react";
import '../index.css'; 

export default function AddList(props) 
{
    const [state, setState] = useState(0);

    useEffect(() => {
        console.log("AddList render");
    });

    return (
        <>
        test
        </>
    );
}

