import * as React from "react";
import Menu from "./Menu";
import Nav from "./Nav";

export default function Wrapper({ children }: { children: any/*JSX.Element*/ }) {
  return (
      <>
        <Nav />

        <div className="container-fluid">
          <div className="row">
            <Menu />
                {children}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4"></main>
          </div>
        </div>
      </>
    );
}