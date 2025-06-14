const Payment = require('../model/payment.model');
const Order = require('../model/order.model');

const getTotalSales = async (req, res) => {
    try {
        const totalSalesResult = await Payment.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalSales = totalSalesResult[0]?.total || 0;
        res.status(200).json({ totalSales });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getTotalOrders = async (req, res) => {
    try {
        const totalOrdersCount = await Order.countDocuments({});
        res.status(200).json({ totalOrders: totalOrdersCount });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getAverageOrderValue = async (req, res) => {
    try {
        const totalSalesResult = await Payment.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalSales = totalSalesResult[0]?.total || 0;

        const successfulOrdersCount = await Order.countDocuments({ status: { $nin: ['cancelled', 'pending'] } });

        const avgOrderValue = successfulOrdersCount > 0 ? (totalSales / successfulOrdersCount).toFixed(2) : 0;

        res.status(200).json({ avgOrderValue });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getConversionRate = async (req, res) => {
    try {
        const totalOrdersCount = await Order.countDocuments({});
        const successfulOrdersCount = await Order.countDocuments({ status: { $nin: ['cancelled', 'pending'] } });

        const conversionRate = totalOrdersCount > 0 ? ((successfulOrdersCount / totalOrdersCount) * 100).toFixed(2) : 0;

        res.status(200).json({ conversionRate: `${conversionRate}%` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTotalSales,
    getTotalOrders,
    getAverageOrderValue,
    getConversionRate,
}; 