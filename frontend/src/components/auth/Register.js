import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Card } from "react-bootstrap";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../../helpers/auth";

function Register() {
  const [state, setState] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    textChange: "Sign Up",
  });

  const { username, email, password, role, textChange } = state;

  const onChange = (name) => (event) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const CustomToastWithLink = () => (
    <div>
      Email already existed
      <Link to="/signin"> Login </Link>
      Here
    </div>
  );

  const handelSubmit = (e) => {
    e.preventDefault();
    setState({
      ...state,
      textChange: "Submitting",
    });

    axios
      .post("/register", {
        username,
        email,
        role,
        password,
      })
      .then((res) => {
        setState({
          ...state,
          username: "",
          email: "",
          role: "",
          password: "",
          textChange: "Submitted",
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        setState({
          ...state,
          username: "",
          email: "",
          password: "",
          role: "",
          textChange: "Sign Up",
        });
        console.log(err.response.data.error);
        toast.warning(err.response.data.error);
      });
  };

  const singUpForm = () => {
    return (
      <>
        {isAuthenticated() ? <Redirect to="/" /> : null}

        <div className="container-fluid ">
          <div className=" col-md-6 signup">
            <Card style={{ border: "3px solid black" }}>
              <Card.Header>
                {" "}
                <h1 className="p-3">Register Here Yourself</h1>
              </Card.Header>
              <Card.Body>
                <form
                  className="needs-validation"
                  noValidate
                  onSubmit={handelSubmit}
                >
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Username "
                      onChange={onChange("username")}
                      value={username}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your Email "
                      onChange={onChange("email")}
                      value={email}
                      required
                    />
                    <div id="emailHelp" className="form-text">
                      We'll never share your email with anyone else.
                    </div>
                  </div>

                  <div className="mb-3">
                    <select
                      className="form-select form-control"
                      onChange={onChange("role")}
                    >
                      <option>Select one from below menu</option>
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
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
                  <button type="submit" className="btn btn-block btn-primary">
                    {textChange}
                  </button>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </>
    );
  };
  return <Base>{singUpForm()}</Base>;
}

export default Register;
