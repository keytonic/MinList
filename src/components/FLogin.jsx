


import React, { useState, useEffect } from "react";
import FacebookLogin from '@greatsumini/react-facebook-login';
import '../index.css'; 

export default function FLogin(props) 
{
    const [state, setState] = useState(0);

    useEffect(() => {
        
    });


    return (<></>);

    return (
        <>
            <FacebookLogin
            appId="628600296445452"


            onSuccess={(response) => {
                console.log('Login Success!', response);
              }}
              onFail={(error) => {
                console.log('Login Failed!', error);
              }}
              onProfileSuccess={(response) => {
                console.log('Get Profile Success!', response);
              }}



            style={{
                backgroundColor: '#4267b2',
                color: '#fff',
                fontSize: '16px',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '4px',
            }}
            />
        </>
    );
}

