const Quiz = require("../models/quiz");
const Quizset = require("../models/quizset");

module.exports = {

    listQuiz: (req, res, next) => {
        try {
            Quiz.find({}, "-authorId")
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
            Quiz.create(req.body, (err, newQuiz) => {
                if (err) return next(err);
                if (!newQuiz) {
                    return res.status(400).json({ success: false, msg: "Quiz Not Created" });
                }
                if (newQuiz) {
                    Quizset.findByIdAndUpdate(req.body.quizset_id, {
                        $push: { questions: newQuiz._id }
                    }, (err, updatedQuizset) => {
                        if (err) {
                            res
                                .status(500)
                                .json({ success: true, msg: "something went wrong" });
                        }
                        if (updatedQuizset) {
                            res.status(200).json({
                                success: true,
                                msg: "Quiz created Successfully!",
                            });
                        }
                    });
                }


            });
        } catch (err) {
            next(err);
        }
    },

    singleQuiz: (req, res, next) => {
        try {
            Quiz.findById(req.params.id, "-__v", (err, quiz) => {
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
    },

    getQuizOfQuizset: async (req, res, next) => {
        try {
            listQuestions = await Quizset.findById(req.params.id, "-__v" )
            .populate("questions", "-__v -_id -authorId -answer")
            if (listQuestions) {
                res.json({ success: true, listQuestions })
            } else {
                res.json({ success: false, msg: "Something Went Wrong" });
            }
        } catch (err) {
            next(err)
        }
    }
}