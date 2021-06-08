import {useState, useContext} from 'react'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const likeIcon = <FontAwesomeIcon icon={faHeart} />

const LikeBtn = (props) => {

    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const {postID} = props
    const {username} = props

    const [buttonStyle, setButtonStyle] = useState({ color: "gray"})
    const [isLiked, setIsLiked] = useState(false)

    const handleLike = () => {

    }

    return (
        <>
        <div id="like-icon" onClick={handleLike} style={buttonStyle}>{likeIcon}</div>
        </>
    )
}

export default LikeBtn