import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
// import Menu from "../core/Menu";
import Base from "../core/Base";

const Activate = ({ match, history }) => {
  const [formData, setFormData] = useState({
    username: "",
    token: "",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const preload = () => {
    let token = match.params.token;
    let { username } = jwt.decode(token);

    if (token) {
      setFormData({
        ...formData,
        username,
        token,
      });
    }
  };

  useEffect(() => {
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { username, token } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/activation", {
        token,
      })
      .then((res) => {
        setFormData({
          ...formData,
        });
        console.log(res);
        toast.success(res.data.message);
        history.push("/signin");
      })
      .catch((err) => {
        console.log(err.response);
        toast.error(err.response.data.error);
      });
  };

  const activationForm = () => {
    return (
      <Base>
        <div className="container-fluid">
          <div className=" col-md-6 signup">
            <Card style={{ border: "3px solid black" }}>
              <Card.Header>
                {" "}
                <h1 className="p-3">Hello {username}</h1>
                <h5>Please Activate Your Account Here</h5>
              </Card.Header>

              <Card.Body>
                <form
                  className="needs-validation"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <button
                    type="submit"
                    className="btn btn-large btn-block btn-primary mb-4"
                  >
                    Activate Your Account
                  </button>
                  <hr className="mt-5" />
                  <h6 className="text-center mt-4">Or sign up again</h6>
                  <Link to="/register" className="btn btn-block btn-warning">
                    Signup Here
                  </Link>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Base>
    );
  };

  return <div>{activationForm()}</div>;
};

export default Activate;
