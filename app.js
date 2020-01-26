// modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");

// routes files
const indexRouter = require("./routes/index");
const usersApiRouter = require("./routes/api/users");
const adminsApiRouter = require("./routes/api/admins");
const quizzesApiRouter = require("./routes/api/quizzes");

const app = express();

// helmet for basic security
app.use(helmet())

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// connecting to mongodb
mongoose.set('useFindAndModify', false);
mongoose.connect(
  "mongodb://localhost/base-quiz",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    console.log(err ? err : "mongoDB connected");
  }
);

// routes
app.use("/", indexRouter);
app.use("/api/v1/users", usersApiRouter);
app.use("/api/v1/admins", adminsApiRouter);
app.use("/api/v1/quizzes", quizzesApiRouter);

// error handlers
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, err });
});

module.exports = app;
