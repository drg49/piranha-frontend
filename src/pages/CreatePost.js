import { useContext, useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalCtx } from '../App'

const CreatePost = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [upload, setUpload] = useState(null)
    const [img, setImg] = useState(null)
    const [caption, setCaption] = useState(null)
    let history = useHistory() 
    let base64;

    const uploadImage = async (e) => {
      const file = e.target.files[0];
      base64 = await convertBase64(file);
      console.log(base64)
      setImg(<img src={base64} alt="Your post" id="uploaded-img"/>)
      setCaption(<><textarea type="text" id="cap" placeholder="Add a caption..."/><br /></>)
      setUpload(<button onClick={handleCreate} id="upload-btn">Upload</button>)
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
            <input type="file" onChange={(e) => {uploadImage(e)}} className="custom-file-input"></input>
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