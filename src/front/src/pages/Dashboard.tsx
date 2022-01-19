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

async function Dashboard() {
  const res = await axios.get("http://localhost:3000/api/user");/*.then(res => {*/
  console.log("ciaoooo");
  if (res.data === false)
  {
    console.log("ciao");
    return (<Navigate to="/signin"/>)
  }
  /*render() {*/
    return <Wrapper>!!! Our Dashboard !!!</Wrapper>;
  //}
}

export default Dashboard;
