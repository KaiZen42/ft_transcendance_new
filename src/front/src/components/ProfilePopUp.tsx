
import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { User } from "../models/User.interface";
import "../styles/ProfilePopUp.css"

interface Props {
	show: boolean;
	user: User;
	onClose: () => void;
  updateState: (user: User) => void;
}

export default function ProfilePopUp({onClose, show, user, updateState}: Props) {

  const [editUsername, setEditUsername] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<User>({
    id: 0,
    avatar: "",
    username: "",
    two_fa_auth: false
  })
  
  const closeHandler = () => {
    setUpdatedUser({
      ...user
    })
    setEditUsername(false)
    onClose();
  };

  const upload = async (files: FileList | null) => {
    if (files === null) return;
    const formData = new FormData();
    formData.append("to_upload", files[0]);
    await axios
      .post(`http://${process.env.REACT_APP_BASE_IP}:3000/api/users/image`, formData, { withCredentials: true })
    window.location.reload();
	}

  function updateUser(e: ChangeEvent<HTMLInputElement>) {
    const {name, value, type, checked} = e.target
    setUpdatedUser(prevUser => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  useEffect(() => {
    setUpdatedUser(user)
  }, [user])

  function applyChanges(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    updateState(updatedUser)
    onClose()
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
			<img src={user?.avatar} className="popup--image"/>
			<div className="image-upload">
				<label htmlFor="file-input">
					<i className="bi bi-cloud-arrow-up popup--icon"/>
				</label>
				<input id="file-input" type="file" onChange={e => upload(e.target.files)}/>
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
                <i className="bi bi-check popup--form--icon" onClick={() => setEditUsername(false)}></i>
              </div>
              </>
          }
          { !editUsername &&
              <>
              <div className="col-6">
                <span className="form-text">{updatedUser?.username}</span>
              </div>
              <div className="col-2">
                <i className="bi bi-pencil popup--form--icon" onClick={() => setEditUsername(true)}></i>
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
              <input name="two_fa_auth" className="form-check-input" type="checkbox" onChange={e => updateUser(e)} checked={updatedUser?.two_fa_auth}/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <button className="btn btn-outline-success">Apply</button>
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