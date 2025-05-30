const { Payment, Order } = require('../model');

// Create new payment
const createPayment = async (req, res) => {
    try {
        const { orderId, amount, method } = req.body;

        // Optional: validate order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const newPayment = new Payment({
            orderId,
            amount,
            method
            
        });

        const savedPayment = await newPayment.save();

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: savedPayment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 }).populate('orderId');

        res.status(200).json({
            success: true,
            data: payments,
            count: payments.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving payments',
            error: error.message
        });
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).populate('orderId');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving payment',
            error: error.message
        });
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedPayment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: updatedPayment
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};

// Delete payment
const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByIdAndDelete(id);

        if (!deletedPayment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully',
            data: deletedPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting payment',
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    updatePaymentStatus,
    deletePayment
};
