import React, { useEffect, useState } from "react";
import Base from "./Base";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  const loadAllBlog = () => {
    axios
      .get("/blogs")
      .then((data) => {
        setBlogs(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadAllBlog();
  }, []);

  return (
    <Base>
      <div>
        {blogs ? (
          blogs.map((blog, index) => {
            return (
              <div className="card mb-3 mt-3" id="card" key={index}>
                <img
                  className="card-img-top"
                  id="img"
                  src={blog.img}
                  alt="Card img cap"
                />
                <div className="card-body">
                  <p className="card-title">{blog.title}</p>
                  <p className="card-text">
                    {blog.content.substring(0, 200)} ...
                  </p>

                  <div className="d-flex align-items-end flex-column text-white">
                    <p>-{blog.author.username}</p>
                    <p>{blog.createdAt.toString()}</p>
                  </div>
                </div>
                <Link
                  to={`/blog/${blog._id}`}
                  className="btn btn-outline-warning m-2  border border-danger "
                >
                  Read Article
                </Link>
              </div>
            );
          })
        ) : (
          <div>no blogs found</div>
        )}
      </div>
    </Base>
  );
};

export default Home;
