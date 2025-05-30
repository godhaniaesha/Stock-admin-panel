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
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'staff'],
        required: true
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