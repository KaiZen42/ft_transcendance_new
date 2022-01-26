import React, {Component, useEffect, useState} from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../models/User.interface";
import { NavLink } from "react-router-dom";

async function signOutUser() {
  await fetch("http://localhost:3000/api/logout", {credentials: 'include'});
}

const Nav = () => {
    const [user, setUser] = useState<User>();

    useEffect(() => {(
      async () => {
        const {data} = await axios.get("http://localhost:3000/api/user", {withCredentials: true});
        setUser(data);
      }
    )();
    }, []);
    
    return(
      <header className="navbar navbar-dark sticky-top bg-dark p-5 shadow">
      <div>
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Transcendance</a>
      </div>
      <div className="navbar-nav">
        <ul>
          <li className="nav-item">
            <NavLink to={'/'} className="nav-link">
              Dashboard
            </NavLink>
          </li>
        {/* </ul> */}
        {/* <ul > */}
          <li className="nav-item">
            <NavLink to={'/leaderboard'} className="nav-link">
              Leadaerboard
            </NavLink>
          </li>
        {/* </ul> */}
        {/* <ul > */}
          <li className="nav-item">
            <NavLink to={'/chat'} className="nav-link">
              Chat
            </NavLink>
          </li>
        {/* </ul> */}
        {/* <ul> */}
          <li className="nav-item">
            <NavLink to={'/game'} className="nav-link">
              Pong game
            </NavLink>
          </li>
        </ul>
        </div>
        <div>
        <ul className="navbar-nav">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="/">Hello, {user?.username}!</a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item text-nowrap">
            <a className="nav-link" href="/" onClick={signOutUser}>Sign out</a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item text-nowrap">
          <img src={user?.avatar} className="nav--image"/>
          </li>
        </ul>
        </div>
    </header>
    );
}

export default Nav;