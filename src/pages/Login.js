import { useContext, useState } from 'react'
import { GlobalCtx } from '../App'

const Login = (props) => {

    const { gState, setGState } = useContext(GlobalCtx)
    const {url} = gState

    const blank = {
        username: "",
        password: "",
    }

    const [form, setForm] = useState(blank)

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
            console.log(data)
            localStorage.setItem("token", JSON.stringify(data))
            setGState({...gState, token: data.token})
            setForm(blank) //reset the form
            props.history.push("/")
        })
        .then(() => window.location.reload())
    }

    return (
        <nav>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username"/>
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password"/>
                    <input type="submit" value="Login" />
                </form>
            </div>
        </nav>  
    )


}

export default Login