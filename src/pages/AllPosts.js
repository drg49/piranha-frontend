import { useContext, useEffect, useState } from 'react'
import { GlobalCtx } from '../App'
const moment = require('moment')
const postsPerPage = 3;
let arrayForHoldingPosts = [];

const AllPosts = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [posts, setPosts] = useState(null)
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

    useEffect(() => {
        getAllPosts(0, postsPerPage)
    }, [])
    
    const handleShowMorePosts = () => {
        getAllPosts(next, next + postsPerPage);
        setNext(next + postsPerPage);
    };

    return (
        <>
            <h1>All Posts</h1>
            <section id="post-board">
            {postsToShow ? postsToShow.map((post) => {
                return (
                    <div id="post">
                        <section id="post-header">
                            <h2>{post.username}</h2>
                            <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                        </section>
                        <img src={post.img} />
                        <h3 id="post-note">{post.note}</h3>
                    </div>
                )
            }) : null}
            <button onClick={handleShowMorePosts}>Load more</button>
            </section>
        </>
    )

}

export default AllPosts