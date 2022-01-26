import axios from "axios";
import React, { Component, useEffect, useState} from "react";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User";

export default function Dashboard() {
  const [user, setUser] = useState(new User());

    useEffect(() => {(
      async () => {
        const {data} = await axios.get("http://localhost:3000/api/user", {withCredentials: true});
        setUser(new User(
          data.id,
          data.username,
          data.avatar
        ));
      }
    )();
    }, []);

  return (<Wrapper><div> <img src = {user.getAvatar} /></div></Wrapper>);
}
