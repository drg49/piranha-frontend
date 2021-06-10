import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGlobe, faHouseUser } from '@fortawesome/free-solid-svg-icons'

const user = <FontAwesomeIcon icon={faUser} />
const globe = <FontAwesomeIcon icon={faGlobe} />
const home = <FontAwesomeIcon icon={faHouseUser} />

const Header = () => {
    let history = useHistory()
    const {gState} = useContext(GlobalCtx)

    const goToPosts = () => {
        history.push("/")
        window.location.reload()
    }

    const goToFollowPosts = () => {
        history.push("/home")
        window.location.reload()
    }

    const allPosts = (<Link><h1 className="header-btn" onClick={goToPosts} title="Popular Posts">{globe}</h1></Link>)
    const myFollowers = (<Link><h1 className="header-btn" onClick={goToFollowPosts} title="My Feed">{home}</h1></Link>)
    const myProfile = (<Link to="/my_profile"><h1 className="header-btn" title="My Profile">{user}</h1></Link>)

    return (
        <nav>
            {/* Show logout and myProfile if the user is currently logged in */}
            {gState.token ? myProfile : null}
            {gState.token ? myFollowers : null}
            {gState.token ? allPosts : null}
            
        </nav>
    ) 

}

export default Header