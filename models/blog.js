const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comment");
const moment = require("moment");
const now = moment();

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  img: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: [
    {
      text: String,
      commentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: String,
    default: now.format("dddd, MMMM Do YYYY"),
  },
  updatedAt: {
    type: String,
    default: now.format("dddd, MMMM Do YYYY"),
  },
});

module.exports = mongoose.model("Blog", blogSchema);
