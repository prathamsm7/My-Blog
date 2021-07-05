const Blog = require("../models/blog");
const _ = require("lodash");
const moment = require("moment");
const now = moment();

//Finding all Blogs
exports.allBlogs = (req, res) => {
  Blog.find()
    .populate("author", "username email")
    .select("_id title img content author likes createdAt")
    .sort({ _id: -1 })
    .exec((err, blogs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "No Blogs Found",
        });
      }
      res.json(blogs);
    });
};

//create new blog
exports.createBlog = (req, res) => {
  let blog = new Blog(req.body);
  // console.log(req.user);
  blog.author = req.user;

  blog.save((err, blog) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Cannot create blog",
      });
    }
    res.json(blog);
  });
};

//Getting blog Id (middlewere)
exports.getBlogById = (req, res, next, id) => {
  Blog.findById(id)
    .populate("author", "user username text date likes email")
    .populate("comments.commentBy", "_id username")
    .exec((err, blog) => {
      if (err || !blog) {
        return res.status(400).json({
          error: err,
        });
      }
      req.blog = blog;
      next();
    });
};

//Blog by ID
exports.getBlog = (req, res) => {
  return res.json(req.blog);
};

exports.myPosts = (req, res) => {
  Blog.find({ author: req.user._id })
    .populate("author", "_id username email")
    .select("_id title content img createdAt updatedAt likes comments")
    .sort("createdAt")
    .exec((err, blogs) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(blogs);
    });
};

// Edit blog
exports.editBlog = (req, res) => {
  let blog = req.blog;
  blog = _.extend(blog, req.body); // extend mutate the source object
  blog.updatedAt = now.format("dddd, MMMM Do YYYY");

  blog.save((err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json(blog);
  });
};

//Checking valid author(middlewere)
exports.isAuthor = (req, res, next) => {
  let isAuthor = req.blog && req.auth && req.blog.author._id == req.auth._id;

  if (!isAuthor) {
    return res.status(403).json({
      error: "You are not authorized to delete the post",
    });
  }
  next();
};

//Delete blog
exports.deleteBlog = (req, res) => {
  let blog = req.blog;
  blog.remove((err, blog) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete blog",
      });
    }
    res.json({
      message: "Blog is deleted successfully",
    });
  });
};

//Making comment
exports.postComment = async (req, res) => {
  const comment = {
    text: req.body.text,
    commentBy: req.user,
  };
  Blog.findByIdAndUpdate(
    req.blog.id,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentBy", "_id username")
    .populate("commentBy", "_id name username")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

//Like the post
exports.increaseLike = async (req, res) => {
  await Blog.findByIdAndUpdate(
    req.blog.id,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};

//Dislike the post
exports.decreaseLike = async (req, res) => {
  await Blog.findByIdAndUpdate(
    req.blog.id,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      res.json(result);
    }
  });
};
