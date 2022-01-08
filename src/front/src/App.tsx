import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import SignOut from "./pages/SIgnOut";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/signout" element={<SignOut />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
