import { useContext, useState } from 'react'
import {Link} from 'react-router-dom'
import { GlobalCtx } from '../App'

const Login = (props) => {

    const { gState, setGState } = useContext(GlobalCtx)
    const {url} = gState

    const blank = {
        username: "",
        password: "",
    }

    const [form, setForm] = useState(blank)
    const [errorText, setErrorText] = useState("")

    const handleChange = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const {username, password} = form

        fetch(`${url}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, password})
        })
        .then(response => response.json())
        .then((data) => {
            if (data.error === "User Does Not Exist") {
                console.log("user failed")
                setErrorText("Username does not exist.")
            } else if (data.error === "PASSWORD DOES NOT MATCH") {
                setErrorText("Password does not match.")
            } else {
            localStorage.setItem("token", JSON.stringify(data))
            setGState({...gState, token: data.token})
            setForm(blank) //reset the form
            props.history.push("/")
            window.location.reload()
            }
        })
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
                <input type="submit" value="Login" />
            </form>
        </section>
        <div id="form-bottom">
        <p>Dont have an account?</p>
        <Link to="/signup"><p id="margin-space">Register</p></Link>
        </div>
        </>  
    )
}

export default Login