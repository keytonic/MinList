import { useNavigate} from "react-router-dom";
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { FacebookAuthProvider, signInWithPopup} from "firebase/auth";
import {db,auth} from "../Firebase"

export default function FLogin(props) 
{
    const provider = new FacebookAuthProvider();
    const navigate = useNavigate();

    function useFLogin(event)
    {
        signInWithPopup(auth, provider).then((result) => 
        {
            let email = result.user.email;
            let username = result.user.displayName;
            let uid = result.user.uid;

            try
            {
                const fetchData = async () => 
                {
                    await getDocs(query(collection(db, "users"), where("uid", "==", uid))).then((snap) => 
                    {
                        if(snap.empty === true)
                        {
                            const addUser = async () => 
                            {
                                await addDoc(collection(db, "users"), { username: username, uid: uid, email: email, lists: [], last: new Date() }).then((docRef) => 
                                {
                                    localStorage.setItem("type","facebook");
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
                                if(lists != [] && lists[0] != undefined)
                                {
                                    localStorage.setItem("list",lists[0]);
                                }
    
                                localStorage.setItem("type","facebook");
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
        }).catch((error) => 
        {
            console.log(error.code,",",error.message);
        });
    }

    if(localStorage.getItem("userid") != null) return (<></>);

    return (
        <button className="gsi-material-button" onClick={useFLogin} style={{marginTop: "10px"}}>
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0866FF" viewBox="0 0 16 16" style={{display: "block",margin: "0"}}>
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                    </svg>
                </div>
                <span className="gsi-material-button-contents">Continue with Facebook</span>
            </div>
        </button>
    );
}