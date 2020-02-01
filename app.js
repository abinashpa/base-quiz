// modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");

// routes files
const usersApiRouter = require("./routes/api/users");
const adminsApiRouter = require("./routes/api/admins");
const quizzesApiRouter = require("./routes/api/quizzes");
const indexRouter = require("./routes/index");

const app = express();

// helmet for basic security
app.use(helmet())

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// connecting to mongodb
const mongoUrl = "mongodb+srv://abinash:12345@cluster0-jsp3p.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    console.log(err ? err : "mongoDB connected");
  }
);
mongoose.set('useFindAndModify', false);

// routes
app.use("/api/v1/quizzes", quizzesApiRouter);
app.use("/api/v1/admins", adminsApiRouter);
app.use("/api/v1/users", usersApiRouter);
app.use("/", indexRouter);

// error handlers
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, err });
});

module.exports = app;
