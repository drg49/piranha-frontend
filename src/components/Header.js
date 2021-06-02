import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { GlobalCtx } from '../App'

const Header = () => {

    const {gState, setGState} = useContext(GlobalCtx)

    const logout = (<Link><h2 onClick={() => {
        localStorage.removeItem("token")
        setGState({...gState, token: null})
    }}>Logout</h2></Link>)

    const signup = (<Link to="/signup"><h2>Signup</h2></Link>)

    const login = (<Link to="/login"><h2>Login</h2></Link>)

    const myProfile = (<Link to="/my_profile"><h2>My Profile</h2></Link>)

    return (
        <nav>
            {/* Show signup/login if the user isn't currently logged in */}
            {gState.token ? null: signup}
            {gState.token ? null : login}
            {/* Show logout if the user is currently logged in */}
            {gState.token ? myProfile : null}
            {gState.token ? logout : null}
        </nav>
    ) 

}

export default Header