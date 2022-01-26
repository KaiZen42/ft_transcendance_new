import * as React from "react";
import Menu from "./Menu";
import Nav from "./Nav";

class Wrapper extends React.Component{
  render(){
  return (
      <>
        <Nav />

        <div className="container-fluid">
          <div className="row">
            <main className="">
                {this.props.children}
                </main>
          </div>
        </div>
      </>
    );
}
}
export default Wrapper;