import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";
import "../styles/video.css";

export default function Dashboard() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_BASE_IP}:3001/api/user`,
        { withCredentials: true }
      );
      setUser(data);
    })();
  }, []);

  return (
    <Wrapper>
      <NavLink to={"/game"}>
        <div>
          <button>PLAY PONG</button>
          <video autoPlay muted loop className="video">
            <source src="movie2.webm" type="video/webm"/>
          </video>
          <img src="OL.png" alt="image_diocaro" className="overlay_back" />
        </div>
      </NavLink>
    </Wrapper>
  );
}
