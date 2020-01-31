const User = require('../models/user')

exports.checkDb = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
        if (!user) {
            res.status(401).json({ success: false, msg: "Unauthorized" })
        }
        else {
            next()
        }
    } catch (err) {
        next(err)
    }
}