const express = require("express");
// const { createOTP, verifyOTP } = require("../../../utils/otp");
const passport = require("passport");
const { generateTokens } = require("../../../controller/Register.controller");
const Users = require("../../../model/Register.model");
const { registerController } = require("../../../controller");
const upload = require("../../../middleware/upload");

const router = express.Router();

//Z_ all users
router.get("/getAllUsers", registerController.getAllUsers);

//Z_ Get user by ID
router.get("/:id", registerController.getUserById);

//Z_ Create new user
router.post("/createUser",
    upload.single('profileImage'),
    registerController.createUser
);

// Register new user
router.post("/",
    upload.single('profileImage'),
    registerController.RegisterUser
);

// Login user
router.post("/login",
    registerController.login
);

// Generate new tokens
router.post("/generateNewTokens",
    registerController.generateNewToken
);

// Logout user
router.post("/logoutUser",
    registerController.logoutUser
);

// Check authentication
router.get("/authnticateCheck",
    registerController.authnticateCheck
);

//Z_ Update user profile
router.put("/updateUser/:id", 
    upload.single('profileImage'), 
    registerController.updateUser
);

//Z_ Delete user
router.delete("/:id",
    registerController.deleteUser
);

// Google OAuth routes
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

// Seller registration process routes
router.post("/verify-gst", registerController.verifyGST);
router.post("/add-business-details", registerController.addBusinessDetails);
router.post("/send-otp", registerController.sendOTP);
router.post("/verify-otp", registerController.verifyOTP);
router.post("/add-store-details", registerController.addStoreDetails);
router.post("/add-bank-details", registerController.addBankDetails);
router.post("/add-pickup-address", registerController.addPickupAddress);
router.post("/accept-terms", registerController.acceptTermsAndConditions);

module.exports = router