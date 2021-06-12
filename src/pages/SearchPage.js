import { useEffect, useState, useContext } from "react"
import { useHistory, Link } from "react-router-dom"
import { GlobalCtx } from '../App'

const SearchPage = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [currentUser, setCurrentUser] = useState(null)
    const [users, setUsers] = useState(null)

    let history = useHistory()
    const [ locationKeys, setLocationKeys ] = useState([]) //Prevent bugs on browser back/forward button
    useEffect(() => {
      return history.listen(location => {
        if (history.action === 'PUSH') {
          setLocationKeys([ location.key ])
        }
        if (history.action === 'POP') {
          if (locationKeys[1] === location.key) {
            setLocationKeys(([ _, ...keys ]) => keys)
            window.location.reload()
          } else {
            setLocationKeys((keys) => [ location.key, ...keys ])
            window.location.reload()
          }
        }
      })
    }, [ locationKeys, ])

    const getUser = async () => {
        const response = await fetch(url + "/post/logged_in_user/", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setCurrentUser(data[0].username)
    }

    const getAllUsers = async () => {
        const response = await fetch(url + "/post/all/users", {
            method: "GET",
            headers: {
                Authorization: "bearer " + token
            }
        })
        const data = await response.json()
        setUsers(data)
    }

    useEffect(() => {
        async function fetchData() {
            await getUser()
            getAllUsers()
        }
        fetchData()
    }, [])

    const preventSpace = (e) => {
        if (e.key === " ") {
            e.preventDefault();
        }
    }

    const [results, setResults] = useState([])

    const handleChange = (event) => {
        let username = event.target.value.trim()
        if (username.length >= 1) {
            setResults(users.filter((item) => {
                return item.username.toLowerCase().includes(username.toLowerCase())
            }).map((item, index) => {
                return (
                    currentUser === item.username ? <Link to="/my_profile"><li key={index}>{item.username}</li></Link> : 
                    <Link to={`/user/${item.username}`}><li key={index}>{item.username}</li></Link>
                )
            })
            )
        } else {
            return null
        }
    }

    return (
        <>
            <input type="text" onChange={handleChange} onKeyDown={preventSpace} id="search-field"/>
            <section id="follow-list">
                {results ? results: null}
            </section>
        </>
    )
}

export default SearchPage