import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Base from "../core/Base";
import { isAuthenticated } from "../../helpers/auth";
import { toast } from "react-toastify";

const Show = ({ match, history }) => {
  const [blog, setBlog] = useState([]);
  const [author, setAuthor] = useState({});
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [text, setText] = useState("");

  const { user, token } = isAuthenticated().data;

  //Loads th blog
  const preload = () => {
    let blogId = match.params.blogId;
    axios
      .get(`/blogs/${blogId}`)
      .then((data) => {
        setBlog(data.data);
        setAuthor(data.data.author);
        setComments(data.data.comments.reverse());
        setLikes(data.data.likes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Delete Blog Handler
  const deleteHandler = () => {
    axios
      .delete(`/blog/${blog._id}/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.info(res.data.message);
        history.push("/");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Onsubmit comment
  const commentHandler = (e) => {
    e.preventDefault();
    axios
      .put(`/blog/${match.params.blogId}/comments/${user._id}`, text, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        setComments(result.data.comments.reverse());
        toast.success("Comment added Successfully");
      })
      .catch((err) => {
        setText("");
        toast.error("Something Went Wrong");
        console.log(err);
      });
  };
  //
  // Handle Change
  const onChange = (name) => (event) => {
    setText({
      ...text,
      [name]: event.target.value,
    });
  };

  useEffect(() => {
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Like Post
  const likePost = () => {
    axios
      .put(
        `/blog/${match.params.blogId}/like/${user._id}`,
        match.params.blogId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setBlog(res.data);
        setLikes(res.data.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Dislike Post
  const dislikePost = (id) => {
    axios
      .put(
        `/blog/${id}/dislike/${user._id}`,
        { blogId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setBlog(res.data);
        setLikes(res.data.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Base>
      <div className="card mb-3 mt-3" id="card">
        <img
          className="card-img-top"
          id="img"
          src={blog.img}
          alt="Card img cap"
        />
        <div className="card-body">
          <p className="card-title">{blog.title}</p>
          <p className="card-text" style={{ alignContent: "start" }}>
            {blog.content}
          </p>

          <div className="row text-white">
            {/*Blog Likes*/}
            <div className="col-10 m-3">
              {likes.includes(user._id) ? (
                <i
                  className="far fa-thumbs-down"
                  style={{ fontSize: "3rem", color: "#0aefff" }}
                  onClick={() => {
                    dislikePost(blog._id);
                  }}
                ></i>
              ) : (
                <i
                  className="far fa-thumbs-up mr-4"
                  style={{ fontSize: "3rem", color: "#0aefff" }}
                  onClick={() => {
                    likePost(blog._id);
                  }}
                ></i>
              )}

              {likes && <p className="mt-3">{likes.length} Likes</p>}
            </div>

            <div className="col-10 align-items-end m-2">
              <p className="fs-3">Post By -{author.username}</p>
              <p>
                Posted On -
                <span className="text-muted fs-6 fw-normal">
                  {blog.createdAt}
                </span>
              </p>
              <p>
                Updated On -
                <span className="text-muted fs-6 fw-normal">
                  {blog.updatedAt}
                </span>
              </p>
            </div>
          </div>
        </div>

        {user._id === author._id ? (
          <div className="text-center">
            <button
              onClick={deleteHandler}
              className="btn btn-outline-danger btn-large p-2 border border-danger text-white"
            >
              Delete
            </button>

            <Link
              to={`/blog/${blog._id}/edit`}
              className="btn btn-outline-success btn-large p-2 border border-success text-white"
            >
              Update
            </Link>
          </div>
        ) : null}
      </div>

      <div className="card mb-3 mt-3" id="card">
        <div className="bg text-warning">
          <h1 className="text-left pl-3">Comments</h1>
          <form
            className="needs-validation p-3"
            onSubmit={commentHandler}
            noValidate
          >
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="4"
                name="text"
                onChange={onChange("text")}
                placeholder="Add to the discussion"
                required
              ></textarea>
            </div>

            <button
              className="btn btn-outline-info text-white fw-3"
              type="submit"
            >
              Leave Your Comment
            </button>
          </form>
        </div>
      </div>

      <div className="container">
        <div className="row mb-2">
          {comments &&
            comments.map((cmt, index) => {
              return (
                <div
                  className="card text-left m-1"
                  id="card"
                  key={index}
                  style={{ width: "34rem" }}
                >
                  <h6 className="card-header ">
                    <strong>By - {cmt.commentBy.username}</strong>
                  </h6>
                  <div className="card-body ">
                    <h5 className="card-text text-white">
                      Comment : {cmt.text}
                    </h5>
                    {/*<span className="text-muted">{cmt.date.toString()}</span>*/}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Base>
  );
};

export default Show;
