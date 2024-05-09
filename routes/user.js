const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const User = require("../models/user");
const { createTokenForUser } = require("../services/authentication");
const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");
const postRouter = require("./post");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(`./public/images`);

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = `${req.user._id}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.use("/post", postRouter);

router.get("/signup", (req, res) => {
  res.render("signup.ejs", {
    sign: "Signin",
  });
});

router.get("/profile", async (req, res) => {
  if (!req.user) return res.redirect("/");
  const user = await User.findOne({ _id: req.user._id }).populate("posts");
  return res.render("profile.ejs", {
    sign: "Logout",
    logged: true,
    user,
  });
});

router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { name, email, username, password, contact, birth } = req.body;
  const user = await User.create({
    name,
    email,
    username,
    password,
    contact,
    dob: birth,
  });

  const token = createTokenForUser(user);
  return res.cookie("token", token).redirect("profile");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(username, password);

    return res.cookie("token", token).redirect("profile");
  } catch (err) {
    return res.redirect("/");
  }
});

router.post("/fileUpload", upload.single("profileImage"), async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  user.profileImage = `/images/${req.file.filename}`;
  user.save();
  return res.redirect("/user/profile");
});

module.exports = router;
