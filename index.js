const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const { validateToken } = require("./services/authentication");
const userRoute = require("./routes/user");
const postRouter = require("./routes/post");

const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGODBURL)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Error Occurred:" + err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", (req, res) => {
  const token = req.cookies["token"];
  if (token) {
    const userPayload = validateToken(token);
    req.user = userPayload;
    return res.redirect("/user/profile");
  }
  res.render("home.ejs", {
    sign: "Signup",
  });
});

app.get("/about", (req, res) => {
  return res.render("about.ejs");
});

app.use("/user", userRoute);
app.use("/post", postRouter);

app.listen(PORT, () => console.log(`Server started at Port: ${PORT}`));
