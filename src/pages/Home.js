import {Link} from 'react-router-dom'

const Home = () => {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <p id="welcome-message">Piranha is a social media app that allows you to share images with the world. Please create an account or login to continue.</p>
            <Link to="/login"><button id="login">Login</button></Link>
            
            <Link to="/signup"><button id="create-account">Create Account</button></Link>
            
        </div>
    )
}

export default Home