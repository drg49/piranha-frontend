import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { GlobalCtx } from '../App'

const Header = () => {

    const {gState, setGState} = useContext(GlobalCtx)

    const logout = (<Link><h2 onClick={() => {
        localStorage.removeItem("token")
        setGState({...gState, token: null})
    }}>Logout</h2></Link>)

    const myProfile = (<Link to="/my_profile"><h2>My Profile</h2></Link>)

    return (
        <nav>
            {/* Show logout and myProfile if the user is currently logged in */}
            {gState.token ? myProfile : null}
            {gState.token ? logout : null}
        </nav>
    ) 

}

export default Header