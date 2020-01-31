const Quiz = require("../models/quiz");

module.exports = {

    listQuiz: (req, res, next) => {
        try {
            Quiz.find({})
                .populate("authorId")
                .exec((err, quizzes) => {
                    if (err) return next(err);
                    if (!quizzes)
                        return res
                            .status(400)
                            .json({ success: false, msg: "No quizzes found!" });
                    else {
                        res.json({ quizzes, success: true });
                    }
                });
        } catch (err) {
            next(err);
        }
    },

    createQuiz: (req, res, next) => {
        try {
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
    },

    singleQuiz: (req, res, next) => {
        try {
            Quiz.findById(req.params.id, (err, quiz) => {
                if (err) {
                    next(err)
                }
                else if (!quiz) {
                    res
                        .status(400)
                        .json({ success: false, msg: "Quiz Not Found" })
                }
                else {
                    res.json(quiz)
                }
            })
        } catch (err) {
            next(err)
        }
    },

    updateQuiz: (req, res, next) => {
        try {
            Quiz.findByIdAndUpdate(req.params.id, req.body, (err, UpdatedQuiz) => {
                if (err) return next(err);
                if (!UpdatedQuiz) {
                    return (
                        res
                            .status(400)
                            .json({ success: false, msg: "Quiz Not Found" })
                    )
                }
                else {
                    res.json({ success: true, msg: "Quiz Updated" });
                }
            });
        } catch (err) {
            next(err);
        }
    },

    deleteQuiz: (req, res, next) => {
        try {
            Quiz.findByIdAndDelete(req.params.id, (err, quizToDelete) => {
                if (err) return next(err);
                if (!quizToDelete)
                    return res.json({ success: false, msg: "Quiz Not Found!" });
                res.json({
                    success: true,
                    msg: "Quiz Successfully Deleted",
                    quizToDelete
                });
            });
        } catch (err) {
            next(err);
        }
    }
}