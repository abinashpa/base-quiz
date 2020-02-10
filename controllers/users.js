const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Score = require("../models/score");
const Quizset = require("../models/quizset");

module.exports = {
    registerUser: (req, res, next) => {
        try {
            User.create(req.body.user, (err, user) => {
                if (err) return next(err);
                if (!user) {
                    return res
                        .status(400)
                        .json({ msg: "Please Try Again", success: false });
                }
                Score.create({}, (err, score) => {
                    console.log(err, score);
                    if (err) {
                        res
                            .status(500)
                            .json({ success: false, msg: "Something went wrong" })
                    }
                    else if (score) {
                        user.score = score._id;
                        user.save()
                        res
                            .status(200)
                            .json({ success: true, msg: "You Are Successfully Registered" });
                    }
                })
            });
        } catch (err) {
            next(err);
        }
    },

    loginUser: (req, res, next) => {
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
                            userId: user._id,
                            username: user.username,
                            email: user.email,
                            isadmin: user.isAdmin
                        },
                        process.env.SECRET,
                        (err, token) => {
                            if (err) return next(err);
                            res.json({ success: true, msg: "You Are Logged In", id: user._id, token });
                        }
                    );
                });
            });
        } catch (err) {
            next(err);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, req.body)
            if (!user) return (
                res
                    .status(400)
                    .json({ success: false, msg: "User Not Found" })
            )
            res.json({ success: true, msg: "Profile Is Updated" });

        } catch (err) {
            next(err);
        }
    },

    aboutUser: async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId, "-password");
            if (!user) return res.status(400).json({ success: false, msg: "User Not Found" });
            res.json({ success: true, user });
        } catch (err) {
            next(err)
        }
    },

    getScore: async (req, res, next) => {
        try {
            user = await User.findById(req.user.userId);
            if (user) {
                scoreboard = await Score.findById(user.score, "-_id -__v");
                if (scoreboard) {
                    res.json({ success: true, scoreboard });
                }
            } else {
                res.json({ success: false, msg: "User Not Found" });
            }
        } catch (err) {
            next(err)
        }
    },

    addScore: async (req, res, next) => {
        try {
            quizset = await Quizset.findById(req.body.quizset_id).populate("questions");
            const outof = quizset.questions.length;
            let totalMarks = 0;

            if (quizset) {
                quizset.questions.map((val, ind) => {
                    if (val.answer == req.body.result[ind]) {
                        ++totalMarks
                    }
                });

                const userData = await User.findById(req.user.userId);
                const oldScore = await Score.findByIdAndUpdate(
                    userData.score, {
                    $push: { scoreboard: { score: totalMarks, outof: outof, category: quizset.name } }
                });

                if (oldScore) {
                    res.json({ success: true, msg: "Your Score Has Submitted" });
                }
            }

            if (!quizset) {
                res
                    .status(500)
                    .json({ success: false, msg: "Quizset Not Found" });
            }
        } catch (err) {
            next(err)
        }
    }
}