
import axios from "axios";
import { ChangeEvent, createRef, FormEvent, useEffect, useState } from "react";
import { PassThrough } from 'stream';
import { User } from "../models/User.interface";
import "../styles/ProfilePopUp.css"

interface Props {
	show: boolean;
	user: User;
	onClose: () => void;
  updateState: (user: User) => void;
}

interface UpdateUser {
  id: number,
  avatar: string,
  username: string,
  two_fa_auth: boolean,
  file: React.RefObject<HTMLInputElement>,
  auth_code: number
}

export default function ProfilePopUp({onClose, show, user, updateState}: Props) {

  const [image, setImage] = useState<JSX.Element>()
  const [code, setCode] = useState()
  const [editUsername, setEditUsername] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UpdateUser>({
    id: 0,
    avatar: "",
    username: "",
    two_fa_auth: false,
    file: createRef(),
    auth_code: 0
  })
  
  const closeHandler = () => {
    updatedUser.file.current!.value = ""
    setUpdatedUser({
      ...user,
      file: createRef(),
      auth_code: 0
    })
    setEditUsername(false)
    setImage(undefined)
    onClose();
  };

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0)
        return
    const url = URL.createObjectURL(e.target.files[0])
    console.log(url)
    setUpdatedUser(prevUser => ({
      ...prevUser,
      avatar: url
    }))
  }

  async function updateUser(e: ChangeEvent<HTMLInputElement>) {
    const {name, value, type, checked} = e.target
    if (type == "checkbox" && checked && !user.two_fa_auth)
    {
      const res = await axios
        .post(`http://${process.env.REACT_APP_BASE_IP}:3000/api/generate`, {
          id: updatedUser.id,
          avatar: updatedUser.avatar,
          username: updatedUser.username,
          two_fa_auth: updatedUser.two_fa_auth
        }, {responseType: 'blob'})
      const url = URL.createObjectURL(res.data);
      setImage(<img src={url}/>)
    }
    if (type == "checkbox" && !checked)
      setImage(undefined)
    setUpdatedUser(prevUser => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  useEffect(() => {
    setUpdatedUser(() => ({
      ...user,
      file: createRef(),
      auth_code: 0}))
  }, [user])

  async function applyChanges(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (updatedUser.file.current!.files!.length > 0)
    {
      const formData = new FormData();
      formData.append("to_upload", updatedUser.file.current!.files![0]);
      await axios
        .post(`http://${process.env.REACT_APP_BASE_IP}:3000/api/users/image`, formData, { withCredentials: true })
    }
    if (code)    
    updateState({
      id: updatedUser.id,
      avatar: updatedUser.avatar,
      username: updatedUser.username,
      two_fa_auth: updatedUser.two_fa_auth
    })
    updatedUser.file.current!.value = ""
    onClose()
  }

  const isChanged = () : boolean | undefined => {
    return !(updatedUser?.avatar != user?.avatar ||
            updatedUser?.two_fa_auth != user?.two_fa_auth ||
            updatedUser?.username != user?.username)
  }

  return (
    <div
      style={{
        visibility: show ? "visible" : "hidden",
        opacity: show ? "1" : "0"
      }}
      className="overlay"
    >
      <div className="popup">
        <span className="close" onClick={closeHandler}>
          &times;
        </span>
        <div className="content">
			<img src={updatedUser?.avatar} className="popup--image"/>
			<div className="image-upload">
				<label htmlFor="file-input">
					<i className="bi bi-cloud-arrow-up popup--icon"/>
				</label>
				<input id="file-input" type="file" ref={updatedUser.file} onChange={onSelectFile}/> 
			</div>
      <form className="container" onSubmit={applyChanges}>
        <div className="row ">
          <div className="col-4">
            <label htmlFor="username" className="col-5 form-label">username</label>
          </div>
          { editUsername &&
              <>
              <div className="col-6">
                <input id="username" name="username" type="text" className="col-5 form-control" onChange={e => updateUser(e)} value={updatedUser?.username}/>
              </div>
              <div className="col-2">
                { updatedUser?.username.length != 0 && 
                  <i className="bi bi-check popup--form--icon" style={{"fontSize": "2rem"}}onClick={() => setEditUsername(false)}/> }
              </div>
              </>
          }
          { !editUsername &&
              <>
              <div className="col-6">
                <span className="form-text">{updatedUser?.username}</span>
              </div>
              <div className="col-2">
                <i className="bi bi-pencil popup--form--icon" onClick={() => setEditUsername(true)}/>
              </div>
            </>
          }
        </div>
        <div className="row">
          <div className="col-5">
            <span className="form-label">Wins</span>
          </div>
          <div className="col-7">
            <span className="form-text">0</span>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <span className="form-label">Losses</span>
          </div>
          <div className="col-7">
            <span className="form-text">0</span>
          </div>
        </div>
        <div className="row">
          <div className="col-7">
            <span className="form-label">2FA Authentication</span>
          </div>
          <div className="col-4">
            <div className="form-check form-switch form-check-inline">
              {/* this switch generates a warning, idk why */}
              <input name="two_fa_auth" className="form-check-input" type="checkbox" onChange={e => updateUser(e)} checked={updatedUser!.two_fa_auth}/>
            </div>
          </div>
        </div>
        {image && <>
         <div className="row">
           <div className="col">{image}</div>
        </div>
        <div className="row">
          <div className="col"><input name="auth_code" type="text" onChange={e => updateUser(e)} value={updatedUser?.auth_code}/></div>
        </div></>}
        <div className="row">
          <div className="col">
            <button className="btn btn-outline-success" disabled={isChanged() || editUsername}>Apply</button>
          </div>
          <div className="col">
            <button type="button" className="btn btn-outline-danger" onClick={closeHandler}>Cancel</button>
          </div>
        </div>
      </form>
		</div>
      </div>
    </div>
  );
};