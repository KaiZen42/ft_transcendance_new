import * as React from "react";
import Menu from "./Menu";
import Nav from "./Nav";

class Wrapper extends React.Component {
  render() {
    return (
      <>
        <Nav />

        <div className="container-fluid">
          <div className="row">
            <Menu />
                {this.props.children}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4"></main>
          </div>
        </div>
      </>
    );
  }
}

export default Wrapper;
