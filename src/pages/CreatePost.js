import { useContext, useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalCtx } from '../App'
import loadGif from '../components/Loading.gif'

const CreatePost = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [input, setInput] = useState(
      <div className='file file--upload'>
      <label htmlFor='input-file'>
      <i className="material-icons"></i>Upload
      </label>
      <input id='input-file' type='file' onChange={(e) => {uploadImage(e)}} />
      </div>
    )
    const [upload, setUpload] = useState(null)
    const [addCap, setAddCap] = useState(null)
    const [img, setImg] = useState(null)
    const [file, setFile] = useState(null)
    const [caption, setCaption] = useState(null)
    const [loading, setLoading] = useState(null)
    let history = useHistory() 
    let base64;

    const uploadImage = async (e) => {
      const file = e.target.files[0];
      setFile(file)
      base64 = await convertBase64(file);
      const str = base64
      if (str.charAt(5) + str.charAt(6) + str.charAt(7) + str.charAt(8) + str.charAt(9) === "image") {
      setInput(null)
      setImg(<img src={base64} alt="Your post" id="uploaded-img"/>)
      setUpload(<button type="submit" id="upload-btn">Post</button>)
      } else {
        setImg(<p>Please select an image file</p>)
        setCaption(null)
        setUpload(null)
      }
    }

    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        if (file) {
          fileReader.readAsDataURL(file);
        }

        fileReader.onload = () => {
          resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
          reject(error)
        }
      })
    }

    const handleCreate = (e) => {
      e.preventDefault()
        setUpload(null)
        setCaption(null)
        setLoading(<img id="load-gif" src={loadGif} alt="Loading"/>)
        const formData = new FormData();
        formData.append("image", file)
        fetch(url + "/post/", {
          method: "post",
          headers: {
              Accept: "application/json",
              Authorization: "bearer " + token
          },
          body: formData
      }).then(response => response.json())
      .then(data => {
        console.log(data)
        setLoading(null)
        setCaption(<><textarea type="text" id="cap" placeholder="Add a caption..."/><br /></>)
        setAddCap(<button onClick={() => handleUpdate(data._id)} id="upload-btn">Add Caption</button>)
      })
    }

    const handleUpdate = (id) => { //This adds a caption by updating the post model
      const note = document.getElementById("cap").value
      fetch(url + "/post/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "bearer " + token
        },
        body: JSON.stringify({note})
      }).then(()=> history.push("/home"))
    }

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

    return (
      <div className="App">
        <form onSubmit={handleCreate}>
          {input}
          <br />
          {img}
          <br/>
          {upload}
        {loading}
        </form>
        <div id="create-caption">
            {caption}
            {addCap}
        </div>
      </div>
    )
}

export default CreatePost