


import React, { useState, useEffect } from "react";
import '../index.css'; 

export default function EditList(props) 
{
    const [state, setState] = useState(0);

    useEffect(() => {
        console.log("EditList render");
    });

    return (
        <>
        </>
    );
}

