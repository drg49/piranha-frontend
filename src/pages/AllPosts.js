import { useContext, useEffect, useState } from 'react'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
const moment = require('moment')
const postsPerPage = 3;
let arrayForHoldingPosts = [];

const trash = <FontAwesomeIcon icon={faTrash} />
const edit = <FontAwesomeIcon icon={faPencilAlt} />

const AllPosts = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [currentUser, setCurrentUser] = useState(null)
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(3);

    const loopWithSlice = (start, end, val) => {
        const slicedPosts = val.slice(start, end)
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };

    const getAllPosts = async (a, b) => {
        const response = await fetch(url + "/post/all/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        console.log(data)
        loopWithSlice(a, b, data.reverse())
    }
    // We are going to grab the current user so we can add delete/edit buttons to only their posts.
    const getUser = async () => {
        const response = await fetch(url + "/post/logged_in_user/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setCurrentUser(data[0].username)
    }
    
    useEffect(() => {
        getAllPosts(0, postsPerPage)
        getUser()
    }, [])
    
    const handleShowMorePosts = () => {
        getAllPosts(next, next + postsPerPage);
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
            getAllPosts(next, next + postsPerPage);
        })
        .then(() => window.location.reload())
    }

    

    return (
        <>
            <h1>All Posts</h1>
            <section id="post-board">
            {postsToShow ? postsToShow.map((post) => {
                return (
                    <div id="post" key={post._id}>
                        <section id="post-header">
                            {currentUser === post.username ? <Link to="/my_profile"><h2>{post.username}</h2></Link> : <Link to={`/user/${post.username}`}><h2>{post.username}</h2></Link>}
                            <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                        </section>
                        <img src={post.img} />
                        <h3 id="post-note">{post.note}</h3>
                        {/* If the current user is equal to the post username, then add a delete button! */}
                        {currentUser === post.username ? <> <hr/> <button>{edit}</button> <button onClick={() => handleDelete(post._id)}>{trash}</button> </> : null}
                    </div>
                )
            }) : null}
            <button onClick={handleShowMorePosts}>Load more</button>
            </section>
        </>
    )

}

export default AllPosts