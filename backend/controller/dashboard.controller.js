const Payment = require('../models/Payment'); // Update paths as needed
const Order = require('../models/Order');
const mongoose = require('mongoose');

const dashboard = async (req, res) => {
    try {
        const userId = req.user._id; // Make sure userId is available via auth middleware

        // 1. User-wise Revenue
        const userRevenueResult = await Payment.aggregate([
            {
                $match: { status: 'success' }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            {
                $match: {
                    'order.userId': new mongoose.Types.ObjectId(userId),
                    'order.status': { $nin: ['cancelled', 'pending'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        // 2. Overall Revenue
        const overallRevenueResult = await Payment.aggregate([
            {
                $match: { status: 'success' }
            },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order'
                }
            },
            { $unwind: '$order' },
            {
                $match: {
                    'order.status': { $nin: ['cancelled', 'pending'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const userRevenue = userRevenueResult[0]?.total || 0;
        const overallRevenue = overallRevenueResult[0]?.total || 0;

        res.status(200).json({
            userRevenue,
            overallRevenue
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    dashboard
};
