import React, {Component, useEffect, useState} from "react";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../models/User";

async function signOutUser() {
  await fetch("http://localhost:3000/api/logout", {credentials: 'include'});
}

const Nav = () => {
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
    
    return(
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Transcendance</a>
      {/* <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button> */}
      <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"/>
      <ul className="navbar-nav">
        <li className="nav-item text-nowrap">
          <a className="nav-link px-3" href="/">Hello, {user.getUsername}!</a>
          </li>
      </ul>
      <ul className="navbar-nav">
        <li className="nav-item text-nowrap">
          <a className="nav-link px-3" href="/" onClick={signOutUser}>Sign out</a>
        </li>
      </ul>
    </header>
    );
}

export default Nav;