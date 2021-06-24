import { useContext, useState } from 'react'
import {Link} from 'react-router-dom'
import { GlobalCtx } from "../App"
import loadGif from '../components/Loading.gif'

const Signup = (props) => {

    const { gState } = useContext(GlobalCtx)
    const {url} = gState 

    const blank = {
        username: "",
        password: "",
        email: "",
    }

    const [form, setForm] = useState(blank)
    const [errorText, setErrorText] = useState("")
    const [submit, setSubmit] = useState(<input type="submit" value="Sign Up" id="create-account"/>)

    const handleChange = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const {username, password, email} = form
        if (form.username.includes(" ")){
            setErrorText("Username cannot have spaces")
        } else {
            setSubmit(<img id="load-gif" src={loadGif} alt="loading" />)
            fetch(`${url}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username, password, email})
            })
            .then(response => response.json())
            .then(data => {
                setForm(blank)
                if(data.error){
                    setErrorText("There is already an account with that username. Please choose another one.")
                    setSubmit(<input type="submit" value="Sign Up" id="create-account"/>)
                } else {
                    props.history.push("/login")
                }
            })
        }
    }

    const preventSpace = (e) => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }

    return (
        <>
        <section id="account-form">
            <p id="error-text">{errorText}</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" onKeyDown={preventSpace} minLength="3" maxLength="15" required/>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" minLength="3" maxLength="30" required/>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" maxLength="256"/>
                {submit}
            </form>
        </section>
        <div id="form-bottom">
        <p>Have an account?</p>
        <Link to="/login"><p id="margin-space">Log in</p></Link>
        </div>
        </>
    )

}

export default Signup