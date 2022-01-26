import axios from "axios";
import React, { Component, FormEvent, useEffect, useRef, useState} from "react";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";

export default function Dashboard() {
  const [user, setUser] = useState<User>();
  const [selectedFile, setSelectedFile] = useState<File>();

  useEffect(() => {(
    async () => {
      const {data} = await axios.get("http://localhost:3000/api/user", {withCredentials: true});
      setUser(data);
    }
  )();
  }, []);

  const submitForm = () => {
    const formData = new FormData();
    formData.append("to_upload", selectedFile!);
  
    axios
      .post("http://localhost:3000/api/users/image", formData, {withCredentials: true})
      .then(() => {
        alert("File Upload success");
      })
      .catch(() => alert("File Upload Error"));
  };

  const handleFileInput = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files![0])
  }

  return (
    <Wrapper>
      <div>
        <img src={`http://localhost:3000/api/users/${user?.avatar}`}/>
        <form onSubmit={submitForm}>
          <input type="file" onChange={handleFileInput} />
          <input type="submit" />
        </form>
      </div>
    </Wrapper>
  );
}
