import React, { useState, useEffect} from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import {db} from "../Firebase"

import Header from './Header';
import Input from './Input';
import TodoCard from './TodoCard';
import MenuOptions from './MenuOptions';
import MenuLists from './MenuLists';
import EditTodo from './EditTodo';
import EditList from './EditList';
import AddList from './AddList';
import About from './About';

import '../index.css'; 

export default function Body(props) 
{
    const [state, setState] = useState({
        menuOptionsOpen: false,
        menuListsOpen: false,
        editTodoId: "",
        editListId: "",
        addListOpen: false,
        aboutOpen: false,
        currentList: localStorage.getItem("list") == null ? "" : localStorage.getItem("list"),
        showAll: localStorage.getItem("showAll") == null ? "false" : localStorage.getItem("showAll"),
        userid: localStorage.getItem("userid"),
        tasks: null,
        reRender: false,
        lists: []
    });

    useEffect(() => {
        console.log("Body render");
    });

    useEffect(() => 
    {
        if( state.userid != null)
        {
            try
            {
                const fetchData = async () => 
                {
                    const q = query(collection(db, "tasks"), where("userid", "==", state.userid), where("list", "==", state.currentList), orderBy("text"));

                    await getDocs(q).then((snap) => 
                    {
                        if (snap.empty === false) 
                        {
                            setState(previousState => { return { ...previousState, tasks: snap }});
                        }
                        else
                        {
                            setState(previousState => { return { ...previousState, tasks: null }});
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
        
    },[state.currentList,state.reRender]);

    function handleState(args)
    {
        if (args.hasOwnProperty("menuListsOpen")) 
        {
            setState(previousState => { return { ...previousState, menuListsOpen: !state.menuListsOpen, menuOptionsOpen: false }});
        }
        else if (args.hasOwnProperty("menuOptionsOpen")) 
        {
            setState(previousState => { return { ...previousState, menuOptionsOpen: !state.menuOptionsOpen, menuListsOpen: false }});
        }
        else if (args.hasOwnProperty("addListOpen")) 
        {
            setState(previousState => { return { ...previousState, addListOpen: !state.addListOpen }});
        }
        else if (args.hasOwnProperty("aboutOpen")) 
        {
            setState(previousState => { return { ...previousState, aboutOpen: !state.aboutOpen }});
        }
        else if (args.hasOwnProperty("showAll")) 
        {
            setState(previousState => { return { ...previousState, showAll: args.showAll }});
        }
        else if (args.hasOwnProperty("loggedIn")) 
        {
            props.handler({loggedIn: props.loggedIn});
        }
        else if (args.hasOwnProperty("editTodoId")) 
        {
            setState(previousState => { return { ...previousState, editTodoId: args.editTodoId }});
        }
        else if (args.hasOwnProperty("editListId")) 
        {
            setState(previousState => { return { ...previousState, editListId: args.editListId }});
        }
        
        else if (args.hasOwnProperty("currentList")) 
        {
            setState(previousState => { return { ...previousState, currentList: args.currentList }});
        }
        //dont make an elseif
        if (args.hasOwnProperty("lists")) 
        {
            setState(previousState => { return { ...previousState, lists: args.lists }});
        }
        if (args.hasOwnProperty("reRender")) 
        {
            setState(previousState => { return { ...previousState, reRender: !state.reRender }});
        }
    }

    function GetTodos(props)
    {
        if(state.tasks === null) return (<></>);

        const tasks = [];

        if(state.tasks.empty === false)
        {
            state.tasks.forEach((doc) => 
            {
                tasks.push(<TodoCard checked={doc.data().checked} text={doc.data().text} id={doc.id} key={doc.id} handler={handleState}/>);
            });
        }
        return (tasks);
    }

    return (
        <>
            <div id="body-wrapper">
                <Header title={state.currentList} handler={handleState} />
                <Input list={state.currentList} handler={handleState} userid={state.userid} />
                <GetTodos />
            </div>
            <MenuLists   open={state.menuListsOpen}   handler={handleState} userid={state.userid} lists={state.lists}/>
            <MenuOptions open={state.menuOptionsOpen} handler={handleState} lists={state.lists}/>
            <EditTodo    todoid={state.editTodoId}    handler={handleState} userid={state.userid} lists={state.lists}/>
            <EditList    listid={state.editListId}    handler={handleState} userid={state.userid} lists={state.lists} currentlist={state.currentList}/>
            <AddList     open={state.addListOpen}     handler={handleState} lists={state.lists} userid={state.userid}/>
            <About       open={state.aboutOpen}       handler={handleState} />
        </>
    );
}