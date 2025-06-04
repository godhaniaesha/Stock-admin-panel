const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
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
    password: {
        type: String,
        trim: true,
        unique: true,
    },
    isactive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'seller', 'staff','user'],
    },
    refreshToken: {
        type: String
    },
    googleClientId: {
        type: String
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

const Users = mongoose.model('usersaa', RegisterSchema)
module.exports = Users; 