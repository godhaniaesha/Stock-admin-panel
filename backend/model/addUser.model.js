const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
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
    role: {
        type: String,
        enum: ['admin', 'seller', 'staff','user'],
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

const UserModel = mongoose.model('user', userSchema)
module.exports = UserModel