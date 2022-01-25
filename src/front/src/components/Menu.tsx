import React from "react";
import { Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";

const Menu = () => {
    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to={'/'} className="nav-link active">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to={'/users'} className="nav-link active">
              Users
            </Link>
          </li>
          <li className="nav-item">
            <Link to={'/chat'} className="nav-link active">
              Chat
            </Link>
          </li>
          <li className="nav-item">
            <Link to={'/game'} className="nav-link active">
              Pong game
            </Link>
          </li>
        </ul>
      </div>
    </nav>
    )
}

export default Menu;