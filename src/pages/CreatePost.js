import { useContext, useState } from 'react'
import {useHistory} from 'react-router-dom'
import { GlobalCtx } from '../App'
import loading from '../components/Loading.gif'

const CreatePost = () => {
    const { gState } = useContext(GlobalCtx)
    const { url, token } = gState

    const [upload, setUpload] = useState(null)
    const [img, setImg] = useState(null)
    const [caption, setCaption] = useState(null)
    let history = useHistory() 
  
  
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

    let base64;

    const uploadImage = async (e) => {
      const file = e.target.files[0];
      base64 = await convertBase64(file);
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
        console.log(note)
        fetch(url + "/post/", {
          method: "post",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "bearer " + token
          },
          body: JSON.stringify({image: base64, note: note})
      })
      .then(() => {history.push("/")})
      }
    }

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