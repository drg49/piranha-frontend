import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
const moment = require("moment")
const postsPerPage = 3;
let arrayForHoldingPosts = [];

const trash = <FontAwesomeIcon icon={faTrash} />
const edit = <FontAwesomeIcon icon={faPencilAlt} />

const Dashboard = (props) => {

    let history = useHistory()

    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState 
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(3);
    const [editForm, setEditForm] = useState(null)
    const [currentID, setCurrentID] = useState(null)
    const [update,setUpdate] = useState({note: ''})
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

    const handleChange = (event) => {
        setUpdate({...update, [event.target.name]: event.target.value})
        setEditForm(<><input type="text" onChange={handleChange} id="update" value={event.target.value} name="note" maxLength="350"/><button onClick={() => handleUpdate(idVar)}>Submit</button></>)
    }

    const beginUpdate = (id, currentNote) => {
        setUpdate({note: currentNote})
        setEditForm(<><input type="text" onChange={handleChange} id="update" value={currentNote} name="note" maxLength="350"/><button onClick={() => handleUpdate(id)}>Submit</button></>)
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
        .then(response => response.json())
        .then(data => {
            getPosts(next, next + postsPerPage);
        })
        .then(() => window.location.reload())
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
                            <h3 id="post-note">{currentID === post._id ? editForm : post.note}</h3>
                            <hr/>
                            <button onClick={() => beginUpdate(post._id, post.note)}>{edit}</button>
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