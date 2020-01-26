const express = require("express");
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const router = express.Router();

// register Admin
router.post("/", (req, res, next) => {
  try {
    Admin.create(req.body.user, (err, Admin) => {
      if (err) return next(err);
      if (!Admin)
        return res
          .status(500)
          .json({ msg: "Something Went Wrong", success: false });
      res.json({
        success: true,
        msg: "You Are Successfully Registered As Admin"
      });
    });
  } catch (err) {
    next(err);
  }
});

// login Admin
router.post("/signin", (req, res, next) => {
  try {
    let { email, password } = req.body.user;
    Admin.findOne({ email }, (err, admin) => {
      if (err) return next(err);
      if (!admin) return res.json({ success: false, msg: "Invalid Email!" });
      admin.verifyPassword(password, (err, matched) => {
        if (err) return next(err);
        if (!matched)
          return res
            .status(401)
            .json({ success: false, msg: "Invalid Password" });
            
        jwt.sign(
          {
            userId: admin._id,
            username: admin.username,
            email: admin.email
          },
          process.env.SECRET,
          (err, token) => {
            if (err) return next(err);
            res.json({
              success: true,
              msg: "You Are Successfully Logged In",
              id: admin._id,
              token
            });
          }
        );
      });
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
