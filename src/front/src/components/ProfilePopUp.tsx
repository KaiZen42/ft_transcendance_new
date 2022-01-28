
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../models/User.interface";
import "../styles/ProfilePopUp.css"

interface Props {
	showProp: boolean;
	user: User | undefined;
	updateUser: (user: User) => void;
	onClose: () => void;
}

export default function ProfilePopUp({showProp, user, updateUser, onClose}: Props) {
  const [show, setShow] = useState(false);

  const closeHandler = () => {
    setShow(false);
    onClose();
  };

  useEffect(() => {
    setShow(showProp);
  }, [showProp]);

  const upload = async (files: FileList | null) => {
	if (files === null) return;
	const formData = new FormData();
	formData.append("to_upload", files[0]);
	await axios
		.post(`http://${process.env.REACT_APP_BASE_IP}:3000/api/users/image`, formData, { withCredentials: true })
	window.location.reload();
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
			<div>Username: {user?.username}</div>
			<div>wins: 0</div>
			<div>losses: 0</div>
		</div>
      </div>
    </div>
  );
};