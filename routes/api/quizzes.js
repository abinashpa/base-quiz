const express = require("express");
const Quiz = require("../../models/quiz");
const router = express.Router();
const auth = require("../../modules/auth");

// list all quiz
router.get("/", (req, res, next) => {
  try {
    Quiz.find({})
      .populate("author", "-password")
      .exec((err, quizzes) => {
        if (err) return next(err);
        if (!quizzes)
          return res
            .status(400)
            .json({ success: false, msg: "No quizzes found!" });
        res.json({ quizzes, success: true });
      });
  } catch (err) {
    next(err);
  }
});

// verify jwt
router.use(auth.verifyToken);

// create quiz
router.post("/", (req, res, next) => {
  try {
    Quiz.create(req.body, (err, quizToCreate) => {
      if (err) return next(err);
      if (!quizToCreate) {
        return res.status(400).json({ success: false, msg: "No Quiz found!" });
      }

      res.status(200).json({
        success: true,
        msg: "Quiz created Successfully!",
        quizToCreate
      });
    });
  } catch (err) {
    next(err);
  }
});

// update quiz
router.put("/:id", (req, res, next) => {
  try {
    Quiz.findByIdAndUpdate(req.params.id, req.body, (err, quizToUpdate) => {
      if (err) return next(err);
      if (!quizToUpdate) {
        return res.status(400).json({ success: false, msg: "Quiz Not Found" });
      }

      res.json({ success: true, quizToUpdate });
    });
  } catch (err) {
    next(err);
  }
});

// delete quiz
router.delete("/:id", (req, res, next) => {
    try {
      Quiz.findByIdAndDelete(req.params.id, (err, quizToDelete) => {
      if (err) return next(err);
      if (!quizToDelete)
        return res.json({ success: false, msg: "Quiz Not Found!" });
      Quizset.findOneAndUpdate(
        { topic: quizToDelete.quizset },
        { $pull: { quiz: quizToDelete._id } },
        (err, updatedQuizset) => {
          if (err) return next(err);
          if (!updatedQuizset)
            return res
              .status(500)
              .json({ success: false, msg: "Can't Update Quizset" })
        }
      );
      res.json({
        success: true,
        msg: "Quiz Successfully Deleted",
        quizToDelete
      });
    } catch (err) {
      next(err);
    }
  });
});

module.exports = router;
