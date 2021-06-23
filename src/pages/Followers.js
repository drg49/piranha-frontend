import { useEffect, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { GlobalCtx } from '../App'

const Followers = (props) => {

  const { gState } = useContext(GlobalCtx)
  const { url, token } = gState

  const [followData, setFollowData] = useState([])

    const username = props.match.params.data
    const name = props.match.params.name
    const num = props.match.params.num

  const currentUser = localStorage.getItem("user")

    const getFollowers = async () => {
      const response = await fetch(url + "/post/useraccount/" + username, {
        method: "GET",
        headers: {
            Authorization: "bearer " + token
        }
      })
      const data = await response.json()
        if (num === '0') {
          setFollowData(data.followers)
        } else if (num === '1') {
          setFollowData(data.following)
        }
    }
    
    useEffect(() => {
      getFollowers()
    }, [])

    return (
        <>
            <h2 id="followers-title">{name}</h2>
            <section id="follow-list">
                {followData ? followData.map((item, index) => {
                  return <Link to={currentUser === item ? `/my_profile` : `/user/${item}`} key={index}><li>{item}</li></Link>
                }) : null }
            </section>
        </>
    )
}


export default Followers