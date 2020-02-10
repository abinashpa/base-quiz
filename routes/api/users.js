const express = require("express");
const router = express.Router();

const auth = require("../../modules/auth");

const userController = require("../../controllers/users");

// create new user
router.post("/", userController.registerUser);

// login user
router.post("/login", userController.loginUser);

// update user
router.put("/:id", auth.verifyToken, userController.updateUser);

// get about user
router.get("/me", auth.verifyToken, userController.aboutUser);

// get scoreboard of a user
router.get("/score", auth.verifyToken, userController.getScore);

// add score to user
router.post("/score", auth.verifyToken, userController.addScore)

module.exports = router;
