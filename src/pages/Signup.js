import { useContext, useState } from 'react'
import {Link} from 'react-router-dom'
import { GlobalCtx } from "../App"

const Signup = (props) => {

    const { gState, setGState } = useContext(GlobalCtx)
    const {url} = gState 

    const blank = {
        username: "",
        password: "",
        email: "",
    }

    const [form, setForm] = useState(blank)
    const [errorText, setErrorText] = useState("")

    const handleChange = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const {username, password, email} = form

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
            } else {
                props.history.push("/login")
            }
        })
    }

    return (
        <>
        <section id="account-form">
            <p id="error-text">{errorText}</p>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email (optional)" />
                <input type="submit" value="Sign Up" />
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