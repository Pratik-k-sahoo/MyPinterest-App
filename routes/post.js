const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const Post = require("../models/post");
const User = require("../models/user");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(`./public/images/uploads`);

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.get("/show", async (req, res) => {
  if (!req.user) return res.redirect("/");
  const user = await User.findOne({ _id: req.user._id }).populate("posts");
  return res.render("posts.ejs", {
    logged: true,
    sign: "Logout",
    user,
  });
});

router.get("/", (req, res) => {
  if (!req.user) return res.redirect("/");
  return res.render("addpost.ejs", {
    user: req.user,
  });
});

router.get("/feed", async (req, res) => {
  if (!req.user) return res.redirect("/");
  const posts = await Post.find({});
  res.render("feed.ejs", {
    posts,
    user: req.user,
  });
});

router.get("/explore", async (req, res) => {
  const posts = await Post.find({});
  res.render("feed.ejs", {
    posts,
    user: req.user,
  });
});

router.post("/upload", upload.single("postImage"), async (req, res) => {
  const post = await Post.create({
    user: req.user._id,
    title: req.body.title,
    desc: req.body.desc,
    image: `/images/uploads/${req.file.filename}`,
  });
  const user = await User.findOne({ _id: req.user._id });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/user/profile");
});

module.exports = router;
