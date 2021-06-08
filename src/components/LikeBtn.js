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
    

    const handleLike = () => {
        if(isLiked === false) {
            setIsLiked(true)
            setButtonStyle({ color: "red" })
            addLike(postID, username)
        }
        if(isLiked === true) {
            setIsLiked(false)
            setButtonStyle({ color: "gray" })
            removeLike(postID, username)
        }
    }

    const addLike = (postID, username) => {
        fetch(url + "/post/" + postID + "/like/" + username, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
        .then(response => response.json())
    }

    const removeLike = (postID, username) => {
        fetch(url + "/post/" + postID + "/dislike/" + username, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
        .then(response => response.json())
    }

    return (
        <>
        <div id="like-icon" onClick={handleLike} style={buttonStyle}>{likeIcon}</div>
        </>
    )
}

export default LikeBtn