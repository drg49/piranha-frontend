import { useEffect, useState, useContext } from "react"
import { GlobalCtx } from '../App'

const FollowBtn = (props) => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const {currentUser} = props
    const {user} = props
    const {following} = props
    const {followData} = props

    const setText = () => {
        if (following === false) {
            return "Follow"
        }
        if (following === true) {
            return "Unfollow"
        }
    }

    const [buttonTxt, setButtonTxt] = useState(setText()) //set the button text to be follow or unfollow!
    const [isFollowing, setIsFollowing] = useState(following)

    useEffect(() => {
        props.getUserAcct()
    })

    const handleFollow = () => {
        if (isFollowing === false) {
            setIsFollowing(true)
            setButtonTxt("Unfollow")
            addFollower(currentUser, user)
        }
        if (isFollowing === true) {
            setIsFollowing(false)
            setButtonTxt("Follow")
            removeFollower(currentUser, user)
        }
    }

    const addFollower = (currentUser, user) => {
        fetch(url + "/post/" + currentUser + "/follow/" + user, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
    }

    const removeFollower = (currentUser, user) => {
        fetch(url + "/post/" + currentUser + "/unfollow/" + user, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
    }

    return (
        <>
        <section id="follow-data">
            <p>Followers: {followData.followers.length}</p>
            <p>Following: {followData.following.length}</p>
        </section>
        <button onClick={handleFollow}>{buttonTxt}</button>
        </>
    )
}

export default FollowBtn