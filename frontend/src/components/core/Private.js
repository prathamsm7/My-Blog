import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../../helpers/auth";
import Base from "../core/Base";

const Private = () => {
  const [blog, setBlog] = useState([]);

  const { user, token } = isAuthenticated().data;

  useEffect(() => {
    axios
      .get(`/myposts/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((blogs) => {
        setBlog(blogs.data);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(blog);
  return (
    <Base>
      <div className="container mt-2">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src="https://bootdey.com/img/Content/avatar/avatar7.png"
                    alt="Admin"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3 text-dark">
                    <h4 style={{ fontSize: "1rem" }}>{user.username}</h4>
                    <p
                      style={{ fontSize: ".7rem", fontWeight: "bold" }}
                      className="text-secondary mb-1"
                    >
                      {user.email}
                    </p>
                    <h3>
                      <span className="badge bg-warning">{user.role}</span>
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            {blog &&
              blog.map((blog, index) => {
                return (
                  <div className="card mb-3" key={index}>
                    <img
                      className="card-img-top"
                      src={blog.img}
                      style={{ height: "17rem" }}
                      alt="Card img cap"
                    />
                    <div className="card-body">
                      <p className="card-title">{blog.title}</p>
                      <p className="card-text">
                        {blog.content.substring(0, 200)}...
                        <Link to={`/blog/${blog._id}`}>more</Link>
                      </p>
                      <div className="d-flex align-items-end flex-column">
                        <h5>
                          <span>
                            {blog.likes.length}
                            <i className="far fa-thumbs-up mr-1 p-2"></i>
                          </span>
                          <span>
                            {blog.comments.length}
                            <i className="fa fa-comments  mr-1 p-2"></i>
                          </span>
                        </h5>
                        <p>-{blog.createdAt}</p>
                        <p>-{blog.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Private;
