import * as React from "react";
import Menu from "./Menu";
import Nav from "./Nav";

class  Wrapper extends React.Component{
  render(){
  return (
    <>
      <Nav />
        <main>
          {this.props.children}
        </main>
    </>
    );
}
}
export default Wrapper;