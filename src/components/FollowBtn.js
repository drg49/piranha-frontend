import { useEffect, useState, useContext } from "react"
import { Link, useHistory } from "react-router-dom"
import { GlobalCtx } from '../App'

const FollowBtn = (props) => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const {currentUser} = props
    const {user} = props
    const {following} = props
    const {followData} = props
    const {currentUserLength} = props

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
        .then(() => window.location.reload())
    }

    const removeFollower = (currentUser, user) => {
        fetch(url + "/post/" + currentUser + "/unfollow/" + user, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "bearer " + token
            }
        })
        .then(() => window.location.reload())
    }

    let history = useHistory()
    const [ locationKeys, setLocationKeys ] = useState([]) //Prevent bugs on browser back/forward button
    useEffect(() => {
      return history.listen(location => {
        if (history.action === 'PUSH') {
          setLocationKeys([ location.key ])
          window.location.reload()
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
    

    return (
        <>
        <section id="user-follow">
            <Link to={`/followers/${user}'s Followers/${user}/0`}><p>Followers: {followData.followers.length}</p></Link>
            <Link to={`/followers/${user} is following/${user}/1`}><p>Following: {followData.following.length}</p></Link>
        </section>
        <button id="follow-btn" onClick={handleFollow}>{buttonTxt}</button>
        </>
    )
}

export default FollowBtn