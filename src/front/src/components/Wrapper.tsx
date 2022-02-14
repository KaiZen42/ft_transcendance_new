import * as React from "react";
import Nav from "./Nav";
import "../styles/video.css";
import overlay from "../assets/OL.png"

export default class Wrapper extends React.Component{
  render(){
  return (
    <>
      <Nav />
        <main>
          {this.props.children}
        </main>
        <video autoPlay muted loop className="video">
          <source src="./movie2.webm" type="video/webm" />
        </video>
        <img src={overlay} alt="neon background" className="overlay_back"/>
    </>
    );
  }
}