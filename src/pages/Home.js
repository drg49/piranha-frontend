import {Link} from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <h1>Welcome!</h1>

            <Link to="/login"><button>Login</button></Link>
            
            <Link to="/signup"><button>Create Account</button></Link>
            
        </div>
    )
}

export default Home