const express = require("express");
const router = express.Router();

const auth = require("../../modules/auth");
const Quiz = require("../../models/quiz");
const Admin = require("../../models/admin");

// list all quiz
router.get("/", (req, res, next) => {
  try {
    Quiz.find({})
      .populate("authorId")
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
    Admin.findById(req.body.authorId, (err, author) => {
      if (err) {
        return next(err);
      }
      if (!author) {
        return res.status(401).json({ success: false, msg: "Unauthorized" });
      }
    });
    Quiz.create(req.body, (err, quizToCreate) => {
      if (err) return next(err);
      if (!quizToCreate) {
        return res.status(400).json({ success: false, msg: "No Quiz Found" });
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
    Quiz.findById(req.params.id, (err, quiz) => {
      if (err) {
        return next(err);
      }
      if (req.body.authorId === quiz.authorId) {
        Quiz.findByIdAndUpdate(req.params.id, req.body, (err, quizToUpdate) => {
          if (err) return next(err);
          if (!quizToUpdate) {
            return res
              .status(400)
              .json({ success: false, msg: "Quiz Not Found" });
          }

          res.json({ success: true, quizToUpdate });
        });
      }
    });
  } catch (err) {
    next(err);
  }
});

// delete quiz
router.delete("/:id", (req, res, next) => {
  try {
    Quiz.findById(req.params.id, (err, quiz) => {
      if (err) {
        next(err);
      }
      if (req.body.authorId === quiz.authorId) {
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
                  .json({ success: false, msg: "Can't Update Quizset" });
            }
          );
          res.json({
            success: true,
            msg: "Quiz Successfully Deleted",
            quizToDelete
          });
        });
      } else {
        return res.status(401).json({ success: false, msg: "Unauthorized" });
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/list", (req, res) => {
  try {
    Quiz.find({ authorId: req.body.id }, (err, list) => {
      res.json({ list });
    });
  } catch (err) {
    next(err)
  }
});

module.exports = router;
