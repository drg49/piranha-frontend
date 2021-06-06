import { useContext, useState } from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalCtx } from '../App'
import axios from 'axios'

const CreatePost = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [formData, setFormData] = useState('')
    const [info, setInfo] = useState({
      image: ''
    })
    const [progressPercent, setProgressPercent] = useState("Upload Here")
    const [error, setError] = useState({
      found: false,
      message: ''
    })
    const [submitBtn, setSubmitBtn] = useState(<button type="submit" >Submit</button>)
    const [captionInput, setCaptionInput] = useState(null)
    let history = useHistory() 
  
    // Upload image
    const upload = ({target: {files}}) => {
      let data = new FormData()
      data.append('categoryImage', files[0])
      data.append('name', files.name)
      setFormData(data)
      setSubmitBtn(<button type="submit" >Submit</button>)
    }
  
    const [uploadBtn, setUploadBtn] = useState(<input type="file" onChange={upload}></input>)
  
    // Send request
    const handleSubmit = (event) => {
      event.preventDefault()
      setInfo({
        image: ''
      })
      const options = {
        onUploadProgress: () => {
          setProgressPercent("Loading, please wait.") // replace with loading icon
        }
      }

      const headers = {headers: {
        "Authorization": "bearer " + token
      }}
  
      axios.post(url + '/post/', formData, headers, options) //change this to url || heroku link later
      .then(res => {
          console.log(res)
        setSubmitBtn(null)
        setUploadBtn(null)
        console.log(res.data.category)
        setTimeout(()=> {
          setInfo(res.data.category)
          setProgressPercent("Done")
          setCaptionInput(<div><input type="text" id="cap"/> <button onClick={() => addCaption(res.data.category._id, document.getElementById("cap").value)}>Post</button></div>)
        }, 1000)
      }).catch(err => {
        console.log(err.response)
        setError({
          found: true,
          message: err.response.data.errors
        });
        setSubmitBtn(null)
        setTimeout(() =>  {
          setError({
            found: false,
            message: ''
          })
          setProgressPercent("Error, please choose another file.")
        }, 3000)
      })
    }
  
    const addCaption = (id, note) => {
      fetch(url + "/post/" + id, {
        method: "PUT",
        headers: {
            "Authorization": "bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({note})
    })
        history.push("/")
    }


    return (
        <div className="App">
        <main>
          {error.found && (
              <div>
                { error.message }
              </div>
         )}
  
           <div>
             {progressPercent}
           </div>
  
         <form onSubmit={handleSubmit}>
            <div>
             {uploadBtn}
            </div>
              {submitBtn}
         </form>
        </main>
        <section>
          <img src={url + `/${info.image}`} id="img-hide-broken" alt="" />
        </section>
        {captionInput}
      </div>
    )
}

export default CreatePost