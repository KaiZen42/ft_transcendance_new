import React, { Component} from "react";
import Wrapper from "../components/Wrapper";
import axios from "axios";
import { Navigate } from "react-router-dom";

/*async function checkLoginStatus() {
  const res = await axios.get("http://localhost:3000/api/user");/*.then(res => {
  console.log("ciaoooo");
  if (res.data === false)
  {
    console.log("ciao");
    return (<Navigate to="/signin"></Navigate>)
  }
}*/

function Dashboard() : any {
  const res = axios.get("http://localhost:3000/checkAuth").then(res => {
  console.log("ciaoooo");
  if (res.data === false)
  {
    console.log("ciao");
    return (<Navigate to="/signin"/>);
  }
    return (<Wrapper>!!! Our Dashboard !!!</Wrapper>);
  });
}

export default Dashboard;
