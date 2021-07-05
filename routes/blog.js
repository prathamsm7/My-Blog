const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controller/auth");
const {
  allBlogs,
  createBlog,
  getBlogById,
  getBlog,
  editBlog,
  deleteBlog,
  isAuthor,
  postComment,
  increaseLike,
  decreaseLike,
  myPosts,
} = require("../controller/blogs");
const { getUserById } = require("../controller/user");
const router = express.Router();
const Blog = require("../models/blog");

//Getting user id in params
router.param("userId", getUserById);
router.param("blogId", getBlogById);

//Find All Blogs
router.get("/blogs", allBlogs);

//Create New Blog
router.post("/blog/create/:userId", isSignedIn, isAuthenticated, createBlog);

//Showing Particular blog
router.get("/blogs/:blogId", getBlog);

// Edit Blog
router.patch(
  "/blogs/:blogId/edit/:userId",
  isSignedIn,
  isAuthenticated,
  editBlog
);

//Deleting Blog
router.delete(
  "/blog/:blogId/:userId",
  isSignedIn,
  isAuthenticated,
  isAuthor,
  deleteBlog
);

//Comment route
router.put(
  "/blog/:blogId/comments/:userId",
  isSignedIn,
  isAuthenticated,
  postComment
);

// like route
router.put(
  "/blog/:blogId/like/:userId",
  isSignedIn,
  isAuthenticated,
  increaseLike
);

// dislike route
router.put(
  "/blog/:blogId/dislike/:userId",
  isSignedIn,
  isAuthenticated,
  decreaseLike
);

router.get("/myposts/:userId", myPosts);
module.exports = router;
