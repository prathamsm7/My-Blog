import React from "react";
import { Fragment } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { withRouter, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, signout } from "../../helpers/auth";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#f72585" };
  } else {
    return { color: "#ffc8dd" };
  }
};

const Menu = ({ history }) => (
  <>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand
        style={{
          color: "yellow",
          fontWeight: "bold",
          fontSize: "2rem",
          fontFamily: "Satisfy ,cursive",
        }}
      >
        <i className="fas fa-blog p-1" style={{ fontSize: "3rem" }}></i>MyBlog
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <NavLink
            className=" text-decoration-none p-2"
            to="/"
            style={currentTab(history, "/")}
          >
            Home
          </NavLink>

          {isAuthenticated() && (
            <NavLink
              to={`/blog/new/${isAuthenticated().data.user._id}`}
              className=" text-decoration-none p-2"
              style={currentTab(history, "blog/new/:userId")}
            >
              Write Post
            </NavLink>
          )}
        </Nav>

        {!isAuthenticated() && (
          <Nav>
            <NavLink
              className="text-white text-decoration-none p-2"
              to="/signin"
              style={currentTab(history, "/signin")}
            >
              Sign In
            </NavLink>

            <NavLink
              className="text-white text-decoration-none p-2"
              to="/register"
              style={currentTab(history, "/register")}
            >
              Sign Up
            </NavLink>
          </Nav>
        )}

        {isAuthenticated() && isAuthenticated().data.user.role === "Admin" && (
          <Nav className="text-info">
            <NavLink
              to="/admin"
              className="text-decoration-none p-2"
              style={currentTab(history, "/admin")}
            >
              Admin Dashboard
            </NavLink>
          </Nav>
        )}

        {isAuthenticated() && isAuthenticated().data.user.role === "User" && (
          <Nav className="text-info mr-4">
            <NavLink
              to="/private"
              className="text-white text-decoration-none p-2"
              style={currentTab(history, "/private")}
            >
              User Dashboard
            </NavLink>
          </Nav>
        )}

        {isAuthenticated() && (
          <span
            className="btn btn-danger p-1 nav-link text-bold fw-4"
            onClick={() => {
              signout(() => {
                toast.success("Signout Success");
                history.push("/");
              });
            }}
          >
            Signout
          </span>
        )}
      </Navbar.Collapse>
    </Navbar>
  </>
);

export default withRouter(Menu);
