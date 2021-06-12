import { useContext, useEffect, useState } from 'react'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'
import LikeBtn from '../components/LikeBtn'
import loading from '../components/Loading.gif'
const moment = require('moment')
const postsPerPage = 15;
let arrayForHoldingPosts = [];

const trash = <FontAwesomeIcon icon={faTrash} />
const edit = <FontAwesomeIcon icon={faPencilAlt} />

const AllPosts = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [currentUser, setCurrentUser] = useState(null)
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(15);
    const [editForm, setEditForm] = useState(null)
    const [currentID, setCurrentID] = useState(null)
    const [postLength, setPostLength] = useState(null)
    let idVar; 
    let history = useHistory()
    const [ locationKeys, setLocationKeys ] = useState([]) //Prevent bugs on browser back/forward button
    useEffect(() => {
      return history.listen(location => {
        if (history.action === 'PUSH') {
          setLocationKeys([ location.key ])
        }
        if (history.action === 'POP') {
          if (locationKeys[1] === location.key) {
            setLocationKeys(([ _, ...keys ]) => keys)
            window.location.reload()
          } else {
            setLocationKeys((keys) => [ location.key, ...keys ])
            window.location.reload()
          }
        }
      })
    }, [ locationKeys, ])

    const loopWithSlice = (start, end, val) => {
        const slicedPosts = val.slice(start, end)
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };
    // Get all posts from the latest 60 days, (check the last route in the backend)
    const getAllPosts = async (a, b) => {
        const response = await fetch(url + "/post/all/latest", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setPostLength(data.length)
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
        async function fetchData() {
            await getUser()
            getAllPosts(0, postsPerPage)
        }
        fetchData()
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
        .then(() => {
            getAllPosts(next, next + postsPerPage);
        })
        .then(() => window.location.reload())
    }

    const handleChange = (event) => {
        setEditForm(<div id="create-caption"><textarea type="text" onChange={handleChange} id="update" value={event.target.value} name="note" maxLength="350"></textarea><br /><button id="upload-btn" onClick={() => handleUpdate(idVar)}>Done</button></div>)
    }

    const beginUpdate = (id, currentNote) => {
        setEditForm(<div id="create-caption"><textarea type="text" onChange={handleChange} id="update" value={currentNote} name="note" maxLength="350"></textarea><br /><button onClick={() => handleUpdate(id)}>Done</button></div>)
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
            getAllPosts(next, next + postsPerPage);
        })
        .then(() => {getUser()})
        .then(() => window.location.reload())
    }
    
    return (
        <>
            <h1>Popular Posts</h1>
            <section id="post-board">
            {postsToShow.length > 0 ? postsToShow.map((post) => {
                return (
                    <div id="post" key={post._id}>
                        <section id="post-header">
                            {currentUser === post.username ? <Link to="/my_profile"><h2>{post.username}</h2></Link> : <Link to={`/user/${post.username}`}><h2>{post.username}</h2></Link>}
                            <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                        </section>
                        <img src={post.image} alt={`Post from ${post.username}`}/>
                        <h3 id="post-note">{editForm && currentUser === post.username && currentID === post._id ? editForm : post.note}</h3>
                        {/* If the current user is equal to the post username, then add a delete and edit button! */}
                        {currentUser === post.username ? 
                        <> 
                        <hr/> 
                            <section id="post-footer">
                            {/* The username is the person who liked the post */}
                            <LikeBtn postID={post._id} username={currentUser} liked={post.likes.includes(currentUser)} likesArray={post.likes} />
                            <div id="edit-delete-btns"> 
                                <button id="edit-btn" title="Edit" onClick={() => beginUpdate(post._id, post.note)}>{edit}</button> 
                                <button title="Delete" onClick={() => handleDelete(post._id)}>{trash}</button> 
                            </div>
                            </section> 
                        </> :<><hr /><div id="just-like-btn"><LikeBtn postID={post._id} username={currentUser} liked={post.likes.includes(currentUser)} likesArray={post.likes} /></div></>}
                    </div>
                )
            }) : <><img id="load-gif" src={loading} alt="Loading"/><p>Please wait while we grab your data</p></>}
            {postLength !== postsToShow.length && postLength > 15  ? <button id="see-more-btn" onClick={handleShowMorePosts}>See more</button> : null}
            </section>
        </>
    )
}

export default AllPosts