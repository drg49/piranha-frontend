import { useContext, useEffect, useState } from 'react'
import { GlobalCtx } from '../App'
const moment = require('moment')

const postsPerPage = 3;
let arrayForHoldingPosts = [];

const UserProfile = (props) => {
    const username = props.match.params.user
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(3);

    const loopWithSlice = (start, end, val) => {
        const slicedPosts = val.slice(start, end)
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };

    const getUserProfile = async (a, b) => {
        const response = await fetch(url + "/post/users/" + username, {
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
        getUserProfile(0, postsPerPage)
    }, [])

    const handleShowMorePosts = () => {
        getUserProfile(next, next + postsPerPage);
        setNext(next + postsPerPage);
    };

    return (
        <div>
            <h1>User Profile</h1>
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
                        </div>
                    )
                }) : null}
                <button onClick={handleShowMorePosts}>Load more</button>
            </section>
        </div>
    )
}

export default UserProfile