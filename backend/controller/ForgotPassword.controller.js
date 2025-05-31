const { Register } = require("../model");
const OTP = require("../model/OTP.model");
const bcrypt = require('bcrypt');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format phone number to E.164 format
const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, add +91 for India
    if (!phoneNumber.startsWith('+')) {
        cleaned = '+91' + cleaned;
    }
    
    return cleaned;
};

// Send OTP via Twilio SMS
const sendOTP = async (phoneNumber, otp) => {
    try {
        // Format phone number to E.164 format
        const formattedNumber = formatPhoneNumber(phoneNumber);
        console.log('Sending OTP to:', formattedNumber);

        const message = await twilioClient.messages.create({
            body: `Your OTP for password reset is: ${otp}. This OTP will expire in 5 minutes.`,
            to: formattedNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        console.log('Message sent successfully:', message.sid);
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

// Forgot Password - Send OTP
const forgotPassword = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        
        // Check if request body exists and has phone property
        if (!req.body || !req.body.phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const phone = req.body.phone;
        console.log('Phone number:', phone);

        // Find user by phone
        const user = await Register.findOne({ phone });
        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone number"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        console.log('Generated OTP:', otp);

        // Save OTP to database
        await OTP.findOneAndUpdate(
            { userId: user._id },
            {
                userId: user._id,
                otp: otp,
                phoneNumber: user.phone
            },
            { upsert: true, new: true }
        );

        // Send OTP via SMS
        await sendOTP(user.phone, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your phone number"
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        if (!req.body || !req.body.phone || !req.body.otp) {
            return res.status(400).json({
                success: false,
                message: "Phone number and OTP are required"
            });
        }

        const { phone, otp } = req.body;

        // Find user
        const user = await Register.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({
            userId: user._id,
            otp: otp
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        if (!req.body || !req.body.phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
        }

        const { phone } = req.body;

        // Find user
        const user = await Register.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate new OTP
        const otp = generateOTP();

        // Update OTP in database
        await OTP.findOneAndUpdate(
            { userId: user._id },
            {
                otp: otp,
                phoneNumber: user.phone
            },
            { new: true }
        );

        // Send new OTP
        await sendOTP(user.phone, otp);

        return res.status(200).json({
            success: true,
            message: "New OTP sent successfully to your phone number"
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        if (!req.body || !req.body.phone || !req.body.otp || !req.body.newPassword) {
            return res.status(400).json({
                success: false,
                message: "Phone number, OTP and new password are required"
            });
        }

        const { phone, otp, newPassword } = req.body;

        // Find user
        const user = await Register.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify OTP
        const otpRecord = await OTP.findOne({
            userId: user._id,
            otp: otp
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Delete OTP record
        await OTP.deleteOne({ userId: user._id });

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    forgotPassword,
    verifyOTP,
    resendOTP,
    resetPassword
};
