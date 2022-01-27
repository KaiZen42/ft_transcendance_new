import React, {Component, useEffect, useState} from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../models/User.interface";
import { NavLink } from "react-router-dom";

export default function Nav() {
    const [user, setUser] = useState<User>();

    useEffect(() => {(
      async () => {
        const {data} = await axios.get(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {withCredentials: true});
        setUser(data);
      }
    )();
    }, []);
    
    async function signOutUser() {
      await fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/logout`, {credentials: 'include'});
      window.location.reload();
    }

    return(
      <header className="header">
        <h2 className="header--title">TRASCENDANCE</h2>
        <ul className="header--icon--list">
            <li>
              <NavLink to={'/'}>
              <i className="bi bi-house header--icon"></i>
              </NavLink>
            </li>
            <li >
              <NavLink to={'/leaderboard'} >
                <i className="bi bi-graph-up-arrow header--icon"></i>
              </NavLink>
            </li>
            <li >
              <NavLink to={'/chat'}>
                <i className="bi bi-chat header--icon"></i>
              </NavLink>
            </li>
            <li >
              <NavLink to={'/game'}>
                <i className="bi bi-joystick header--icon"></i>
              </NavLink>
            </li>
        </ul>
        <div className="header--signout">
          <img src={user?.avatar} className="nav--image"/>
          <i className="bi bi-box-arrow-right header--icon" onClick={signOutUser}></i>
        </div>
      </header>)
}