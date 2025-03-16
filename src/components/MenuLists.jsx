import React, { useState, useEffect } from "react";
import { getDoc, doc} from "firebase/firestore";
import {db} from "../Firebase"
import ListCard from './ListCard';
import EditList from './EditList';
import AddList from './AddList';
import '../index.css'; 

export default function MenuLists(props) 
{
    const [state, setState] = useState({
        editListId: "",
        addListOpen: false,
        currentList: localStorage.getItem("list") == null ? "" : localStorage.getItem("list"),
        lists: props.lists
    });

    useEffect(() => 
    {
        handlePosition();
    });

    useEffect(() => 
    {
        window.addEventListener('resize', handlePosition);
    },[]);

    useEffect(() => 
    {
        let modalWrapper = document.getElementsByClassName("modal-wrapper")[0];

        if(modalWrapper != null)
        {
            modalWrapper.style.visibility = "visible";
            modalWrapper.style.opacity = "1";
        }

    }, [state.addListOpen,state.editListId]);


    useEffect(() => 
    {
        if(state.lists.length === 0 || props.lists.length != state.lists.length)
        {
            try
            {
                const fetchData = async () => 
                {
                    await getDoc(doc(db, 'users', props.userid)).then((snap) => 
                    {
                        if (snap.exists()) 
                        {
                            setState(previousState => { return { ...previousState, lists: snap.data().lists }});

                            if(props.lists.toString() !== snap.data().lists.toString())
                            {
                                props.handler({lists: snap.data().lists});
                            }
                        }
                    });
                };
                fetchData();
            } 
            catch (err) 
            {
                console.log(err);
            } 
        }
        
    },[props.lists]);

    function handleState(args)
    {
        if (args.hasOwnProperty("currentList")) 
        {
            setState(previousState => { return { ...previousState, currentList: args.currentList }});
            props.handler({currentList: args.currentList});
        }
        else if (args.hasOwnProperty("addListOpen")) 
        {
            setState(previousState => { return { ...previousState, addListOpen: !state.addListOpen }});
        }
        else if (args.hasOwnProperty("editListId")) 
        {
            setState(previousState => { return { ...previousState, editListId: args.editListId }});
        }
        if (args.hasOwnProperty("lists")) 
        {
            props.handler({lists: args.lists});
            setState(previousState => { return { ...previousState, lists: args.lists }});
        }
    }

    function handlePosition()
    {
        const rec = document.getElementById("header-wrapper").getBoundingClientRect();

        if(rec == null) return;

        const menu = document.getElementById("menu-lists-wrapper");

        if(menu == null) return;
        
        menu.style.left = rec.left + "px";

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
        if
        (
            event.target.id == "menu-list-header-left" || 
            event.target.id == "lists-menu-close" || 
            event.target.id == "lists-menu-close-path" ||
            event.target.id == "menu-outer"
        )
        {
            document.body.style.overflowY = "visible";
            props.handler({menuListsOpen:"toggle"});
        }
        else if(event.target.id == "menu-list-header-right" || event.target.id == "lists-menu-add" || event.target.id == "lists-menu-add-path")
        {
            setState(previousState => { return { ...previousState, addListOpen: true }});
        }
    }

    function GetLists(props)
    {
        let count = 0;
        let storedObject = {};

        const storedObjectString = localStorage.getItem("counts");  
        if(storedObjectString != null) storedObject = JSON.parse(storedObjectString);

        const lists = props.lists.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

        const listItems = [];

        for (let list of lists) 
        {
            count = storedObject[list];
            listItems.push(<ListCard text={list} handler={handleState} count={count} current={state.currentList} key={lists.indexOf(list)}/>);
        }

        return listItems;
    }

    if(props.open == false) return(<></>);

    return (
        <>
            <div id="menu-outer" onClick={handleClick}>
                <div id="menu-lists-wrapper">
                    <div id="menu-list-header">
                        <div id="menu-list-header-left" onClick={handleClick}>
                            <svg id="lists-menu-close" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="lists-menu-close-path" d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"></path>
                            </svg>
                        </div>
                        <div id="menu-list-header-center">Lists</div>
                        <div id="menu-list-header-right" onClick={handleClick}>
                            <svg id="lists-menu-add" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                                <path id="lists-menu-add-path" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"></path>
                            </svg>
                        </div>
                    </div>
                    <div id="menu-list-cards">
                        <GetLists lists={state.lists}/>
                    </div>
                </div>
            </div>
            <EditList    listid={state.editListId}    handler={handleState} userid={props.userid} lists={state.lists} currentlist={state.currentList}/>
            <AddList     open={state.addListOpen}     handler={handleState} lists={state.lists} userid={props.userid}/>
        </>
    );
}