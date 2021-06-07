import {Link} from 'react-router-dom'


const Home = () => {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>

            <Link to="/login"><button id="login">Login</button></Link>
            
            <Link to="/signup"><button id="create-account">Create Account</button></Link>
            
        </div>
    )
}

export default Home