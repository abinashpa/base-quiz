const router = require("express").Router();

const auth = require("../../modules/auth");
const isAdmin = require("../../modules/isAdmin");
const quizsetController = require("../../controllers/quizset");

// get all the quizset
router.get("/", quizsetController.listQuizset);

// create new quizset
router.post("/", auth.verifyToken,
    isAdmin.checkDb,
    quizsetController.createQuizset
);

// delete quizset
router.delete("/:id", auth.verifyToken,
    isAdmin.checkDb,
    quizsetController.deleteQuizset
);

module.exports = router;
