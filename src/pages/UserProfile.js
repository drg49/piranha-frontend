import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import LikeBtn from '../components/LikeBtn'
import FollowBtn from '../components/FollowBtn'
import loading from '../components/Loading.gif'
const moment = require('moment')

const postsPerPage = 15;
let arrayForHoldingPosts = [];

const UserProfile = (props) => {
    const username = props.match.params.user //Grab this value to add to the followers
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState
    const [postsToShow, setPostsToShow] = useState([]);
    const [next, setNext] = useState(15);
    const [postLength, setPostLength] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [currentUserProfile, setCurrentUserProfile] = useState(null)
    const [followData, setFollowData] = useState({followers: [], following: []})
    const [bio, setBio] = useState(null)

    const loopWithSlice = (start, end, val) => {
        const slicedPosts = val.slice(start, end)
        arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
        setPostsToShow(arrayForHoldingPosts);
    };
    //The profile that the current user is looking at, SHOWS THIER POSTS
    const getUserProfile = async (a, b) => {
        const response = await fetch(url + "/post/users/" + username, {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setPostLength(data.length)
        loopWithSlice(a, b, data.reverse())
    }
    //Gets only the account of the user we are looking at, NOT their profile posts. I know it's confusing. Look at our models/controllers in the backend to understand it better.
    const getUserAccount = async () => {
        const response = await fetch(url + "/post/useraccount/" + username, {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setFollowData({followers: data.followers, following: data.following})
        setBio(data.bio)
    }

    //Gets the current user, NOT the user profile
    const getUser = async () => {
        const response = await fetch(url + "/post/logged_in_user/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        console.log(data[0])
        setCurrentUserProfile(data[0]) //this is what you will grab to put in the currentUser param in the followbtn page (first param)
        setCurrentUser(data[0].username)
    }

    useEffect(() => {
        async function fetchData() {
            await getUser()
            await getUserAccount()
            getUserProfile(0, postsPerPage)
        }
        fetchData()
    }, [])

    let history = useHistory()
    const [ locationKeys, setLocationKeys ] = useState([]) //handle errors when broswer back/forward button is fired
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
        getUserProfile(next, next + postsPerPage);
        setNext(next + postsPerPage);
    };
    
    return (
        <div>
            <h1 id="user-title">{username}</h1>
            <div id="user-bio">{bio}</div>
            {currentUserProfile ? <FollowBtn currentUser={currentUser} user={username} following={currentUserProfile.following.includes(username)} followData={followData} currentUserLength={currentUserProfile.following.length} /> : null}
            <section id="post-board">
                {postsToShow.length > 0 ? postsToShow.map((post) => {
                    return (
                        <div id="post" key={post._id}>
                            <section id="post-header">
                                <h2>{post.username}</h2>
                                <h3>{moment(post.createdAt).format('MM-DD-YYYY')}</h3>
                            </section>
                            <img src={`https://drg-s3-2.s3.amazonaws.com/${post.image}`} alt={`Post by ${post.username}`}/>
                            <h3 id="post-note">{post.note}</h3>
                            <><hr /><div id="just-like-btn"><LikeBtn postID={post._id} username={currentUser} liked={post.likes.includes(currentUser)} likesArray={post.likes} /></div></>
                        </div>
                    )
                }) : postsToShow.length === 0 ? null : <><img id="load-gif" src={loading} alt="Loading"/><p>Please wait while we grab your data</p></>}
                {postLength !== postsToShow.length && postLength > 15  ? <button id="see-more-btn" onClick={handleShowMorePosts}>See more</button> : null}
            </section>
        </div>
    )
}

export default UserProfile