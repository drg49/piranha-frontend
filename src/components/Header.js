import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGlobe, faHouseUser, faSearch } from '@fortawesome/free-solid-svg-icons'

const user = <FontAwesomeIcon icon={faUser} />
const globe = <FontAwesomeIcon icon={faGlobe} />
const home = <FontAwesomeIcon icon={faHouseUser} />
const searchIcon = <FontAwesomeIcon icon={faSearch} />

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

    const goToProfile = () => {
        history.push("/my_profile")
        window.location.reload()
    }

    const goToSearch = () => {
        history.push("/search")
        window.location.reload()
    }

    const allPosts = (<Link><h1 className="header-btn" onClick={goToPosts} title="Popular Posts">{globe}</h1></Link>)
    const myFollowers = (<Link><h1 className="header-btn" onClick={goToFollowPosts} title="My Feed">{home}</h1></Link>)
    const myProfile = (<Link><h1 className="header-btn" onClick={goToProfile} title="My Profile">{user}</h1></Link>)
    const search = (<Link><h1 className="header-btn" onClick={goToSearch} title="Search">{searchIcon}</h1></Link>)

    return (
        <nav>
            {/* Show logout and myProfile if the user is currently logged in */}
            {gState.token ? myProfile : null}
            {gState.token ? myFollowers : null}
            {gState.token ? search : null}
            {gState.token ? allPosts : null}
        </nav>
    ) 

}

export default Header