import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import LikeBtn from '../components/LikeBtn'
import loading from '../components/Loading.gif'

const moment = require('moment')

const postsPerPage = 15;
let arrayForHoldingPosts = [];

const trash = <FontAwesomeIcon icon={faTrash} />
const edit = <FontAwesomeIcon icon={faPencilAlt} />

const FollowersPosts = () => {

    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [currentUser, setCurrentUser] = useState(null)
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(15);
    const [editForm, setEditForm] = useState(null)
    const [currentID, setCurrentID] = useState(null)
    const [postLength, setPostLength] = useState(null)
    const [currentFollowers, setCurrentFollowers] = useState(null) //see if the user is following anyone to display a message.
    let idVar; 

    const [followers, setFollowers] = useState(null)
    
    const loopWithSlice = (start, end, val) => {
        const slicedPosts = val.slice(start, end)
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };

    //first we get the user
    const getUser = async () => {
        const response = await fetch(url + "/post/logged_in_user/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setCurrentUser(data[0].username)
        setCurrentFollowers(data[0].following.length)
        setFollowers(data[0].username + "," + data[0].following.join(","))
        // only get the posts from the users we follow including our own posts
        getFollowingPosts(data[0].username + "," + data[0].following.join(","), 0, postsPerPage)
    }

    const getFollowingPosts = async (arg, a, b) => {
        const response = await fetch(url + "/post/home/" + arg, {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setPostLength(data.length)
        loopWithSlice(a, b, data.reverse())
    }

    useEffect(() => {
        async function fetchData() {
            await getUser()
        }
        fetchData()
    }, [])

    const handleShowMorePosts = () => {
        console.log(followers)
        getFollowingPosts(followers, next, next + postsPerPage);
        setNext(next + postsPerPage);
    };

    const handleDelete = (id) => {
        fetch(url + "/post/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "bearer " + token
            },
        })
        .then(() => {
            getFollowingPosts(followers, next, next + postsPerPage);
        })
        .then(() => window.location.reload())
    }

    const handleChange = (event) => {
        setEditForm(<div id="create-caption"><textarea type="text" onChange={handleChange} id="update" value={event.target.value} name="note" maxLength="350"></textarea><br /><button id="upload-btn" onClick={() => handleUpdate(idVar)}>Done</button></div>)
    }

    const beginUpdate = (id, currentNote) => {
        setEditForm(<div id="create-caption"><textarea type="text" onChange={handleChange} id="update" value={currentNote} name="note" maxLength="350"></textarea><br /><button id="upload-btn" onClick={() => handleUpdate(id)}>Done</button></div>)
        setCurrentID(id)
        idVar = id
    }
    
    const handleUpdate = (id) => {
        const note = document.getElementById("update").value
        fetch(url + "/post/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            },
            body: JSON.stringify({note})
        })
        .then(() => {
            getFollowingPosts(followers, next, next + postsPerPage);
        })
        .then(() => {getUser()})
        .then(() => window.location.reload())
    }
    
    return (
        <>
        <h1>Your Feed</h1>
        <section id="post-board">
        {postsToShow.length > 0 ? postsToShow.map((post) => {
            return (
                <div id="post" key={post._id}>
                    <section id="post-header">
                        {currentUser === post.username ? <Link to="/my_profile"><h2>{post.username}</h2></Link> : <Link to={`/user/${post.username}`}><h2>{post.username}</h2></Link>}
                        <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                    </section>
                    <img src={`https://drg-s3-2.s3.amazonaws.com/${post.image}`} alt={`Post from ${post.username}`}/>
                    <h3 id="post-note">{editForm && currentUser === post.username && currentID === post._id ? editForm : post.note}</h3>
                    {/* If the current user is equal to the post username, then add a delete and edit button! */}
                    {currentUser === post.username ? 
                    <> 
                    <hr/> 
                        <section id="post-footer">
                        {/* The username attribute is the person who liked the post */}
                        <LikeBtn postID={post._id} username={currentUser} liked={post.likes.includes(currentUser)} likesArray={post.likes} />
                        <div id="edit-delete-btns"> 
                            <button id="edit-btn" title="Edit" onClick={() => beginUpdate(post._id, post.note)}>{edit}</button> 
                            <button title="Delete" onClick={() => handleDelete(post.image)}>{trash}</button> 
                        </div>
                        </section> 
                    </> :<><hr /><div id="just-like-btn"><LikeBtn postID={post._id} username={currentUser} liked={post.likes.includes(currentUser)} likesArray={post.likes} /></div></>}
                </div>
            )
        }) : currentFollowers === 0 ? null : <img id="load-gif" src={loading} alt="Loading"/>}
        {postLength !== postsToShow.length && postLength > 15  ? <button id="see-more-btn" onClick={handleShowMorePosts}>See more</button> : null}
        </section>
    </>
    )
}

export default FollowersPosts