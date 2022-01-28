
import * as React from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Nav from '../components/Nav';
import Wrapper from '../components/Wrapper';

export default async function SignIn() {
  let location = useLocation();

  let from : any = location.state;
  const url: string = "https://api.intra.42.fr/oauth/authorize?client_id=" + process.env.REACT_APP_CLIENT_ID +"&redirect_uri="+ process.env.REACT_APP_REDIRECT_URI + "&response_type=code" + "&state=" +from.from.pathname;
  
  return (
  

    <div>
      <p></p>{window.location.replace(url)}
      {/* <p>You must log in to view the page at {from.from.pathname}</p> */}
      {/* <a href={`http://${process.env.REACT_APP_BASE_IP}:3000/api/login`}><button>Login</button></a> */}
    </div>
 
  );
}

