import { useContext, useEffect, useRef, useState } from 'react'
import { GlobalCtx } from '../App'

const AllPosts = () => {
    const { gState, setGState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [posts, setPosts] = useState(null)

    const getAllPosts = async () => {
        const response = await fetch(url + "/post/all/", {
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
        getAllPosts()
    }, [])

    return (
        <>
            <h1>All Posts</h1>
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
        </>
    )

}

export default AllPosts