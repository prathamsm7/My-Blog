import React from "react";
import Menu from "./Menu";

const Base = ({ children }) => (
  <div className="container-fluid">
    <Menu />
    <div className="container">{children}</div>
    <footer className="text-center bg-dark">
      <h4> If you got any question, feel free to reach out</h4>
    </footer>
  </div>
);

export default Base;
