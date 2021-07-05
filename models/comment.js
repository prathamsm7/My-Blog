const mongoose = require("mongoose");
const User = require("./user");

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
