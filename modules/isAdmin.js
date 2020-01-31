const Admin = require('../models/admin')

exports.checkDb = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.userId)
        if (!admin) {
            res.status(401).json({ success: false, msg: "Unauthorized" })
        }
        else {
            next()
        }
    } catch (err) {
        next(err)
    }
}