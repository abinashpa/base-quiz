const express = require("express");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../../modules/auth");
const router = express.Router();

// create new user
router.post("/", (req, res, next) => {
  try {
    User.create(req.body.user, (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(400)
          .json({ msg: "Please Try Again", success: false });
      }

      res.json({ success: true, msg: "You Are Successfully Registered" });
    });
  } catch (err) {
    next(err);
  }
});

// login user
router.post("/signin", (req, res, next) => {
  try {
    const { email, password } = req.body.user;
    User.findOne({ email }, (err, user) => {
      if (err) return next(err);
      if (!user) return res.json({ success: false, msg: "Invalid Credential" });
      user.verifyPassword(password, (err, matched) => {
        if (err) return next(err);
        if (!matched)
          return res.status(401).json({ success: false, msg: "Unauthorized" });
        jwt.sign(
          {
            userid: user._id,
            username: user.username,
            email: user.email,
            isadmin: user.isAdmin
          },
          process.env.SECRET,
          (err, token) => {
            if (err) return next(err);
            res.json({ success: true, msg: "You Are Logged In", id:user._id, token });
          }
        );
      });
    });
  } catch (err) {
    next(err);
  }
});

// get users listing
router.get("/", (req, res, next) => {
  try {
    User.find({}, "-password", (err, users) => {
      if (err) return next(err);
      if (!users) return res.json({ success: false, msg: "users not found!" });
      res.json({ users, success: true });
    });
  } catch (err) {
    next(err);
  }
});

//get a user
router.get("/:id", (req, res, next) => {
  try {
    User.findById(req.params.id, "-password", (err, user) => {
      if (err) return next(err);
      if (!user) res.json({ success: false, msg: "no user found!" });
      res.json({ user, success: true });
    });
  } catch (err) {
    next(err);
  }
});

// verify jwt
router.use(auth.verifyToken);

// update user
router.put("/:id", (req, res, next) => {
  try {
    User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, user) => {
        if (err) return next(err);
        if (!user) return res.json({ success: false, msg: "user not found!" });
        res.json({ user, success: true, msg:"Profile Is Updated" });
      }
    );
  } catch (err) {
    next(err);
  }
});

// delete a user
router.delete("/:id", (req, res, next) => {
  try {
    User.findByIdAndDelete(req.params.id, (err, user) => {
      if (err) return next(err);
      if (!user)
        return (
          res
          .status(401)
          .json({ success: false, msg: "user not found!" })
        )
      res.json({ success: true, msg: "successfully deleted!" });
    });
  } catch (err) {
    next(err);
  }
});

// get current user
router.get("/me", (req, res, next) => {
  try {
    const { username } = req.body.user;
    User.findOne({ username }, "-password").exec((err, user) => {
      if (err) return next(err);
      if (!user) {
        Admin.findOne({ username }, "-password").exec((err, user) => {
          if (err) return next(err);
          res.json({ success: true, user });
        });
      } else {
        res.json({ success: true, user });
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
