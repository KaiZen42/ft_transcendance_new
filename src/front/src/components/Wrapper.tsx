
import * as React from "react";
import Nav from "./Nav";

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
        
    </>
    );
  }
}