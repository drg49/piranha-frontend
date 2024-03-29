import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import LikeBtn from '../components/LikeBtn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import FollowData from '../components/FollowData'
import LogoutBtn from '../components/LogoutBtn'
import loading from '../components/Loading.gif'
const moment = require("moment")
const postsPerPage = 15;
let arrayForHoldingPosts = [];
const trash = <FontAwesomeIcon icon={faTrash} />
const edit = <FontAwesomeIcon icon={faPencilAlt} />

const MyProfile = () => {

    let history = useHistory()
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState 
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(15);
    const [editForm, setEditForm] = useState(null)
    const [currentID, setCurrentID] = useState(null)
    const [postLength, setPostLength] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [followData, setFollowData] = useState({followers: [], following: []})
    const [bio, setBio] = useState(null)
    const [bioForm, setBioForm] = useState(null)
    const [bioUpdate, setBioUpdate] = useState(false)
    let idVar; 

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
        setPostLength(data.length)
        loopWithSlice(a, b, data.reverse())
        await getUser()
    }

    const getUser = async () => {
        const response = await fetch(url + "/post/logged_in_user/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setCurrentUser(data[0].username)
        setBio(data[0].bio)
        setFollowData({followers: data[0].followers, following: data[0].following})
    }

    useEffect(() => {
        async function fetchData() {
            await getUser()
            getPosts(0, postsPerPage)
        }
        fetchData()
    }, [])

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
        .then(() => {
            getPosts(next, next + postsPerPage);
        })
        .then(() => window.location.reload())
    }

    const goToCreate = () => {
        history.push("/create_post")
        window.location.reload()
    }
    //////EDIT POSTS/////
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
            getPosts(next, next + postsPerPage);
        })
        .then(() => {getUser()})
        .then(() => window.location.reload())
    }
    ///////////////////////
    //////EDIT BIO/////////
    const handleBioChange = (event) => {
        setBioForm(<div id="edit-bio"><textarea id="bio-text" onChange={handleBioChange} value={event.target.value} maxLength="150"></textarea><br /><button id="submit-bio" onClick={handleBioUpdate}>Done</button></div>)
    }
    
    const bioUpdateStart = (currentBio) => {
        setBioUpdate(true)
        setBioForm(<div id="edit-bio"><textarea id="bio-text" onChange={handleBioChange} value={currentBio} maxLength="150"></textarea><br /><button id="submit-bio" onClick={handleBioUpdate}>Done</button></div>)
    }

    const handleBioUpdate = () => {
        const bio = document.getElementById("bio-text").value
        setBioUpdate(false)
        fetch(url + "/post/user/bio", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            },
            body: JSON.stringify({bio})
        })
        .then(() => window.location.reload())
    }
    ////////////////////////
    return (
        <div>
            {currentUser ? 
            <>
            <nav id="profile-header">
                <h1 id="user-title">{currentUser}</h1>
                <LogoutBtn />
            </nav>
            <section id="bio">
                { bioUpdate === true ? bioForm :
                <>
                {bio}
                <div id="edit-bio-btn" title="Edit Bio" onClick={() => bioUpdateStart(bio)}>{edit}</div>
                </> }
            </section>
            <FollowData followData={followData} currentUser={currentUser}/> 
            <button id="create-btn" onClick={goToCreate}>Create Post</button>
            <h3>My Posts</h3>
            </> : null }
            <section id="post-board">
                {postsToShow.length > 0 ? postsToShow.map((post) => {
                    return (
                        <div id="post" key={post._id}>
                            <section id="post-header">
                                <h2>{post.username}</h2>
                                <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                            </section>
                            <img src={`https://drg-s3-2.s3.amazonaws.com/${post.image}`} alt="Post created by you"/>
                            <h3 id="post-note">{currentID === post._id ? editForm : post.note}</h3>
                            <hr/>
                            <section id="post-footer">
                            <LikeBtn postID={post._id} username={currentUser} liked={post.likes.includes(currentUser)} likesArray={post.likes} />
                            <div id="edit-delete-btns">
                                <button id="edit-btn" title="Edit" onClick={() => beginUpdate(post._id, post.note)}>{edit}</button>
                                <button title="Delete" onClick={() => handleDelete(post.image)}>{trash}</button>
                            </div>
                            </section>
                        </div>
                    )
                }) : postsToShow.length === 0 ? null : <><img id="load-gif" src={loading} alt="Loading"/><p>Please wait while we grab your data</p></>}
                {postLength !== postsToShow.length && postLength > 15  ? <button id="see-more-btn" onClick={handleShowMorePosts}>See more</button> : null}
            </section>
        </div>
    )
}

export default MyProfile