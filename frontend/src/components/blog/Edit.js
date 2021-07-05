import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Base from "../core/Base";
import { isAuthenticated } from "../../helpers/auth";
import { toast } from "react-toastify";

const Edit = ({ match, history }) => {
  const blogId = match.params.blogId;
  const { user, token } = isAuthenticated().data;

  const [blog, setBlog] = useState({
    title: "",
    content: "",
    img: "",
  });

  const { title, content, img } = blog;

  //load blog data and set in form
  const preload = () => {
    axios
      .get(`/blogs/${blogId}`)
      .then((data) => {
        setBlog({
          ...blog,
          title: data.data.title,
          content: data.data.content,
          img: data.data.img,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (name) => (event) => {
    setBlog({
      ...blog,
      [name]: event.target.value,
    });
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(
        `/blogs/${blogId}/edit/${user._id}`,
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
        setBlog({
          ...blog,
          title: "",
          content: "",
          img: "",
        });
        toast.success("Blog Edited Successfully");
        history.push(`/blog/${blogId}`);
      })
      .catch((err) => {
        setBlog({
          ...blog,
          title: "",
          content: "",
          img: "",
        });
        toast.error("Something Went Wrong , Fill All fields");
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
              value={blog.title}
              required
              onChange={onChange("title")}
            />
          </Form.Group>

          <Form.Group controlId="formBasicContent" className="p-3">
            <Form.Control
              name="content"
              value={blog.content}
              placeholder="Type something ........"
              as="textarea"
              rows={3}
              required
              onChange={onChange("content")}
            />
          </Form.Group>

          <Form.Group controlId="formBasicImg" className="p-3">
            <Form.Control
              name="img"
              value={blog.img}
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

export default Edit;
