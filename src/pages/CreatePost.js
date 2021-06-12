import { useContext, useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalCtx } from '../App'

const CreatePost = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [input, setInput] = useState(
      <div class='file file--upload'>
      <label for='input-file'>
      <i class="material-icons"></i>Upload
      </label>
      <input id='input-file' type='file' onChange={(e) => {uploadImage(e)}} />
      </div>
    )
    const [upload, setUpload] = useState(null)
    const [img, setImg] = useState(null)
    const [caption, setCaption] = useState(null)
    let history = useHistory() 
    let base64;

    const uploadImage = async (e) => {
      const file = e.target.files[0];
      base64 = await convertBase64(file);
      const str = base64
      if (str.charAt(5) + str.charAt(6) + str.charAt(7) + str.charAt(8) + str.charAt(9) === "image") {
        setInput(null)
      setImg(<img src={base64} alt="Your post" id="uploaded-img"/>)
      setCaption(<><textarea type="text" id="cap" placeholder="Add a caption..."/><br /></>)
      setUpload(<button onClick={handleCreate} id="upload-btn">Post</button>)
      } else {
        setImg(<p>Please select an image file</p>)
        setCaption(null)
        setUpload(null)
      }
    }

    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
          reject(error)
        }
      })
    }

    const handleCreate = () => {
      if (base64 === undefined) {
        console.log("Please choose a file")
      } else {
        const note = document.getElementById("cap").value
        fetch(url + "/post/", {
          method: "post",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "bearer " + token
          },
          body: JSON.stringify({image: base64, note: note})
      })
      .then(() => {history.push("/home")})
      }
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
        {input}
        <br />
        {img}
        <br/>
        <div id="create-caption">
          {caption}
          {upload}
        </div>
      </div>
    )
}

export default CreatePost