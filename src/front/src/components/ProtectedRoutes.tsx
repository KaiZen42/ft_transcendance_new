
import { render } from "@testing-library/react";
import React from "react";
import { Navigate, Outlet, Route } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  console.log("this", isAuthenticated);

  return (isAuthenticated ? <Outlet/> : <Navigate to="/signin" />);
}
