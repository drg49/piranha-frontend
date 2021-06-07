import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faUser, faGlobe } from '@fortawesome/free-solid-svg-icons'

const leave = <FontAwesomeIcon icon={faArrowRight} size="xs"/>
const user = <FontAwesomeIcon icon={faUser} style={{fontSize: "31px"}}/>
const globe = <FontAwesomeIcon icon={faGlobe} />

const Header = () => {
    let history = useHistory()
    const {gState, setGState} = useContext(GlobalCtx)

    const logout = (<Link><h3 className="header-btn" onClick={() => {
        localStorage.removeItem("token")
        setGState({...gState, token: null})
    }}>Logout {leave}</h3></Link>)

    const goToPosts = () => {
        history.push("/")
        window.location.reload()
    }

    const allPosts = (<Link><h1 className="header-btn" onClick={goToPosts} style={{paddingLeft: "49px"}}>{globe}</h1></Link>)

    const myProfile = (<Link to="/my_profile"><h2 className="header-btn">{user}</h2></Link>)

    return (
        <nav>
            {/* Show logout and myProfile if the user is currently logged in */}
            {gState.token ? myProfile : null}
            {gState.token ? allPosts : null}
            {gState.token ? logout : null}
        </nav>
    ) 

}

export default Header