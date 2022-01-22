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
import ProtectedRoute from "./components/ProtectedRoutes";

export default function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />}/>
            </Route>
            <Route path="/users" element={<ProtectedRoute />}>
              <Route path="/users" element={<Users />}/>
            </Route>
            <Route path="/signup" element={<ProtectedRoute />}>
              <Route path="/signup" element={<SignUp />}/>
            </Route>
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<Error404 />} /> 
          </Routes>
        </BrowserRouter>
    </div>
  );
}
