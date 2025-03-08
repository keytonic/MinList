import React, { useState, useEffect} from "react";
import '../index.css'; 

import Header from './Header';
import Input from './Input';
import TodoCard from './TodoCard';
import MenuOptions from './MenuOptions';
import MenuLists from './MenuLists';

export default function Body(props) 
{
    const [state, setState] = useState({
        menuOptionsOpen: false,
        menuListsOpen: false,
        currentList: localStorage.getItem("list") == null ? "" : localStorage.getItem("list"),
        showAll: localStorage.getItem("showAll") == null ? "false" : localStorage.getItem("showAll"),
        userid: localStorage.getItem("userid")
    });

    useEffect(() => {
        console.log("Body render");
    });

    function handleState(props)
    {
        if (props.hasOwnProperty("menuListsOpen")) 
        {
            setState(previousState => { return { ...previousState, menuListsOpen: !state.menuListsOpen, menuOptionsOpen: false }});
        }
        else if (props.hasOwnProperty("menuOptionsOpen")) 
        {
            setState(previousState => { return { ...previousState, menuOptionsOpen: !state.menuOptionsOpen, menuListsOpen: false }});
        }
        else if (props.hasOwnProperty("currentList")) 
        {
            setState(previousState => { return { ...previousState, currentList: props.currentList }});
        }
        else if (props.hasOwnProperty("showAll")) 
        {
            setState(previousState => { return { ...previousState, showAll: props.showAll }});
        }
    }

    return (
        <>
            <div id="body-wrapper">
                <Header title={state.currentList} handler={handleState}/>
                <Input />
                <TodoCard checked={true} text="Walk the dog" />
                <TodoCard checked={false} text="Do laundry" />
                <TodoCard checked={true} text="Wash dishes" />
            </div>
            <MenuLists open={state.menuListsOpen} handler={handleState} userid={state.userid} />
            <MenuOptions open={state.menuOptionsOpen} handler={handleState} />
        </>
    );
}