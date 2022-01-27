
import * as React from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Nav from '../components/Nav';

export default function SignIn() {
  let location = useLocation();

  let from : any = location.state;

  return (
    <div>
      <p>You must log in to view the page at {from.from.pathname}</p>
      <a href={`http://${process.env.REACT_APP_BASE_IP}:3000/api/login`}><button>Login</button></a>
    </div>
  );
}

