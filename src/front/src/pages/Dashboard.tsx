
import React, { useEffect, useState} from "react";
import Game from "../components/Game";
import Wrapper from "../components/Wrapper";
import "../styles/video.css";
import "../styles/neon_button.css"
import "../styles/PongGame.css"

export default function Dashboard() {

  const [game, setGame] = useState(false)

  return (
    <Wrapper>
	  <section className="container vh-100">
      
      <div className="center">
        <div className="h-100" style={{display : game ? "none" : "block"}}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h1 className="white-text">Multiplayer Snake</h1>
              <a className="neon-button" onClick={() => setGame(true)}>Join Game</a>
          </div>
        </div>
        <div className="h-100" style={{display : game ? "block" : "none"}}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <Game start={game}/>
          </div>
        </div>
        </div>
    </section>
    </Wrapper>
  );
}
