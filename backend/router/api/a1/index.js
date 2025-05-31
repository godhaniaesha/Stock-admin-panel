const express = require("express");

const router = express.Router();

const user = require("./user");
const register = require("./Register");
const forgotPassword = require("./forgotPassword.route");


router.use("/user", user);
router.use("/register", register);
router.use("/forgotPassword", forgotPassword);



module.exports = router