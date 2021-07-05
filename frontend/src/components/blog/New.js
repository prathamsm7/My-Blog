import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Base from "../core/Base";
import { isAuthenticated } from "../../helpers/auth";
import { toast } from "react-toastify";

const New = ({ match, history }) => {
  const [values, setValues] = useState({
    title: "",
    content: "",
    img: "",
  });

  const { title, content, img } = values;

  const { user, token } = isAuthenticated().data;

  const handelSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `/blog/create/${user._id}`,
        {
          title,
          content,
          img,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setValues({
          ...values,
          title: "",
          content: "",
          img: "",
        });
        toast.success("Blog Created Successfully");
        history.push("/");
      })
      .catch((err) => {
        setValues({
          ...values,
          title: "",
          content: "",
          img: "",
        });
        toast.error("something went wrong");
        console.log(err);
      });
  };

  const onChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: event.target.value,
    });
  };
  return (
    <Base>
      <div className="container border border-info m-4">
        <Form
          className=" needs-validation p-3 m-3"
          noValidate
          onSubmit={handelSubmit}
        >
          <Form.Group controlId="formBasicAuthor" className="p-3">
            <Form.Control
              type="text"
              placeholder="Enter Blog Title"
              name="title"
              required
              onChange={onChange("title")}
              minLength="10"
            />
          </Form.Group>

          <Form.Group controlId="formBasicContent" className="p-3">
            <Form.Control
              name="content"
              placeholder="Type something ........"
              as="textarea"
              rows={3}
              required
              onChange={onChange("content")}
              minLength="200"
            />
          </Form.Group>

          <Form.Group controlId="formBasicImg" className="p-3">
            <Form.Control
              name="img"
              type="text"
              placeholder="Image URL link"
              required
              onChange={onChange("img")}
            />
          </Form.Group>
          <Button className="m-3 btn btn-lg" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </Base>
  );
};

export default New;
