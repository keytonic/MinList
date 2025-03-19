import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from "react-router-dom";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import {db} from "../Firebase"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function GLogin(props) 
{
    const [ user, setUser ] = useState(null);

    const useGLogin = useGoogleLogin(
    {
        onSuccess: (codeResponse) => setUser(codeResponse),
        promptMomentNotification:true
        //onError: (error) => console.log('Login Failed:', error)
    });

    const navigate = useNavigate();

    useEffect(
        () => {
            if (user != null) 
            {
                axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    logIn(res.data);
                    
                })
                .catch((err) => {/*console.log(err)*/});
            }
        },
        [ user ]
    );

    function logIn(data)
    {
        try
        {
            const fetchData = async () => 
            {
                await getDocs(query(collection(db, "users"), where("email", "==", data.email))).then((snap) => 
                {
                    if(snap.empty === true)
                    {
                        const addUser = async () => 
                        {
                            await addDoc(collection(db, "users"), { username: data.name, email: data.email, password: null, lists: [], last: new Date() }).then((docRef) => 
                            {
                                //console.log("new user added, logging in.");
                                localStorage.setItem("userid", docRef.id);
                                props.handler({loggedIn: true});
                                navigate('/home');
                            });
                        };
                        addUser();

                    }
                    else
                    {
                        var id = null;
                        let lists = [];
                        snap.forEach((doc) => {
                            id = doc.id;
                            lists = doc.data().lists;
                        });

                        if(id != null)
                        {
                            //console.log("existing user found, loggin in.");

                            if(lists != [] && lists[0] != undefined)
                            {
                                localStorage.setItem("list",lists[0]);
                            }

                            localStorage.setItem("userid", id);
                            updateDoc(doc(db, "users", id), { last: new Date() });
                            props.handler({loggedIn: true});
                            navigate('/home');
                        }
                    }
                });
            }
            fetchData();
        }
        catch (err) 
        {
            console.log(err);
        } 
    }

    return (
        <button className="gsi-material-button" onClick={useGLogin}>
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block",margin: "0"}}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div>
                <span className="gsi-material-button-contents">Continue with Google</span>
                <span style={{display: "none"}}>Continue with Google</span>
            </div>
        </button>
    );
}
 