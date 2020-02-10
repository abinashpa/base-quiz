// modules
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");

// routes files
const usersApiRouter = require("./routes/api/users");
const adminsApiRouter = require("./routes/api/admins");
const quizsetApiRouter = require("./routes/api/quizset");
const quizzesApiRouter = require("./routes/api/quizzes");

const app = express();

// environmental variable
require('dotenv').config()

// helmet for Protection
app.use(helmet())

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// connecting to mongodb
mongoose.connect(
  process.env.ATLAS,
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
app.use("/api/v1/quizset", quizsetApiRouter);

// sending index.html from public
app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"))
});

// error handlers
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, err });
});

module.exports = app;
