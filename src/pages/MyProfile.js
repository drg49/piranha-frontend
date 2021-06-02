import { useContext, useEffect, useRef, useState } from 'react'
import { GlobalCtx } from '../App'

const postsPerPage = 3;
let arrayForHoldingPosts = [];

const Dashboard = () => {
    const { gState, setGState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [posts, setPosts] = useState(null)
    const [updateID, setUpdateID] = useState(null) 

    const imgRef = useRef(null)
    const noteRef = useRef(null)

    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(3);

    const loopWithSlice = (start, end, val) => {
        const slicedPosts = val.slice(start, end)
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
      };

    const getPosts = async (a, b) => {
        const response = await fetch(url + "/post/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        console.log(data)
        loopWithSlice(a, b, data.reverse())
        // setPosts(data)
    }

    useEffect(() => {
        getPosts(0, postsPerPage)
    }, [])


    
    const handleShowMorePosts = () => {
        getPosts(next, next + postsPerPage);
        setNext(next + postsPerPage);
      };

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
            getPosts(next, next + postsPerPage);
        })
        .then(() => window.location.reload())
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
                {postsToShow ? postsToShow.map((post) => {
                    return (
                        <div id="post">
                            <img src={post.img} />
                            <h3 id="post-note">{post.note}</h3>
                        </div>
                    )
                }) : null}
                <button onClick={handleShowMorePosts}>Load more</button>
            </section>
        </div>
    )

}


export default Dashboard