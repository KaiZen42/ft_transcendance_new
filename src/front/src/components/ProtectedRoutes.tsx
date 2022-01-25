

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default class ProtectedRoute extends React.Component {
  state = {
    page: <></>
  }
  async componentDidMount() {
    //let location = useLocation();
    const res = await fetch("http://localhost:3000/api/user", {credentials: 'include'});
    const data = await res.json();
    console.log("data id:" + data.id);
    if (data.id != null)
      this.setState({page: <Outlet/>});
    else
      this.setState({page: <Navigate to="/signin"/>});
  }

  render() {
    return (this.state.page);
  }
}