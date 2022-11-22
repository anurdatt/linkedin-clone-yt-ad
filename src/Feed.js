import React, { useEffect, useState } from 'react'
import CreateIcon from "@material-ui/icons/Create";
import ImageIcon from "@material-ui/icons/Image"
import SubscriptionsIcon from "@material-ui/icons/Subscriptions"
import EventNoteIcon from "@material-ui/icons/EventNote"
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay"
import "./Feed.css";
import InputOption from './InputOption';
import Post from './Post';
import { db } from './firebase';
import { collection, onSnapshot, serverTimestamp, addDoc, orderBy, query } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from './features/user/userSlice';
import FlipMove from "react-flip-move";

function Feed() {

    // const samplePost = {
    //     id: new Date().getTime(), 
    //     name: "Anuran Datta", 
    //     description: "This is a test", 
    //     message: "WOW this works!",
    //     timestamp: new Date()
    // };

    const [posts, setPosts] = useState([])
    const [input, setInput] = useState("")

    const user = useSelector(selectUser)

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))
        // const unsub = 
        onSnapshot(q, (snapshot) => 
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        )
    }, [])

    const sendPost = async (e) => {
        e.preventDefault()
        // setPosts([...posts, {
        //     ...samplePost, 
        //     id: new Date().getTime(), 
        //     message: input,
        //     timestamp: new Date()
        // }])
        // console.log({posts})
        const docRef = await addDoc(collection(db, "posts"), {
            name: user.displayName, 
            description: user.email, 
            message: input,
            photoUrl: user.photoURL || "",
            timestamp: serverTimestamp()
        })
        console.log("Document written with ID: ", docRef.id);

        setInput("");
    }

  return (
    <div className='feed'>
        <div className="feed_inputContainer">
            <div className="feed_input">
                <CreateIcon />

                <form>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
                    <button type="submit" onClick={sendPost}>Send</button>
                </form>

            </div>

            <div className="feed_inputOptions">
                <InputOption Icon={ImageIcon} title="Photo" color="#70B5F9"/>
                <InputOption Icon={SubscriptionsIcon} title="Video" color="#E7A33E"/>
                <InputOption Icon={EventNoteIcon} title="Event" color="#C0CBCD"/>
                <InputOption Icon={CalendarViewDayIcon} title="Write Article" color="#7FC15E"/>
            </div>

        </div>

        <FlipMove>
            {posts.map(({id, data: {name, description, message, photoUrl}}) => 
            
            (<Post 
                key={id} 
                name={name} 
                description={description} 
                message={message} 
                photoUrl={photoUrl}
            />)
        
            )}
        </FlipMove>
        

    </div>
  )
}

export default Feed