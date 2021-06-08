import { useContext, useState } from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalCtx } from '../App'
import axios from 'axios'
import loading from '../components/Loading.gif'

const CreatePost = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [formData, setFormData] = useState('')
    const [info, setInfo] = useState({
      image: ''
    })
    const [progressPercent, setProgressPercent] = useState(null)
    const [error, setError] = useState({
      found: false,
      message: ''
    })
    const [submitBtn, setSubmitBtn] = useState(null)
    const [captionInput, setCaptionInput] = useState(null)
    let history = useHistory() 
  
    // Upload image
    const upload = ({target: {files}}) => {
      let data = new FormData()
      data.append('categoryImage', files[0])
      data.append('name', files.name)
      setFormData(data)
      setSubmitBtn(<button type="submit" id="upload-btn">Upload</button>)
    }
  
    const [uploadBtn, setUploadBtn] = useState(<input type="file" onChange={upload} className="custom-file-input"></input> )
  
    // Send request
    const handleSubmit = (event) => {
      event.preventDefault()
      setInfo({
        image: ''
      })

      const headers = {headers: {
        "Authorization": "bearer " + token
      }}
  
      axios.post(url + '/post/', formData, headers) //change this to url || heroku link later
      .then(res => {
        setProgressPercent(<img src={loading} id="load-gif" alt="Loading"/>)
        setSubmitBtn(null)
        setUploadBtn(null)
        setTimeout(()=> {
          setInfo(res.data.category)
          setProgressPercent("Image Uploaded!")
          setCaptionInput(<div id="create-caption"><textarea type="text" id="cap" placeholder="Add a caption..."/><br /> <button onClick={() => addCaption(res.data.category._id, document.getElementById("cap").value)}>Post</button></div>)
        }, 1000)
        setTimeout(() => {
          setProgressPercent(<br />)
        }, 4000)
      }).catch(err => {
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
          setProgressPercent("Please choose a valid image file to upload.")
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
          {info.image ? <img src={url + `/${info.image}`} id="uploaded-img" alt="" /> : null}
        </section>
        {captionInput}
      </div>
    )
}

export default CreatePost