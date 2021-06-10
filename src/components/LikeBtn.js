import {useState, useContext, useEffect} from 'react'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const likeIcon = <FontAwesomeIcon icon={faHeart} />

const LikeBtn = (props) => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const {postID} = props
    const {username} = props
    
    const setColors = () => {
        if(props.liked === false) {
            return ({ color: "gray" })
        }
        if(props.liked === true) {
            return ({ color: "red" })
        }
    }

    const [buttonStyle, setButtonStyle] = useState(setColors())
    const [isLiked, setIsLiked] = useState(props.liked) //if the liked array includes the username then set this to true, else set to false
    const [numLikes, setNumLikes] = useState(props.likesArray.length)
    const [refresh, setRefresh] = useState("")


    const handleLike = () => {
        if(isLiked === false) {
            setIsLiked(true)
            setButtonStyle({ color: "red" })
            setNumLikes(props.likesArray.length + 1)
            addLike(postID, username)
        }
        if(isLiked === true) {
            setIsLiked(false)
            setButtonStyle({ color: "gray" })
            setNumLikes(props.likesArray.length)
            removeLike(postID, username)
        }
        if(isLiked === true && refresh === true) {
            setNumLikes(props.likesArray.length - 1)
        }
        if(isLiked === false && refresh === true) {
            setNumLikes(props.likesArray.length)
        }
    }

    //This handles errors on page refresh
    useEffect(() => {
        if(isLiked === true && buttonStyle.color === "red") {
            setRefresh(true)
        }
    }, [])

    const addLike = (postID, username) => {
        fetch(url + "/post/" + postID + "/like/" + username, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
    }

    const removeLike = (postID, username) => {
        fetch(url + "/post/" + postID + "/dislike/" + username, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
    }

    return (
        <section id="like-section">
            <div id="like-icon" onClick={handleLike} style={buttonStyle}>{likeIcon}</div>
            <div id="like-num">{numLikes}</div>
        </section>
    )
}

export default LikeBtn