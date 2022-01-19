import React, {useEffect} from "react";
// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Route, Routes , Navigate} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Error404 from "./pages/404";
import axios from "axios";

async function checkLoginStatus() {
  const res = await axios.get("http://localhost:3000/api/user");/*.then(res => {*/
  console.log("ciaoooo");
  if (res.data === false)
  {
    console.log("ciao");
    return (<Navigate to="/signin"></Navigate>)
  }
}

function App() {
  return (
    <div className="App">
       {/* { checkLoginStatus() }  */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/users" element={<Users />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
