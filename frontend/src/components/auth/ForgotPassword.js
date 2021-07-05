import axios from "axios";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticated } from "../../helpers/auth";
import Base from "../core/Base";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    textChange: "Send Reset Password Link",
  });

  const { email, textChange } = state;

  const onChange = (name) => (event) => {
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setState({
      ...state,
      textChange: "Submitting",
    });

    axios
      .put(`/forgot-password`, { email })
      .then((res) => {
        setState({
          ...state,
          email: "",
          textChange: "Submitted",
        });
        toast.success(res.data.message);
        // console.log(res.data.message);
      })
      .catch((err) => {
        setState({
          ...state,
          email: "",
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
              <h1 className="p-3">Forgot Password Link</h1>
            </Card.Header>
            <Card.Body>
              <form className="needs-validation" noValidate>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Your Email "
                    onChange={onChange("email")}
                    value={email}
                    required
                  />
                </div>

                <button
                  onClick={onSubmit}
                  className="btn btn-block btn-outline-success"
                >
                  {textChange}
                </button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Base>
  );
};

export default ForgotPassword;
