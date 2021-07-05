import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../helpers/auth";
import Base from "../core/Base";

const ResetPassword = ({ match, history }) => {
  const [values, setValues] = useState({
    newPassword: "",
    token: "",
  });

  const { newPassword, token } = values;

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setValues({ ...values, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (newPassword) {
      axios
        .put(`/resetpassword`, {
          newPass: newPassword,
          resetLink: token,
        })
        .then((data) => {
          setValues({
            ...values,
            newPassword: "",
          });
          // console.log(data.data.message);
          toast.success(data.data.message, history.push("/signin"));
        })
        .catch((data) => {
          setValues({
            ...values,
            newPassword: "",
          });
          // console.log(data.response.data.error);
          toast.error(data.response.data.error);
        });
    } else {
      return false;
    }
  };

  return (
    <Base>
      {isAuthenticated() ? <Redirect to="/" /> : null}
      <div className="container-fluid">
        <div className="col-md-8 col-sm-12 signup">
          <Card style={{ border: "3px solid black" }}>
            <Card.Header>
              {" "}
              <h1 className="p-3">Reset Password Here</h1>
            </Card.Header>
            <Card.Body>
              <form className="needs-validation" noValidate>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Your New Password "
                    onChange={onChange("newPassword")}
                    value={newPassword}
                    required
                  />
                </div>
                <button
                  onClick={onSubmit}
                  className="btn btn-block btn-outline-success"
                >
                  Reset Password
                </button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Base>
  );
};

export default ResetPassword;
