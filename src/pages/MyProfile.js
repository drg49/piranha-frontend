import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
const moment = require("moment")
const postsPerPage = 3;
let arrayForHoldingPosts = [];

const trash = <FontAwesomeIcon icon={faTrash} />

const Dashboard = (props) => {

    let history = useHistory()

    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState 
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
    }

    useEffect(() => {
        getPosts(0, postsPerPage)
    }, [])

    const handleShowMorePosts = () => {
        getPosts(next, next + postsPerPage);
        setNext(next + postsPerPage);
      };


    const handleDelete = (id) => {
        fetch(url + "/post/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "bearer " + token
            },
        })
        .then(response => response.json())
        .then(data => {
            getPosts(next, next + postsPerPage);
        })
        .then(() => window.location.reload())
    }

    const goToCreate = () => {
        history.push("/create_post")
        window.location.reload()
    }

    return (
        <div>
            <h1>My Posts</h1>
            {/* NEW POST */}
            <button onClick={goToCreate}>Create Post</button>
            {/*  */}
            <section id="post-board">
                {postsToShow ? postsToShow.map((post) => {
                    return (
                        <div id="post" key={post._id}>
                            <section id="post-header">
                                <h2>{post.username}</h2>
                                <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                            </section>
                            <img src={url + `/${post.image}`} />
                            <h3 id="post-note">{post.note}</h3>
                            <hr/>
                            <button onClick={() => handleDelete(post._id)}>{trash}</button>
                        </div>
                    )
                }) : null}
                <button onClick={handleShowMorePosts}>Load more</button>
            </section>
        </div>
    )

}

export default Dashboard