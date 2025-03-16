import React, { useState, useEffect} from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import {db} from "../Firebase"
import Header from './Header';
import Input from './Input';
import TodoCard from './TodoCard';
import EditTodo from './EditTodo';
import '../index.css'; 

export default function Body(props) 
{
    const [state, setState] = useState({
        editTodoId: "",
        background: localStorage.getItem("background") == null ? "" : localStorage.getItem("background"),
        currentList: localStorage.getItem("list") == null ? "" : localStorage.getItem("list"),
        showAll: localStorage.getItem("showAll") == null ? "false" : localStorage.getItem("showAll"),
        userid: localStorage.getItem("userid"),
        tasks: null,
        reRender: false,
        lists: []
    });

    useEffect(() => 
    {
        if( state.userid != null)
        {
            try
            {
                const storedObjectString = localStorage.getItem("counts");
                const storedObject = JSON.parse(storedObjectString);

                const fetchData = async () => 
                {
                    let q = null;
                    
                    if(state.showAll == "true")
                        q = query(collection(db, "tasks"), where("userid", "==", state.userid), where("list", "==", state.currentList), orderBy("text"));
                    else
                        q = query(collection(db, "tasks"), where("userid", "==", state.userid), where("list", "==", state.currentList), where("checked", "==", "false"), orderBy("text"));

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

                        const myObject = { ...storedObject, [state.currentList]: snap.size };
                        localStorage.setItem("counts", JSON.stringify(myObject));
                    });
                };
                fetchData();
            } 
            catch (err) 
            {
                console.log(err);
            } 
        }
    },[state.currentList,state.reRender,state.showAll]);

    useEffect(() => 
    {
        let modalWrapper = document.getElementsByClassName("modal-wrapper")[0];

        if(modalWrapper != null)
        {
            modalWrapper.style.visibility = "visible";
            modalWrapper.style.opacity = "1";
        }

    }, [state.editTodoId]);

    useEffect(() => 
    {
        if(state.background == "")
        {
            document.documentElement.style.backgroundImage = `linear-gradient(180deg, #88a5bf, #f4f0f0)`;
        }
        else
        {
            document.documentElement.style.backgroundImage = `url(/images/backgrounds/${state.background}.png),linear-gradient(0deg, #88a5bf, #f4f0f0)`;
        }
    }, [state.background]);



    function handleState(args)
    {
        if (args.hasOwnProperty("showAll")) 
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
        else if (args.hasOwnProperty("currentList")) 
        {
            setState(previousState => { return { ...previousState, currentList: args.currentList }});
        }
        else if (args.hasOwnProperty("background")) 
        {
            setState(previousState => { return { ...previousState, background: args.background }});
        }
        if (args.hasOwnProperty("lists")) 
        {
            setState(previousState => { return { ...previousState, lists: args.lists }});
        }
        if (args.hasOwnProperty("reRender")) 
        {
            setState(previousState => { return { ...previousState, reRender: !state.reRender }});
        }
    }

    return (
        <>
            <div id="body-wrapper">
                <Header title={state.currentList} handler={handleState} lists={state.lists} userid={state.userid} install={props.install}/>
                <Input list={state.currentList} handler={handleState} userid={state.userid} />
                <GetTodos tasks={state.tasks} showall={state.showAll} handler={handleState} list={state.currentList} />
            </div>
            <EditTodo todoid={state.editTodoId} handler={handleState} userid={state.userid} lists={state.lists}/>
        </>
    );
}

function GetTodos(props)
{
    if(props.tasks === null) return (<></>);

    function handleState(args)
    {
        if (args.hasOwnProperty("editTodoId")) 
        {
            props.handler({editTodoId: args.editTodoId});
        }
    }

    const buf = [];

    if(props.tasks.size > 0)
    {
        props.tasks.forEach((doc) => 
        {
            buf.push(<TodoCard checked={doc.data().checked} text={doc.data().text} id={doc.id} key={doc.id} list={doc.data().list} handler={handleState} showall={props.showall}/>);
        });
    }
    return (
        <div id="todos-outer">{buf}</div>
    );
}