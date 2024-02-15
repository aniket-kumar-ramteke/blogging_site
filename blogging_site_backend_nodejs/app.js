const express = require("express");
const bodyParser = require("body-parser");
const postRoute = require("./routes/post.js");
const userRoute = require("./routes/user.js");
const commentRoute = require("./routes/comment.js");

const app = express();

app.use(bodyParser.json());

app.use("/posts", postRoute);
app.use("/user", userRoute);
app.use("/comments", commentRoute);
module.exports = app;