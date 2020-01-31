const express = require("express");
const router = express.Router();

const adminController = require("../../controllers/admins")

// register Admin
router.post("/", adminController.registerAdmin);

// login Admin
router.post("/login", adminController.loginAdmin);

module.exports = router;
