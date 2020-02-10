const express = require("express");
const router = express.Router();

const auth = require("../../modules/auth");
const isAdmin = require("../../modules/isAdmin");
const quizController = require("../../controllers/quiz");

// list all quiz
router.get("/", quizController.listQuiz);

// single quiz
router.get("/:id", auth.verifyToken, quizController.singleQuiz)

// create quiz
router.post("/", auth.verifyToken, isAdmin.checkDb, quizController.createQuiz);

// update quiz
router.put("/:id", auth.verifyToken, isAdmin.checkDb, quizController.updateQuiz);

// delete quiz
router.delete("/:id", auth.verifyToken, isAdmin.checkDb, quizController.deleteQuiz);

// get quizzes of particular quizset
router.get("/quizset/:id" , quizController.getQuizOfQuizset)

module.exports = router;
