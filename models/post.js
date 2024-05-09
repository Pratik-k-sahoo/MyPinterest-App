const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
});

const Post = model("post", postSchema);

module.exports = Post;
