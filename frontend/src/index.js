import React from "react";
import ReactDOM from "react-dom";
import "../src/index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
  <Router>
    <ToastContainer />
    <App />
  </Router>,
  document.getElementById("root")
);
