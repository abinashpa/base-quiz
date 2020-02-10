const Quizset = require("../models/quizset");

module.exports = {

    listQuizset: async (req, res, next) => {
        try {
            const allQuizset = await Quizset.find({}, "-__v -questions")
            if (allQuizset) {
                res.json({ success: true, allQuizset });
            }
        } catch (err) {
            next(err)
        }
    },

    createQuizset: async (req, res, next) => {
        try {
            const newQuizset = await Quizset.create(req.body);
            if (newQuizset) {
                res.json({ success: true, msg: "New Quizset Created" });
            } else {
                res
                    .status(500)
                    .json({ success: false, msg: "Something went wrong" })
            }
        } catch (err) {
            next(err);
        }
    },

    deleteQuizset: async (req, res, next) => {
        try {
            const deletedQuiz = await Quizset.findByIdAndDelete(req.params.id);
            if (!deletedQuiz) {
                res.json({ success: false, msg: "Quizset can't be deleted" })
            } else {
                res.json({ success: true, msg: "Quizset deleted" })
            }
        } catch (err) {
            next(err)
        }
    },

    updateQuizset: async (req, res, next) => {
        try {
            const updatedQuiz = await Quizset.findByIdAndUpdate(req.params.id);
            if (!updatedQuiz) {
                res.json({ success: false, msg: "Quizset can't be updated" })
            } else {
                res.json({ success: true, msg: "Quizset updated" });
            }
        } catch (err) {
            next(err)
        }
    }
}