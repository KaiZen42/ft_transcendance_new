

import Wrapper from "../components/Wrapper";
import "../styles/neon_button.css"
import "../styles/PongGame.css"
import { NavLink } from "react-router-dom";

export default function Dashboard() {

  return (
    <Wrapper>
	  <section className="container vh-100">
      
      <div className="center">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h1 className="white-text">Multiplayer Pong</h1>
              <NavLink to={'/game'} >
                <div className="neon-button">Join Game</div>
              </NavLink>
          </div>
        </div>
    </section>
    </Wrapper>
  );
}
