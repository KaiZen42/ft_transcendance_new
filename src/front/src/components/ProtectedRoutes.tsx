
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element })
{
  const [page, setPage] = React.useState<JSX.Element>(<></>);
  
  let location = useLocation();

  useEffect(() => {
    async function getUser() {
      const res = await fetch("http://localhost:3000/api/user", {credentials: 'include'});
      const data = await res.json();
      console.log("data id:" + data.id);
      if (data.id != null)
        setPage(children);
      else
        setPage(<Navigate to="/signin" state={{ from: location }} replace />);
    }
    getUser();
  });

  return page;
 /* return children;*/
}
/*export default class ProtectedRoute extends React.Component*/ /*{
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
  return children;
}*/