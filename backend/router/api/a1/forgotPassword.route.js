const express = require('express');
const router = express.Router();
const {
    forgotpasswordController
} = require('../../../controller');

// Forgot password - Send OTP
router.post('/forgot-password', forgotpasswordController.forgotPassword);

// Verify OTP
router.post('/verify-otp', forgotpasswordController.verifyOTP);

// Resend OTP
router.post('/resend-otp', forgotpasswordController.resendOTP);

// Reset password
router.post('/reset-password', forgotpasswordController.resetPassword);

module.exports = router; 