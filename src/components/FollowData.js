// This component only appears in the my_profile page 
// FollowData for other users will belong in the FollowBtn.js component
import { Link, useHistory } from "react-router-dom"
import { useEffect, useState } from "react"

const FollowData = (props) => {

    const {followData} = props
    const{currentUser} = props

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
        <section id="follow-data">
            <Link to={`/followers/Your Followers/${currentUser}/0`}><p>Followers: {followData.followers.length}</p></Link>
            <Link to={`/followers/Who You Follow/${currentUser}/1`}><p>Following: {followData.following.length}</p></Link>
        </section>
    )
}

export default FollowData