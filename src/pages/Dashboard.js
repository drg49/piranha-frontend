import { useContext, useEffect, useRef, useState } from 'react'
import { GlobalCtx } from '../App'

const Dashboard = () => {
    const { gState, setGState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [posts, setPosts] = useState(null)
    const [updateID, setUpdateID] = useState(null) 

    const imgRef = useRef(null)
    const noteRef = useRef(null)

    const getPosts = async () => {
        const response = await fetch(url + "/post/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        console.log(data)
        setPosts(data)
    }

    useEffect(() => {
        getPosts()
    }, [])

    const handleClick = () => {
        const note = noteRef.current.value
        const img = imgRef.current.value
        fetch(url + "/post/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            },
            body: JSON.stringify({note, img})
        })
        .then(response => response.json())
        .then(data => {
            noteRef.current.value = "";
            getPosts();
        })
    }

    return (
        <div>
            <h1>My Posts</h1>
            {/* NEW POST */}
            <input type="text" name="img" ref={imgRef} placeholder="Img URL" />
            <input type="text" name="note" ref={noteRef} placeholder="Description"/>
            <button onClick={handleClick}>Create Post</button>
            {/*  */}
            <section id="post-board">
                {posts ? posts.map((post) => {
                    return (
                        <div>
                            <h3>{post.note}</h3>
                            <img src={post.img} />
                        </div>
                    )
                }) : null}
            </section>
        </div>
    )

}

export default Dashboard