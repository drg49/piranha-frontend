import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { GlobalCtx } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const leave = <FontAwesomeIcon icon={faArrowRight} size="xs"/>

const LogoutBtn = () => {
    
    const {gState, setGState} = useContext(GlobalCtx)

    const logout = (<Link><h3 className="header-btn" id="logout" onClick={() => {
        localStorage.clear()
        setGState({...gState, token: null})
    }}>Logout {leave}</h3></Link>)

    return  <>{gState.token ? logout : null}</>
}

export default LogoutBtn