const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    isactive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'seller'],
    },
    refreshToken: {
        type: String
    },
    googleClientId: {
        type: String
    },
    profileImage: {
        type: String,
        default: ''
    },
    // New seller-specific fields
    sellerInfo: {
        gstNumber: {
            type: String,
        },
        otp:{
            type:Number
        },
        otpExpiry:{
            type:Date
        },
        gstDetails: {
            type: String,
        },
        gstVerified: {
            type: Boolean,
            default: false
        },
        businessName: {
            type: String,
        },
        panNumber: {
            type: String,
        },
        businessType: {
            type: String,
        },
        registeredBusinessAddress: {
            type: String,
        },
        storeName: {
            type: String,
        },
        ownerName: {
            type: String,
        },
        bankName: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        confirmAccountNumber: {
            type: String,
        },
        ifscCode: {
            type: String,
        },
        pickupAddress: {
            buildingNumber: {
                type: String,
            },
            street: {
                type: String,
            },
            landmark: {
                type: String,
            },
            pincode: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            }
        }
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

const Users = mongoose.model('usersaa', RegisterSchema)
module.exports = Users;