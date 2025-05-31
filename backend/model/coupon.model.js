const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'futureplan'],
        required: true,
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, {
    timestamps: true,
    versionKey: false
});

const CouponModel = mongoose.model('coupon', couponSchema)

module.exports = CouponModel
