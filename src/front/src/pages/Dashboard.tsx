
import React, { useEffect, useState} from "react";
import Game from "../components/Game";
import Wrapper from "../components/Wrapper";

export default function Dashboard() {

  const [game, setGame] = useState(false)

  return (
    
  <Wrapper>
	  <section className="vh-100">
      <div className="container h-100">
        <div className="h-100" style={{display : game ? "none" : "block"}}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <h1>Multiplayer Snake</h1>
              <button className="btn btn-success" onClick={() => setGame(true)}>Join Game</button>
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
