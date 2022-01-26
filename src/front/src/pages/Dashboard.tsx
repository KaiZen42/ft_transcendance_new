import axios from "axios";
import React, { Component, FormEvent, useEffect, useRef, useState} from "react";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";
import {Navigate} from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState<User>();
	const [selectedFile, setSelectedFile] = useState<File>();
	const [image, setImage] = useState(false)

  useEffect(() => {(
    async () => {
      const {data} = await axios.get("http://localhost:3000/api/user", {withCredentials: true});
      setUser(data);
    }
  )();
  }, []);

//   const submitForm = () => {
//     const formData = new FormData();
//     formData.append("to_upload", selectedFile!);
  
//     axios
//       .post("http://localhost:3000/api/users/image", formData, {withCredentials: true})
//       .then(() => {
//         alert("File Upload success");
//       })
//       .catch(() => alert("File Upload Error"));
//   };
	const upload = async (files: FileList | null) => {
		if (files === null) return;
		const formData = new FormData();
		formData.append("to_upload", files[0]);
		await axios
			.post("http://localhost:3000/api/users/image", formData, { withCredentials: true })
		
		setImage(true)		
	}
		
	if (image) {
		window.location.reload();
	}
  
//   const handleFileInput = (e : React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFile(e.target.files![0])
//   }
  
  return (
    <Wrapper>
      <div>
        <img src={user?.avatar} width="250px"/>
			  {/* <form onSubmit={submitForm}> */}
			  <form>
		<label className="btn btn-primary">
					  Upload image<input type="file" hidden onChange={e => upload(e.target.files)} />
          {/* <input type="submit" /> */}
		</label>
        </form>
      </div>
    </Wrapper>
  );
}
