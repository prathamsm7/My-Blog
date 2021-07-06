import React, { useState } from "react";
import axios from "axios";
import { authenticate, isAuthenticated } from "../../helpers/auth";
import { Link, Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import { toast } from "react-toastify";
import { Card } from "react-bootstrap";
import Base from "../core/Base";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ history }) => {
  const [state, setState] = useState({
    email: "",
    password: "",
    textChange: "Log In",
  });

  const { email, password, textChange } = state;

  const onChange = (name) => (event) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  //Signin with google
  //Sending google token
//   const sendGoogleToken = (tokenId) => {
//     axios
//       .post("/googlelogin", {
//         idToken: tokenId,
//       })
//       .then((res) => {
//         informParent(res);
//         // console.log(res.data);
//         toast.info(`Welcome back ${res.data.user.username}`);
//       })
//       .catch((error) => {
//         toast.warning("google sign in error");
//         console.log(error);
//       });
//   };

  //Redirect after login
//   const informParent = (response) => {
//     authenticate(response, () => {
//       isAuthenticated() && isAuthenticated().data.user.role === "Admin"
//         ? history.push("/admin")
//         : history.push("/private");
//     });
//   };

//   const responseGoogle = (response) => {
//     sendGoogleToken(response.tokenId);
//   };

  const handelSubmit = (e) => {
    e.preventDefault();
    setState({
      ...state,
      textChange: "Submitting",
    });
    axios
      .post("/signin", {
        email,
        password,
      })
      .then((res) => {
        authenticate(res, () => {
          setState({
            ...state,
            email: "",
            password: "",
            textChange: "Submitted",
          });
          toast.success(`Hey ${res.data.user.username}, Welcome Back`);
          isAuthenticated() && isAuthenticated().data.user.role === "Admin"
            ? history.push("/admin")
            : history.push("/private");
        });
      })
      .catch((err) => {
        setState({
          ...state,
          email: "",
          password: "",
          textChange: "Sign In",
        });
        // console.log(err.response.data.error);
        toast.error(err.response.data.error);
      });
  };

  return (
    <Base>
      {isAuthenticated() ? <Redirect to="/" /> : null}
      <div className="container-fluid">
        <div className="col-md-8 col-sm-12 signup">
          <Card style={{ border: "3px solid black" }}>
            <Card.Header>
              {" "}
              <h1 className="p-3">Login Here</h1>
            </Card.Header>
            <Card.Body>
              <form
                className="needs-validation"
                onSubmit={handelSubmit}
                noValidate
              >
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email "
                    onChange={onChange("email")}
                    value={email}
                    required
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Your Password "
                    onChange={onChange("password")}
                    value={password}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-block btn-outline-dark"
                >
                  {textChange}
                </button>

                <p>
                  <Link to="/forgot-password"> Forgot Password?</Link>
                </p>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Base>
  );
};

export default Login;
