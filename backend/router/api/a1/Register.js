const express = require("express");
// const { createOTP, verifyOTP } = require("../../../utils/otp");
const passport = require("passport");
const { generateTokens } = require("../../../controller/Register.controller");
const Users = require("../../../model/Register.model");
const { registerController } = require("../../../controller");
const upload = require("../../../middleware/upload");

const router = express.Router();

// Get all users
router.get("/getAllregister", registerController.getAllUsers);

router.post("/",
    //    createOTP(),
    registerController.RegisterUser
)

router.post("/login",
    registerController.login
)

router.post("/generateNewTokens",
    registerController.generateNewToken
)

router.post("/logoutUser",
    registerController.logoutUser
)

router.get("/authnticateCheck",
    registerController.authnticateCheck
)

router.put("/updateprofile/:id", upload.single('profileImage'), registerController.updateUser);

// router.post(
//    "/verifyOTP",
//    verifyOTP()
// )

// router.get('/google',
//    passport.authenticate(
//       'google',
//       {
//          scope:
//             ['profile', 'email']
//       }
//    ));

router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async function (req, res) {
        console.log("google callback", req.session?.passport?.user);

        const { assesToken, refreshToken } = await generateTokens(req.session.passport.user);

        console.log(assesToken, refreshToken);

        const userDetails = await Users.findOne({ _id: req.session.passport.user }).select("-password -refreshToken");

        const option = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("assesToken", assesToken, option)
            .cookie("refreshToken", refreshToken, option)
            .redirect('http://localhost:3000')
    });

module.exports = router
