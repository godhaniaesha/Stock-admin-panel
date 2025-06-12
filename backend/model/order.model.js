const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usersaa', // Changed from 'Register' to 'usersaa'
        required: true
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupon', // Changed from 'Coupon' to 'coupon'
        required: false
    },
    // Personal Details
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
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    // Shipping Details
    address: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    // Payment Details
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'upi', 'netbanking']
    },
    paymentDetails: {
        type: Object,
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    finalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'paid']
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Order', orderSchema);
