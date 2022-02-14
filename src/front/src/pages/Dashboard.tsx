
import React, { useEffect, useState} from "react";
import Game from "../components/Game";
import Wrapper from "../components/Wrapper";
import "../styles/video.css";
import "../styles/neon_button.css"

export default function Dashboard() {

  const [game, setGame] = useState(false)

  return (
    
  <Wrapper>
	  <section className="vh-100">
      <div className="container h-100">
        <div className="h-100" style={{display : game ? "none" : "block"}}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h1>Multiplayer Snake</h1>
              <button className="neon-button" onClick={() => setGame(true)}>Join Game</button>
          </div>
        </div>
        <div className="h-100" style={{display : game ? "block" : "none"}}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <Game start={game}/>
          </div>
        </div>
      </div>
      <div>
          <video autoPlay muted loop className="video">
            <source src="movie2.webm" type="video/webm"/>
          </video>
          <img src="OL.png" alt="image_diocaro" className="overlay_back" />
        </div>
    </section>
	</Wrapper>
  );
}
