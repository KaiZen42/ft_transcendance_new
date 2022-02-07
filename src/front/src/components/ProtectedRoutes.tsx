
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import TwoFaAuth from "./TwoFaAuth";


export default function ProtectedRoute({ children }: { children: JSX.Element })
{
  const [page, setPage] = useState<JSX.Element>(<></>);
  const [auth, setAuth] = useState(false)
  
  let location = useLocation();
  let check_code: boolean = false

  function updateAuth(auth: boolean)
  {
    setAuth(auth)
  }

  useEffect(() => {
    async function getUser() {
      const res = await fetch(`http://${process.env.REACT_APP_BASE_IP}:3000/api/user`, {credentials: "include"});
      const data = await res.json();
      console.log(data)
      console.log("data 2fa:" + data.two_fa);
      if (data.id != null){
        if (data.two_fa && !auth)
        {
          console.log(" FRONTTTTTTT")
          setPage(<TwoFaAuth onSubmit={updateAuth}/>)
        }
        else
          setPage(children);
      }
      else
        setPage(<Navigate to="/signin" state={{ from: location }} replace />);
    }
    getUser();
  }, []);

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